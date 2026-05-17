# BT2 Protocol Subgraph

This subgraph indexes the protocol event surface used by the AMM, ERC-1155 crafting contract, NFT rental vault, game-token factory, and VRF consumer.

## Configure

`subgraph.yaml` is checked in with zero-address placeholders so the schema, mappings, and queries are reviewable without a live deployment. After running `script/Deploy.s.sol`, replace each `source.address` with the logged contract address:

- `AMM_ADDR`
- `NFT_ADDR`
- `VAULT_ADDR`
- `FACTORY_ADDR`
- `VRF_ADDR`

Set each `startBlock` to the deployment block for faster indexing.

## Build

```sh
npm install
npm run codegen
npm run build
```

## Documented Queries

See `queries/protocol.graphql` for five ready-to-use GraphQL queries:

1. Recent swaps with trader, token route, and amounts.
2. Liquidity changes grouped by provider and action.
3. ERC-1155 balances for game items and crafted ponies.
4. Crafting request/fulfillment lifecycle.
5. Vault rental and yield-configuration activity.
