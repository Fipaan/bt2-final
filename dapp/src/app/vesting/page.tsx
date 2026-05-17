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
    missingAddressLabels,
    TOKEN_VESTING_ABI,
} from "@/lib/contracts";
import { friendlyError, missingEnvMessage } from "@/lib/errors";
import { formatAmount, shortenAddress } from "@/lib/utils";
import {
    ConnectGuard,
    Notice,
    Section,
    StatCard,
    TxButton,
} from "@/components/ui";

const DURATION = 365 * 24 * 60 * 60;

export default function VestingPage() {
    const { address } = useAccount();
    const [error, setError] = useState("");
    const missing = missingAddressLabels(["vesting"]);

    const { data, refetch } = useReadContracts({
        contracts:
            missing.length === 0
                ? [
                      {
                          address: ADDRESSES.vesting,
                          abi: TOKEN_VESTING_ABI,
                          functionName: "vestedAmount",
                      },
                      {
                          address: ADDRESSES.vesting,
                          abi: TOKEN_VESTING_ABI,
                          functionName: "released",
                      },
                      {
                          address: ADDRESSES.vesting,
                          abi: TOKEN_VESTING_ABI,
                          functionName: "start",
                      },
                      {
                          address: ADDRESSES.vesting,
                          abi: TOKEN_VESTING_ABI,
                          functionName: "beneficiary",
                      },
                  ]
                : [],
    });

    const [vestedAmount, released, start, beneficiary] = (data ?? []).map(
        (d) => d?.result,
    );
    const vested = (vestedAmount as bigint) ?? 0n;
    const rel = (released as bigint) ?? 0n;
    const startTs = (start as bigint) ?? 0n;
    const claimable = vested > rel ? vested - rel : 0n;
    const now = BigInt(Math.floor(Date.now() / 1000));
    const elapsed = now > startTs ? now - startTs : 0n;
    const progressPct =
        startTs > 0n
            ? Math.min(100, Number((elapsed * 100n) / BigInt(DURATION)))
            : 0;
    const endDate =
        startTs > 0n
            ? new Date(
                  Number(startTs + BigInt(DURATION)) * 1000,
              ).toLocaleDateString()
            : "-";
    const isBeneficiary =
        !!address &&
        typeof beneficiary === "string" &&
        address.toLowerCase() === beneficiary.toLowerCase();

    const { writeContractAsync, data: txHash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash: txHash },
    );

    async function handleRelease() {
        if (missing.length > 0) {
            setError(missingEnvMessage(missing));
            return;
        }
        setError("");
        try {
            await writeContractAsync({
                address: ADDRESSES.vesting,
                abi: TOKEN_VESTING_ABI,
                functionName: "release",
            });
            refetch();
        } catch (err) {
            setError(friendlyError(err));
        }
    }

    return (
        <ConnectGuard>
            <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fade-in">
                <Section
                    title="Token Vesting"
                    sub="Linear vesting over 365 days"
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
                        <StatCard
                            label="Vested"
                            value={formatAmount(vested)}
                            sub="GOV unlocked so far"
                            accent
                        />
                        <StatCard
                            label="Released"
                            value={formatAmount(rel)}
                            sub="Already claimed"
                        />
                        <StatCard
                            label="Claimable"
                            value={formatAmount(claimable)}
                            sub="Available to release"
                        />
                        <StatCard
                            label="Vesting ends"
                            value={endDate}
                            sub="Full unlock date"
                        />
                    </div>

                    <div className="card flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs font-mono text-subtext">
                            <span>Progress</span>
                            <span className="text-accent">
                                {progressPct.toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent rounded-full transition-all duration-500"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono text-subtext">
                            <span>
                                Start:{" "}
                                {startTs > 0n
                                    ? new Date(
                                          Number(startTs) * 1000,
                                      ).toLocaleDateString()
                                    : "-"}
                            </span>
                            <span>End: {endDate}</span>
                        </div>
                    </div>

                    <div className="card flex items-center justify-between">
                        <div>
                            <p className="text-xs font-mono text-subtext uppercase tracking-widest">
                                Beneficiary
                            </p>
                            <p className="font-mono text-sm text-white mt-1">
                                {beneficiary
                                    ? shortenAddress(beneficiary as string)
                                    : "-"}
                                {isBeneficiary && (
                                    <span className="text-green ml-2">
                                        (you)
                                    </span>
                                )}
                            </p>
                        </div>
                        {!isBeneficiary && address && (
                            <span className="text-xs font-mono text-subtext">
                                Not your vesting
                            </span>
                        )}
                    </div>

                    {isSuccess ? (
                        <Notice
                            tone="success"
                            message="Tokens released successfully."
                        />
                    ) : (
                        <TxButton
                            onClick={handleRelease}
                            loading={isPending || isConfirming}
                            disabled={claimable === 0n || !isBeneficiary}
                        >
                            {!isBeneficiary
                                ? "Only beneficiary can release"
                                : claimable === 0n
                                  ? "Nothing to release yet"
                                  : `Release ${formatAmount(claimable)} GOV`}
                        </TxButton>
                    )}

                    {txHash && (
                        <p className="text-xs font-mono text-subtext break-all">
                            Tx: <span className="text-accent">{txHash}</span>
                        </p>
                    )}
                </Section>
            </main>
        </ConnectGuard>
    );
}
