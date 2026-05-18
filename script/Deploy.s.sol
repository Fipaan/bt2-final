// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

import {GovernanceToken} from "src/dao/GovernanceToken.sol";
import {TokenVesting} from "src/dao/TokenVesting.sol";
import {MyGovernor} from "src/dao/MyGovernor.sol";
import {Treasury} from "src/dao/Treasury.sol";
import {Box} from "src/dao/Box.sol";

import {AMM} from "src/amm/AMM.sol";
import {GameToken} from "src/amm/GameToken.sol";
import {Equestria1155} from "src/amm/Equestria1155.sol";

import {GameTokenFactory} from "src/factory/GameTokenFactory.sol";
import {GameTokenV1} from "src/factory/GameTokenV1.sol";
import {GameTokenV2} from "src/factory/GameTokenV2.sol";

import {NFTRentalVault} from "src/vault/NFTRentalVault.sol";

import {PriceFeedConsumer} from "src/chainlink/PriceFeedConsumer.sol";
import {VRFConsumer} from "src/chainlink/VRFConsumer.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract Deploy is Script {
    // -- Chainlink config (Arbitrum Sepolia) -------------------
    // Got from: https://docs.chain.link/vrf/v2-5/supported-networks#arbitrum-sepolia
    address constant VRF_COORDINATOR = 0x5CE8D5A2BC84beb22a398CCA51996F7930313D61;
    bytes32 constant VRF_KEY_HASH = 0x1770bdc7eec7771f7ba4ffd640f34260d7f095b79c92d34a5b2551d6f6cfd2be;
    // -- ETH/USD Arbitrum Sepolia ------------------------------
    // Got from: https://docs.chain.link/data-feeds/price-feeds/addresses?network=arbitrum&page=1#arbitrum-sepolia
    address constant PRICE_FEED = 0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165;

    // NOTE: shortened for testnet - use 2 days + 1 hours for production
    uint256 constant TIMELOCK_DELAY = 10 seconds;
    uint256 constant STALENESS = 10 minutes;

    function run() external {
        vm.startBroadcast();

        address deployer = msg.sender;
        uint256 vrfSubId = vm.envUint("VRF_SUB_ID");

        // -- 1. GOVERNANCE TOKEN -------------------------------
        GovernanceToken token = new GovernanceToken(
            deployer, // team    (40%)
            deployer, // treasury(30%)
            deployer, // airdrop (20%)
            deployer // liquidity(10%)
        );

        // -- 2. TOKEN VESTING ----------------------------------
        TokenVesting vesting = new TokenVesting(address(token), deployer, block.timestamp);

        // -- 3. TIMELOCK ---------------------------------------
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](1);
        executors[0] = address(0);

        TimelockController timelock = new TimelockController(TIMELOCK_DELAY, proposers, executors, deployer);

        // -- 4. GOVERNOR ---------------------------------------
        MyGovernor governor = new MyGovernor(token, timelock);
        timelock.grantRole(timelock.PROPOSER_ROLE(), address(governor));
        timelock.grantRole(timelock.EXECUTOR_ROLE(), address(0));

        // -- 5. TREASURY + BOX ---------------------------------
        Treasury treasury = new Treasury(address(timelock));
        Box box = new Box(address(timelock));

        // -- 6. GAME TOKENS + AMM ------------------------------
        GameToken tokenA = new GameToken("Harmony", "HAR", deployer);
        GameToken tokenB = new GameToken("Sparkle", "SPK", deployer);
        AMM amm = new AMM(address(tokenA), address(tokenB));

        // -- 7. ERC-1155 ---------------------------------------
        Equestria1155 nft = new Equestria1155("ipfs://game/{id}", VRF_COORDINATOR, VRF_KEY_HASH, vrfSubId);

        // -- 8. FACTORY + UUPS PROXY ---------------------------
        GameTokenFactory factory = new GameTokenFactory();

        GameTokenV1 implV1 = new GameTokenV1();
        GameTokenV2 implV2 = new GameTokenV2();

        bytes memory initData = abi.encodeCall(GameTokenV1.initialize, ("Game Token", "GAME", deployer));
        ERC1967Proxy proxy = new ERC1967Proxy(address(implV1), initData);

        // -- 9. VAULT ------------------------------------------
        NFTRentalVault vault =
            new NFTRentalVault(IERC20(address(token)), IERC1155(address(nft)), nft.PINKIE_PIE(), address(timelock));

        // -- 10. CHAINLINK -------------------------------------
        PriceFeedConsumer priceFeed = new PriceFeedConsumer(PRICE_FEED, STALENESS);
        VRFConsumer vrf = new VRFConsumer(VRF_COORDINATOR, VRF_KEY_HASH, vrfSubId);

        // -- 11. OUTPUT ----------------------------------------
        console.log("=== DEPLOYED ===");
        console.log("TOKEN_ADDR=%s", address(token));
        console.log("VESTING_ADDR=%s", address(vesting));
        console.log("TIMELOCK_ADDR=%s", address(timelock));
        console.log("GOVERNOR_ADDR=%s", address(governor));
        console.log("TREASURY_ADDR=%s", address(treasury));
        console.log("BOX_ADDR=%s", address(box));
        console.log("TOKEN_A_ADDR=%s", address(tokenA));
        console.log("TOKEN_B_ADDR=%s", address(tokenB));
        console.log("AMM_ADDR=%s", address(amm));
        console.log("NFT_ADDR=%s", address(nft));
        console.log("FACTORY_ADDR=%s", address(factory));
        console.log("IMPL_V1_ADDR=%s", address(implV1));
        console.log("IMPL_V2_ADDR=%s", address(implV2));
        console.log("PROXY_ADDR=%s", address(proxy));
        console.log("VAULT_ADDR=%s", address(vault));
        console.log("PRICE_FEED_ADDR=%s", address(priceFeed));
        console.log("VRF_ADDR=%s", address(vrf));

        vm.stopBroadcast();
    }
}
