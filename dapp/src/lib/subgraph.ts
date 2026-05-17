import { SUBGRAPH_URL } from "@/lib/contracts";

export type IndexedProposal = {
  id: string;
  proposalId: string;
  proposer: `0x${string}`;
  description: string;
  voteStart: string;
  voteEnd: string;
  canceled: boolean;
  queued: boolean;
  executed: boolean;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  voteCount: string;
  timestamp: string;
};

export async function graphQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!SUBGRAPH_URL) {
    throw new Error("NEXT_PUBLIC_SUBGRAPH_URL is not configured.");
  }

  const response = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Subgraph request failed with HTTP ${response.status}.`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "Subgraph returned an error.");
  }

  return json.data as T;
}

export async function fetchIndexedProposals(): Promise<IndexedProposal[]> {
  const data = await graphQuery<{ proposals: IndexedProposal[] }>(`
    query FrontendProposals {
      proposals(first: 25, orderBy: timestamp, orderDirection: desc) {
        id
        proposalId
        proposer
        description
        voteStart
        voteEnd
        canceled
        queued
        executed
        forVotes
        againstVotes
        abstainVotes
        voteCount
        timestamp
      }
    }
  `);
  return data.proposals;
}

export async function fetchRecentActivity(): Promise<{
  swaps: Array<{ id: string; trader: string; amountIn: string; amountOut: string; timestamp: string }>;
  crafts: Array<{ id: string; user: string; ponyId: string; timestamp: string }>;
}> {
  return graphQuery<{
    swaps: Array<{ id: string; trader: string; amountIn: string; amountOut: string; timestamp: string }>;
    crafts: Array<{ id: string; user: string; ponyId: string; timestamp: string }>;
  }>(`
    query RecentProtocolActivity {
      swaps: swapEvents(first: 5, orderBy: timestamp, orderDirection: desc) {
        id
        trader
        amountIn
        amountOut
        timestamp
      }
      crafts: craftRequests(first: 5, orderBy: timestamp, orderDirection: desc) {
        id
        user
        ponyId
        timestamp
      }
    }
  `);
}
