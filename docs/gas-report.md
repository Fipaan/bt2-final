# Gas Optimization Report

## Yul Assembly Benchmark

`getAmountOut` — constant-product AMM swap price calculation.

| Implementation | Gas Used | Savings |
|----------------|----------|---------|
| Pure Solidity  | 6,308    | —       |
| Yul Assembly   | 5,965    | 343 (~5.4%) |

The Yul implementation avoids Solidity's implicit overflow checks and uses raw `div`/`mul` opcodes directly, saving ~343 gas per price query.

## L1 vs L2 Gas Comparison

Gas costs measured via `forge test --gas-report`. L1 cost calculated at 30 gwei, L2 at 0.1 gwei. ETH price ~$3,000.

| Operation | Gas Used | L1 Cost (gwei) | L1 Cost (USD) | L2 Cost (gwei) | L2 Cost (USD) | Savings |
|-----------|----------|----------------|---------------|----------------|---------------|---------|
| `addLiquidity` | 205,160 | 6,154,800 | ~$18.46 | 20,516 | ~$0.06 | ~308x |
| `removeLiquidity` | 70,413 | 2,112,390 | ~$6.34 | 7,041 | ~$0.02 | ~308x |
| `swap` | 72,068 | 2,162,040 | ~$6.49 | 7,207 | ~$0.02 | ~308x |
| `craft` (ERC-1155) | 293,335 | 8,800,050 | ~$26.40 | 29,334 | ~$0.09 | ~308x |
| `propose` (Governor) | 77,143 | 2,314,290 | ~$6.94 | 7,714 | ~$0.02 | ~308x |
| `deposit` (Vault) | 114,313 | 3,429,390 | ~$10.29 | 11,431 | ~$0.03 | ~308x |

> L1 gas price: 30 gwei. L2 gas price: 0.1 gwei. ETH: $3,000.
> L2 deployment: Arbitrum Sepolia.

## Conclusion

Deploying on Arbitrum L2 reduces gas costs by approximately **300x** across all operations, making the protocol economically viable for end users. The most expensive operation (`craft`) costs ~$26 on L1 vs ~$0.09 on L2.
