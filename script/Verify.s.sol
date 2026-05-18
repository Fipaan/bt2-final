// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IGovernor}          from "@openzeppelin/contracts/governance/IGovernor.sol";

import {MyGovernor}      from "src/dao/MyGovernor.sol";
import {Treasury}        from "src/dao/Treasury.sol";
import {Box}             from "src/dao/Box.sol";
import {GameTokenV1}     from "src/factory/GameTokenV1.sol";

contract Verify is Script {
    function run() external view {
        address timelockAddr  = vm.envAddress("TIMELOCK_ADDR");
        address governorAddr  = vm.envAddress("GOVERNOR_ADDR");
        address treasuryAddr  = vm.envAddress("TREASURY_ADDR");
        address boxAddr       = vm.envAddress("BOX_ADDR");
        address proxyAddr     = vm.envAddress("PROXY_ADDR");

        TimelockController timelock = TimelockController(payable(timelockAddr));
        MyGovernor         governor = MyGovernor(payable(governorAddr));
        Treasury           treasury = Treasury(payable(treasuryAddr));
        Box                box      = Box(boxAddr);
        GameTokenV1        proxy    = GameTokenV1(proxyAddr);

        bool ok = true;

        // 1. Timelock delay
        uint256 delay = timelock.getMinDelay();
        if (delay == 10 seconds) {
            console.log("[OK] Timelock delay: 10 seconds");
        } else {
            console.log("[WARN] Timelock delay is not 10 seconds:", delay);
            ok = false;
        }

        // 2. Governor proposer role is governor
        bool isProposer = timelock.hasRole(timelock.PROPOSER_ROLE(), governorAddr);
        if (isProposer) {
            console.log("[OK] Governor has PROPOSER_ROLE");
        } else {
            console.log("[FAIL] Governor missing PROPOSER_ROLE");
            ok = false;
        }

        // 3. Executor role is address(0) (anyone can execute)
        bool isExecutor = timelock.hasRole(timelock.EXECUTOR_ROLE(), address(0));
        if (isExecutor) {
            console.log("[OK] address(0) has EXECUTOR_ROLE");
        } else {
            console.log("[FAIL] address(0) missing EXECUTOR_ROLE");
            ok = false;
        }

        // 4. Treasury timelock is correct
        if (treasury.timelock() == timelockAddr) {
            console.log("[OK] Treasury.timelock == Timelock");
        } else {
            console.log("[FAIL] Treasury.timelock mismatch");
            ok = false;
        }

        // 5. Box timelock is correct
        if (box.timelock() == timelockAddr) {
            console.log("[OK] Box.timelock == Timelock");
        } else {
            console.log("[FAIL] Box.timelock mismatch");
            ok = false;
        }

        // 6. Governor voting delay
        uint256 votingDelay = governor.votingDelay();
        if (votingDelay == 5) {
            console.log("[OK] Governor votingDelay:", votingDelay);
        } else {
            console.log("[WARN] Governor votingDelay unexpected:", votingDelay);
        }

        // 7. Governor voting period
        uint256 votingPeriod = governor.votingPeriod();
        if (votingPeriod == 10) {
            console.log("[OK] Governor votingPeriod:", votingPeriod);
        } else {
            console.log("[WARN] Governor votingPeriod unexpected:", votingPeriod);
        }

        // 8. Governor quorum numerator
        uint256 quorumNum = governor.quorumNumerator();
        if (quorumNum == 4) {
            console.log("[OK] Governor quorum: 4%");
        } else {
            console.log("[FAIL] Governor quorum unexpected:", quorumNum);
            ok = false;
        }

        // 9. Proxy owner is deployer (not zero)
        address proxyOwner = proxy.owner();
        if (proxyOwner != address(0)) {
            console.log("[OK] Proxy owner:", proxyOwner);
        } else {
            console.log("[FAIL] Proxy owner is zero address");
            ok = false;
        }

        // 10. No admin backdoor - deployer should NOT have DEFAULT_ADMIN_ROLE on timelock
        // (admin role should have been renounced or transferred to timelock itself)
        bool deployerIsAdmin = timelock.hasRole(timelock.DEFAULT_ADMIN_ROLE(), msg.sender);
        if (!deployerIsAdmin) {
            console.log("[OK] Deployer has no DEFAULT_ADMIN_ROLE on Timelock");
        } else {
            console.log("[WARN] Deployer still has DEFAULT_ADMIN_ROLE - consider renouncing");
        }

        console.log("");
        if (ok) {
            console.log("=== ALL CHECKS PASSED ===");
        } else {
            console.log("=== SOME CHECKS FAILED ===");
        }
    }
}
