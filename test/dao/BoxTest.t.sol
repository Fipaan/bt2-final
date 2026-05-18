// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

import {GovernanceToken} from "src/dao/GovernanceToken.sol";
import {MyGovernor} from "src/dao/MyGovernor.sol";
import {Box} from "src/dao/Box.sol";

contract BoxTest is Test {
    GovernanceToken token;
    MyGovernor governor;
    TimelockController timelock;
    Box box;

    uint256 VOTING_DELAY;
    uint256 VOTING_PERIOD;

    address voter1 = address(1);
    address voter2 = address(2);

    function setUp() public {
        // ---------------- ACTORS ----------------
        address teamUser = address(10);
        address treasuryUser = address(11);
        address airdropUser = address(12);
        address liquidityUser = address(13);

        // ---------------- TOKEN ----------------
        token = new GovernanceToken(teamUser, treasuryUser, airdropUser, liquidityUser);

        // ---------------- VOTERS ----------------
        vm.prank(teamUser);
        token.transfer(voter1, 100_000 ether);

        vm.prank(teamUser);
        token.transfer(voter2, 200_000 ether);

        // ---------------- DELEGATION ----------------
        vm.prank(voter1);
        token.delegate(voter1);

        vm.prank(voter2);
        token.delegate(voter2);

        vm.prank(teamUser);
        token.delegate(teamUser);

        vm.prank(treasuryUser);
        token.delegate(treasuryUser);

        vm.roll(block.number + 1);

        // ---------------- TIMELOCK ----------------
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](1);
        executors[0] = address(0);

        timelock = new TimelockController(2 days, proposers, executors, address(this));

        governor = new MyGovernor(token, timelock);

        VOTING_DELAY = governor.votingDelay();
        VOTING_PERIOD = governor.votingPeriod();

        timelock.grantRole(timelock.PROPOSER_ROLE(), address(governor));
        timelock.grantRole(timelock.EXECUTOR_ROLE(), address(0));

        // ---------------- TARGET CONTRACTS ----------------
        box = new Box(address(timelock));
    }
}
