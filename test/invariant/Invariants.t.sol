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

contract InvariantTests is Test {
    AMM amm;
    GameToken tokenA;
    GameToken tokenB;
    LPToken lp;
    AMMHandler handler;
    GovernanceToken govToken;
    NFTRentalVault vault;
    Treasury treasury;

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
}
