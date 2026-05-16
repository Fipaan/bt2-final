// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {GameToken} from "src/amm/GameToken.sol";

contract GameTokenFactory {
    event TokenCreated(address indexed token, bytes32 indexed salt, bool create2);

    address[] public allTokens;

    /// @notice Deploy with CREATE (address unpredictable)
    function createToken(
        string memory name,
        string memory symbol
    ) external returns (address token) {
        token = address(new GameToken(name, symbol, msg.sender));
        allTokens.push(token);
        emit TokenCreated(token, bytes32(0), false);
    }

    /// @notice Deploy with CREATE2 (address deterministic)
    function createToken2(
        string memory name,
        string memory symbol,
        bytes32 salt
    ) external returns (address token) {
        token = address(new GameToken{salt: salt}(name, symbol, msg.sender));
        allTokens.push(token);
        emit TokenCreated(token, salt, true);
    }

    /// @notice Predict CREATE2 address before deployment
    function predictAddress(
        string memory name,
        string memory symbol,
        bytes32 salt,
        address deployer
    ) external pure returns (address) {
        bytes memory creationCode = abi.encodePacked(
            type(GameToken).creationCode,
            abi.encode(name, symbol, deployer)
        );
        return address(uint160(uint256(keccak256(abi.encodePacked(
            bytes1(0xff),
            deployer,
            salt,
            keccak256(creationCode)
        )))));
    }

    function allTokensLength() external view returns (uint256) {
        return allTokens.length;
    }
}
