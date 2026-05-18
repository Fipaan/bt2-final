import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  ProposalCreated,
  VoteCast,
  ProposalQueued,
  ProposalExecuted,
  ProposalCanceled,
} from "../generated/MyGovernor/MyGovernor";
import { Proposal } from "../generated/schema";

export function handleProposalCreated(event: ProposalCreated): void {
  const id = event.params.proposalId.toString();
  const proposal = new Proposal(id);
  proposal.proposalId = id;
  proposal.proposer = event.params.proposer;
  proposal.description = event.params.description;
  proposal.voteStart = event.params.voteStart;
  proposal.voteEnd = event.params.voteEnd;
  proposal.canceled = false;
  proposal.queued = false;
  proposal.executed = false;
  proposal.forVotes = BigInt.fromI32(0);
  proposal.againstVotes = BigInt.fromI32(0);
  proposal.abstainVotes = BigInt.fromI32(0);
  proposal.voteCount = 0;
  proposal.timestamp = event.block.timestamp;
  proposal.save();
}

export function handleVoteCast(event: VoteCast): void {
  const id = event.params.proposalId.toString();
  const proposal = Proposal.load(id);
  if (!proposal) return;

  if (event.params.support == 0) {
    proposal.againstVotes = proposal.againstVotes.plus(event.params.weight);
  } else if (event.params.support == 1) {
    proposal.forVotes = proposal.forVotes.plus(event.params.weight);
  } else {
    proposal.abstainVotes = proposal.abstainVotes.plus(event.params.weight);
  }
  proposal.voteCount = proposal.voteCount + 1;
  proposal.save();
}

export function handleProposalQueued(event: ProposalQueued): void {
  const proposal = Proposal.load(event.params.proposalId.toString());
  if (!proposal) return;
  proposal.queued = true;
  proposal.save();
}

export function handleProposalExecuted(event: ProposalExecuted): void {
  const proposal = Proposal.load(event.params.proposalId.toString());
  if (!proposal) return;
  proposal.executed = true;
  proposal.save();
}

export function handleProposalCanceled(event: ProposalCanceled): void {
  const proposal = Proposal.load(event.params.proposalId.toString());
  if (!proposal) return;
  proposal.canceled = true;
  proposal.save();
}
