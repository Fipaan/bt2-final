// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

import {VRFConsumer}        from "src/chainlink/VRFConsumer.sol";
import {MockVRFCoordinator} from "src/chainlink/mocks/MockVRFCoordinator.sol";

contract VRFConsumerTest is Test {
    VRFConsumer        vrfConsumer;
    MockVRFCoordinator coordinator;

    address alice = address(0xA11CE);

    bytes32 constant KEY_HASH = bytes32("keyhash");
    uint256 constant SUB_ID   = 1;

    function setUp() public {
        coordinator = new MockVRFCoordinator();
        vrfConsumer = new VRFConsumer(address(coordinator), KEY_HASH, SUB_ID);
    }

    function test_requestRandom_returnsRequestId() public {
        vm.prank(alice);
        uint256 reqId = vrfConsumer.requestRandom();
        assertGt(reqId, 0);
    }

    function test_requestRandom_storesSender() public {
        vm.prank(alice);
        uint256 reqId = vrfConsumer.requestRandom();
        assertEq(vrfConsumer.requestToSender(reqId), alice);
    }

    function test_requestRandom_emitsEvent() public {
        vm.prank(alice);
        vm.expectEmit(true, true, false, false);
        emit VRFConsumer.RandomRequested(1, alice);
        vrfConsumer.requestRandom();
    }

    function test_fulfillRandomWords_storesResult() public {
        vm.prank(alice);
        uint256 reqId = vrfConsumer.requestRandom();

        uint256[] memory words = new uint256[](1);
        words[0] = 12345;
        coordinator.fulfillRandomWords(reqId, words);

        assertEq(vrfConsumer.lastRandomResult(alice), 12345);
    }

    function test_fulfillRandomWords_emitsEvent() public {
        vm.prank(alice);
        uint256 reqId = vrfConsumer.requestRandom();

        uint256[] memory words = new uint256[](1);
        words[0] = 99999;

        vm.expectEmit(true, false, false, true);
        emit VRFConsumer.RandomFulfilled(reqId, 99999);
        coordinator.fulfillRandomWords(reqId, words);
    }

    function test_multipleRequests_independentResults() public {
        address bob = address(0xB0B);

        vm.prank(alice);
        uint256 reqA = vrfConsumer.requestRandom();

        vm.prank(bob);
        uint256 reqB = vrfConsumer.requestRandom();

        uint256[] memory wordsA = new uint256[](1); wordsA[0] = 111;
        uint256[] memory wordsB = new uint256[](1); wordsB[0] = 222;

        coordinator.fulfillRandomWords(reqA, wordsA);
        coordinator.fulfillRandomWords(reqB, wordsB);

        assertEq(vrfConsumer.lastRandomResult(alice), 111);
        assertEq(vrfConsumer.lastRandomResult(bob),   222);
    }

    function testFuzz_fulfillRandomWords_anyWord(uint256 word) public {
        vm.prank(alice);
        uint256 reqId = vrfConsumer.requestRandom();

        uint256[] memory words = new uint256[](1);
        words[0] = word;
        coordinator.fulfillRandomWords(reqId, words);

        assertEq(vrfConsumer.lastRandomResult(alice), word);
    }
}
