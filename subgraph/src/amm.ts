import { Address, BigInt } from "@graphprotocol/graph-ts";
import { LiquidityAdded, LiquidityRemoved, Swap } from "../generated/AMM/AMM";
import { LiquidityEvent, Pool, SwapEvent } from "../generated/schema";
import { eventId, ONE, ZERO } from "./helpers";

function getPool(address: Address): Pool {
  let id = address.toHexString();
  let pool = Pool.load(id);
  if (pool == null) {
    pool = new Pool(id);
    pool.address = address;
    pool.reserveA = ZERO;
    pool.reserveB = ZERO;
    pool.liquidityEventCount = ZERO;
    pool.swapCount = ZERO;
    pool.updatedAt = ZERO;
    pool.updatedAtBlock = ZERO;
  }
  return pool;
}

function savePool(pool: Pool, timestamp: BigInt, blockNumber: BigInt): void {
  pool.updatedAt = timestamp;
  pool.updatedAtBlock = blockNumber;
  pool.save();
}

export function handleLiquidityAdded(event: LiquidityAdded): void {
  let poolId = event.address.toHexString();
  let pool = getPool(event.address);
  pool.reserveA = pool.reserveA.plus(event.params.amountA);
  pool.reserveB = pool.reserveB.plus(event.params.amountB);
  pool.liquidityEventCount = pool.liquidityEventCount.plus(ONE);
  savePool(pool, event.block.timestamp, event.block.number);

  let entity = new LiquidityEvent(eventId(event));
  entity.pool = poolId;
  entity.provider = event.params.provider;
  entity.action = "ADD";
  entity.amountA = event.params.amountA;
  entity.amountB = event.params.amountB;
  entity.lpTokenAmount = event.params.lpTokensMinted;
  entity.transactionHash = event.transaction.hash;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.save();
}

export function handleLiquidityRemoved(event: LiquidityRemoved): void {
  let poolId = event.address.toHexString();
  let pool = getPool(event.address);
  pool.reserveA = pool.reserveA.minus(event.params.amountA);
  pool.reserveB = pool.reserveB.minus(event.params.amountB);
  pool.liquidityEventCount = pool.liquidityEventCount.plus(ONE);
  savePool(pool, event.block.timestamp, event.block.number);

  let entity = new LiquidityEvent(eventId(event));
  entity.pool = poolId;
  entity.provider = event.params.provider;
  entity.action = "REMOVE";
  entity.amountA = event.params.amountA;
  entity.amountB = event.params.amountB;
  entity.lpTokenAmount = event.params.lpTokensBurned;
  entity.transactionHash = event.transaction.hash;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.save();
}

export function handleSwap(event: Swap): void {
  let poolId = event.address.toHexString();
  let pool = getPool(event.address);
  pool.swapCount = pool.swapCount.plus(ONE);
  savePool(pool, event.block.timestamp, event.block.number);

  let entity = new SwapEvent(eventId(event));
  entity.pool = poolId;
  entity.trader = event.params.trader;
  entity.tokenIn = event.params.tokenIn;
  entity.tokenOut = event.params.tokenOut;
  entity.amountIn = event.params.amountIn;
  entity.amountOut = event.params.amountOut;
  entity.transactionHash = event.transaction.hash;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.save();
}
