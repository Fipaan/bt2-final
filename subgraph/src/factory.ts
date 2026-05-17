import { TokenCreated } from "../generated/GameTokenFactory/GameTokenFactory";
import { CreatedToken } from "../generated/schema";
import { eventId } from "./helpers";

export function handleTokenCreated(event: TokenCreated): void {
  let entity = new CreatedToken(eventId(event));
  entity.token = event.params.token;
  entity.salt = event.params.salt;
  entity.create2 = event.params.create2;
  entity.transactionHash = event.transaction.hash;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.save();
}
