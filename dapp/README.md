# GameFi Economy Frontend

Next.js 14 + TypeScript + Wagmi v2 + RainbowKit dApp for the GameFi Economy protocol on Arbitrum Sepolia.

## Setup

```sh
npm install
cp .env.local.example .env.local
npm run dev
```

Fill every `NEXT_PUBLIC_*_ADDR` value from the Foundry deployment output and set `NEXT_PUBLIC_SUBGRAPH_URL` to the deployed subgraph endpoint.

## Features

- Wallet connection through RainbowKit, including MetaMask and WalletConnect.
- Arbitrum Sepolia network guard with a switch-network prompt.
- Dashboard reads token balance, voting power, delegate address, vault shares, ERC-1155 balances, and AMM reserves.
- Write transactions for crafting, AMM swaps, vault deposit/staking, vesting release, delegation, and Governor voting.
- DAO proposal list comes from The Graph; live proposal state and vote totals are read from the Governor contract.
- User-facing error messages for rejected transactions, wrong network, insufficient balances, missing env config, and subgraph failures.

## Local Artifacts

Do not commit generated/build folders such as `out/`, `broadcast/`, `node_modules/`, `dapp/.next/`, or `subgraph/generated/`.
