"use client";
import { useEffect, useState } from "react";
import {
    useAccount,
    useReadContracts,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { maxUint256 } from "viem";
import {
    ADDRESSES,
    NFT_RENTAL_VAULT_ABI,
    GOVERNANCE_TOKEN_ABI,
    EQUESTRIA_1155_ABI,
    TOKEN_IDS,
    missingAddressLabels,
} from "@/lib/contracts";
import { friendlyError, missingEnvMessage } from "@/lib/errors";
import { formatAmount, parseAmount } from "@/lib/utils";
import {
    ConnectGuard,
    TxButton,
    Section,
    StatCard,
    InputField,
    Badge,
    Notice,
} from "@/components/ui";

type Mode = "deposit" | "withdraw" | "stake";

export default function VaultPage() {
    const { address } = useAccount();
    const [mode, setMode] = useState<Mode>("deposit");
    const [amount, setAmount] = useState("");
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
    const [error, setError] = useState("");
    const missing = missingAddressLabels([
        "nftRentalVault",
        "governanceToken",
        "equestria1155",
    ]);

    const { writeContractAsync, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash: txHash },
    );

    const { data, refetch } = useReadContracts({
        contracts:
            address && missing.length === 0
                ? [
                      {
                          address: ADDRESSES.nftRentalVault,
                          abi: NFT_RENTAL_VAULT_ABI,
                          functionName: "totalAssets",
                      },
                      {
                          address: ADDRESSES.nftRentalVault,
                          abi: NFT_RENTAL_VAULT_ABI,
                          functionName: "totalSupply",
                      },
                      {
                          address: ADDRESSES.nftRentalVault,
                          abi: NFT_RENTAL_VAULT_ABI,
                          functionName: "boostBps",
                      },
                      {
                          address: ADDRESSES.nftRentalVault,
                          abi: NFT_RENTAL_VAULT_ABI,
                          functionName: "boostedNftId",
                      },
                      {
                          address: ADDRESSES.nftRentalVault,
                          abi: NFT_RENTAL_VAULT_ABI,
                          functionName: "balanceOf",
                          args: [address],
                      },
                      {
                          address: ADDRESSES.nftRentalVault,
                          abi: NFT_RENTAL_VAULT_ABI,
                          functionName: "isRenting",
                          args: [address],
                      },
                      {
                          address: ADDRESSES.governanceToken,
                          abi: GOVERNANCE_TOKEN_ABI,
                          functionName: "balanceOf",
                          args: [address],
                      },
                      {
                          address: ADDRESSES.governanceToken,
                          abi: GOVERNANCE_TOKEN_ABI,
                          functionName: "allowance",
                          args: [address, ADDRESSES.nftRentalVault],
                      },
                      {
                          address: ADDRESSES.equestria1155,
                          abi: EQUESTRIA_1155_ABI,
                          functionName: "balanceOf",
                          args: [address, TOKEN_IDS.PINKIE_PIE],
                      },
                      {
                          address: ADDRESSES.equestria1155,
                          abi: EQUESTRIA_1155_ABI,
                          functionName: "isApprovedForAll",
                          args: [address, ADDRESSES.nftRentalVault],
                      },
                  ]
                : [],
    });

    useEffect(() => {
        if (isSuccess) refetch();
    }, [isSuccess, refetch]);

    const [
        totalAssets,
        totalSupply,
        boostBps,
        boostedNftId,
        shares,
        isRenting,
        govBalance,
        govAllowance,
        pinkieBalance,
        nftApproved,
    ] = (data ?? []).map((d) => d?.result);

    const amountBig = parseAmount(amount);
    const needsApproval = ((govAllowance as bigint) ?? 0n) < amountBig;
    const nftNeedsApproval = !(nftApproved as boolean);
    const boostMultiplier = boostBps ? Number(boostBps as bigint) / 1000 : 1;

    async function handleDeposit() {
        if (!address) return;
        if (missing.length > 0) {
            setError(missingEnvMessage(missing));
            return;
        }
        if (((govBalance as bigint) ?? 0n) < amountBig) {
            setError("Insufficient GOV balance for this deposit.");
            return;
        }
        setError("");
        try {
            if (needsApproval) {
                const approveTx = await writeContractAsync({
                    address: ADDRESSES.governanceToken,
                    abi: GOVERNANCE_TOKEN_ABI,
                    functionName: "approve",
                    args: [ADDRESSES.nftRentalVault, maxUint256],
                });
                setTxHash(approveTx);
                return;
            }
            const depositTx = await writeContractAsync({
                address: ADDRESSES.nftRentalVault,
                abi: NFT_RENTAL_VAULT_ABI,
                functionName: "deposit",
                args: [amountBig, address],
            });
            setTxHash(depositTx);
            setAmount("");
        } catch (err) {
            setError(friendlyError(err));
        }
    }

    async function handleWithdraw() {
        if (!address || !shares) return;
        setError("");
        try {
            const tx = await writeContractAsync({
                address: ADDRESSES.nftRentalVault,
                abi: NFT_RENTAL_VAULT_ABI,
                functionName: "redeem",
                args: [shares as bigint, address, address],
            });
            setTxHash(tx);
            refetch();
        } catch (err) {
            setError(friendlyError(err));
        }
    }

    async function handleStakeNFT() {
        if (!address) return;
        if (missing.length > 0) {
            setError(missingEnvMessage(missing));
            return;
        }
        if (((pinkieBalance as bigint) ?? 0n) < 1n) {
            setError("You need a Pinkie Pie NFT before staking.");
            return;
        }
        setError("");
        try {
            if (nftNeedsApproval) {
                const approvalTx = await writeContractAsync({
                    address: ADDRESSES.equestria1155,
                    abi: EQUESTRIA_1155_ABI,
                    functionName: "setApprovalForAll",
                    args: [ADDRESSES.nftRentalVault, true],
                });
                setTxHash(approvalTx);
                return;
            }
            const tx = await writeContractAsync({
                address: ADDRESSES.nftRentalVault,
                abi: NFT_RENTAL_VAULT_ABI,
                functionName: "stakeNFT",
                args: [(boostedNftId as bigint) ?? TOKEN_IDS.PINKIE_PIE],
            });
            setTxHash(tx);
        } catch (err) {
            setError(friendlyError(err));
        }
    }

    async function handleUnstakeNFT() {
        if (!address) return;
        setError("");
        try {
            const tx = await writeContractAsync({
                address: ADDRESSES.nftRentalVault,
                abi: NFT_RENTAL_VAULT_ABI,
                functionName: "unstakeNFT",
                args: [(boostedNftId as bigint) ?? TOKEN_IDS.PINKIE_PIE],
            });
            setTxHash(tx);
            refetch();
        } catch (err) {
            setError(friendlyError(err));
        }
    }

    const loading = isPending || isConfirming;

    return (
        <ConnectGuard>
            <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fade-in">
                <Section
                    title="NFT Rental Vault"
                    sub="ERC-4626 vault · stake a pony NFT for boosted yield"
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

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard
                            label="Total Assets"
                            value={
                                totalAssets !== undefined
                                    ? formatAmount(totalAssets as bigint)
                                    : "—"
                            }
                            sub="GOV locked"
                        />
                        <StatCard
                            label="Your Shares"
                            value={
                                shares !== undefined
                                    ? formatAmount(shares as bigint)
                                    : "—"
                            }
                            sub="vSHARE"
                            accent
                        />
                        <StatCard
                            label="Yield Boost"
                            value={`${boostMultiplier.toFixed(1)}x`}
                            sub={isRenting ? "Active ✦" : "No NFT staked"}
                        />
                        <StatCard
                            label="Your GOV"
                            value={
                                govBalance !== undefined
                                    ? formatAmount(govBalance as bigint)
                                    : "—"
                            }
                            sub="Available"
                        />
                    </div>

                    {/* NFT Boost panel */}
                    <div
                        className={`card border ${isRenting ? "border-orange/40 bg-orange/5" : "border-border"}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="font-display font-semibold text-white text-sm">
                                    Pony NFT Boost
                                </p>
                                <p className="text-subtext text-xs font-mono mt-0.5">
                                    Stake Pinkie Pie (#
                                    {TOKEN_IDS.PINKIE_PIE.toString()}) for{" "}
                                    {boostMultiplier.toFixed(1)}x yield
                                </p>
                            </div>
                            {isRenting ? (
                                <Badge color="orange">Staked ✦</Badge>
                            ) : (
                                <Badge color="default">Not staked</Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-subtext text-xs font-mono">
                                Pinkie Pie balance:{" "}
                                {pinkieBalance !== undefined
                                    ? (pinkieBalance as bigint).toString()
                                    : "—"}
                            </span>
                            {isRenting ? (
                                <TxButton
                                    onClick={handleUnstakeNFT}
                                    loading={loading}
                                    variant="ghost"
                                >
                                    Unstake NFT
                                </TxButton>
                            ) : (
                                <TxButton
                                    onClick={handleStakeNFT}
                                    loading={loading}
                                    disabled={
                                        ((pinkieBalance as bigint) ?? 0n) === 0n
                                    }
                                >
                                    {nftNeedsApproval
                                        ? "Approve NFT"
                                        : "Stake NFT"}
                                </TxButton>
                            )}
                        </div>
                    </div>

                    {/* Mode tabs */}
                    <div className="card flex flex-col gap-4">
                        <div className="flex gap-2 border-b border-border pb-3">
                            {(["deposit", "withdraw"] as Mode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`text-sm font-mono capitalize px-3 py-1.5 rounded-lg transition-colors ${
                                        mode === m
                                            ? "bg-accent/10 text-accent border border-accent/30"
                                            : "text-subtext hover:text-text"
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        {mode === "deposit" ? (
                            <>
                                <InputField
                                    label="GOV Amount"
                                    value={amount}
                                    onChange={setAmount}
                                    placeholder="0.0"
                                    type="number"
                                    hint={
                                        isRenting
                                            ? `With boost: ~${(Number(amount || 0) * boostMultiplier).toFixed(4)} shares`
                                            : undefined
                                    }
                                />
                                {isSuccess ? (
                                    <div className="bg-green/10 border border-green/40 text-green text-sm font-mono rounded-lg p-3 text-center">
                                        Transaction confirmed.
                                    </div>
                                ) : (
                                    <TxButton
                                        onClick={handleDeposit}
                                        loading={loading}
                                        disabled={!amount || amountBig === 0n}
                                    >
                                        {needsApproval
                                            ? "Approve GOV"
                                            : "Deposit"}
                                    </TxButton>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-subtext font-mono">
                                        Shares to redeem
                                    </span>
                                    <span className="font-mono text-white">
                                        {shares !== undefined
                                            ? formatAmount(shares as bigint)
                                            : "—"}{" "}
                                        vSHARE
                                    </span>
                                </div>
                                {isSuccess ? (
                                    <div className="bg-green/10 border border-green/40 text-green text-sm font-mono rounded-lg p-3 text-center">
                                        Withdrawal successful.
                                    </div>
                                ) : (
                                    <TxButton
                                        onClick={handleWithdraw}
                                        loading={loading}
                                        disabled={
                                            ((shares as bigint) ?? 0n) === 0n
                                        }
                                        variant="ghost"
                                    >
                                        Redeem All Shares
                                    </TxButton>
                                )}
                            </>
                        )}

                        {txHash && (
                            <p className="text-xs font-mono text-subtext break-all">
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
