// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

import {PriceFeedConsumer} from "src/chainlink/PriceFeedConsumer.sol";
import {MockAggregator} from "src/chainlink/mocks/MockAggregator.sol";

contract PriceFeedConsumerTest is Test {
    PriceFeedConsumer consumer;
    MockAggregator feed;

    uint256 constant STALENESS = 1 hours;

    function setUp() public {
        feed = new MockAggregator(2000e8); // $2000
        consumer = new PriceFeedConsumer(address(feed), STALENESS);
    }

    function test_getLatestPrice_returnsPrice() public view {
        (int256 price,) = consumer.getLatestPrice();
        assertEq(price, 2000e8);
    }

    function test_getLatestPrice_returnsUpdatedAt() public view {
        (, uint256 updatedAt) = consumer.getLatestPrice();
        assertEq(updatedAt, block.timestamp);
    }

    function test_getLatestPrice_revertsWhenStale() public {
        vm.warp(block.timestamp + STALENESS + 1);
        vm.expectRevert(PriceFeedConsumer.StalePrice.selector);
        consumer.getLatestPrice();
    }

    function test_getLatestPrice_exactThresholdNotStale() public {
        vm.warp(block.timestamp + STALENESS);
        // exactly at threshold - not stale yet
        (int256 price,) = consumer.getLatestPrice();
        assertEq(price, 2000e8);
    }

    function test_getLatestPrice_revertsOnNegativePrice() public {
        feed.setPrice(-1);
        vm.expectRevert(PriceFeedConsumer.InvalidPrice.selector);
        consumer.getLatestPrice();
    }

    function test_getLatestPrice_revertsOnZeroPrice() public {
        feed.setPrice(0);
        vm.expectRevert(PriceFeedConsumer.InvalidPrice.selector);
        consumer.getLatestPrice();
    }

    function test_mockAggregator_setPrice() public {
        feed.setPrice(3000e8);
        (int256 price,) = consumer.getLatestPrice();
        assertEq(price, 3000e8);
    }

    function test_mockAggregator_setUpdatedAt_makesStale() public {
        vm.warp(block.timestamp + STALENESS + 100);
        feed.setUpdatedAt(block.timestamp - STALENESS - 1);
        vm.expectRevert(PriceFeedConsumer.StalePrice.selector);
        consumer.getLatestPrice();
    }

    function test_mockAggregator_getRoundData() public view {
        (, int256 price,,,) = feed.getRoundData(1);
        assertEq(price, 2000e8);
    }

    function test_mockAggregator_description() public view {
        assertEq(keccak256(bytes(feed.description())), keccak256(bytes("Mock")));
    }

    function test_mockAggregator_version() public view {
        assertEq(feed.version(), 1);
    }
}
