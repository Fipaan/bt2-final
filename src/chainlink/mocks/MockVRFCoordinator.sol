// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient}       from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract MockVRFCoordinator {
    uint256 private _reqId;

    mapping(uint256 => address) public consumers;

    function requestRandomWords(VRFV2PlusClient.RandomWordsRequest calldata)
        external returns (uint256 requestId)
    {
        requestId = ++_reqId;
        consumers[requestId] = msg.sender;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] calldata words) external {
        VRFConsumerBaseV2Plus(consumers[requestId]).rawFulfillRandomWords(requestId, words);
    }
}
