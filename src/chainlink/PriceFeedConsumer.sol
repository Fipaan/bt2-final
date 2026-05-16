// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceFeedConsumer {
    AggregatorV3Interface public immutable priceFeed;
    uint256 public immutable stalenessThreshold;

    error StalePrice();
    error InvalidPrice();
    error InvalidRound();

    constructor(address feed_, uint256 stalenessThreshold_) {
        priceFeed = AggregatorV3Interface(feed_);
        stalenessThreshold = stalenessThreshold_;
    }

    function getLatestPrice() external view returns (int256 price, uint256 updatedAt) {
        (
            uint80  roundId,
            int256  price_,
            uint256 startedAt,
            uint256 updatedAt_,
            uint80  answeredInRound
        ) = priceFeed.latestRoundData();
        if (startedAt == 0)            revert InvalidRound();
        if (answeredInRound < roundId) revert InvalidRound();
        // SLITHER-NOTE:
        //     basically, it compares timestamps, and that's how
        //     getLatestPrice should work, it can't be done in
        //     other way, it needs to compare them.
        // slither-disable-next-line timestamp
        if (block.timestamp - updatedAt_ > stalenessThreshold) revert StalePrice();
        if (price_ <= 0)               revert InvalidPrice();
        price     = price_;
        updatedAt = updatedAt_;
    }
}
