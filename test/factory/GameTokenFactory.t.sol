// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import {GameTokenFactory} from "src/factory/GameTokenFactory.sol";
import {GameTokenV1}      from "src/factory/GameTokenV1.sol";
import {GameTokenV2}      from "src/factory/GameTokenV2.sol";

contract GameTokenFactoryTest is Test {
    GameTokenFactory factory;
    GameTokenV1      impl1;
    GameTokenV2      impl2;

    address alice = address(0xA11CE);

    function setUp() public {
        factory = new GameTokenFactory();
        impl1   = new GameTokenV1();
        impl2   = new GameTokenV2();
    }

    // -- helpers -----------------------------------------------

    function _proxy(address owner) internal returns (GameTokenV1) {
        bytes memory data = abi.encodeCall(GameTokenV1.initialize, ("Test", "TST", owner));
        return GameTokenV1(address(new ERC1967Proxy(address(impl1), data)));
    }

    // -- Factory: CREATE ---------------------------------------

    function test_create_deploysToken() public {
        address token = factory.createToken("Gold", "GLD");
        assertNotEq(token, address(0));
    }

    function test_create_ownerIsCallerMessage() public {
        address token = factory.createToken("Gold", "GLD");
        assertEq(GameTokenV1(token).owner(), address(this));
    }

    function test_create_trackedInAllTokens() public {
        factory.createToken("Gold", "GLD");
        factory.createToken("Silver", "SLV");
        assertEq(factory.allTokensLength(), 2);
    }

    function test_create_differentAddressEachTime() public {
        address a = factory.createToken("Gold", "GLD");
        address b = factory.createToken("Gold", "GLD");
        assertNotEq(a, b);
    }

    function test_create_emitsEvent() public {
        vm.expectEmit(false, false, false, false);
        emit GameTokenFactory.TokenCreated(address(0), bytes32(0), false);
        factory.createToken("Gold", "GLD");
    }

    // -- Factory: CREATE2 --------------------------------------

    function test_create2_deploysToken() public {
        address token = factory.createToken2("Gold", "GLD", bytes32("salt1"));
        assertNotEq(token, address(0));
    }

    function test_create2_deterministicAddress() public {
        bytes32 salt = bytes32("mysalt");
        address predicted = factory.predictAddress("Gold", "GLD", salt, address(factory));
        address actual    = factory.createToken2("Gold", "GLD", salt);
        assertEq(actual, predicted);
    }

    function test_create2_revertsOnSaltReuse() public {
        bytes32 salt = bytes32("dupe");
        factory.createToken2("Gold", "GLD", salt);
        vm.expectRevert();
        factory.createToken2("Gold", "GLD", salt);
    }

    function test_create2_emitsEvent() public {
        bytes32 salt = bytes32("s");
        vm.expectEmit(false, true, false, false);
        emit GameTokenFactory.TokenCreated(address(0), salt, true);
        factory.createToken2("Gold", "GLD", salt);
    }

    // -- UUPS Proxy: V1 ----------------------------------------

    function test_proxy_initialize() public {
        GameTokenV1 proxy = _proxy(alice);
        assertEq(proxy.name(), "Test");
        assertEq(proxy.symbol(), "TST");
        assertEq(proxy.owner(), alice);
    }

    function test_proxy_cannotReinitialize() public {
        GameTokenV1 proxy = _proxy(alice);
        vm.expectRevert();
        proxy.initialize("X", "X", alice);
    }

    function test_proxy_mint() public {
        GameTokenV1 proxy = _proxy(alice);
        vm.prank(alice);
        proxy.mint(alice, 1000 ether);
        assertEq(proxy.balanceOf(alice), 1000 ether);
    }

    function test_proxy_mintOnlyOwner() public {
        GameTokenV1 proxy = _proxy(alice);
        vm.expectRevert();
        proxy.mint(address(this), 1000 ether);
    }

    function test_proxy_version_v1() public {
        GameTokenV1 proxy = _proxy(alice);
        assertEq(proxy.version(), "V1");
    }

    // -- UUPS Proxy: V1 → V2 upgrade --------------------------

    function test_upgrade_toV2() public {
        GameTokenV1 proxy = _proxy(alice);
        vm.prank(alice);
        proxy.upgradeToAndCall(address(impl2), "");
        assertEq(GameTokenV2(address(proxy)).version(), "V2");
    }

    function test_upgrade_onlyOwner() public {
        GameTokenV1 proxy = _proxy(alice);
        vm.expectRevert();
        proxy.upgradeToAndCall(address(impl2), "");
    }

    function test_upgrade_statePreserved() public {
        GameTokenV1 proxy = _proxy(alice);
        vm.prank(alice);
        proxy.mint(alice, 500 ether);

        vm.prank(alice);
        proxy.upgradeToAndCall(address(impl2), "");

        assertEq(GameTokenV2(address(proxy)).balanceOf(alice), 500 ether);
        assertEq(GameTokenV2(address(proxy)).owner(), alice);
    }

    function test_upgrade_v2_initializeCap() public {
        GameTokenV1 proxy = _proxy(alice);
        vm.prank(alice);
        proxy.upgradeToAndCall(
            address(impl2),
            abi.encodeCall(GameTokenV2.initializeV2, (1000 ether))
        );
        assertEq(GameTokenV2(address(proxy)).mintCap(), 1000 ether);
    }

    function test_upgrade_v2_capEnforced() public {
        GameTokenV1 proxy = _proxy(alice);
        vm.startPrank(alice);
        proxy.upgradeToAndCall(
            address(impl2),
            abi.encodeCall(GameTokenV2.initializeV2, (1000 ether))
        );
        vm.expectRevert("cap exceeded");
        GameTokenV2(address(proxy)).mint(alice, 1001 ether);
        vm.stopPrank();
    }

    function test_upgrade_v2_mintUnderCap() public {
        GameTokenV1 proxy = _proxy(alice);
        vm.startPrank(alice);
        proxy.upgradeToAndCall(
            address(impl2),
            abi.encodeCall(GameTokenV2.initializeV2, (1000 ether))
        );
        GameTokenV2(address(proxy)).mint(alice, 999 ether);
        vm.stopPrank();
        assertEq(GameTokenV2(address(proxy)).balanceOf(alice), 999 ether);
    }
}
