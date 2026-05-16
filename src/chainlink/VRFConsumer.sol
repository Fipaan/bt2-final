// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {VRFConsumerBaseV2Plus}      from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient}            from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {IVRFCoordinatorV2Plus}      from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";

contract VRFConsumer is VRFConsumerBaseV2Plus {
    IVRFCoordinatorV2Plus public immutable coordinator;

    bytes32 public immutable keyHash;
    uint256 public immutable subscriptionId;
    uint16  public constant  REQUEST_CONFIRMATIONS = 3;
    uint32  public constant  NUM_WORDS = 1;
    uint32  public constant  CALLBACK_GAS_LIMIT = 100_000;

    mapping(uint256 => address) public requestToSender;
    mapping(address => uint256) public lastRandomResult;

    event RandomRequested(uint256 indexed requestId, address indexed sender);
    event RandomFulfilled(uint256 indexed requestId, uint256 randomWord);

    constructor(
        address coordinator_,
        bytes32 keyHash_,
        uint256 subscriptionId_
    ) VRFConsumerBaseV2Plus(coordinator_) {
        coordinator    = IVRFCoordinatorV2Plus(coordinator_);
        keyHash        = keyHash_;
        subscriptionId = subscriptionId_;
    }

    function requestRandom() external returns (uint256 requestId) {
        requestId = coordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash:             keyHash,
                subId:               subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit:    CALLBACK_GAS_LIMIT,
                numWords:            NUM_WORDS,
                extraArgs:           VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        requestToSender[requestId] = msg.sender;
        emit RandomRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords)
        internal override
    {
        address sender = requestToSender[requestId];
        lastRandomResult[sender] = randomWords[0];
        emit RandomFulfilled(requestId, randomWords[0]);
    }
}
