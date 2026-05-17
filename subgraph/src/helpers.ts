import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

export const ZERO = BigInt.fromI32(0);
export const ONE = BigInt.fromI32(1);
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function eventId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
}

export function accountTokenId(owner: Address, tokenId: BigInt): string {
  return owner.toHexString() + "-" + tokenId.toString();
}
