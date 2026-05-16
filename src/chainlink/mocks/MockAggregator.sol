// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract MockAggregator is AggregatorV3Interface {
    int256  public price;
    uint256 public updatedAt;
    uint8   public constant override decimals = 8;

    constructor(int256 initialPrice) {
        price     = initialPrice;
        updatedAt = block.timestamp;
    }

    function setPrice(int256 newPrice) external {
        price     = newPrice;
        updatedAt = block.timestamp;
    }

    function setUpdatedAt(uint256 ts) external {
        updatedAt = ts;
    }

    function latestRoundData() external view override returns (
        uint80  roundId,
        int256  answer,
        uint256 startedAt,
        uint256 updatedAt_,
        uint80  answeredInRound
    ) {
        return (1, price, block.timestamp, updatedAt, 1);
    }

    function getRoundData(uint80) external view override returns (
        uint80  roundId,
        int256  answer,
        uint256 startedAt,
        uint256 updatedAt_,
        uint80  answeredInRound
    ) {
        return (1, price, block.timestamp, updatedAt, 1);
    }

    function description() external pure override returns (string memory) { return "Mock"; }
    function version()     external pure override returns (uint256)        { return 1; }
}
