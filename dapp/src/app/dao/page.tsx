"use client";

import { useEffect, useMemo, useState } from "react";
import {
    useAccount,
    useReadContracts,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import {
    ADDRESSES,
    GOVERNANCE_TOKEN_ABI,
    GOVERNOR_ABI,
    missingAddressLabels,
} from "@/lib/contracts";
import { friendlyError, missingEnvMessage } from "@/lib/errors";
import { fetchIndexedProposals, type IndexedProposal } from "@/lib/subgraph";
import {
    formatAmount,
    PROPOSAL_STATES,
    shortenAddress,
    SUPPORT_LABELS,
} from "@/lib/utils";
import {
    Badge,
    ConnectGuard,
    EmptyState,
    Notice,
    Section,
    StatCard,
    TxButton,
} from "@/components/ui";

function stateColor(
    state: number,
): "green" | "orange" | "red" | "accent" | "purple" | "default" {
    if (state === 1) return "green";
    if (state === 0) return "orange";
    if (state === 3) return "red";
    if (state === 4 || state === 5) return "accent";
    if (state === 7) return "purple";
    return "default";
}

export default function DAOPage() {
    const { address } = useAccount();
    const [proposals, setProposals] = useState<IndexedProposal[]>([]);
    const [proposalError, setProposalError] = useState("");
    const [activeProposalId, setActiveProposalId] = useState<string | null>(
        null,
    );
    const [support, setSupport] = useState<0 | 1 | 2>(1);
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
    const [txError, setTxError] = useState("");

    const { writeContractAsync, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash: txHash },
    );
    const missing = missingAddressLabels(["governanceToken", "myGovernor"]);

    useEffect(() => {
        let cancelled = false;
        fetchIndexedProposals()
            .then((next) => {
                if (!cancelled) {
                    setProposals(next);
                    setProposalError("");
                }
            })
            .catch((error) => {
                if (!cancelled) setProposalError(friendlyError(error));
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const proposalReads = useMemo(() => {
        if (!address || missing.length > 0) return [];
        return proposals.flatMap((proposal) => {
            const proposalId = BigInt(proposal.proposalId);
            return [
                {
                    address: ADDRESSES.myGovernor,
                    abi: GOVERNOR_ABI,
                    functionName: "state",
                    args: [proposalId],
                },
                {
                    address: ADDRESSES.myGovernor,
                    abi: GOVERNOR_ABI,
                    functionName: "proposalVotes",
                    args: [proposalId],
                },
                {
                    address: ADDRESSES.myGovernor,
                    abi: GOVERNOR_ABI,
                    functionName: "hasVoted",
                    args: [proposalId, address],
                },
            ];
        });
    }, [address, missing.length, proposals]);

    const { data, refetch } = useReadContracts({
        contracts:
            address && missing.length === 0
                ? [
                      {
                          address: ADDRESSES.governanceToken,
                          abi: GOVERNANCE_TOKEN_ABI,
                          functionName: "balanceOf",
                          args: [address],
                      },
                      {
                          address: ADDRESSES.governanceToken,
                          abi: GOVERNANCE_TOKEN_ABI,
                          functionName: "getVotes",
                          args: [address],
                      },
                      {
                          address: ADDRESSES.governanceToken,
                          abi: GOVERNANCE_TOKEN_ABI,
                          functionName: "delegates",
                          args: [address],
                      },
                      {
                          address: ADDRESSES.myGovernor,
                          abi: GOVERNOR_ABI,
                          functionName: "votingDelay",
                      },
                      {
                          address: ADDRESSES.myGovernor,
                          abi: GOVERNOR_ABI,
                          functionName: "votingPeriod",
                      },
                      ...proposalReads,
                  ]
                : [],
    });

    useEffect(() => {
        if (isSuccess) refetch();
    }, [isSuccess, refetch]);

    const [govBal, govVotes, delegate, votingDelay, votingPeriod] = (data ?? [])
        .slice(0, 5)
        .map((d) => d?.result);
    const liveProposalData = (data ?? []).slice(5);
    const isSelfDelegated =
        !!address &&
        typeof delegate === "string" &&
        delegate.toLowerCase() === address.toLowerCase();
    const loading = isPending || isConfirming;

    async function handleDelegate() {
        if (!address) return;
        setTxError("");
        try {
            const tx = await writeContractAsync({
                address: ADDRESSES.governanceToken,
                abi: GOVERNANCE_TOKEN_ABI,
                functionName: "delegate",
                args: [address],
            });
            setTxHash(tx);
        } catch (error) {
            setTxError(friendlyError(error));
        }
    }

    async function handleVote(proposalId: string) {
        if (!address) return;
        setTxError("");
        try {
            const tx = await writeContractAsync({
                address: ADDRESSES.myGovernor,
                abi: GOVERNOR_ABI,
                functionName: "castVote",
                args: [BigInt(proposalId), support],
            });
            setTxHash(tx);
        } catch (error) {
            setTxError(friendlyError(error));
        }
    }

    return (
        <ConnectGuard>
            <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fade-in">
                <Section
                    title="DAO Governance"
                    sub="Indexed proposals · live Governor state · wallet voting"
                >
                    {missing.length > 0 && (
                        <Notice
                            tone="warning"
                            message={missingEnvMessage(missing)}
                        />
                    )}
                    {proposalError && (
                        <Notice
                            tone="warning"
                            message={proposalError}
                        />
                    )}
                    {txError && (
                        <Notice
                            tone="error"
                            message={txError}
                        />
                    )}
                    {txHash && isSuccess && (
                        <Notice
                            tone="success"
                            message="Transaction confirmed."
                        />
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard
                            label="GOV Balance"
                            value={
                                govBal !== undefined
                                    ? formatAmount(govBal as bigint)
                                    : "-"
                            }
                        />
                        <StatCard
                            label="Voting Power"
                            value={
                                govVotes !== undefined
                                    ? formatAmount(govVotes as bigint)
                                    : "-"
                            }
                            accent
                        />
                        <StatCard
                            label="Voting Delay"
                            value={
                                votingDelay !== undefined
                                    ? `${votingDelay} blocks`
                                    : "-"
                            }
                        />
                        <StatCard
                            label="Voting Period"
                            value={
                                votingPeriod !== undefined
                                    ? `${votingPeriod} blocks`
                                    : "-"
                            }
                        />
                    </div>

                    {!isSelfDelegated && (
                        <div className="card border-orange/40 bg-orange/5 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-orange font-display font-semibold text-sm">
                                    Delegate your votes
                                </p>
                                <p className="text-subtext text-xs font-mono mt-0.5">
                                    Current delegate:{" "}
                                    {delegate
                                        ? shortenAddress(delegate as string)
                                        : "none"}
                                </p>
                            </div>
                            <TxButton
                                onClick={handleDelegate}
                                loading={loading}
                            >
                                Self-delegate
                            </TxButton>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {proposals.length === 0 && !proposalError && (
                            <EmptyState message="No proposals indexed yet." />
                        )}
                        {proposals.map((proposal, index) => {
                            const base = index * 3;
                            const rawState = liveProposalData[base]?.result as
                                | bigint
                                | number
                                | undefined;
                            const liveState =
                                rawState !== undefined
                                    ? Number(rawState)
                                    : undefined;
                            const liveVotes = liveProposalData[base + 1]
                                ?.result as
                                | readonly [bigint, bigint, bigint]
                                | undefined;
                            const hasVoted =
                                (liveProposalData[base + 2]?.result as
                                    | boolean
                                    | undefined) ?? false;
                            const state =
                                liveState ??
                                (proposal.executed
                                    ? 7
                                    : proposal.canceled
                                      ? 2
                                      : proposal.queued
                                        ? 5
                                        : 0);
                            const againstVotes =
                                liveVotes?.[0] ?? BigInt(proposal.againstVotes);
                            const forVotes =
                                liveVotes?.[1] ?? BigInt(proposal.forVotes);
                            const abstainVotes =
                                liveVotes?.[2] ?? BigInt(proposal.abstainVotes);
                            const total =
                                forVotes + againstVotes + abstainVotes;
                            const forPct =
                                total > 0n
                                    ? Number((forVotes * 100n) / total)
                                    : 0;
                            const isActive = state === 1;
                            const isOpen =
                                activeProposalId === proposal.proposalId;

                            return (
                                <div
                                    key={proposal.id}
                                    className={`card cursor-pointer transition-all hover:border-accent/40 ${
                                        isOpen
                                            ? "border-accent/60 bg-accent/5"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setActiveProposalId(
                                            isOpen ? null : proposal.proposalId,
                                        )
                                    }
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <p className="font-body text-sm text-white leading-snug">
                                                {proposal.description}
                                            </p>
                                            <p className="text-subtext text-xs font-mono mt-1">
                                                By{" "}
                                                {shortenAddress(
                                                    proposal.proposer,
                                                )}
                                            </p>
                                        </div>
                                        <Badge color={stateColor(state)}>
                                            {PROPOSAL_STATES[state]?.label ??
                                                "Unknown"}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between text-xs font-mono text-subtext">
                                            <span className="text-green">
                                                For {forPct.toFixed(1)}%
                                            </span>
                                            <span className="text-red">
                                                Against{" "}
                                                {total > 0n
                                                    ? (100 - forPct).toFixed(1)
                                                    : 0}
                                                %
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green rounded-full transition-all"
                                                style={{ width: `${forPct}%` }}
                                            />
                                        </div>
                                        <div className="flex gap-4 text-xs font-mono text-subtext">
                                            <span>
                                                {formatAmount(forVotes)} For
                                            </span>
                                            <span>
                                                {formatAmount(againstVotes)}{" "}
                                                Against
                                            </span>
                                            <span>
                                                {formatAmount(abstainVotes)}{" "}
                                                Abstain
                                            </span>
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div
                                            className="mt-4 pt-4 border-t border-border flex flex-col gap-3"
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >
                                            <div className="flex gap-2">
                                                {([1, 0, 2] as const).map(
                                                    (nextSupport) => (
                                                        <button
                                                            key={nextSupport}
                                                            onClick={() =>
                                                                setSupport(
                                                                    nextSupport,
                                                                )
                                                            }
                                                            className={`flex-1 text-xs font-mono py-2 rounded-lg border transition-colors ${
                                                                support ===
                                                                nextSupport
                                                                    ? nextSupport ===
                                                                      1
                                                                        ? "border-green/40 bg-green/10 text-green"
                                                                        : nextSupport ===
                                                                            0
                                                                          ? "border-red/40 bg-red/10 text-red"
                                                                          : "border-subtext/40 bg-surface2 text-subtext"
                                                                    : "border-border text-subtext hover:text-text"
                                                            }`}
                                                        >
                                                            {
                                                                SUPPORT_LABELS[
                                                                    nextSupport
                                                                ]
                                                            }
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                            <TxButton
                                                onClick={() =>
                                                    handleVote(
                                                        proposal.proposalId,
                                                    )
                                                }
                                                loading={loading}
                                                disabled={
                                                    !isActive ||
                                                    !isSelfDelegated ||
                                                    hasVoted
                                                }
                                            >
                                                {hasVoted
                                                    ? "Already voted"
                                                    : !isActive
                                                      ? "Voting closed"
                                                      : isSelfDelegated
                                                        ? `Vote ${SUPPORT_LABELS[support]}`
                                                        : "Delegate first to vote"}
                                            </TxButton>
                                            {txHash && (
                                                <p className="text-xs font-mono text-subtext break-all">
                                                    Tx:{" "}
                                                    <span className="text-accent">
                                                        {txHash}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Section>
            </main>
        </ConnectGuard>
    );
}
