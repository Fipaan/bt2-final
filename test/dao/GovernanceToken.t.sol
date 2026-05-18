// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

import {GovernanceToken} from "src/dao/GovernanceToken.sol";

contract GovernanceTokenTest is Test {
    GovernanceToken token;

    address teamUser = address(10);
    address treasuryUser = address(11);
    address airdropUser = address(12);
    address liquidityUser = address(13);

    address voter = address(10);

    function setUp() public {
        token = new GovernanceToken(teamUser, treasuryUser, airdropUser, liquidityUser);
    }

    // 1. correct initial distribution
    function testInitialDistribution() public view {
        assertEq(token.balanceOf(treasuryUser), 300_000 ether);
        assertEq(token.balanceOf(airdropUser), 200_000 ether);
        assertEq(token.balanceOf(liquidityUser), 100_000 ether);
        assertEq(token.balanceOf(teamUser), 400_000 ether);
    }

    // 2. delegation enables voting power
    function testDelegation() public {
        vm.prank(treasuryUser);
        token.delegate(voter);

        assertGt(token.getVotes(voter), 0);
    }

    // 3. voting power snapshot consistency
    function testVotingPowerSnapshot() public {
        vm.prank(treasuryUser);
        token.delegate(treasuryUser);

        uint256 votes = token.getVotes(treasuryUser);
        uint256 balance = token.balanceOf(treasuryUser);

        assertEq(votes, balance);
    }

    // 4. permit works (EIP-2612)
    function testPermit() public {
        uint256 pk = 0xA11CE;
        address owner = vm.addr(pk);

        deal(address(token), owner, 100 ether);

        uint256 deadline = block.timestamp + 1 hours;
        uint256 nonce = token.nonces(owner);

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                token.DOMAIN_SEPARATOR(),
                keccak256(
                    abi.encode(
                        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                        owner,
                        address(this),
                        100 ether,
                        nonce,
                        deadline
                    )
                )
            )
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, digest);

        token.permit(owner, address(this), 100 ether, deadline, v, r, s);

        assertEq(token.allowance(owner, address(this)), 100 ether);
    }

    // 5. delegation changes voting power dynamically
    function testDelegationUpdate() public {
        vm.prank(treasuryUser);
        token.transfer(voter, 1000 ether);

        vm.prank(voter);
        token.delegate(voter);

        vm.roll(block.number + 1);

        uint256 before = token.getVotes(voter);

        vm.prank(voter);
        token.transfer(address(20), 100 ether);

        vm.roll(block.number + 1);

        assertLt(token.getVotes(voter), before);
    }

    function testFuzz_transfer_conservesSupply(uint256 amount) public {
        amount = bound(amount, 0, token.balanceOf(treasuryUser));
        uint256 supplyBefore = token.totalSupply();
        vm.prank(treasuryUser);
        token.transfer(voter, amount);
        assertEq(token.totalSupply(), supplyBefore);
    }

    function testFuzz_delegate_votingPowerMatchesBalance(uint256 amount) public {
        uint256 available = token.balanceOf(treasuryUser);
        amount = bound(amount, 1 ether, available);
        vm.prank(treasuryUser);
        token.transfer(voter, amount);
        vm.prank(voter);
        token.delegate(voter);
        vm.roll(block.number + 1);
        assertEq(token.getVotes(voter), token.balanceOf(voter));
    }
}
