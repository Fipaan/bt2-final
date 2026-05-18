// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IGovernor} from "@openzeppelin/contracts/governance/IGovernor.sol";

import {GovernanceToken} from "src/dao/GovernanceToken.sol";
import {MyGovernor} from "src/dao/MyGovernor.sol";
import {Box} from "src/dao/Box.sol";
import {Treasury} from "src/dao/Treasury.sol";

contract FullFlowTest is Test {
    GovernanceToken token;
    MyGovernor governor;
    TimelockController timelock;

    Box box;
    Treasury treasury;

    address alice = address(1);
    address bob = address(2);

    uint256 VOTING_DELAY;
    uint256 VOTING_PERIOD;

    function setUp() public {
        address teamUser = address(10);
        address treasuryUser = address(11);
        address airdropUser = address(12);
        address liquidityUser = address(13);

        token = new GovernanceToken(teamUser, treasuryUser, airdropUser, liquidityUser);

        deal(address(token), alice, 1_000_000 ether);
        deal(address(token), bob, 1_000_000 ether);

        vm.prank(alice);
        token.delegate(alice);

        vm.prank(bob);
        token.delegate(bob);

        // move past delegation checkpoint
        vm.roll(block.number + VOTING_DELAY + 1);

        // TIMELOCK
        address[] memory proposers = new address[](0);

        address[] memory executors = new address[](1);
        executors[0] = address(0);

        timelock = new TimelockController(2 days, proposers, executors, address(this));

        // GOVERNOR
        governor = new MyGovernor(token, timelock);

        VOTING_DELAY = governor.votingDelay();
        VOTING_PERIOD = governor.votingPeriod();

        timelock.grantRole(timelock.PROPOSER_ROLE(), address(governor));
        timelock.grantRole(timelock.EXECUTOR_ROLE(), address(0));

        // TARGETS
        box = new Box(address(timelock));
        treasury = new Treasury(address(timelock));
    }

    function testFullDAOFlow() public {
        // ================= PROPOSAL 1 (BOX) =================
        address[] memory targets = new address[](1);
        targets[0] = address(box);

        uint256[] memory values = new uint256[](1);

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("store(uint256)", 42);

        string memory description = "Set Box to 42";

        vm.prank(alice);
        uint256 proposalId = governor.propose(targets, values, calldatas, description);

        // move to active voting
        vm.roll(block.number + VOTING_DELAY + 1);

        vm.prank(alice);
        governor.castVote(proposalId, 1);

        vm.prank(bob);
        governor.castVote(proposalId, 1);

        // end voting period
        vm.roll(block.number + VOTING_PERIOD + VOTING_DELAY + 1);

        bytes32 descHash = keccak256(bytes(description));

        assertEq(uint256(governor.state(proposalId)), uint256(IGovernor.ProposalState.Succeeded));

        governor.queue(targets, values, calldatas, descHash);

        vm.warp(block.timestamp + 2 days + 1);

        governor.execute(targets, values, calldatas, descHash);

        assertEq(box.retrieve(), 42);

        // ================= PROPOSAL 2 (TREASURY) =================
        vm.deal(address(treasury), 10 ether);

        address[] memory t2 = new address[](1);
        t2[0] = address(treasury);

        uint256[] memory v2 = new uint256[](1);

        bytes[] memory c2 = new bytes[](1);
        uint256 sent = 5 ether;
        c2[0] = abi.encodeWithSignature("withdrawETH(address,uint256)", alice, sent);

        string memory desc2 = "Send ETH";

        vm.prank(alice);
        uint256 proposal2 = governor.propose(t2, v2, c2, desc2);

        vm.roll(block.number + VOTING_DELAY + 1);

        vm.prank(alice);
        governor.castVote(proposal2, 1);

        vm.prank(bob);
        governor.castVote(proposal2, 1);

        vm.roll(block.number + VOTING_PERIOD + VOTING_DELAY + 1);

        bytes32 descHash2 = keccak256(bytes(desc2));

        assertEq(uint256(governor.state(proposal2)), uint256(IGovernor.ProposalState.Succeeded));

        governor.queue(t2, v2, c2, descHash2);

        vm.warp(block.timestamp + 2 days + 2);

        governor.execute(t2, v2, c2, descHash2);
        assertEq(alice.balance, sent, "treasury ETH not received");
    }
}
