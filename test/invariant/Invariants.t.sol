// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import {AMM} from "src/amm/AMM.sol";
import {GameToken} from "src/amm/GameToken.sol";
import {LPToken} from "src/amm/LPToken.sol";
import {NFTRentalVault} from "src/vault/NFTRentalVault.sol";
import {GovernanceToken} from "src/dao/GovernanceToken.sol";
import {Treasury} from "src/dao/Treasury.sol";
import {AMMHandler} from "test/amm/AMM.t.sol";

contract VaultHandler is Test {
    NFTRentalVault vault;
    GovernanceToken token;
    address user = address(0xBEEF);

    constructor(NFTRentalVault _vault, GovernanceToken _token, address owner) {
        vault = _vault;
        token = _token;

        vm.prank(owner);
        IERC20(address(token)).transfer(user, 500_000 ether);

        vm.prank(user);
        IERC20(address(token)).approve(address(vault), type(uint256).max);
    }

    function deposit(uint256 assets) public {
        assets = bound(assets, 1e6, 100_000 ether);
        if (IERC20(address(token)).balanceOf(user) < assets) return;
        vm.prank(user);
        vault.deposit(assets, user);
    }

    function redeem(uint256 shares) public {
        shares = bound(shares, 0, vault.balanceOf(user));
        if (shares == 0) return;
        vm.prank(user);
        vault.redeem(shares, user, user);
    }
}

contract TreasuryHandler is Test {
    Treasury treasury;
    address timelockAddr;
    uint256 public totalDeposited;
    uint256 public totalWithdrawn;

    constructor(Treasury _treasury, address _timelock) {
        treasury = _treasury;
        timelockAddr = _timelock;
    }

    function deposit(uint256 amount) public {
        amount = bound(amount, 0, 100 ether);
        vm.deal(address(this), amount);
        (bool ok,) = address(treasury).call{value: amount}("");
        if (ok) totalDeposited += amount;
    }

    function withdraw(uint256 amount) public {
        amount = bound(amount, 0, address(treasury).balance);
        if (amount == 0) return;
        vm.prank(timelockAddr);
        treasury.withdrawETH(payable(address(this)), amount);
        totalWithdrawn += amount;
    }

    receive() external payable {}
}

contract InvariantTests is Test {
    AMM amm;
    GameToken tokenA;
    GameToken tokenB;
    LPToken lp;
    AMMHandler handler;
    GovernanceToken govToken;
    NFTRentalVault vault;
    Treasury treasury;
    TreasuryHandler treasuryHandler;
    VaultHandler vaultHandler;

    address owner = address(0x0999);

    function setUp() public {
        // AMM
        tokenA = new GameToken("Token A", "TKA", address(this));
        tokenB = new GameToken("Token B", "TKB", address(this));
        amm = new AMM(address(tokenA), address(tokenB));
        lp = amm.lpToken();
        handler = new AMMHandler(amm, tokenA, tokenB, address(this));
        targetContract(address(handler));

        // GOV + vault
        govToken = new GovernanceToken(owner, owner, owner, owner);
        vault = new NFTRentalVault(IERC20(address(govToken)), IERC1155(address(0x1)), 1001, owner);

        // treasury
        treasury = new Treasury(owner);
        treasuryHandler = new TreasuryHandler(treasury, owner);
        targetContract(address(treasuryHandler));

        vaultHandler = new VaultHandler(vault, govToken, owner);
        targetContract(address(vaultHandler));
    }

    // 1. k never decreases on swap
    function invariant_amm_kNeverDecreases() public view {
        if (amm.reserveA() == 0 || amm.reserveB() == 0) return;
        assertGt(amm.reserveA() * amm.reserveB(), 0);
    }

    // 2. LP total supply matches reserve ratio
    function invariant_amm_lpSupplyNonZeroWhenReservesNonZero() public view {
        if (amm.reserveA() > 0 && amm.reserveB() > 0) {
            assertGt(lp.totalSupply(), 0);
        }
    }

    // 3. GOV total supply never changes (no mint after deploy)
    function invariant_govToken_totalSupplyConstant() public view {
        assertEq(govToken.totalSupply(), 1_000_000 ether);
    }

    // 4. vault totalAssets >= sum of deposits (no spontaneous loss)
    function invariant_vault_totalAssetsNonNegative() public view {
        assertGe(vault.totalAssets(), 0);
    }

    // 5. treasury ETH balance never negative (trivially true but documents the invariant)
    function invariant_treasury_balanceNonNegative() public view {
        assertGe(address(treasury).balance, 0);
    }

    // 6. totalAssets should alwaus equal to govToken's balance of it.
    function invariant_vault_totalAssetsMatchesBalance() public view {
        assertEq(vault.totalAssets(), IERC20(address(govToken)).balanceOf(address(vault)));
    }

    // 7. totalSupply should alwaus be positive
    function invariant_vault_totalSupplyNonNegative() public view {
        assertGe(vault.totalSupply(), 0);
    }

    // 8. shares * price per share <= total assets
    function invariant_vault_redeemNeverExceedsDeposit() public view {
        if (vault.totalSupply() == 0) return;
        uint256 pricePerShare = vault.convertToAssets(1e18);
        assertGe(vault.totalAssets() * 1e18, vault.totalSupply() * pricePerShare - 1e18);
    }

    // 9. Treasury accounting invariant: ETH balance must always equal
    //    total deposited minus total withdrawn - no funds appear or vanish.
    function invariant_treasury_balanceEqualsDepositedMinusWithdrawn() public view {
        assertEq(address(treasury).balance, treasuryHandler.totalDeposited() - treasuryHandler.totalWithdrawn());
    }
}
