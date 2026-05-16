// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20}          from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20}       from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {LPToken} from "./LPToken.sol";

contract AMM is ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public immutable tokenA;
    address public immutable tokenB;
    LPToken public immutable lpToken;

    uint256 public reserveA;
    uint256 public reserveB;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 lpTokensMinted);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB, uint256 lpTokensBurned);
    event Swap(address indexed trader, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);

    constructor(address tokenA_, address tokenB_) {
        require(tokenA_ != address(0) && tokenB_ != address(0), "zero token");
        require(tokenA_ != tokenB_, "identical tokens");
        tokenA = tokenA_;
        tokenB = tokenB_;
        lpToken = new LPToken("AMM LP Token", "AMM-LP", address(this));
    }

    function addLiquidity(
        uint256 amountADesired, uint256 amountBDesired,
        uint256 minAmountA,     uint256 minAmountB
    ) external nonReentrant returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        require(amountADesired > 0 && amountBDesired > 0, "zero amount");

        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            // SLITHER-NOTE:
            //     intentional divide-before-multiply - ratio fitting truncates
            //     toward zero, which means the vault takes slightly less than
            //     desired.
            //     This is the standard Uniswap V2 approach and it is acceptable.
            // slither-disable-next-line divide-before-multiply
            uint256 amountBOptimal = (amountADesired * reserveB) / reserveA;
            if (amountBOptimal <= amountBDesired) {
                amountA = amountADesired;
                amountB = amountBOptimal;
            } else {
                // SLITHER-NOTE:
                //     intentional divide-before-multiply - ratio fitting truncates
                //     toward zero, which means the vault takes slightly less than
                //     desired.
                //     This is the standard Uniswap V2 approach and it is acceptable.
                // slither-disable-next-line divide-before-multiply
                uint256 amountAOptimal = (amountBDesired * reserveA) / reserveB;
                amountA = amountAOptimal;
                amountB = amountBDesired;
            }
        }

        require(amountA >= minAmountA, "slippage A");
        require(amountB >= minAmountB, "slippage B");

        uint256 supply = lpToken.totalSupply();
        if (supply == 0) {
            liquidity = _sqrt(amountA * amountB);
        } else {
            liquidity = _min(
                (amountA * supply) / reserveA,
                (amountB * supply) / reserveB
            );
        }
        require(liquidity > 0, "insufficient liquidity");

        reserveA += amountA;
        reserveB += amountB;

        IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).safeTransferFrom(msg.sender, address(this), amountB);

        lpToken.mint(msg.sender, liquidity);

        emit LiquidityAdded(msg.sender, amountA, amountB, liquidity);
    }

    function removeLiquidity(
        uint256 lpAmount,
        uint256 minAmountA, uint256 minAmountB
    ) external nonReentrant returns (uint256 amountA, uint256 amountB) {
        require(lpAmount > 0, "zero amount");
        uint256 supply = lpToken.totalSupply();
        require(supply > 0, "no liquidity");

        amountA = (reserveA * lpAmount) / supply;
        amountB = (reserveB * lpAmount) / supply;
        require(amountA >= minAmountA, "slippage A");
        require(amountB >= minAmountB, "slippage B");
        require(amountA > 0 && amountB > 0, "insufficient burn");

        reserveA -= amountA;
        reserveB -= amountB;

        lpToken.burn(msg.sender, lpAmount);

        IERC20(tokenA).safeTransfer(msg.sender, amountA);
        IERC20(tokenB).safeTransfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB, lpAmount);
    }

    function swap(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut
    ) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "zero amount");
        require(tokenIn == tokenA || tokenIn == tokenB, "invalid token");

        bool    aToB       = tokenIn == tokenA;
        address tokenOut   = aToB ? tokenB   : tokenA;
        uint256 reserveIn  = aToB ? reserveA : reserveB;
        uint256 reserveOut = aToB ? reserveB : reserveA;

        amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
        require(amountOut > 0, "zero output");
        require(amountOut >= minAmountOut, "slippage");
        require(amountOut <  reserveOut,   "insufficient liquidity");

        if (aToB) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }

        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).safeTransfer(msg.sender, amountOut);

        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "zero amount");
        require(reserveIn > 0 && reserveOut > 0, "empty reserves");
        uint256 amountInWithFee = amountIn * 997;
        uint256 numerator       = amountInWithFee * reserveOut;
        uint256 denominator     = reserveIn * 1000 + amountInWithFee;
        amountOut               = numerator / denominator;
    }

    /// @notice Yul assembly implementation
    /// @dev memory-safe: only operates on stack/scratch space, no memory slots touched.
    function getAmountOutYul(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        // SLITHER-NOTE:
        //     it's intentionally written in assembly, to see performance difference
        // slither-disable-next-line assembly
        assembly ("memory-safe") {
            if or(iszero(amountIn), or(iszero(reserveIn), iszero(reserveOut))) {
                revert(0, 0)
            }
            let amountInWithFee := mul(amountIn, 997)
            let numerator       := mul(amountInWithFee, reserveOut)
            let denominator     := add(mul(reserveIn, 1000), amountInWithFee)
            amountOut := div(numerator, denominator)
        }
    }


    function quoteAForB(uint256 amountIn) external view returns (uint256) {
        if (reserveA == 0 || reserveB == 0) return 0;
        return getAmountOut(amountIn, reserveA, reserveB);
    }

    function quoteBForA(uint256 amountIn) external view returns (uint256) {
        if (reserveA == 0 || reserveB == 0) return 0;
        return getAmountOut(amountIn, reserveB, reserveA);
    }

    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    // Implementation: https://ethereum.stackexchange.com/questions/2910/can-i-square-root-in-solidity
    function _sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = x / 2 + 1;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
