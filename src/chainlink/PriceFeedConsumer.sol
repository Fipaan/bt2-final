// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceFeedConsumer {
    AggregatorV3Interface public immutable priceFeed;
    uint256 public immutable stalenessThreshold;

    error StalePrice();
    error InvalidPrice();

    constructor(address feed_, uint256 stalenessThreshold_) {
        priceFeed = AggregatorV3Interface(feed_);
        stalenessThreshold = stalenessThreshold_;
    }

    function getLatestPrice() external view returns (int256 price, uint256 updatedAt) {
        (, price,, updatedAt,) = priceFeed.latestRoundData();
        if (block.timestamp - updatedAt > stalenessThreshold) revert StalePrice();
        if (price <= 0) revert InvalidPrice();
    }
}
