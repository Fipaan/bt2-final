// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {PriceFeedConsumer} from "src/chainlink/PriceFeedConsumer.sol";

contract ForkTest is Test {
    // Arbitrum mainnet addresses
    address constant USDC = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
    address constant WHALE = 0x47c031236e19d024b42f8AE6780E44A573170703;
    address constant ETH_USD_FEED = 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612;

    uint256 fork;

    function setUp() public {
        // fork = vm.createFork(vm.envString("ARBITRUM_RPC_URL"));
        fork = vm.createFork("https://arb1.arbitrum.io/rpc");
        vm.selectFork(fork);
    }

    // 1. Fork test: real USDC transfer on Arbitrum mainnet
    function test_fork_usdcTransfer() public {
        uint256 amount = 1000e6; // 1000 USDC
        uint256 before = IERC20(USDC).balanceOf(WHALE);

        vm.prank(WHALE);
        IERC20(USDC).transfer(address(this), amount);

        assertEq(IERC20(USDC).balanceOf(address(this)), amount);
        assertEq(IERC20(USDC).balanceOf(WHALE), before - amount);
    }

    // 2. Fork test: real Chainlink ETH/USD price feed
    function test_fork_chainlinkPriceFeed() public {
        PriceFeedConsumer consumer = new PriceFeedConsumer(ETH_USD_FEED, 1 hours);
        (int256 price,) = consumer.getLatestPrice();
        assertGt(price, 0);
        assertGt(price, 100e8); // ETH > $100
        assertLt(price, 100_000e8); // ETH < $100,000
    }

    // 3. Fork test: Chainlink feed staleness on forked state
    function test_fork_chainlinkStalenessCheck() public {
        PriceFeedConsumer consumer = new PriceFeedConsumer(ETH_USD_FEED, 1 hours);
        // warp far into future to make feed stale
        vm.warp(block.timestamp + 2 hours);
        vm.expectRevert(PriceFeedConsumer.StalePrice.selector);
        consumer.getLatestPrice();
    }
}
