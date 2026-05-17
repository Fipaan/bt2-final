"use client";
import { useAccount, useReadContracts } from "wagmi";
import {
    ADDRESSES,
    EQUESTRIA_1155_ABI,
    TOKEN_IDS,
    ELEMENT_NAMES,
} from "@/lib/contracts";
import { ConnectGuard, Section, EmptyState } from "@/components/ui";

const ALL_TOKENS = [
    { id: TOKEN_IDS.HONESTY, emoji: "💙", color: "#58A6FF", type: "Element" },
    { id: TOKEN_IDS.KINDNESS, emoji: "💚", color: "#3FB950", type: "Element" },
    { id: TOKEN_IDS.LAUGHTER, emoji: "💛", color: "#E3B341", type: "Element" },
    {
        id: TOKEN_IDS.GENEROSITY,
        emoji: "💜",
        color: "#BC8CFF",
        type: "Element",
    },
    { id: TOKEN_IDS.LOYALTY, emoji: "❤️", color: "#F85149", type: "Element" },
    { id: TOKEN_IDS.MAGIC, emoji: "✨", color: "#BC8CFF", type: "Element" },
    {
        id: TOKEN_IDS.PINKIE_PIE,
        emoji: "🎉",
        color: "#E3B341",
        type: "Pony NFT",
    },
    {
        id: TOKEN_IDS.STARLIGHT_GLIMMER,
        emoji: "🌟",
        color: "#BC8CFF",
        type: "Pony NFT",
    },
];

export default function InventoryPage() {
    const { address } = useAccount();

    const { data } = useReadContracts({
        contracts: address
            ? ALL_TOKENS.map(({ id }) => ({
                  address: ADDRESSES.equestria1155,
                  abi: EQUESTRIA_1155_ABI,
                  functionName: "balanceOf" as const,
                  args: [address, id],
              }))
            : [],
    });

    const tokensWithBalance = ALL_TOKENS.map((t, i) => ({
        ...t,
        balance: (data?.[i]?.result as bigint) ?? 0n,
        name: ELEMENT_NAMES[t.id.toString()],
    }));

    const hasAny = tokensWithBalance.some((t) => t.balance > 0n);

    return (
        <ConnectGuard>
            <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fade-in">
                <Section
                    title="Inventory"
                    sub="Your ERC-1155 token balances on Equestria1155"
                >
                    {hasAny ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {tokensWithBalance.map(
                                ({ id, emoji, color, type, name, balance }) => (
                                    <div
                                        key={id.toString()}
                                        className="card flex flex-col items-center gap-2 text-center"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                                            style={{
                                                background: color + "22",
                                                border: `1px solid ${color}44`,
                                            }}
                                        >
                                            {emoji}
                                        </div>
                                        <div>
                                            <p className="font-display font-semibold text-white text-sm">
                                                {name}
                                            </p>
                                            <p className="text-subtext text-xs font-mono">
                                                #{id.toString()} · {type}
                                            </p>
                                        </div>
                                        <p
                                            className="font-mono font-bold text-xl"
                                            style={{ color }}
                                        >
                                            {balance.toString()}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    ) : (
                        <EmptyState message="No items found — craft some ponies or get minted elements" />
                    )}
                </Section>
            </main>
        </ConnectGuard>
    );
}
