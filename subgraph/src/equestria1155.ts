import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ApprovalForAll,
  CraftFulfilled,
  CraftRequested,
  TransferBatch,
  TransferSingle
} from "../generated/Equestria1155/Equestria1155";
import { CraftFulfillment, CraftRequest, NftTransfer, OperatorApproval, TokenBalance } from "../generated/schema";
import { accountTokenId, eventId, ZERO, ZERO_ADDRESS } from "./helpers";

function getBalance(owner: Address, tokenId: BigInt): TokenBalance {
  let id = accountTokenId(owner, tokenId);
  let balance = TokenBalance.load(id);
  if (balance == null) {
    balance = new TokenBalance(id);
    balance.owner = owner;
    balance.tokenId = tokenId;
    balance.balance = ZERO;
    balance.updatedAt = ZERO;
    balance.updatedAtBlock = ZERO;
  }
  return balance;
}

function increaseBalance(owner: Address, tokenId: BigInt, value: BigInt, timestamp: BigInt, blockNumber: BigInt): void {
  if (owner.toHexString() == ZERO_ADDRESS) return;
  let balance = getBalance(owner, tokenId);
  balance.balance = balance.balance.plus(value);
  balance.updatedAt = timestamp;
  balance.updatedAtBlock = blockNumber;
  balance.save();
}

function decreaseBalance(owner: Address, tokenId: BigInt, value: BigInt, timestamp: BigInt, blockNumber: BigInt): void {
  if (owner.toHexString() == ZERO_ADDRESS) return;
  let balance = getBalance(owner, tokenId);
  balance.balance = balance.balance.minus(value);
  balance.updatedAt = timestamp;
  balance.updatedAtBlock = blockNumber;
  balance.save();
}

function saveTransfer(
  id: string,
  operator: Address,
  from: Address,
  to: Address,
  tokenId: BigInt,
  value: BigInt,
  event: TransferSingle
): void {
  let transfer = new NftTransfer(id);
  transfer.operator = operator;
  transfer.from = from;
  transfer.to = to;
  transfer.tokenId = tokenId;
  transfer.value = value;
  transfer.transactionHash = event.transaction.hash;
  transfer.blockNumber = event.block.number;
  transfer.timestamp = event.block.timestamp;
  transfer.save();
}

export function handleTransferSingle(event: TransferSingle): void {
  decreaseBalance(event.params.from, event.params.id, event.params.value, event.block.timestamp, event.block.number);
  increaseBalance(event.params.to, event.params.id, event.params.value, event.block.timestamp, event.block.number);
  saveTransfer(
    eventId(event),
    event.params.operator,
    event.params.from,
    event.params.to,
    event.params.id,
    event.params.value,
    event
  );
}

export function handleTransferBatch(event: TransferBatch): void {
  for (let i = 0; i < event.params.ids.length; i++) {
    let tokenId = event.params.ids[i];
    let value = event.params.values[i];
    decreaseBalance(event.params.from, tokenId, value, event.block.timestamp, event.block.number);
    increaseBalance(event.params.to, tokenId, value, event.block.timestamp, event.block.number);

    let transfer = new NftTransfer(eventId(event) + "-" + i.toString());
    transfer.operator = event.params.operator;
    transfer.from = event.params.from;
    transfer.to = event.params.to;
    transfer.tokenId = tokenId;
    transfer.value = value;
    transfer.transactionHash = event.transaction.hash;
    transfer.blockNumber = event.block.number;
    transfer.timestamp = event.block.timestamp;
    transfer.save();
  }
}

export function handleApprovalForAll(event: ApprovalForAll): void {
  let id = event.params.owner.toHexString() + "-" + event.params.operator.toHexString();
  let approval = new OperatorApproval(id);
  approval.owner = event.params.owner;
  approval.operator = event.params.operator;
  approval.approved = event.params.approved;
  approval.updatedAt = event.block.timestamp;
  approval.updatedAtBlock = event.block.number;
  approval.save();
}

export function handleCraftRequested(event: CraftRequested): void {
  let id = event.params.requestId.toString();
  let request = new CraftRequest(id);
  request.requestId = event.params.requestId;
  request.user = event.params.user;
  request.ponyId = event.params.ponyId;
  request.fulfilled = false;
  request.transactionHash = event.transaction.hash;
  request.blockNumber = event.block.number;
  request.timestamp = event.block.timestamp;
  request.save();
}

export function handleCraftFulfilled(event: CraftFulfilled): void {
  let requestId = event.params.requestId.toString();
  let request = CraftRequest.load(requestId);
  if (request == null) {
    request = new CraftRequest(requestId);
    request.requestId = event.params.requestId;
    request.user = event.params.user;
    request.ponyId = event.params.ponyId;
    request.transactionHash = event.transaction.hash;
    request.blockNumber = event.block.number;
    request.timestamp = event.block.timestamp;
  }

  let fulfillment = new CraftFulfillment(eventId(event));
  fulfillment.request = requestId;
  fulfillment.requestId = event.params.requestId;
  fulfillment.user = event.params.user;
  fulfillment.ponyId = event.params.ponyId;
  fulfillment.transactionHash = event.transaction.hash;
  fulfillment.blockNumber = event.block.number;
  fulfillment.timestamp = event.block.timestamp;
  fulfillment.save();

  request.fulfilled = true;
  request.fulfillment = fulfillment.id;
  request.save();
}
