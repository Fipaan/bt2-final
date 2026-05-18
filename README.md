# Equestria Protocol - GameFi Economy on L2

A production-grade GameFi DeFi protocol built on Arbitrum Sepolia for Blockchain Technologies 2 capstone.

## Overview

Equestria Protocol is a fully on-chain GameFi economy featuring:
- ERC-1155 in-game item crafting with Chainlink VRF loot drops
- Constant-product AMM for fungible resource trading
- ERC-4626 NFT rental vault with yield boost
- Full DAO governance with OpenZeppelin Governor stack
- UUPS upgradeable contracts via Factory pattern

## Deployed Contracts (Arbitrum Sepolia) (NOTE: not defense ready)

| Contract | Address |
|----------|---------|
| GovernanceToken | `0xa1639E90360F8bf5c991ef317d4c2bda179DA96D` |
| TokenVesting | `0x64B58c4f1aB0C6e3bD313edBe60f6431a409BDdc` |
| TimelockController | `0x50178088Fb1Cd9aD739FDc6B05A9F04fFe79E710` |
| MyGovernor | `0x45bcfCA8CB484B64c61E9a6760a32400049043C7` |
| Treasury | `0xB9282Dbe231a68a99AcE83426e7098476a0C6F8f` |
| Box | `0xDb99EdB2A4e805d61e03986C80E72e9D3E86D117` |
| GameToken A (HAR) | `0x117e85C48Cf83ab72e6d2Ee00433745D6c41b623` |
| GameToken B (SPK) | `0x51Dd1b79B10E60477594B6EA90619E56B0a6EE8d` |
| AMM | `0x06866CC62f0408cc597B46Bf164C04A81523c09d` |
| Equestria1155 | `0x53d6131b4cb09481C14cbAEFeb75ab34B44d3FB3` |
| GameTokenFactory | `0x15dac80704b017c71a8387AD59CfbAb695136159` |
| GameTokenV1 (impl) | `0xb10b57DDdFF61CC4E0cF86ADa95A800C473aee2b` |
| GameTokenV2 (impl) | `0xEbF04728Df386Bf88Ef98acE452e53CDB2ed7bB2` |
| GameToken Proxy | `0x01816b063D3E892C80eae870002005130a8D7297` |
| NFTRentalVault | `0xb1F9f5d8f62C987D28BccD9F5Ae66a702347aF08` |
| PriceFeedConsumer | `0x2502f6CC7073d0af503eA29b9731ecD7Eae17Fa8` |
| VRFConsumer | `0xb8545E71e8F8a43B3d77879662D2D68D2b2f4Ba8` |

> Block explorer: https://sepolia.arbiscan.io

## Architecture

See [docs/architecture.md](docs/architecture.md) for full system design, C4 diagrams, sequence flows, and storage layouts.

## Security

See [docs/audit.md](docs/audit.md) for the full internal security audit report including findings, centralization analysis, and governance attack analysis.

## Getting Started

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js 20+

### Install
```bash
$ git clone https://github.com/Fipaan/bt2-final.git
$ cd bt2-final
$ forge install
$ npm install -g solhint prettier prettier-plugin-solidity
```

### Build
```bash
$ forge build
```

### Test
```bash
$ forge test -vvv
```

### Coverage
```bash
$ forge coverage --no-match-coverage "(script|test)" --ir-minimum
```

### Deploy
```bash
$ cp .env.example .env # fill in PRIVATE_KEY, RPC_URL, VRF_SUB_ID
$ source .env
$ forge script script/Deploy.s.sol --broadcast --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

### Verify deployment
```bash
$ forge script script/Verify.s.sol --rpc-url $RPC_URL
```

## Gas Report

See [gas-report.md](docs/gas-report.md) for before/after Yul benchmarks and L1 vs L2 gas comparison.

## Coverage Report

See [coverage.md](docs/coverage.md) - line coverage 93% across `src/`.

## Frontend

```bash
$ forge build
$ cp out/ src/lib/out/
$ cd frontend
$ npm install
$ npm run dev
```

Connect MetaMask to Arbitrum Sepolia (chain ID 421614).

## Subgraph

Deployed on The Graph - [studio link here].

Supported queries: `RecentSwaps`, `LiquidityHistory`, `HolderBalances`, `CraftingLifecycle`, `VaultActivity`.

## Team

| Member | Ownership |
|--------|-----------|
| Roman M. | Smart contracts, tests, deployment, CI |
| Anatoly T. | Frontend, subgraph, documentation |

## License

MIT
