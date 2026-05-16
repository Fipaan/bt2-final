// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {GameTokenV1} from "./GameTokenV1.sol";

contract GameTokenV2 is GameTokenV1 {
    uint256 public mintCap;

    function initializeV2(uint256 cap) external reinitializer(2) {
        mintCap = cap;
    }

    function mint(address to, uint256 amount) external override onlyOwner {
        if (mintCap > 0) require(totalSupply() + amount <= mintCap, "cap exceeded");
        _mint(to, amount);
    }

    function version() external pure override returns (string memory) { return "V2"; }
}
