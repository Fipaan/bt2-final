import { RandomFulfilled, RandomRequested } from "../generated/VRFConsumer/VRFConsumer";
import { RandomRequest } from "../generated/schema";

export function handleRandomRequested(event: RandomRequested): void {
  let id = event.params.requestId.toString();
  let request = new RandomRequest(id);
  request.requestId = event.params.requestId;
  request.sender = event.params.sender;
  request.fulfilled = false;
  request.requestedTx = event.transaction.hash;
  request.requestedAt = event.block.timestamp;
  request.requestedAtBlock = event.block.number;
  request.save();
}

export function handleRandomFulfilled(event: RandomFulfilled): void {
  let id = event.params.requestId.toString();
  let request = RandomRequest.load(id);
  if (request == null) {
    request = new RandomRequest(id);
    request.requestId = event.params.requestId;
    request.sender = event.address;
    request.fulfilled = false;
    request.requestedTx = event.transaction.hash;
    request.requestedAt = event.block.timestamp;
    request.requestedAtBlock = event.block.number;
  }
  request.fulfilled = true;
  request.randomWord = event.params.randomWord;
  request.fulfilledTx = event.transaction.hash;
  request.fulfilledAt = event.block.timestamp;
  request.fulfilledAtBlock = event.block.number;
  request.save();
}
