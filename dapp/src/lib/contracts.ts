import { zeroAddress } from "viem";

export const ADDRESS_ENV = {
  governanceToken: "NEXT_PUBLIC_TOKEN_ADDR",
  vesting: "NEXT_PUBLIC_VESTING_ADDR",
  timelock: "NEXT_PUBLIC_TIMELOCK_ADDR",
  myGovernor: "NEXT_PUBLIC_GOVERNOR_ADDR",
  treasury: "NEXT_PUBLIC_TREASURY_ADDR",
  box: "NEXT_PUBLIC_BOX_ADDR",
  tokenA: "NEXT_PUBLIC_TOKEN_A_ADDR",
  tokenB: "NEXT_PUBLIC_TOKEN_B_ADDR",
  amm: "NEXT_PUBLIC_AMM_ADDR",
  equestria1155: "NEXT_PUBLIC_NFT_ADDR",
  factory: "NEXT_PUBLIC_FACTORY_ADDR",
  proxy: "NEXT_PUBLIC_PROXY_ADDR",
  nftRentalVault: "NEXT_PUBLIC_VAULT_ADDR",
  priceFeed: "NEXT_PUBLIC_PRICE_FEED_ADDR",
  vrfConsumer: "NEXT_PUBLIC_VRF_ADDR",
} as const;

export type ContractAddressKey = keyof typeof ADDRESS_ENV;

function addressFrom(value: string | undefined): `0x${string}` {
  return value && /^0x[a-fA-F0-9]{40}$/.test(value) ? (value as `0x${string}`) : zeroAddress;
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
  return keys.filter((key) => ADDRESSES[key] === zeroAddress).map((key) => ADDRESS_ENV[key]);
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

export const EQUESTRIA_1155_ABI = 
[
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "baseURI",
                           "type":  "string",
                           "internalType":  "string"
                       },
                       {
                           "name":  "vrfCoordinator",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "keyHash_",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       },
                       {
                           "name":  "subscriptionId_",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "CALLBACK_GAS_LIMIT",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint32",
                            "internalType":  "uint32"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "GENEROSITY",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "HONESTY",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "KINDNESS",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "LAUGHTER",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "LOYALTY",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "MAGIC",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "PINKIE_PIE",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "REQUEST_CONFIRMATIONS",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint16",
                            "internalType":  "uint16"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "STARLIGHT_GLIMMER",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "acceptOwnership",
        "inputs":  [

                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "balanceOf",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "id",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "balanceOfBatch",
        "inputs":  [
                       {
                           "name":  "owners",
                           "type":  "address[]",
                           "internalType":  "address[]"
                       },
                       {
                           "name":  "ids",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "balances",
                            "type":  "uint256[]",
                            "internalType":  "uint256[]"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "burn",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "id",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "data",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "contractOwner",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "craft",
        "inputs":  [
                       {
                           "name":  "ponyId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "requestId",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "isApprovedForAll",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "operator",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "keyHash",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bytes32",
                            "internalType":  "bytes32"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "mint",
        "inputs":  [
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "id",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "data",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "mintBatch",
        "inputs":  [
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "ids",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "values",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "data",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "owner",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "pendingCraftPonyId",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "pendingCraftUser",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "rawFulfillRandomWords",
        "inputs":  [
                       {
                           "name":  "requestId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "randomWords",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "recipes",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "honesty",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "kindness",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "laughter",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "generosity",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "loyalty",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "magic",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "s_vrfCoordinator",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "contract IVRFCoordinatorV2Plus"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "safeBatchTransferFrom",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "ids",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "values",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "data",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "safeTransferFrom",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "id",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "data",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "setApprovalForAll",
        "inputs":  [
                       {
                           "name":  "operator",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "approved",
                           "type":  "bool",
                           "internalType":  "bool"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "setCoordinator",
        "inputs":  [
                       {
                           "name":  "_vrfCoordinator",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "subscriptionId",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "supportsInterface",
        "inputs":  [
                       {
                           "name":  "interfaceId",
                           "type":  "bytes4",
                           "internalType":  "bytes4"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "pure"
    },
    {
        "type":  "function",
        "name":  "transferOwnership",
        "inputs":  [
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "uri",
        "inputs":  [
                       {
                           "name":  "tokenId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "event",
        "name":  "ApprovalForAll",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "operator",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "approved",
                           "type":  "bool",
                           "indexed":  false,
                           "internalType":  "bool"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "CoordinatorSet",
        "inputs":  [
                       {
                           "name":  "vrfCoordinator",
                           "type":  "address",
                           "indexed":  false,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "CraftFulfilled",
        "inputs":  [
                       {
                           "name":  "requestId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "user",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "ponyId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "CraftRequested",
        "inputs":  [
                       {
                           "name":  "requestId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "user",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "ponyId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "OwnershipTransferRequested",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "OwnershipTransferred",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "TransferBatch",
        "inputs":  [
                       {
                           "name":  "operator",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "from",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "ids",
                           "type":  "uint256[]",
                           "indexed":  false,
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "values",
                           "type":  "uint256[]",
                           "indexed":  false,
                           "internalType":  "uint256[]"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "TransferSingle",
        "inputs":  [
                       {
                           "name":  "operator",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "from",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "id",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "URI",
        "inputs":  [
                       {
                           "name":  "value",
                           "type":  "string",
                           "indexed":  false,
                           "internalType":  "string"
                       },
                       {
                           "name":  "id",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "error",
        "name":  "IdOwnerArrLengthMismatch",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "IdValueArrLengthMismatch",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "InsufficientBalance",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "InvalidRecipe",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "NotApproved",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "NotEnoughGenerosity",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "NotEnoughHonesty",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "NotEnoughKindness",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "NotEnoughLaughter",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "NotEnoughLoyalty",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "NotEnoughMagic",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "NotOwner",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "OnlyCoordinatorCanFulfill",
        "inputs":  [
                       {
                           "name":  "have",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "want",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "OnlyOwnerOrCoordinator",
        "inputs":  [
                       {
                           "name":  "have",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "coordinator",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ReentrancyGuardReentrantCall",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "SelfApproval",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "SmartContractNotAccepted",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "TooManyIdFieldsInURL",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAddress",
        "inputs":  [

                   ]
    }
]
 as const;

export const GOVERNANCE_TOKEN_ABI = 
[
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "_teamVesting",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "_treasury",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "_airdrop",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "_liquidity",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "CLOCK_MODE",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "DOMAIN_SEPARATOR",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bytes32",
                            "internalType":  "bytes32"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "TOTAL_SUPPLY",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "airdrop",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "allowance",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "approve",
        "inputs":  [
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "balanceOf",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "checkpoints",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "pos",
                           "type":  "uint32",
                           "internalType":  "uint32"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "tuple",
                            "internalType":  "struct Checkpoints.Checkpoint208",
                            "components":  [
                                               {
                                                   "name":  "_key",
                                                   "type":  "uint48",
                                                   "internalType":  "uint48"
                                               },
                                               {
                                                   "name":  "_value",
                                                   "type":  "uint208",
                                                   "internalType":  "uint208"
                                               }
                                           ]
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "clock",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint48",
                            "internalType":  "uint48"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "decimals",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint8",
                            "internalType":  "uint8"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "delegate",
        "inputs":  [
                       {
                           "name":  "delegatee",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "delegateBySig",
        "inputs":  [
                       {
                           "name":  "delegatee",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "nonce",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "expiry",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "v",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "r",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       },
                       {
                           "name":  "s",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "delegates",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "eip712Domain",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "fields",
                            "type":  "bytes1",
                            "internalType":  "bytes1"
                        },
                        {
                            "name":  "name",
                            "type":  "string",
                            "internalType":  "string"
                        },
                        {
                            "name":  "version",
                            "type":  "string",
                            "internalType":  "string"
                        },
                        {
                            "name":  "chainId",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "verifyingContract",
                            "type":  "address",
                            "internalType":  "address"
                        },
                        {
                            "name":  "salt",
                            "type":  "bytes32",
                            "internalType":  "bytes32"
                        },
                        {
                            "name":  "extensions",
                            "type":  "uint256[]",
                            "internalType":  "uint256[]"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "getPastTotalSupply",
        "inputs":  [
                       {
                           "name":  "timepoint",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "getPastVotes",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "timepoint",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "getVotes",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "liquidity",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "name",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "nonces",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "numCheckpoints",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint32",
                            "internalType":  "uint32"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "permit",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "deadline",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "v",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "r",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       },
                       {
                           "name":  "s",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "symbol",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "teamVesting",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "totalSupply",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "transfer",
        "inputs":  [
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "transferFrom",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "treasury",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "event",
        "name":  "Approval",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "spender",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "DelegateChanged",
        "inputs":  [
                       {
                           "name":  "delegator",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "fromDelegate",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "toDelegate",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "DelegateVotesChanged",
        "inputs":  [
                       {
                           "name":  "delegate",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "previousVotes",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "newVotes",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "EIP712DomainChanged",
        "inputs":  [

                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "Transfer",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "error",
        "name":  "CheckpointUnorderedInsertion",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ECDSAInvalidSignature",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ECDSAInvalidSignatureLength",
        "inputs":  [
                       {
                           "name":  "length",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ECDSAInvalidSignatureS",
        "inputs":  [
                       {
                           "name":  "s",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20ExceededSafeSupply",
        "inputs":  [
                       {
                           "name":  "increasedSupply",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "cap",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InsufficientAllowance",
        "inputs":  [
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "allowance",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "needed",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InsufficientBalance",
        "inputs":  [
                       {
                           "name":  "sender",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "balance",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "needed",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidApprover",
        "inputs":  [
                       {
                           "name":  "approver",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidReceiver",
        "inputs":  [
                       {
                           "name":  "receiver",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidSender",
        "inputs":  [
                       {
                           "name":  "sender",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidSpender",
        "inputs":  [
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC2612ExpiredSignature",
        "inputs":  [
                       {
                           "name":  "deadline",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC2612InvalidSigner",
        "inputs":  [
                       {
                           "name":  "signer",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC5805FutureLookup",
        "inputs":  [
                       {
                           "name":  "timepoint",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "clock",
                           "type":  "uint48",
                           "internalType":  "uint48"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC6372InconsistentClock",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "InvalidAccountNonce",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "currentNonce",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "InvalidShortString",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "SafeCastOverflowedUintDowncast",
        "inputs":  [
                       {
                           "name":  "bits",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "StringTooLong",
        "inputs":  [
                       {
                           "name":  "str",
                           "type":  "string",
                           "internalType":  "string"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "VotesExpiredSignature",
        "inputs":  [
                       {
                           "name":  "expiry",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAddressAirdrop",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAddressLiquidity",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAddressTeamVesting",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAddressTreasury",
        "inputs":  [

                   ]
    }
]
 as const;

export const GOVERNOR_ABI = 
[
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "token_",
                           "type":  "address",
                           "internalType":  "contract IVotes"
                       },
                       {
                           "name":  "timelock_",
                           "type":  "address",
                           "internalType":  "contract TimelockController"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "receive",
        "stateMutability":  "payable"
    },
    {
        "type":  "function",
        "name":  "BALLOT_TYPEHASH",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bytes32",
                            "internalType":  "bytes32"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "CLOCK_MODE",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "COUNTING_MODE",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "pure"
    },
    {
        "type":  "function",
        "name":  "EXTENDED_BALLOT_TYPEHASH",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bytes32",
                            "internalType":  "bytes32"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "cancel",
        "inputs":  [
                       {
                           "name":  "targets",
                           "type":  "address[]",
                           "internalType":  "address[]"
                       },
                       {
                           "name":  "values",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "calldatas",
                           "type":  "bytes[]",
                           "internalType":  "bytes[]"
                       },
                       {
                           "name":  "descriptionHash",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "castVote",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "support",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "castVoteBySig",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "support",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "voter",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "signature",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "castVoteWithReason",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "support",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "reason",
                           "type":  "string",
                           "internalType":  "string"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "castVoteWithReasonAndParams",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "support",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "reason",
                           "type":  "string",
                           "internalType":  "string"
                       },
                       {
                           "name":  "params",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "castVoteWithReasonAndParamsBySig",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "support",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "voter",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "reason",
                           "type":  "string",
                           "internalType":  "string"
                       },
                       {
                           "name":  "params",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       },
                       {
                           "name":  "signature",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "clock",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint48",
                            "internalType":  "uint48"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "eip712Domain",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "fields",
                            "type":  "bytes1",
                            "internalType":  "bytes1"
                        },
                        {
                            "name":  "name",
                            "type":  "string",
                            "internalType":  "string"
                        },
                        {
                            "name":  "version",
                            "type":  "string",
                            "internalType":  "string"
                        },
                        {
                            "name":  "chainId",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "verifyingContract",
                            "type":  "address",
                            "internalType":  "address"
                        },
                        {
                            "name":  "salt",
                            "type":  "bytes32",
                            "internalType":  "bytes32"
                        },
                        {
                            "name":  "extensions",
                            "type":  "uint256[]",
                            "internalType":  "uint256[]"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "execute",
        "inputs":  [
                       {
                           "name":  "targets",
                           "type":  "address[]",
                           "internalType":  "address[]"
                       },
                       {
                           "name":  "values",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "calldatas",
                           "type":  "bytes[]",
                           "internalType":  "bytes[]"
                       },
                       {
                           "name":  "descriptionHash",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "payable"
    },
    {
        "type":  "function",
        "name":  "getVotes",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "timepoint",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "getVotesWithParams",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "timepoint",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "params",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "hasVoted",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "hashProposal",
        "inputs":  [
                       {
                           "name":  "targets",
                           "type":  "address[]",
                           "internalType":  "address[]"
                       },
                       {
                           "name":  "values",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "calldatas",
                           "type":  "bytes[]",
                           "internalType":  "bytes[]"
                       },
                       {
                           "name":  "descriptionHash",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "pure"
    },
    {
        "type":  "function",
        "name":  "name",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "nonces",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "onERC1155BatchReceived",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bytes4",
                            "internalType":  "bytes4"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "onERC1155Received",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bytes4",
                            "internalType":  "bytes4"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "onERC721Received",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bytes4",
                            "internalType":  "bytes4"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "proposalDeadline",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "proposalEta",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "proposalNeedsQueuing",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "proposalProposer",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "proposalSnapshot",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "proposalThreshold",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "proposalVotes",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "againstVotes",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "forVotes",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "abstainVotes",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "propose",
        "inputs":  [
                       {
                           "name":  "targets",
                           "type":  "address[]",
                           "internalType":  "address[]"
                       },
                       {
                           "name":  "values",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "calldatas",
                           "type":  "bytes[]",
                           "internalType":  "bytes[]"
                       },
                       {
                           "name":  "description",
                           "type":  "string",
                           "internalType":  "string"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "queue",
        "inputs":  [
                       {
                           "name":  "targets",
                           "type":  "address[]",
                           "internalType":  "address[]"
                       },
                       {
                           "name":  "values",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "calldatas",
                           "type":  "bytes[]",
                           "internalType":  "bytes[]"
                       },
                       {
                           "name":  "descriptionHash",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "quorum",
        "inputs":  [
                       {
                           "name":  "blockNumber",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "quorumDenominator",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "quorumNumerator",
        "inputs":  [
                       {
                           "name":  "timepoint",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "quorumNumerator",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "relay",
        "inputs":  [
                       {
                           "name":  "target",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "data",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "payable"
    },
    {
        "type":  "function",
        "name":  "setProposalThreshold",
        "inputs":  [
                       {
                           "name":  "newProposalThreshold",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "setVotingDelay",
        "inputs":  [
                       {
                           "name":  "newVotingDelay",
                           "type":  "uint48",
                           "internalType":  "uint48"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "setVotingPeriod",
        "inputs":  [
                       {
                           "name":  "newVotingPeriod",
                           "type":  "uint32",
                           "internalType":  "uint32"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "state",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint8",
                            "internalType":  "enum IGovernor.ProposalState"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "supportsInterface",
        "inputs":  [
                       {
                           "name":  "interfaceId",
                           "type":  "bytes4",
                           "internalType":  "bytes4"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "timelock",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "token",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "contract IERC5805"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "updateQuorumNumerator",
        "inputs":  [
                       {
                           "name":  "newQuorumNumerator",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "updateTimelock",
        "inputs":  [
                       {
                           "name":  "newTimelock",
                           "type":  "address",
                           "internalType":  "contract TimelockController"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "version",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "votingDelay",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "pure"
    },
    {
        "type":  "function",
        "name":  "votingPeriod",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "pure"
    },
    {
        "type":  "event",
        "name":  "EIP712DomainChanged",
        "inputs":  [

                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "ProposalCanceled",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "ProposalCreated",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "proposer",
                           "type":  "address",
                           "indexed":  false,
                           "internalType":  "address"
                       },
                       {
                           "name":  "targets",
                           "type":  "address[]",
                           "indexed":  false,
                           "internalType":  "address[]"
                       },
                       {
                           "name":  "values",
                           "type":  "uint256[]",
                           "indexed":  false,
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "signatures",
                           "type":  "string[]",
                           "indexed":  false,
                           "internalType":  "string[]"
                       },
                       {
                           "name":  "calldatas",
                           "type":  "bytes[]",
                           "indexed":  false,
                           "internalType":  "bytes[]"
                       },
                       {
                           "name":  "voteStart",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "voteEnd",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "description",
                           "type":  "string",
                           "indexed":  false,
                           "internalType":  "string"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "ProposalExecuted",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "ProposalQueued",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "etaSeconds",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "ProposalThresholdSet",
        "inputs":  [
                       {
                           "name":  "oldProposalThreshold",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "newProposalThreshold",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "QuorumNumeratorUpdated",
        "inputs":  [
                       {
                           "name":  "oldQuorumNumerator",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "newQuorumNumerator",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "TimelockChange",
        "inputs":  [
                       {
                           "name":  "oldTimelock",
                           "type":  "address",
                           "indexed":  false,
                           "internalType":  "address"
                       },
                       {
                           "name":  "newTimelock",
                           "type":  "address",
                           "indexed":  false,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "VoteCast",
        "inputs":  [
                       {
                           "name":  "voter",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "support",
                           "type":  "uint8",
                           "indexed":  false,
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "weight",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "reason",
                           "type":  "string",
                           "indexed":  false,
                           "internalType":  "string"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "VoteCastWithParams",
        "inputs":  [
                       {
                           "name":  "voter",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "support",
                           "type":  "uint8",
                           "indexed":  false,
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "weight",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "reason",
                           "type":  "string",
                           "indexed":  false,
                           "internalType":  "string"
                       },
                       {
                           "name":  "params",
                           "type":  "bytes",
                           "indexed":  false,
                           "internalType":  "bytes"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "VotingDelaySet",
        "inputs":  [
                       {
                           "name":  "oldVotingDelay",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "newVotingDelay",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "VotingPeriodSet",
        "inputs":  [
                       {
                           "name":  "oldVotingPeriod",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "newVotingPeriod",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "error",
        "name":  "CheckpointUnorderedInsertion",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "FailedInnerCall",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorAlreadyCastVote",
        "inputs":  [
                       {
                           "name":  "voter",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorAlreadyQueuedProposal",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorDisabledDeposit",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorInsufficientProposerVotes",
        "inputs":  [
                       {
                           "name":  "proposer",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "votes",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "threshold",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorInvalidProposalLength",
        "inputs":  [
                       {
                           "name":  "targets",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "calldatas",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "values",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorInvalidQuorumFraction",
        "inputs":  [
                       {
                           "name":  "quorumNumerator",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "quorumDenominator",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorInvalidSignature",
        "inputs":  [
                       {
                           "name":  "voter",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorInvalidVoteType",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorInvalidVotingPeriod",
        "inputs":  [
                       {
                           "name":  "votingPeriod",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorNonexistentProposal",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorNotQueuedProposal",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorOnlyExecutor",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorOnlyProposer",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorQueueNotImplemented",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorRestrictedProposer",
        "inputs":  [
                       {
                           "name":  "proposer",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "GovernorUnexpectedProposalState",
        "inputs":  [
                       {
                           "name":  "proposalId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "current",
                           "type":  "uint8",
                           "internalType":  "enum IGovernor.ProposalState"
                       },
                       {
                           "name":  "expectedStates",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "InvalidAccountNonce",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "currentNonce",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "InvalidShortString",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "QueueEmpty",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "QueueFull",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "SafeCastOverflowedUintDowncast",
        "inputs":  [
                       {
                           "name":  "bits",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "StringTooLong",
        "inputs":  [
                       {
                           "name":  "str",
                           "type":  "string",
                           "internalType":  "string"
                       }
                   ]
    }
]
 as const;

export const AMM_ABI = 
[
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "tokenA_",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "tokenB_",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "addLiquidity",
        "inputs":  [
                       {
                           "name":  "amountADesired",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "amountBDesired",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "minAmountA",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "minAmountB",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "amountA",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "amountB",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "liquidity",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "getAmountOut",
        "inputs":  [
                       {
                           "name":  "amountIn",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "reserveIn",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "reserveOut",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "amountOut",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "pure"
    },
    {
        "type":  "function",
        "name":  "getAmountOutYul",
        "inputs":  [
                       {
                           "name":  "amountIn",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "reserveIn",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "reserveOut",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "amountOut",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "pure"
    },
    {
        "type":  "function",
        "name":  "lpToken",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "contract LPToken"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "quoteAForB",
        "inputs":  [
                       {
                           "name":  "amountIn",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "quoteBForA",
        "inputs":  [
                       {
                           "name":  "amountIn",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "removeLiquidity",
        "inputs":  [
                       {
                           "name":  "lpAmount",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "minAmountA",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "minAmountB",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "amountA",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "amountB",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "reserveA",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "reserveB",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "swap",
        "inputs":  [
                       {
                           "name":  "tokenIn",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "amountIn",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "minAmountOut",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "amountOut",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "tokenA",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "tokenB",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "event",
        "name":  "LiquidityAdded",
        "inputs":  [
                       {
                           "name":  "provider",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "amountA",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "amountB",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "lpTokensMinted",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "LiquidityRemoved",
        "inputs":  [
                       {
                           "name":  "provider",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "amountA",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "amountB",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "lpTokensBurned",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "Swap",
        "inputs":  [
                       {
                           "name":  "trader",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "tokenIn",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "tokenOut",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "amountIn",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "amountOut",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "error",
        "name":  "AddressEmptyCode",
        "inputs":  [
                       {
                           "name":  "target",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "AddressInsufficientBalance",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "EmptyReserveIn",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "EmptyReserveOut",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "FailedInnerCall",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "IdenticalTokens",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "InsufficientBurnA",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "InsufficientBurnB",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "InsufficientLiquidity",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "InvalidToken",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "NoLiquidity",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ReentrancyGuardReentrantCall",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "SafeERC20FailedOperation",
        "inputs":  [
                       {
                           "name":  "token",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "Slippage",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "SlippageA",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "SlippageB",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAddressA",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAddressB",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAmount",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAmountA",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAmountB",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAmountIn",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAmountOut",
        "inputs":  [

                   ]
    }
]
 as const;

export const NFT_RENTAL_VAULT_ABI = 
[
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "asset_",
                           "type":  "address",
                           "internalType":  "contract IERC20"
                       },
                       {
                           "name":  "nftContract_",
                           "type":  "address",
                           "internalType":  "contract IERC1155"
                       },
                       {
                           "name":  "boostedNftId_",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "owner_",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "BASE_BPS",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "allowance",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "approve",
        "inputs":  [
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "asset",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "balanceOf",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "boostBps",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "boostedNftId",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "convertToAssets",
        "inputs":  [
                       {
                           "name":  "shares",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "convertToShares",
        "inputs":  [
                       {
                           "name":  "assets",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "decimals",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint8",
                            "internalType":  "uint8"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "deposit",
        "inputs":  [
                       {
                           "name":  "assets",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "receiver",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "injectYield",
        "inputs":  [
                       {
                           "name":  "amount",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "isRenting",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "maxDeposit",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "maxMint",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "maxRedeem",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "maxWithdraw",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "mint",
        "inputs":  [
                       {
                           "name":  "shares",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "receiver",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "name",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "nftContract",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "contract IERC1155"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "onERC1155BatchReceived",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       },
                       {
                           "name":  "",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bytes4",
                            "internalType":  "bytes4"
                        }
                    ],
        "stateMutability":  "pure"
    },
    {
        "type":  "function",
        "name":  "onERC1155Received",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bytes4",
                            "internalType":  "bytes4"
                        }
                    ],
        "stateMutability":  "pure"
    },
    {
        "type":  "function",
        "name":  "owner",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "previewDeposit",
        "inputs":  [
                       {
                           "name":  "assets",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "previewMint",
        "inputs":  [
                       {
                           "name":  "shares",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "previewRedeem",
        "inputs":  [
                       {
                           "name":  "shares",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "previewWithdraw",
        "inputs":  [
                       {
                           "name":  "assets",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "redeem",
        "inputs":  [
                       {
                           "name":  "shares",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "receiver",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "renounceOwnership",
        "inputs":  [

                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "rentals",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "renter",
                            "type":  "address",
                            "internalType":  "address"
                        },
                        {
                            "name":  "stakedAt",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "setBoostBps",
        "inputs":  [
                       {
                           "name":  "newBoostBps",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "stakeNFT",
        "inputs":  [
                       {
                           "name":  "nftId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "supportsInterface",
        "inputs":  [
                       {
                           "name":  "interfaceId",
                           "type":  "bytes4",
                           "internalType":  "bytes4"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "pure"
    },
    {
        "type":  "function",
        "name":  "symbol",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "totalAssets",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "totalSupply",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "transfer",
        "inputs":  [
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "transferFrom",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "transferOwnership",
        "inputs":  [
                       {
                           "name":  "newOwner",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "unstakeNFT",
        "inputs":  [
                       {
                           "name":  "nftId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "withdraw",
        "inputs":  [
                       {
                           "name":  "assets",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "receiver",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "event",
        "name":  "Approval",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "spender",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "BoostUpdated",
        "inputs":  [
                       {
                           "name":  "newBoostBps",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "Deposit",
        "inputs":  [
                       {
                           "name":  "sender",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "owner",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "assets",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "shares",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "NFTStaked",
        "inputs":  [
                       {
                           "name":  "renter",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "nftId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "NFTUnstaked",
        "inputs":  [
                       {
                           "name":  "renter",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "nftId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "OwnershipTransferred",
        "inputs":  [
                       {
                           "name":  "previousOwner",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "newOwner",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "Transfer",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "Withdraw",
        "inputs":  [
                       {
                           "name":  "sender",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "receiver",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "owner",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "assets",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "shares",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "YieldInjected",
        "inputs":  [
                       {
                           "name":  "amount",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "error",
        "name":  "AddressEmptyCode",
        "inputs":  [
                       {
                           "name":  "target",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "AddressInsufficientBalance",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "AlreadyStaked",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "BoostBelowBase",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InsufficientAllowance",
        "inputs":  [
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "allowance",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "needed",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InsufficientBalance",
        "inputs":  [
                       {
                           "name":  "sender",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "balance",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "needed",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidApprover",
        "inputs":  [
                       {
                           "name":  "approver",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidReceiver",
        "inputs":  [
                       {
                           "name":  "receiver",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidSender",
        "inputs":  [
                       {
                           "name":  "sender",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidSpender",
        "inputs":  [
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC4626ExceededMaxDeposit",
        "inputs":  [
                       {
                           "name":  "receiver",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "assets",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "max",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC4626ExceededMaxMint",
        "inputs":  [
                       {
                           "name":  "receiver",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "shares",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "max",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC4626ExceededMaxRedeem",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "shares",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "max",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC4626ExceededMaxWithdraw",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "assets",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "max",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "FailedInnerCall",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "MathOverflowedMulDiv",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "NotRenter",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "OwnableInvalidOwner",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "OwnableUnauthorizedAccount",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ReentrancyGuardReentrantCall",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "SafeERC20FailedOperation",
        "inputs":  [
                       {
                           "name":  "token",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "WrongNft",
        "inputs":  [

                   ]
    }
]
 as const;

export const VRF_CONSUMER_ABI = 
[
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "coordinator_",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "keyHash_",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       },
                       {
                           "name":  "subscriptionId_",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "CALLBACK_GAS_LIMIT",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint32",
                            "internalType":  "uint32"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "NUM_WORDS",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint32",
                            "internalType":  "uint32"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "REQUEST_CONFIRMATIONS",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint16",
                            "internalType":  "uint16"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "acceptOwnership",
        "inputs":  [

                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "keyHash",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bytes32",
                            "internalType":  "bytes32"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "lastRandomResult",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "owner",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "rawFulfillRandomWords",
        "inputs":  [
                       {
                           "name":  "requestId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "randomWords",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "requestRandom",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "requestId",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "requestToSender",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "s_vrfCoordinator",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "contract IVRFCoordinatorV2Plus"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "setCoordinator",
        "inputs":  [
                       {
                           "name":  "_vrfCoordinator",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "subscriptionId",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "transferOwnership",
        "inputs":  [
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "event",
        "name":  "CoordinatorSet",
        "inputs":  [
                       {
                           "name":  "vrfCoordinator",
                           "type":  "address",
                           "indexed":  false,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "OwnershipTransferRequested",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "OwnershipTransferred",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "RandomFulfilled",
        "inputs":  [
                       {
                           "name":  "requestId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "randomWord",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "RandomRequested",
        "inputs":  [
                       {
                           "name":  "requestId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "sender",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "error",
        "name":  "OnlyCoordinatorCanFulfill",
        "inputs":  [
                       {
                           "name":  "have",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "want",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "OnlyOwnerOrCoordinator",
        "inputs":  [
                       {
                           "name":  "have",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "coordinator",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAddress",
        "inputs":  [

                   ]
    }
]
 as const;

export const GAME_TOKEN_FACTORY_ABI = 
[
    {
        "type":  "function",
        "name":  "allTokens",
        "inputs":  [
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "allTokensLength",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "createToken",
        "inputs":  [
                       {
                           "name":  "name",
                           "type":  "string",
                           "internalType":  "string"
                       },
                       {
                           "name":  "symbol",
                           "type":  "string",
                           "internalType":  "string"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "token",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "createToken2",
        "inputs":  [
                       {
                           "name":  "name",
                           "type":  "string",
                           "internalType":  "string"
                       },
                       {
                           "name":  "symbol",
                           "type":  "string",
                           "internalType":  "string"
                       },
                       {
                           "name":  "salt",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "token",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "predictAddress",
        "inputs":  [
                       {
                           "name":  "name",
                           "type":  "string",
                           "internalType":  "string"
                       },
                       {
                           "name":  "symbol",
                           "type":  "string",
                           "internalType":  "string"
                       },
                       {
                           "name":  "salt",
                           "type":  "bytes32",
                           "internalType":  "bytes32"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "event",
        "name":  "TokenCreated",
        "inputs":  [
                       {
                           "name":  "token",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "salt",
                           "type":  "bytes32",
                           "indexed":  true,
                           "internalType":  "bytes32"
                       },
                       {
                           "name":  "create2",
                           "type":  "bool",
                           "indexed":  true,
                           "internalType":  "bool"
                       }
                   ],
        "anonymous":  false
    }
]
 as const;

export const GAME_TOKEN_ABI = 
[
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "name_",
                           "type":  "string",
                           "internalType":  "string"
                       },
                       {
                           "name":  "symbol_",
                           "type":  "string",
                           "internalType":  "string"
                       },
                       {
                           "name":  "owner_",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "allowance",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "approve",
        "inputs":  [
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "balanceOf",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "decimals",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint8",
                            "internalType":  "uint8"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "mint",
        "inputs":  [
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "amount",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "name",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "owner",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "renounceOwnership",
        "inputs":  [

                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "symbol",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "string",
                            "internalType":  "string"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "totalSupply",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "transfer",
        "inputs":  [
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "transferFrom",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "transferOwnership",
        "inputs":  [
                       {
                           "name":  "newOwner",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "event",
        "name":  "Approval",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "spender",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "OwnershipTransferred",
        "inputs":  [
                       {
                           "name":  "previousOwner",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "newOwner",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "Transfer",
        "inputs":  [
                       {
                           "name":  "from",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "to",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "error",
        "name":  "ERC20InsufficientAllowance",
        "inputs":  [
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "allowance",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "needed",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InsufficientBalance",
        "inputs":  [
                       {
                           "name":  "sender",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "balance",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "needed",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidApprover",
        "inputs":  [
                       {
                           "name":  "approver",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidReceiver",
        "inputs":  [
                       {
                           "name":  "receiver",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidSender",
        "inputs":  [
                       {
                           "name":  "sender",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ERC20InvalidSpender",
        "inputs":  [
                       {
                           "name":  "spender",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "OwnableInvalidOwner",
        "inputs":  [
                       {
                           "name":  "owner",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "OwnableUnauthorizedAccount",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    }
]
 as const;

export const TOKEN_VESTING_ABI = 
[
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "_token",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "_beneficiary",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "_start",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "DURATION",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "beneficiary",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "release",
        "inputs":  [

                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "released",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "start",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "token",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "contract IERC20"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "vestedAmount",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "error",
        "name":  "AddressEmptyCode",
        "inputs":  [
                       {
                           "name":  "target",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "AddressInsufficientBalance",
        "inputs":  [
                       {
                           "name":  "account",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "FailedInnerCall",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "NothingToRelease",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "SafeERC20FailedOperation",
        "inputs":  [
                       {
                           "name":  "token",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAddressBeneficiary",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAddressToken",
        "inputs":  [

                   ]
    }
]
 as const;

export const BOX_ABI = 
[
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "_timelock",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "retrieve",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "store",
        "inputs":  [
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "timelock",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "event",
        "name":  "ValueChanged",
        "inputs":  [
                       {
                           "name":  "value",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "error",
        "name":  "NotTimelock",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "ZeroAddress",
        "inputs":  [

                   ]
    }
]
 as const;

export const PRICE_FEED_CONSUMER_ABI = 
[
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "feed_",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "stalenessThreshold_",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "getLatestPrice",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "price",
                            "type":  "int256",
                            "internalType":  "int256"
                        },
                        {
                            "name":  "updatedAt",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "priceFeed",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "contract AggregatorV3Interface"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "stalenessThreshold",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "error",
        "name":  "InvalidPrice",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "InvalidRound",
        "inputs":  [

                   ]
    },
    {
        "type":  "error",
        "name":  "StalePrice",
        "inputs":  [

                   ]
    }
]
 as const;

export const ERC20_ABI = GAME_TOKEN_ABI;
