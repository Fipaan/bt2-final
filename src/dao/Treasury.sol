// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Treasury {
    using SafeERC20 for IERC20;
    address public immutable timelock;

     modifier onlyTimelock() {
         _onlyTimelock();
         _;
     }

     function _onlyTimelock() internal view {
         require(msg.sender == timelock, "Not timelock");
     }


    constructor(address _timelock) {
        require(_timelock != address(0));
        timelock = _timelock;
    }

    // -------------------------
    // ETH
    // -------------------------
    receive() external payable {}

    function withdrawETH(address payable to, uint256 amount)
        external
        onlyTimelock
    {
        require(to != address(0));
        // SLITHER-NOTE:
        //     it's custom implementation of withdrawETH,
        //     so it expected to perform low-level call
        // slither-disable-next-line low-level-calls
        (bool success, ) = to.call{value: amount}("");
        require(success, "ETH transfer failed");
    }

    // -------------------------
    // ERC20
    // -------------------------
    function withdrawToken(
        address token,
        address to,
        uint256 amount
    ) external onlyTimelock {
        IERC20(token).safeTransfer(to, amount);
    }
}
