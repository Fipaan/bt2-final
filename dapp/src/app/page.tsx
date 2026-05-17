"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount, useReadContracts } from "wagmi";
import {
  ADDRESSES,
  AMM_ABI,
  EQUESTRIA_1155_ABI,
  GOVERNANCE_TOKEN_ABI,
  missingAddressLabels,
  NFT_RENTAL_VAULT_ABI,
  TOKEN_IDS,
} from "@/lib/contracts";
import { friendlyError, missingEnvMessage } from "@/lib/errors";
import { fetchRecentActivity } from "@/lib/subgraph";
import { formatAmount, shortenAddress } from "@/lib/utils";
import { Badge, ConnectGuard, Notice, Section, StatCard } from "@/components/ui";

type RecentActivity = Awaited<ReturnType<typeof fetchRecentActivity>>;

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [activity, setActivity] = useState<RecentActivity | null>(null);
  const [activityError, setActivityError] = useState("");

  const missing = missingAddressLabels([
    "governanceToken",
    "nftRentalVault",
    "equestria1155",
    "amm",
  ]);

  const { data } = useReadContracts({
    contracts: address && missing.length === 0 ? [
      { address: ADDRESSES.governanceToken, abi: GOVERNANCE_TOKEN_ABI, functionName: "balanceOf", args: [address] },
      { address: ADDRESSES.governanceToken, abi: GOVERNANCE_TOKEN_ABI, functionName: "getVotes", args: [address] },
      { address: ADDRESSES.governanceToken, abi: GOVERNANCE_TOKEN_ABI, functionName: "delegates", args: [address] },
      { address: ADDRESSES.nftRentalVault, abi: NFT_RENTAL_VAULT_ABI, functionName: "balanceOf", args: [address] },
      { address: ADDRESSES.nftRentalVault, abi: NFT_RENTAL_VAULT_ABI, functionName: "isRenting", args: [address] },
      { address: ADDRESSES.amm, abi: AMM_ABI, functionName: "reserveA" },
      { address: ADDRESSES.amm, abi: AMM_ABI, functionName: "reserveB" },
      { address: ADDRESSES.equestria1155, abi: EQUESTRIA_1155_ABI, functionName: "balanceOf", args: [address, TOKEN_IDS.PINKIE_PIE] },
    ] : [],
  });

  useEffect(() => {
    let cancelled = false;
    fetchRecentActivity()
      .then((next) => {
        if (!cancelled) {
          setActivity(next);
          setActivityError("");
        }
      })
      .catch((error) => {
        if (!cancelled) setActivityError(friendlyError(error));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [govBal, govVotes, delegate, vaultShares, isRenting, reserveA, reserveB, pinkie] =
    (data ?? []).map((d) => d?.result);

  const quickLinks = [
    { href: "/craft", label: "Craft a Pony", desc: "Burn elements, mint a pony NFT", color: "text-purple" },
    { href: "/amm", label: "Swap Tokens", desc: "Trade on the AMM marketplace", color: "text-green" },
    { href: "/vault", label: "Stake & Earn", desc: "Deposit GOV tokens, earn yield boost", color: "text-orange" },
    { href: "/dao", label: "Vote on Proposals", desc: "Govern protocol parameters", color: "text-accent" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple/5 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-white">
              GameFi<span className="text-accent">Economy</span>
            </h1>
            <p className="text-subtext mt-1 font-body">
              ERC-1155 on-chain item economy · craft · trade · govern
            </p>
            {isConnected && address && (
              <p className="text-xs font-mono text-subtext mt-2">
                Connected: <span className="text-accent">{shortenAddress(address)}</span>
              </p>
            )}
          </div>
          <ConnectButton />
        </div>
      </div>

      {missing.length > 0 && <Notice tone="warning" message={missingEnvMessage(missing)} />}

      <ConnectGuard>
        <Section title="Portfolio" sub="Wallet, voting, vault, and protocol state">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="GOV Balance" value={govBal !== undefined ? formatAmount(govBal as bigint) : "-"} />
            <StatCard label="Voting Power" value={govVotes !== undefined ? formatAmount(govVotes as bigint) : "-"} accent />
            <StatCard label="Vault Shares" value={vaultShares !== undefined ? formatAmount(vaultShares as bigint) : "-"} />
            <StatCard label="Pinkie Pie" value={pinkie !== undefined ? (pinkie as bigint).toString() : "-"} sub="ERC-1155 balance" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatCard label="Delegate" value={delegate ? shortenAddress(delegate as string) : "-"} />
            <StatCard label="AMM Reserve A" value={reserveA !== undefined ? formatAmount(reserveA as bigint) : "-"} />
            <StatCard label="AMM Reserve B" value={reserveB !== undefined ? formatAmount(reserveB as bigint) : "-"} sub={isRenting ? "NFT boost active" : "No NFT boost"} />
          </div>
        </Section>

        <Section title="Indexed Activity" sub="Loaded from The Graph">
          {activityError ? (
            <Notice tone="warning" message={activityError} />
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              <div className="card flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-white text-sm">Recent Swaps</h3>
                  <Badge color="green">{activity?.swaps.length ?? 0}</Badge>
                </div>
                {(activity?.swaps ?? []).map((swap) => (
                  <div key={swap.id} className="flex items-center justify-between text-xs font-mono border-t border-border pt-2">
                    <span className="text-subtext">{shortenAddress(swap.trader)}</span>
                    <span className="text-green">{formatAmount(BigInt(swap.amountIn))} in</span>
                  </div>
                ))}
                {activity && activity.swaps.length === 0 && <p className="text-subtext text-xs font-mono">No indexed swaps yet.</p>}
              </div>
              <div className="card flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-white text-sm">Craft Requests</h3>
                  <Badge color="purple">{activity?.crafts.length ?? 0}</Badge>
                </div>
                {(activity?.crafts ?? []).map((craft) => (
                  <div key={craft.id} className="flex items-center justify-between text-xs font-mono border-t border-border pt-2">
                    <span className="text-subtext">{shortenAddress(craft.user)}</span>
                    <span className="text-purple">Pony #{craft.ponyId}</span>
                  </div>
                ))}
                {activity && activity.crafts.length === 0 && <p className="text-subtext text-xs font-mono">No indexed crafts yet.</p>}
              </div>
            </div>
          )}
        </Section>

        <Section title="Protocol" sub="Core workflows">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="card hover:border-accent/40 transition-colors">
                <p className={`font-display font-semibold text-sm ${link.color}`}>{link.label}</p>
                <p className="text-subtext text-xs mt-1">{link.desc}</p>
              </Link>
            ))}
          </div>
        </Section>
      </ConnectGuard>
    </main>
  );
}
