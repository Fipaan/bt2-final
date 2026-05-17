import { zeroAddress } from "viem";

export const ADDRESS_ENV = {
    governanceToken: "TOKEN_ADDR",
    vesting: "VESTING_ADDR",
    timelock: "TIMELOCK_ADDR",
    myGovernor: "GOVERNOR_ADDR",
    treasury: "TREASURY_ADDR",
    box: "BOX_ADDR",
    tokenA: "TOKEN_A_ADDR",
    tokenB: "TOKEN_B_ADDR",
    amm: "AMM_ADDR",
    equestria1155: "NFT_ADDR",
    factory: "FACTORY_ADDR",
    proxy: "PROXY_ADDR",
    nftRentalVault: "VAULT_ADDR",
    priceFeed: "PRICE_FEED_ADDR",
    vrfConsumer: "VRF_ADDR",
} as const;

export type ContractAddressKey = keyof typeof ADDRESS_ENV;

function addressFrom(value: string | undefined): `0x${string}` {
    return value && /^0x[a-fA-F0-9]{40}$/.test(value)
        ? (value as `0x${string}`)
        : zeroAddress;
}

export const ADDRESSES = {
    governanceToken: addressFrom(process.env.NEXT_PUBLIC_TOKEN_ADDR),
    vesting: addressFrom(process.env.NEXT_PUBLIC_VESTING_ADDR),
    timelock: addressFrom(process.env.NEXT_PUBLIC_TIMELOCK_ADDR),
    myGovernor: addressFrom(process.env.NEXT_PUBLIC_GOVERNOR_ADDR),
    treasury: addressFrom(process.env.NEXT_PUBLIC_TREASURY_ADDR),
    box: addressFrom(process.env.NEXT_PUBLIC_BOX_ADDR),
    tokenA: addressFrom(process.env.NEXT_PUBLIC_TOKEN_A_ADDR),
    tokenB: addressFrom(process.env.NEXT_PUBLIC_TOKEN_B_ADDR),
    amm: addressFrom(process.env.NEXT_PUBLIC_AMM_ADDR),
    equestria1155: addressFrom(process.env.NEXT_PUBLIC_NFT_ADDR),
    factory: addressFrom(process.env.NEXT_PUBLIC_FACTORY_ADDR),
    proxy: addressFrom(process.env.NEXT_PUBLIC_PROXY_ADDR),
    nftRentalVault: addressFrom(process.env.NEXT_PUBLIC_VAULT_ADDR),
    priceFeed: addressFrom(process.env.NEXT_PUBLIC_PRICE_FEED_ADDR),
    vrfConsumer: addressFrom(process.env.NEXT_PUBLIC_VRF_ADDR),
} as const satisfies Record<ContractAddressKey, `0x${string}`>;

export function missingAddressLabels(keys: ContractAddressKey[]): string[] {
    return keys
        .filter((key) => ADDRESSES[key] === zeroAddress)
        .map((key) => ADDRESS_ENV[key]);
}

export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "";
export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;

export const TOKEN_IDS = {
    HONESTY: 1n,
    KINDNESS: 2n,
    LAUGHTER: 3n,
    GENEROSITY: 4n,
    LOYALTY: 5n,
    MAGIC: 6n,
    PINKIE_PIE: 1001n,
    STARLIGHT_GLIMMER: 1002n,
} as const;

export const ELEMENT_NAMES: Record<string, string> = {
    "1": "Honesty",
    "2": "Kindness",
    "3": "Laughter",
    "4": "Generosity",
    "5": "Loyalty",
    "6": "Magic",
    "1001": "Pinkie Pie",
    "1002": "Starlight Glimmer",
};

export const PONY_RECIPES: Record<string, Record<string, number>> = {
    "1001": { "1": 15, "2": 10, "3": 100, "4": 20, "5": 5, "6": 0 },
    "1002": { "1": 5, "2": 3, "3": 0, "4": 0, "5": 15, "6": 80 },
};

import AMMArtifact from "./out/AMM.sol/AMM.json";
import Equestria1155Artifact from "./out/Equestria1155.sol/Equestria1155.json";
import GameTokenArtifact from "./out/GameToken.sol/GameToken.json";
// import LPTokenArtifact from "./out/LPToken.sol/LPToken.json"; // skipped
// import MockAggregatorArtifact from "./out/MockAggregator.sol/MockAggregator.json"; // skipped
// import MockVRFCoordinatorArtifact from "./out/MockVRFCoordinator.sol/MockVRFCoordinator.json"; // skipped
import PriceFeedConsumerArtifact from "./out/PriceFeedConsumer.sol/PriceFeedConsumer.json";
import VRFConsumerArtifact from "./out/VRFConsumer.sol/VRFConsumer.json";
import BoxArtifact from "./out/Box.sol/Box.json";
import GovernanceTokenArtifact from "./out/GovernanceToken.sol/GovernanceToken.json";
import MyGovernorArtifact from "./out/MyGovernor.sol/MyGovernor.json";
import TokenVestingArtifact from "./out/TokenVesting.sol/TokenVesting.json";
// import TreasuryArtifact from "./out/Treasury.sol/Treasury.json"; // skipped
import GameTokenFactoryArtifact from "./out/GameTokenFactory.sol/GameTokenFactory.json";
// import GameTokenV1Artifact from "./out/GameTokenV1.sol/GameTokenV1.json"; // skipped
// import GameTokenV2Artifact from "./out/GameTokenV2.sol/GameTokenV2.json"; // skipped
import NFTRentalVaultArtifact from "./out/NFTRentalVault.sol/NFTRentalVault.json";

export const AMM_ABI = AMMArtifact.abi as const;
export const EQUESTRIA_1155_ABI = Equestria1155Artifact.abi as const;
export const GAME_TOKEN_ABI = GameTokenArtifact.abi as const;
// export const LP_TOKEN_ABI             = LPTokenArtifact.abi as const; // skipped
// export const MOCK_AGGREGATOR_ABI      = MockAggregatorArtifact.abi as const; // skipped
// export const MOCK_VRF_COORDINATOR_ABI = MockVRFCoordinatorArtifact.abi as const; // skipped
export const PRICE_FEED_CONSUMER_ABI = PriceFeedConsumerArtifact.abi as const;
export const VRF_CONSUMER_ABI = VRFConsumerArtifact.abi as const;
export const BOX_ABI = BoxArtifact.abi as const;
export const GOVERNANCE_TOKEN_ABI = GovernanceTokenArtifact.abi as const;
export const GOVERNOR_ABI = MyGovernorArtifact.abi as const;
export const TOKEN_VESTING_ABI = TokenVestingArtifact.abi as const;
// export const TREASURY_ABI             = TreasuryArtifact.abi as const; // skipped
export const GAME_TOKEN_FACTORY_ABI = GameTokenFactoryArtifact.abi as const;
// export const GAME_TOKEN_V1_ABI        = GameTokenV1Artifact.abi as const; // skipped
// export const GAME_TOKEN_V2_ABI        = GameTokenV2Artifact.abi as const; // skipped
export const NFT_RENTAL_VAULT_ABI = NFTRentalVaultArtifact.abi as const;

export const ERC20_ABI = GAME_TOKEN_ABI;
