// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import {Equestria1155} from "src/amm/Equestria1155.sol";
import {MockVRFCoordinator} from "src/chainlink/mocks/MockVRFCoordinator.sol";

contract GoodReceiver is IERC1155Receiver {
    event SingleReceived(address operator, address from, uint256 id, uint256 value, bytes data);
    event BatchReceived(address operator, address from, uint256[] ids, uint256[] values, bytes data);

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        if (interfaceId == 0xffffffff) return false;
        return interfaceId == type(IERC1155).interfaceId;
    }

    function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes calldata data)
        external
        returns (bytes4)
    {
        emit SingleReceived(operator, from, id, value, data);
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4) {
        emit BatchReceived(operator, from, ids, values, data);
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }
}

contract BadReceiver is IERC1155Receiver {
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        if (interfaceId == 0xffffffff) return false;
        return interfaceId == type(IERC1155).interfaceId;
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return 0x00000000;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        pure
        returns (bytes4)
    {
        return 0x00000000;
    }
}

contract Equestria1155Test is Test {
    Equestria1155 internal token;
    GoodReceiver internal goodReceiver;
    BadReceiver internal badReceiver;
    MockVRFCoordinator internal coordinator;

    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);

    function setUp() public {
        coordinator = new MockVRFCoordinator();
        token = new Equestria1155("ipfs://game/{id}", address(coordinator), bytes32("eq1155key"), 1);

        goodReceiver = new GoodReceiver();
        badReceiver = new BadReceiver();

        uint256[] memory ids = new uint256[](6);
        uint256[] memory values = new uint256[](6);

        ids[0] = token.HONESTY();
        values[0] = 100;
        ids[1] = token.KINDNESS();
        values[1] = 100;
        ids[2] = token.LAUGHTER();
        values[2] = 200;
        ids[3] = token.GENEROSITY();
        values[3] = 100;
        ids[4] = token.LOYALTY();
        values[4] = 100;
        ids[5] = token.MAGIC();
        values[5] = 100;

        token.mintBatch(alice, ids, values, "");
        token.mintBatch(bob, ids, values, "");
    }

    function testMintSingleFungible() public {
        token.mint(alice, token.HONESTY(), 25, "");
        assertEq(token.balanceOf(alice, token.HONESTY()), 125);
    }

    function testMintBatchAndBalances() public {
        uint256[] memory ids = new uint256[](3);
        uint256[] memory values = new uint256[](3);

        ids[0] = token.HONESTY();
        values[0] = 7;
        ids[1] = token.KINDNESS();
        values[1] = 8;
        ids[2] = token.LAUGHTER();
        values[2] = 9;

        token.mintBatch(bob, ids, values, "");

        assertEq(token.balanceOf(bob, token.HONESTY()), 107);
        assertEq(token.balanceOf(bob, token.KINDNESS()), 108);
        assertEq(token.balanceOf(bob, token.LAUGHTER()), 209);
    }

    function testBalanceOfBatch() public view {
        address[] memory owners = new address[](3);
        uint256[] memory ids = new uint256[](3);

        owners[0] = alice;
        ids[0] = token.HONESTY();
        owners[1] = alice;
        ids[1] = token.KINDNESS();
        owners[2] = alice;
        ids[2] = token.LAUGHTER();

        uint256[] memory balances = token.balanceOfBatch(owners, ids);

        assertEq(balances[0], 100);
        assertEq(balances[1], 100);
        assertEq(balances[2], 200);
    }

    function testUriSubstitution() public view {
        string memory expected = string.concat("ipfs://game/", _toHex64(token.PINKIE_PIE()), ".json");
        assertEq(token.uri(token.PINKIE_PIE()), expected);
    }

    function testCraftSuccessMintsNFTAndBurnsResources() public {
        uint256 id = token.PINKIE_PIE();
        vm.prank(alice);
        uint256 reqId = token.craft(id);

        assertEq(token.balanceOf(alice, token.HONESTY()), 85);
        assertEq(token.balanceOf(alice, token.KINDNESS()), 90);
        assertEq(token.balanceOf(alice, token.LAUGHTER()), 100);
        assertEq(token.balanceOf(alice, token.GENEROSITY()), 80);
        assertEq(token.balanceOf(alice, token.LOYALTY()), 95);
        assertEq(token.balanceOf(alice, token.MAGIC()), 100);
        assertEq(token.balanceOf(alice, id), 0);

        // simulate Chainlink fulfillment with a non-lucky number (>=10)
        uint256[] memory words = new uint256[](1);
        words[0] = 50; // 50 % 100 = 50, not < 10, so amount = 1
        coordinator.fulfillRandomWords(reqId, words);

        assertEq(token.balanceOf(alice, id), 1);
    }

    function testCraftDoubleDropOnLuckyRoll() public {
        uint256 id = token.PINKIE_PIE();
        vm.prank(alice);
        uint256 reqId = token.craft(id);

        uint256[] memory words = new uint256[](1);
        words[0] = 9; // 9 % 100 = 9 < 10 -> double drop
        coordinator.fulfillRandomWords(reqId, words);

        assertEq(token.balanceOf(alice, id), 2);
    }

    function testCraftRevertsOnInsufficientResources() public {
        uint256 laughter_id = token.LAUGHTER();
        vm.prank(alice);
        token.burn(alice, laughter_id, 200, "");

        uint256 id = token.PINKIE_PIE();

        vm.prank(alice);
        vm.expectRevert(Equestria1155.NotEnoughLaughter.selector);
        token.craft(id);
    }

    function testSafeTransferFromApprovedOperatorToEOA() public {
        vm.prank(alice);
        token.setApprovalForAll(address(this), true);

        token.safeTransferFrom(alice, bob, token.HONESTY(), 10, "");

        assertEq(token.balanceOf(alice, token.HONESTY()), 90);
        assertEq(token.balanceOf(bob, token.HONESTY()), 110);
    }

    function testSafeBatchTransferFromApprovedOperatorToGoodReceiver() public {
        vm.prank(alice);
        token.setApprovalForAll(address(this), true);

        uint256[] memory ids = new uint256[](2);
        uint256[] memory values = new uint256[](2);
        ids[0] = token.KINDNESS();
        values[0] = 11;
        ids[1] = token.MAGIC();
        values[1] = 12;

        token.safeBatchTransferFrom(alice, address(goodReceiver), ids, values, "0x1234");

        assertEq(token.balanceOf(alice, token.KINDNESS()), 89);
        assertEq(token.balanceOf(alice, token.MAGIC()), 88);
        assertEq(token.balanceOf(address(goodReceiver), token.KINDNESS()), 11);
        assertEq(token.balanceOf(address(goodReceiver), token.MAGIC()), 12);
    }

    function testTransferToRejectingContractReverts() public {
        vm.prank(alice);
        token.setApprovalForAll(address(this), true);

        uint256 id = token.HONESTY();

        vm.expectRevert(Equestria1155.SmartContractNotAccepted.selector);
        token.safeTransferFrom(alice, address(badReceiver), id, 1, "");

        assertEq(token.balanceOf(alice, id), 100);
        assertEq(token.balanceOf(address(badReceiver), id), 0);
    }

    function _toHex64(uint256 value) internal pure returns (string memory) {
        bytes memory out = new bytes(64);
        for (uint256 i = 0; i < 64; ++i) {
            uint256 nibble = value & 0xF;
            out[63 - i] = _hexChar(nibble);
            value >>= 4;
        }
        return string(out);
    }

    function _hexChar(uint256 b) internal pure returns (bytes1) {
        // forge-lint: disable-next-line(unsafe-typecast)
        if (b < 10) return bytes1(uint8(b + 48));
        // forge-lint: disable-next-line(unsafe-typecast)
        return bytes1(uint8(b + 87));
    }

    function testSetRecipe_onlyGovernor() public {
        uint256 ponyId = token.PINKIE_PIE();
        Equestria1155.Recipe memory newRecipe =
            Equestria1155.Recipe({honesty: 10, kindness: 10, laughter: 10, generosity: 10, loyalty: 10, magic: 10});
        vm.expectRevert(Equestria1155.NotGovernor.selector);
        vm.prank(alice);
        token.setRecipe(ponyId, newRecipe);
    }

    function testSetRecipe_governorCanUpdate() public {
        address gov = address(0xDAA);
        token.setGovernor(gov);

        uint256 ponyId = token.PINKIE_PIE();
        Equestria1155.Recipe memory newRecipe =
            Equestria1155.Recipe({honesty: 1, kindness: 1, laughter: 1, generosity: 1, loyalty: 1, magic: 1});
        vm.prank(gov);
        token.setRecipe(ponyId, newRecipe);

        (uint256 h,,,,,) = token.recipes(ponyId);
        assertEq(h, 1);
    }

    function testSetGovernor_onlyOwner() public {
        vm.expectRevert();
        vm.prank(alice);
        token.setGovernor(alice);
    }
}
