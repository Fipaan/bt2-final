// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {NFTRentalVault} from "src/vault/NFTRentalVault.sol";
import {GovernanceToken} from "src/dao/GovernanceToken.sol";
import {MockVRFCoordinator} from "src/chainlink/mocks/MockVRFCoordinator.sol";
import {Equestria1155} from "src/amm/Equestria1155.sol";

contract NFTRentalVaultTest is Test {
    NFTRentalVault vault;
    GovernanceToken govToken;
    MockVRFCoordinator coordinator;
    Equestria1155 nft;

    address owner = address(0x0999);
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    uint256 NFT_ID;
    uint256 constant DEPOSIT = 1000 ether;

    function setUp() public {
        // deploy governance token
        govToken = new GovernanceToken(owner, owner, owner, owner);

        // deploy NFT
        coordinator = new MockVRFCoordinator();
        nft = new Equestria1155("ipfs://game/{id}", address(coordinator), bytes32("eq1155key"), 1);

        // deploy vault
        NFT_ID = nft.PINKIE_PIE();
        vault = new NFTRentalVault(IERC20(address(govToken)), nft, NFT_ID, owner);

        // fund alice and bob
        vm.startPrank(owner);
        IERC20(address(govToken)).transfer(alice, 100_000 ether);
        IERC20(address(govToken)).transfer(bob, 100_000 ether);
        IERC20(address(govToken)).transfer(owner, 10_000 ether);
        vm.stopPrank();

        // mint NFT to alice
        uint256[] memory ids = new uint256[](6);
        uint256[] memory values = new uint256[](6);
        ids[0] = 1;
        values[0] = 100;
        ids[1] = 2;
        values[1] = 100;
        ids[2] = 3;
        values[2] = 200;
        ids[3] = 4;
        values[3] = 100;
        ids[4] = 5;
        values[4] = 100;
        ids[5] = 6;
        values[5] = 100;
        nft.mintBatch(alice, ids, values, "");

        nft.mint(alice, NFT_ID, 1, "");

        // approvals
        vm.prank(alice);
        IERC20(address(govToken)).approve(address(vault), type(uint256).max);
        vm.prank(bob);
        IERC20(address(govToken)).approve(address(vault), type(uint256).max);
        vm.prank(owner);
        IERC20(address(govToken)).approve(address(vault), type(uint256).max);
    }

    // ── deposit / withdraw ────────────────────────────────────

    function test_deposit_basic() public {
        vm.prank(alice);
        uint256 shares = vault.deposit(DEPOSIT, alice);
        assertGt(shares, 0);
        assertEq(vault.balanceOf(alice), shares);
    }

    function test_deposit_assetsTransferred() public {
        uint256 before = IERC20(address(govToken)).balanceOf(address(vault));
        vm.prank(alice);
        vault.deposit(DEPOSIT, alice);
        assertEq(IERC20(address(govToken)).balanceOf(address(vault)), before + DEPOSIT);
    }

    function test_withdraw_basic() public {
        vm.startPrank(alice);
        vault.deposit(DEPOSIT, alice);
        vault.withdraw(DEPOSIT, alice, alice);
        vm.stopPrank();
        assertEq(IERC20(address(govToken)).balanceOf(alice), 100_000 ether);
    }

    function test_redeem_basic() public {
        vm.startPrank(alice);
        uint256 shares = vault.deposit(DEPOSIT, alice);
        vault.redeem(shares, alice, alice);
        vm.stopPrank();
        assertGe(IERC20(address(govToken)).balanceOf(alice), 100_000 ether - 1);
    }

    function test_previewDeposit_matchesActual() public {
        uint256 preview = vault.previewDeposit(DEPOSIT);
        vm.prank(alice);
        uint256 actual = vault.deposit(DEPOSIT, alice);
        assertEq(preview, actual);
    }

    // ── NFT staking ───────────────────────────────────────────

    function test_stakeNFT() public {
        vm.startPrank(alice);
        nft.setApprovalForAll(address(vault), true);
        vault.stakeNFT(NFT_ID);
        vm.stopPrank();
        assertTrue(vault.isRenting(alice));
    }

    function test_stakeNFT_wrongId() public {
        vm.startPrank(alice);
        nft.setApprovalForAll(address(vault), true);
        vm.expectRevert(NFTRentalVault.WrongNft.selector);
        vault.stakeNFT(9999);
        vm.stopPrank();
    }

    function test_stakeNFT_doubleStakeReverts() public {
        vm.startPrank(alice);
        nft.setApprovalForAll(address(vault), true);
        vault.stakeNFT(NFT_ID);
        vm.expectRevert(NFTRentalVault.AlreadyStaked.selector);
        vault.stakeNFT(NFT_ID);
        vm.stopPrank();
    }

    function test_unstakeNFT() public {
        vm.startPrank(alice);
        nft.setApprovalForAll(address(vault), true);
        vault.stakeNFT(NFT_ID);
        vault.unstakeNFT(NFT_ID);
        vm.stopPrank();
        assertFalse(vault.isRenting(alice));
        assertEq(nft.balanceOf(alice, NFT_ID), 1);
    }

    function test_unstakeNFT_notRenterReverts() public {
        vm.startPrank(alice);
        nft.setApprovalForAll(address(vault), true);
        vault.stakeNFT(NFT_ID);
        vm.stopPrank();
        vm.expectRevert(NFTRentalVault.NotRenter.selector);
        vm.prank(bob);
        vault.unstakeNFT(NFT_ID);
    }

    // ── boost ─────────────────────────────────────────────────

    function test_boost_givesMoreShares() public {
        vm.prank(bob);
        uint256 normalShares = vault.deposit(DEPOSIT, bob);

        vm.startPrank(alice);
        nft.setApprovalForAll(address(vault), true);
        vault.stakeNFT(NFT_ID);
        uint256 boostedShares = vault.deposit(DEPOSIT, alice);
        vm.stopPrank();

        assertGt(boostedShares, normalShares);
    }

    function test_setBoostBps_onlyOwner() public {
        vm.expectRevert();
        vault.setBoostBps(1500);
    }

    function test_setBoostBps_updated() public {
        vm.prank(owner);
        vault.setBoostBps(1500);
        assertEq(vault.boostBps(), 1500);
    }

    function test_setBoostBps_belowBaseReverts() public {
        vm.prank(owner);
        vm.expectRevert(NFTRentalVault.BoostBelowBase.selector);
        vault.setBoostBps(500);
    }

    // ── yield injection ───────────────────────────────────────

    function test_injectYield_increasesAssets() public {
        vm.prank(alice);
        vault.deposit(DEPOSIT, alice);

        uint256 before = vault.totalAssets();
        vm.prank(owner);
        vault.injectYield(1000 ether);
        assertEq(vault.totalAssets(), before + 1000 ether);
    }

    function test_injectYield_onlyOwner() public {
        vm.expectRevert();
        vault.injectYield(100 ether);
    }

    // ── ERC-4626 rounding invariants ──────────────────────────

    function testFuzz_depositRedeem_roundingInvariant(uint256 assets) public {
        assets = bound(assets, 1e6, 50_000 ether);
        vm.startPrank(alice);
        uint256 shares = vault.deposit(assets, alice);
        uint256 redeemed = vault.redeem(shares, alice, alice);
        vm.stopPrank();
        // rounding must never give back more than deposited
        assertLe(redeemed, assets);
    }

    function testFuzz_injectYield_increasesTotalAssets(uint256 amount) public {
        amount = bound(amount, 1 ether, 10_000 ether);
        vm.prank(alice);
        vault.deposit(1000 ether, alice);
        uint256 before = vault.totalAssets();
        vm.prank(owner);
        vault.injectYield(amount);
        assertEq(vault.totalAssets(), before + amount);
    }
}
