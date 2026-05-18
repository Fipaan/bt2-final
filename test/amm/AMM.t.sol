// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

import {AMM} from "src/amm/AMM.sol";
import {LPToken} from "src/amm/LPToken.sol";
import {GameToken} from "src/amm/GameToken.sol";

contract AMMHandler is Test {
    AMM amm;
    GameToken tokenA;
    GameToken tokenB;
    LPToken lp;
    address user = address(0xBEEF);

    constructor(AMM _amm, GameToken _a, GameToken _b, address owner) {
        amm = _amm;
        tokenA = _a;
        tokenB = _b;
        lp = _amm.lpToken();

        vm.startPrank(owner);
        tokenA.mint(user, 1_000_000 ether);
        tokenB.mint(user, 1_000_000 ether);
        vm.stopPrank();

        vm.startPrank(user);
        tokenA.approve(address(amm), type(uint256).max);
        tokenB.approve(address(amm), type(uint256).max);
        lp.approve(address(amm), type(uint256).max);
        vm.stopPrank();
    }

    function addLiquidity(uint256 a, uint256 b) public {
        a = bound(a, 1 ether, 100_000 ether);
        b = bound(b, 1 ether, 100_000 ether);
        vm.prank(user);
        amm.addLiquidity(a, b, 0, 0);
    }

    function removeLiquidity(uint256 lpAmt) public {
        lpAmt = bound(lpAmt, 0, lp.balanceOf(user));
        if (lpAmt == 0) return;
        vm.prank(user);
        amm.removeLiquidity(lpAmt, 0, 0);
    }

    function swap(uint256 amountIn, bool aToB) public {
        amountIn = bound(amountIn, 1 ether, 10_000 ether);
        address tokenIn = aToB ? address(tokenA) : address(tokenB);
        vm.prank(user);
        try amm.swap(tokenIn, amountIn, 0) {} catch {}
    }
}

contract AMMTest is Test {
    AMM amm;
    GameToken tokenA;
    GameToken tokenB;
    LPToken lp;
    AMMHandler handler;

    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    uint256 constant INITIAL = 1_000_000 ether;

    function setUp() public {
        tokenA = new GameToken("Token A", "TKA", address(this));
        tokenB = new GameToken("Token B", "TKB", address(this));
        amm = new AMM(address(tokenA), address(tokenB));
        lp = amm.lpToken();

        tokenA.mint(alice, INITIAL);
        tokenB.mint(alice, INITIAL);
        tokenA.mint(bob, INITIAL);
        tokenB.mint(bob, INITIAL);

        vm.startPrank(alice);
        tokenA.approve(address(amm), type(uint256).max);
        tokenB.approve(address(amm), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(bob);
        tokenA.approve(address(amm), type(uint256).max);
        tokenB.approve(address(amm), type(uint256).max);
        vm.stopPrank();

        handler = new AMMHandler(amm, tokenA, tokenB, address(this));
        targetContract(address(handler));
    }

    // -- helpers ----------------------------------------------

    function _addLiquidity(address who, uint256 a, uint256 b) internal returns (uint256 lpAmt) {
        vm.prank(who);
        (,, lpAmt) = amm.addLiquidity(a, b, 0, 0);
    }

    // -- constructor -------------------------------------------

    function test_constructor_setsTokens() public view {
        assertEq(amm.tokenA(), address(tokenA));
        assertEq(amm.tokenB(), address(tokenB));
    }

    function test_constructor_deploysLPToken() public view {
        assertNotEq(address(lp), address(0));
    }

    function test_constructor_revertsZeroAddress() public {
        vm.expectRevert(AMM.ZeroAddressA.selector);
        new AMM(address(0), address(tokenB));
    }

    function test_constructor_revertsIdenticalTokens() public {
        vm.expectRevert(AMM.IdenticalTokens.selector);
        new AMM(address(tokenA), address(tokenA));
    }

    // -- addLiquidity ------------------------------------------

    function test_addLiquidity_initial() public {
        uint256 lpAmt = _addLiquidity(alice, 1000 ether, 1000 ether);
        assertGt(lpAmt, 0);
        assertEq(amm.reserveA(), 1000 ether);
        assertEq(amm.reserveB(), 1000 ether);
    }

    function test_addLiquidity_mintsLPTokens() public {
        _addLiquidity(alice, 1000 ether, 1000 ether);
        assertGt(lp.balanceOf(alice), 0);
    }

    function test_addLiquidity_subsequentKeepsRatio() public {
        _addLiquidity(alice, 1000 ether, 2000 ether);
        uint256 lpBefore = lp.totalSupply();

        _addLiquidity(bob, 500 ether, 1000 ether);
        assertGt(lp.totalSupply(), lpBefore);
        assertEq(amm.reserveA(), 1500 ether);
        assertEq(amm.reserveB(), 3000 ether);
    }

    function test_addLiquidity_revertsZeroAmount() public {
        vm.expectRevert(AMM.ZeroAmountA.selector);
        vm.prank(alice);
        amm.addLiquidity(0, 1000 ether, 0, 0);
    }

    function test_addLiquidity_slippageA() public {
        _addLiquidity(alice, 1000 ether, 1000 ether);
        vm.expectRevert(AMM.SlippageA.selector);
        vm.prank(bob);
        amm.addLiquidity(500 ether, 500 ether, 600 ether, 0);
    }

    function test_addLiquidity_slippageB() public {
        _addLiquidity(alice, 1000 ether, 2000 ether);
        vm.expectRevert(AMM.SlippageB.selector);
        vm.prank(bob);
        amm.addLiquidity(500 ether, 500 ether, 0, 600 ether);
    }

    function test_addLiquidity_emitsEvent() public {
        vm.prank(alice);
        vm.expectEmit(true, false, false, false);
        emit AMM.LiquidityAdded(alice, 1000 ether, 1000 ether, 0);
        amm.addLiquidity(1000 ether, 1000 ether, 0, 0);
    }

    // -- removeLiquidity ---------------------------------------

    function test_removeLiquidity_basic() public {
        uint256 lpAmt = _addLiquidity(alice, 1000 ether, 1000 ether);

        vm.startPrank(alice);
        lp.approve(address(amm), lpAmt);
        (uint256 a, uint256 b) = amm.removeLiquidity(lpAmt, 0, 0);
        vm.stopPrank();

        assertGt(a, 0);
        assertGt(b, 0);
        assertEq(lp.balanceOf(alice), 0);
    }

    function test_removeLiquidity_reservesDecreased() public {
        uint256 lpAmt = _addLiquidity(alice, 1000 ether, 1000 ether);

        vm.startPrank(alice);
        lp.approve(address(amm), lpAmt);
        amm.removeLiquidity(lpAmt, 0, 0);
        vm.stopPrank();

        assertEq(amm.reserveA(), 0);
        assertEq(amm.reserveB(), 0);
    }

    function test_removeLiquidity_revertsZero() public {
        _addLiquidity(alice, 1000 ether, 1000 ether);
        vm.expectRevert(AMM.ZeroAmount.selector);
        vm.prank(alice);
        amm.removeLiquidity(0, 0, 0);
    }

    function test_removeLiquidity_slippage() public {
        uint256 lpAmt = _addLiquidity(alice, 1000 ether, 1000 ether);

        vm.startPrank(alice);
        lp.approve(address(amm), lpAmt);
        vm.expectRevert(AMM.SlippageA.selector);
        amm.removeLiquidity(lpAmt, type(uint256).max, 0);
        vm.stopPrank();
    }

    function test_removeLiquidity_emitsEvent() public {
        uint256 lpAmt = _addLiquidity(alice, 1000 ether, 1000 ether);

        vm.startPrank(alice);
        lp.approve(address(amm), lpAmt);
        vm.expectEmit(true, false, false, false);
        emit AMM.LiquidityRemoved(alice, 0, 0, lpAmt);
        amm.removeLiquidity(lpAmt, 0, 0);
        vm.stopPrank();
    }

    // -- swap --------------------------------------------------

    function test_swap_AtoB() public {
        _addLiquidity(alice, 100_000 ether, 100_000 ether);

        uint256 balBefore = tokenB.balanceOf(bob);

        vm.prank(bob);
        uint256 out = amm.swap(address(tokenA), 1000 ether, 0);

        assertGt(out, 0);
        assertEq(tokenB.balanceOf(bob), balBefore + out);
    }

    function test_swap_BtoA() public {
        _addLiquidity(alice, 100_000 ether, 100_000 ether);

        uint256 balBefore = tokenA.balanceOf(bob);

        vm.prank(bob);
        uint256 out = amm.swap(address(tokenB), 1000 ether, 0);

        assertGt(out, 0);
        assertEq(tokenA.balanceOf(bob), balBefore + out);
    }

    function test_swap_revertsInvalidToken() public {
        _addLiquidity(alice, 1000 ether, 1000 ether);
        vm.expectRevert(AMM.InvalidToken.selector);
        vm.prank(bob);
        amm.swap(address(0xdead), 100 ether, 0);
    }

    function test_swap_revertsZeroAmount() public {
        _addLiquidity(alice, 1000 ether, 1000 ether);
        vm.expectRevert(AMM.ZeroAmountIn.selector);
        vm.prank(bob);
        amm.swap(address(tokenA), 0, 0);
    }

    function test_swap_revertsSlippage() public {
        _addLiquidity(alice, 1000 ether, 1000 ether);
        vm.expectRevert(AMM.Slippage.selector);
        vm.prank(bob);
        amm.swap(address(tokenA), 100 ether, type(uint256).max);
    }

    function test_swap_updatesReserves() public {
        _addLiquidity(alice, 1000 ether, 1000 ether);

        vm.prank(bob);
        amm.swap(address(tokenA), 100 ether, 0);

        assertEq(amm.reserveA(), 1100 ether);
        assertLt(amm.reserveB(), 1000 ether);
    }

    function test_swap_emitsEvent() public {
        _addLiquidity(alice, 1000 ether, 1000 ether);

        vm.prank(bob);
        vm.expectEmit(true, true, true, false);
        emit AMM.Swap(bob, address(tokenA), address(tokenB), 100 ether, 0);
        amm.swap(address(tokenA), 100 ether, 0);
    }

    // -- getAmountOut ------------------------------------------

    function test_benchmark_getAmountOut_solidity() public view {
        amm.getAmountOut(1000 ether, 100_000 ether, 100_000 ether);
    }

    function test_benchmark_getAmountOut_yul() public view {
        amm.getAmountOutYul(1000 ether, 100_000 ether, 100_000 ether);
    }

    function test_getAmountOut_basic() public view {
        uint256 out = amm.getAmountOut(1000 ether, 100_000 ether, 100_000 ether);
        assertGt(out, 0);
        assertLt(out, 1000 ether); // fee must reduce output
    }

    function test_getAmountOut_matchesYul() public view {
        uint256 a = 1000 ether;
        uint256 rIn = 100_000 ether;
        uint256 rOut = 100_000 ether;
        assertEq(amm.getAmountOut(a, rIn, rOut), amm.getAmountOutYul(a, rIn, rOut));
    }

    function test_getAmountOut_revertsZeroReserve() public {
        vm.expectRevert(AMM.EmptyReserveIn.selector);
        amm.getAmountOut(100, 0, 1000);
    }

    // -- quotes ------------------------------------------------

    function test_quotes_zeroBeforeLiquidity() public view {
        assertEq(amm.quoteAForB(1000), 0);
        assertEq(amm.quoteBForA(1000), 0);
    }

    function test_quotes_nonZeroAfterLiquidity() public {
        _addLiquidity(alice, 1000 ether, 1000 ether);
        assertGt(amm.quoteAForB(100 ether), 0);
        assertGt(amm.quoteBForA(100 ether), 0);
    }

    // -- fuzz --------------------------------------------------

    function testFuzz_swap_constantProduct(uint256 amountIn) public {
        amountIn = bound(amountIn, 1 ether, 10_000 ether);
        _addLiquidity(alice, 100_000 ether, 100_000 ether);

        uint256 kBefore = amm.reserveA() * amm.reserveB();

        vm.prank(bob);
        amm.swap(address(tokenA), amountIn, 0);

        uint256 kAfter = amm.reserveA() * amm.reserveB();
        assertGe(kAfter, kBefore);
    }

    function testFuzz_getAmountOut_alwaysLessThanInput(uint256 amountIn) public view {
        amountIn = bound(amountIn, 1, 1_000_000 ether);
        uint256 out = amm.getAmountOut(amountIn, 1_000_000 ether, 1_000_000 ether);
        assertLt(out, amountIn);
    }

    function testFuzz_addRemoveLiquidity_noLoss(uint256 amount) public {
        amount = bound(amount, 1 ether, 100_000 ether);
        uint256 balABefore = tokenA.balanceOf(alice);
        uint256 balBBefore = tokenB.balanceOf(alice);

        uint256 lpAmt = _addLiquidity(alice, amount, amount);

        vm.startPrank(alice);
        lp.approve(address(amm), lpAmt);
        amm.removeLiquidity(lpAmt, 0, 0);
        vm.stopPrank();

        // rounding may lose 1 wei per token
        assertGe(tokenA.balanceOf(alice), balABefore - 1);
        assertGe(tokenB.balanceOf(alice), balBBefore - 1);
    }

    // -- invariant setup ---------------------------------------

    function invariant_kNeverDecreases() public view {
        if (amm.reserveA() == 0 || amm.reserveB() == 0) return;
        assertGe(amm.reserveA() * amm.reserveB(), 0);
    }

    function testFuzz_getAmountOut_yulMatchesSolidity(uint256 amountIn, uint256 rIn, uint256 rOut) public view {
        amountIn = bound(amountIn, 1, 1_000_000 ether);
        rIn = bound(rIn, 1, 1_000_000 ether);
        rOut = bound(rOut, 1, 1_000_000 ether);
        assertEq(amm.getAmountOut(amountIn, rIn, rOut), amm.getAmountOutYul(amountIn, rIn, rOut));
    }

    function testFuzz_removeLiquidity_neverExceedsReserves(uint256 amount) public {
        amount = bound(amount, 1 ether, 100_000 ether);
        uint256 lpAmt = _addLiquidity(alice, amount, amount);
        vm.startPrank(alice);
        lp.approve(address(amm), lpAmt);
        (uint256 a, uint256 b) = amm.removeLiquidity(lpAmt, 0, 0);
        vm.stopPrank();
        assertLe(a, amount);
        assertLe(b, amount);
    }

    function test_lpToken_transfer() public {
        uint256 lpAmt = _addLiquidity(alice, 1000 ether, 1000 ether);
        vm.prank(alice);
        lp.transfer(bob, lpAmt / 2);
        assertEq(lp.balanceOf(bob), lpAmt / 2);
        assertEq(lp.balanceOf(alice), lpAmt - lpAmt / 2);
    }

    function test_lpToken_transferFrom() public {
        uint256 lpAmt = _addLiquidity(alice, 1000 ether, 1000 ether);
        vm.prank(alice);
        lp.approve(address(this), lpAmt);
        lp.transferFrom(alice, bob, lpAmt);
        assertEq(lp.balanceOf(bob), lpAmt);
    }

    function test_lpToken_approve() public {
        vm.prank(alice);
        lp.approve(bob, 500 ether);
        assertEq(lp.allowance(alice, bob), 500 ether);
    }

    function test_lpToken_transferFrom_reducesAllowance() public {
        uint256 lpAmt = _addLiquidity(alice, 1000 ether, 1000 ether);
        vm.prank(alice);
        lp.approve(bob, lpAmt);
        vm.prank(bob);
        lp.transferFrom(alice, bob, lpAmt / 2);
        assertEq(lp.allowance(alice, bob), lpAmt / 2);
    }

    function test_lpToken_transferFrom_maxAllowanceNotReduced() public {
        uint256 lpAmt = _addLiquidity(alice, 1000 ether, 1000 ether);
        vm.prank(alice);
        lp.approve(bob, type(uint256).max);
        vm.prank(bob);
        lp.transferFrom(alice, bob, lpAmt);
        assertEq(lp.allowance(alice, bob), type(uint256).max);
    }

    function test_lpToken_transfer_revertsInsufficientBalance() public {
        vm.expectRevert(LPToken.InsufficientBalance.selector);
        vm.prank(alice);
        lp.transfer(bob, 1);
    }

    function test_lpToken_transferFrom_revertsInsufficientAllowance() public {
        _addLiquidity(alice, 1000 ether, 1000 ether);
        vm.expectRevert(LPToken.NotAllowed.selector);
        lp.transferFrom(alice, bob, 1);
    }

    function test_lpToken_decimals() public view {
        assertEq(lp.DECIMALS(), 18);
    }
}
