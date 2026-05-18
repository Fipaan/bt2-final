// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {Treasury} from "src/dao/Treasury.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock", "MCK") {
        _mint(msg.sender, 1_000_000 ether);
    }
}

contract TreasuryTest is Test {
    Treasury treasury;
    MockERC20 token;
    address timelock = address(0x1234);
    address recipient = address(0x5678);

    function setUp() public {
        treasury = new Treasury(timelock);
        token = new MockERC20();
    }

    function test_receiveETH() public {
        vm.deal(address(this), 1 ether);
        (bool ok,) = address(treasury).call{value: 1 ether}("");
        assertTrue(ok);
        assertEq(address(treasury).balance, 1 ether);
    }

    function test_withdrawETH_onlyTimelock() public {
        vm.deal(address(treasury), 1 ether);
        vm.expectRevert(Treasury.NotTimelock.selector);
        treasury.withdrawETH(payable(recipient), 1 ether);
    }

    function test_withdrawETH_works() public {
        vm.deal(address(treasury), 1 ether);
        vm.prank(timelock);
        treasury.withdrawETH(payable(recipient), 1 ether);
        assertEq(recipient.balance, 1 ether);
    }

    function test_withdrawToken_onlyTimelock() public {
        token.transfer(address(treasury), 1000 ether);
        vm.expectRevert(Treasury.NotTimelock.selector);
        treasury.withdrawToken(address(token), recipient, 1000 ether);
    }

    function test_withdrawToken_works() public {
        token.transfer(address(treasury), 1000 ether);
        vm.prank(timelock);
        treasury.withdrawToken(address(token), recipient, 1000 ether);
        assertEq(token.balanceOf(recipient), 1000 ether);
    }
}
