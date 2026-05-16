// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TokenVesting {
    using SafeERC20 for IERC20;
    IERC20 public immutable token;
    address public immutable beneficiary;

    uint256 public immutable start;
    uint256 public constant DURATION = 365 days;

    uint256 public released;

    constructor(address _token, address _beneficiary, uint256 _start) {
        require(_token       != address(0));
        require(_beneficiary != address(0));
        token = IERC20(_token);
        beneficiary = _beneficiary;
        start = _start;
    }

    function vestedAmount() public view returns (uint256) {
        uint256 total = token.balanceOf(address(this)) + released;

        // SLITHER-NOTE:
        //     it clamps block's timestamp between expected range,
        //     it can't avoid compare timestamps
        // slither-disable-next-line timestamp
        if (block.timestamp < start) return 0;
        if (block.timestamp >= start + DURATION) return total;

        return (total * (block.timestamp - start)) / DURATION;
    }

    function release() external {
        uint256 vested = vestedAmount();
        uint256 amount = vested - released;
        // SLITHER-NOTE:
        //     basically, it compares timestamps, and that's how DAO works,
        //     it can't be done in other way, it needs to compare them.
        // slither-disable-next-line timestamp
        require(amount > 0, "Nothing to release");

        released = vested;
        token.safeTransfer(beneficiary, amount);
    }
}
