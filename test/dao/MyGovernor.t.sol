// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IGovernor} from "@openzeppelin/contracts/governance/IGovernor.sol";

import {GovernanceToken} from "src/dao/GovernanceToken.sol";
import {MyGovernor} from "src/dao/MyGovernor.sol";
import {Box} from "src/dao/Box.sol";

contract MyGovernorTest is Test {
    GovernanceToken token;
    MyGovernor governor;
    TimelockController timelock;
    Box box;

    uint256 VOTING_DELAY;
    uint256 VOTING_PERIOD;

    address teamUser = address(10);
    address treasuryUser = address(11);
    address airdropUser = address(12);
    address liquidityUser = address(13);

    address voter1 = address(1);
    address voter2 = address(2);

    function setUp() public {
        token = new GovernanceToken(teamUser, treasuryUser, airdropUser, liquidityUser);

        vm.prank(liquidityUser);
        token.transfer(voter1, 30_000 ether);

        vm.prank(liquidityUser);
        token.transfer(voter2, 60_000 ether);

        vm.prank(voter1);
        token.delegate(voter1);

        vm.prank(voter2);
        token.delegate(voter2);

        vm.roll(block.number + VOTING_DELAY + 1);

        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](1);
        executors[0] = address(0);

        timelock = new TimelockController(2 days, proposers, executors, address(this));

        governor = new MyGovernor(token, timelock);

        VOTING_DELAY = governor.votingDelay();
        VOTING_PERIOD = governor.votingPeriod();

        timelock.grantRole(timelock.PROPOSER_ROLE(), address(governor));
        timelock.grantRole(timelock.EXECUTOR_ROLE(), address(0));

        box = new Box(address(timelock));
    }

    // =========================================================
    // HELPERS
    // =========================================================

    function _proposal() internal returns (uint256) {
        address[] memory t = new address[](1);
        t[0] = address(box);

        uint256[] memory v = new uint256[](1);

        bytes[] memory c = new bytes[](1);
        c[0] = abi.encodeWithSignature("store(uint256)", 42);

        vm.prank(voter1);
        return governor.propose(t, v, c, "DAO proposal");
    }

    function _descHash() internal pure returns (bytes32) {
        return keccak256(bytes("DAO proposal"));
    }

    // =========================================================
    // proposal creation
    // =========================================================
    function test_propose() public {
        uint256 id = _proposal();
        assertGt(id, 0);
    }

    // =========================================================
    // proposal becomes active
    // =========================================================
    function test_state_active() public {
        uint256 id = _proposal();
        vm.roll(block.number + VOTING_DELAY + 1);

        assertEq(uint256(governor.state(id)), uint256(IGovernor.ProposalState.Active));
    }

    // =========================================================
    // voting FOR works
    // =========================================================
    function test_vote_for() public {
        uint256 id = _proposal();
        vm.roll(block.number + VOTING_DELAY + 1);

        vm.prank(voter1);
        governor.castVote(id, 1);

        (uint256 against, uint256 forVotes, uint256 abstain) = governor.proposalVotes(id);
        assertGt(forVotes, 0);
        assertEq(against, 0);
        assertEq(abstain, 0);
    }

    // =========================================================
    // voting AGAINST works
    // =========================================================
    function test_vote_against() public {
        uint256 id = _proposal();
        vm.roll(block.number + VOTING_DELAY + 1);

        vm.prank(voter1);
        governor.castVote(id, 0);

        (uint256 against,,) = governor.proposalVotes(id);
        assertGt(against, 0);
    }

    // =========================================================
    // voting ABSTAIN works
    // =========================================================
    function test_vote_abstain() public {
        uint256 id = _proposal();
        vm.roll(block.number + VOTING_DELAY + 1);

        vm.prank(voter1);
        governor.castVote(id, 2);

        (,, uint256 abstain) = governor.proposalVotes(id);
        assertGt(abstain, 0);
    }

    // =========================================================
    // delegation gives voting power
    // =========================================================
    function test_delegation() public {
        vm.prank(address(10));
        token.transfer(voter1, 1000 ether);

        vm.roll(block.number + VOTING_DELAY + 1);

        vm.prank(voter1);
        token.delegate(voter1);

        assertGt(token.getVotes(voter1), 0);
    }

    // =========================================================
    // proposal succeeds with votes
    // =========================================================
    function test_succeeded_state() public {
        uint256 id = _proposal();
        vm.roll(block.number + VOTING_DELAY + 1);

        vm.prank(voter1);
        governor.castVote(id, 1);
        vm.prank(voter2);
        governor.castVote(id, 1);

        vm.roll(block.number + VOTING_PERIOD + 1);

        assertEq(uint256(governor.state(id)), uint256(IGovernor.ProposalState.Succeeded));
    }

    // =========================================================
    // proposal queued
    // =========================================================
    function test_queue() public {
        uint256 id = _proposal();
        vm.roll(block.number + VOTING_DELAY + 1);

        vm.prank(voter1);
        governor.castVote(id, 1);
        vm.prank(voter2);
        governor.castVote(id, 1);

        vm.roll(block.number + VOTING_PERIOD + 1);

        governor.queue(_targets(), _values(), _calldatas(), _descHash());
    }

    // =========================================================
    // execution works
    // =========================================================
    function test_execute() public {
        uint256 id = _proposal();
        vm.roll(block.number + VOTING_DELAY + 1);

        vm.prank(voter1);
        governor.castVote(id, 1);
        vm.prank(voter2);
        governor.castVote(id, 1);

        vm.roll(block.number + VOTING_PERIOD + 1);

        governor.queue(_targets(), _values(), _calldatas(), _descHash());

        vm.warp(block.timestamp + 2 days + 1);

        governor.execute(_targets(), _values(), _calldatas(), _descHash());

        assertEq(box.retrieve(), 42);
    }

    // =========================================================
    // proposal defeated (no votes)
    // =========================================================
    function test_defeated() public {
        uint256 id = _proposal();

        vm.roll(block.number + VOTING_DELAY + VOTING_PERIOD + 1);

        assertEq(uint256(governor.state(id)), uint256(IGovernor.ProposalState.Defeated));
    }

    // =========================================================
    // proposal threshold blocks low-balance proposer
    // =========================================================
    function test_proposal_threshold_blocks_low_balance() public {
        address poorUser = address(99);
        vm.prank(liquidityUser);
        token.transfer(poorUser, 1 ether); // well below 1% threshold
        vm.prank(poorUser);
        token.delegate(poorUser);
        vm.roll(block.number + VOTING_DELAY + 1);
        address[] memory t = new address[](1);
        t[0] = address(box);
        uint256[] memory v = new uint256[](1);
        bytes[] memory c = new bytes[](1);
        c[0] = abi.encodeWithSignature("store(uint256)", 1);
        vm.expectRevert();
        vm.prank(poorUser);
        governor.propose(t, v, c, "should fail");
    }

    // =========================================================
    // quorum not met -> defeated
    // =========================================================
    function test_defeated_quorum_not_met() public {
        // voter1 has 30k, total supply ~1M -> 3% < 4% quorum
        uint256 id = _proposal();
        vm.roll(block.number + VOTING_DELAY + 1);
        vm.prank(voter1);
        governor.castVote(id, 1); // votes FOR but quorum not met
        vm.roll(block.number + VOTING_PERIOD + 1);
        assertEq(uint256(governor.state(id)), uint256(IGovernor.ProposalState.Defeated));
    }

    // =========================================================
    // helpers
    // =========================================================
    function _targets() internal view returns (address[] memory t) {
        t = new address[](1);
        t[0] = address(box);
    }

    function _values() internal pure returns (uint256[] memory v) {
        v = new uint256[](1);
    }

    function _calldatas() internal pure returns (bytes[] memory c) {
        c = new bytes[](1);
        c[0] = abi.encodeWithSignature("store(uint256)", 42);
    }
}
