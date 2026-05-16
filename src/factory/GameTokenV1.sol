// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ERC20Upgradeable}   from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable}    from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable}      from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GameTokenV1 is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }

    function initialize(string memory name, string memory symbol, address owner) public initializer {
        __ERC20_init(name, symbol);
        __Ownable_init(owner);
    }

    function mint(address to, uint256 amount) external virtual onlyOwner {
        _mint(to, amount);
    }

    function version() external pure virtual returns (string memory) { return "V1"; }

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}
}
