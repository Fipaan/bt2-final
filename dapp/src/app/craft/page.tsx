"use client";

import { useState } from "react";
import {
    useAccount,
    useReadContracts,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import {
    ADDRESSES,
    ELEMENT_NAMES,
    EQUESTRIA_1155_ABI,
    missingAddressLabels,
    PONY_RECIPES,
    TOKEN_IDS,
} from "@/lib/contracts";
import { friendlyError, missingEnvMessage } from "@/lib/errors";
import { ConnectGuard, Notice, Section, TxButton } from "@/components/ui";

const PONIES = [
    { id: TOKEN_IDS.PINKIE_PIE, name: "Pinkie Pie", icon: "PP" },
    { id: TOKEN_IDS.STARLIGHT_GLIMMER, name: "Starlight Glimmer", icon: "SG" },
];

const ELEMENT_COLORS: Record<string, string> = {
    "1": "text-accent",
    "2": "text-green",
    "3": "text-orange",
    "4": "text-purple",
    "5": "text-red",
    "6": "text-purple",
};

export default function CraftPage() {
    const { address } = useAccount();
    const [selected, setSelected] = useState<bigint>(TOKEN_IDS.PINKIE_PIE);
    const [error, setError] = useState("");
    const missing = missingAddressLabels(["equestria1155"]);

    const {
        writeContractAsync,
        data: txHash,
        isPending,
        reset,
    } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash: txHash },
    );

    const { data: balances } = useReadContracts({
        contracts:
            address && missing.length === 0
                ? [1n, 2n, 3n, 4n, 5n, 6n].map((id) => ({
                      address: ADDRESSES.equestria1155,
                      abi: EQUESTRIA_1155_ABI,
                      functionName: "balanceOf" as const,
                      args: [address, id],
                  }))
                : [],
    });

    const balMap: Record<string, bigint> = {};
    [1n, 2n, 3n, 4n, 5n, 6n].forEach((id, i) => {
        balMap[id.toString()] = (balances?.[i]?.result as bigint) ?? 0n;
    });

    const recipe = PONY_RECIPES[selected.toString()];
    const canCraft =
        recipe &&
        Object.entries(recipe).every(
            ([id, needed]) => (balMap[id] ?? 0n) >= BigInt(needed),
        );

    async function handleCraft() {
        if (missing.length > 0) {
            setError(missingEnvMessage(missing));
            return;
        }
        setError("");
        try {
            await writeContractAsync({
                address: ADDRESSES.equestria1155,
                abi: EQUESTRIA_1155_ABI,
                functionName: "craft",
                args: [selected],
            });
        } catch (err) {
            setError(friendlyError(err));
        }
    }

    return (
        <ConnectGuard>
            <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fade-in">
                <Section
                    title="Crafting Workshop"
                    sub="Burn Elements of Harmony to mint a pony NFT"
                >
                    {missing.length > 0 && (
                        <Notice
                            tone="warning"
                            message={missingEnvMessage(missing)}
                        />
                    )}
                    {error && (
                        <Notice
                            tone="error"
                            message={error}
                        />
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        {PONIES.map(({ id, name, icon }) => (
                            <button
                                key={id.toString()}
                                onClick={() => {
                                    setSelected(id);
                                    reset();
                                }}
                                className={`card text-left transition-all ${
                                    selected === id
                                        ? "border-accent/60 bg-accent/5"
                                        : "hover:border-border/80"
                                }`}
                            >
                                <div className="w-10 h-10 rounded-lg border border-accent/30 bg-accent/10 text-accent font-display font-bold flex items-center justify-center mb-2">
                                    {icon}
                                </div>
                                <p className="font-display font-semibold text-white text-sm">
                                    {name}
                                </p>
                                <p className="text-subtext text-xs font-mono mt-0.5">
                                    ID #{id.toString()}
                                </p>
                            </button>
                        ))}
                    </div>

                    <div className="card">
                        <h3 className="font-display font-semibold text-white text-sm mb-3">
                            Recipe - {ELEMENT_NAMES[selected.toString()]}
                        </h3>
                        <div className="flex flex-col gap-2">
                            {Object.entries(recipe)
                                .filter(([, v]) => v > 0)
                                .map(([id, needed]) => {
                                    const have = balMap[id] ?? 0n;
                                    const enough = have >= BigInt(needed);
                                    return (
                                        <div
                                            key={id}
                                            className="flex items-center justify-between"
                                        >
                                            <span
                                                className={`text-sm font-mono ${ELEMENT_COLORS[id]}`}
                                            >
                                                {ELEMENT_NAMES[id]}
                                            </span>
                                            <span
                                                className={`text-sm font-mono ${enough ? "text-green" : "text-red"}`}
                                            >
                                                {have.toString()} / {needed}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {isSuccess ? (
                            <Notice
                                tone="success"
                                message="Craft successful. Check your inventory."
                            />
                        ) : (
                            <TxButton
                                onClick={handleCraft}
                                loading={isPending || isConfirming}
                                disabled={!canCraft}
                            >
                                {isPending
                                    ? "Confirm in wallet..."
                                    : isConfirming
                                      ? "Minting..."
                                      : canCraft
                                        ? `Craft ${ELEMENT_NAMES[selected.toString()]}`
                                        : "Insufficient elements"}
                            </TxButton>
                        )}
                        {!canCraft && (
                            <p className="text-subtext text-xs font-mono text-center">
                                You need more elements to craft this pony
                            </p>
                        )}
                        {txHash && (
                            <p className="text-xs font-mono text-subtext text-center break-all">
                                Tx:{" "}
                                <span className="text-accent">{txHash}</span>
                            </p>
                        )}
                    </div>
                </Section>
            </main>
        </ConnectGuard>
    );
}
