import { BigInt } from "@graphprotocol/graph-ts";
import { BoostUpdated, NFTStaked, NFTUnstaked, YieldInjected } from "../generated/NFTRentalVault/NFTRentalVault";
import { BoostUpdate, Rental, VaultStat, YieldInjection } from "../generated/schema";
import { eventId, ONE, ZERO } from "./helpers";

function getVaultStat(): VaultStat {
  let stat = VaultStat.load("global");
  if (stat == null) {
    stat = new VaultStat("global");
    stat.activeRentalCount = ZERO;
    stat.totalYieldInjected = ZERO;
    stat.currentBoostBps = BigInt.fromI32(1200);
    stat.boostUpdateCount = ZERO;
    stat.updatedAt = ZERO;
    stat.updatedAtBlock = ZERO;
  }
  return stat;
}

function rentalId(renter: string, nftId: BigInt): string {
  return renter + "-" + nftId.toString();
}

export function handleNFTStaked(event: NFTStaked): void {
  let id = rentalId(event.params.renter.toHexString(), event.params.nftId);
  let rental = new Rental(id);
  rental.renter = event.params.renter;
  rental.nftId = event.params.nftId;
  rental.active = true;
  rental.stakedAt = event.block.timestamp;
  rental.stakedTx = event.transaction.hash;
  rental.save();

  let stat = getVaultStat();
  stat.activeRentalCount = stat.activeRentalCount.plus(ONE);
  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.save();
}

export function handleNFTUnstaked(event: NFTUnstaked): void {
  let id = rentalId(event.params.renter.toHexString(), event.params.nftId);
  let rental = Rental.load(id);
  if (rental == null) {
    rental = new Rental(id);
    rental.renter = event.params.renter;
    rental.nftId = event.params.nftId;
    rental.stakedAt = ZERO;
    rental.stakedTx = event.transaction.hash;
  }
  rental.active = false;
  rental.unstakedAt = event.block.timestamp;
  rental.unstakedTx = event.transaction.hash;
  rental.save();

  let stat = getVaultStat();
  if (stat.activeRentalCount.gt(ZERO)) {
    stat.activeRentalCount = stat.activeRentalCount.minus(ONE);
  }
  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.save();
}

export function handleYieldInjected(event: YieldInjected): void {
  let injection = new YieldInjection(eventId(event));
  injection.amount = event.params.amount;
  injection.transactionHash = event.transaction.hash;
  injection.blockNumber = event.block.number;
  injection.timestamp = event.block.timestamp;
  injection.save();

  let stat = getVaultStat();
  stat.totalYieldInjected = stat.totalYieldInjected.plus(event.params.amount);
  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.save();
}

export function handleBoostUpdated(event: BoostUpdated): void {
  let update = new BoostUpdate(eventId(event));
  update.newBoostBps = event.params.newBoostBps;
  update.transactionHash = event.transaction.hash;
  update.blockNumber = event.block.number;
  update.timestamp = event.block.timestamp;
  update.save();

  let stat = getVaultStat();
  stat.currentBoostBps = event.params.newBoostBps;
  stat.boostUpdateCount = stat.boostUpdateCount.plus(ONE);
  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.save();
}
