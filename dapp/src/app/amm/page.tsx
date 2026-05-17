"use client";
import { useEffect, useState } from "react";
import {
    useAccount,
    useReadContracts,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, maxUint256 } from "viem";
import {
    ADDRESSES,
    AMM_ABI,
    ERC20_ABI,
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
    Notice,
} from "@/components/ui";

type Step = "idle" | "approving" | "swapping";

export default function AMMPage() {
    const { address } = useAccount();
    const [amountIn, setAmountIn] = useState("");
    const [direction, setDirection] = useState<"AtoB" | "BtoA">("AtoB");
    const [step, setStep] = useState<Step>("idle");
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
    const [error, setError] = useState("");
    const missing = missingAddressLabels(["amm", "tokenA", "tokenB"]);

    const { writeContractAsync } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        { hash: txHash },
    );

    const { data, refetch } = useReadContracts({
        contracts:
            address && missing.length === 0
                ? [
                      {
                          address: ADDRESSES.amm,
                          abi: AMM_ABI,
                          functionName: "reserveA",
                      },
                      {
                          address: ADDRESSES.amm,
                          abi: AMM_ABI,
                          functionName: "reserveB",
                      },
                      {
                          address: ADDRESSES.amm,
                          abi: AMM_ABI,
                          functionName: "tokenA",
                      },
                      {
                          address: ADDRESSES.amm,
                          abi: AMM_ABI,
                          functionName: "tokenB",
                      },
                      {
                          address: ADDRESSES.tokenA,
                          abi: ERC20_ABI,
                          functionName: "balanceOf",
                          args: [address],
                      },
                      {
                          address: ADDRESSES.tokenA,
                          abi: ERC20_ABI,
                          functionName: "symbol",
                      },
                      {
                          address: ADDRESSES.tokenA,
                          abi: ERC20_ABI,
                          functionName: "allowance",
                          args: [address, ADDRESSES.amm],
                      },
                      {
                          address: ADDRESSES.tokenB,
                          abi: ERC20_ABI,
                          functionName: "balanceOf",
                          args: [address],
                      },
                      {
                          address: ADDRESSES.tokenB,
                          abi: ERC20_ABI,
                          functionName: "symbol",
                      },
                      {
                          address: ADDRESSES.tokenB,
                          abi: ERC20_ABI,
                          functionName: "allowance",
                          args: [address, ADDRESSES.amm],
                      },
                  ]
                : [],
    });

    useEffect(() => {
        if (isSuccess) refetch();
    }, [isSuccess, refetch]);

    const [
        resA,
        resB,
        ,
        ,
        tokenABal,
        tokenASymbol,
        allowanceA,
        tokenBBal,
        tokenBSymbol,
        allowanceB,
    ] = (data ?? []).map((d) => d?.result);
    const reserveA = (resA as bigint) ?? 0n;
    const reserveB = (resB as bigint) ?? 0n;

    const amountInBig = parseAmount(amountIn);
    const estimatedOut =
        amountInBig > 0n && reserveA > 0n && reserveB > 0n
            ? direction === "AtoB"
                ? (amountInBig * 997n * reserveB) /
                  (reserveA * 1000n + amountInBig * 997n)
                : (amountInBig * 997n * reserveA) /
                  (reserveB * 1000n + amountInBig * 997n)
            : 0n;

    const tokenBal = direction === "AtoB" ? tokenABal : tokenBBal;
    const tokenSymbol = direction === "AtoB" ? tokenASymbol : tokenBSymbol;
    const allowance = direction === "AtoB" ? allowanceA : allowanceB;
    const needsApproval = ((allowance as bigint) ?? 0n) < amountInBig;

    async function handleSwap() {
        if (!address) return;
        if (missing.length > 0) {
            setError(missingEnvMessage(missing));
            return;
        }
        if (((tokenBal as bigint) ?? 0n) < amountInBig) {
            setError("Insufficient token balance for this swap.");
            return;
        }
        setError("");
        try {
            if (needsApproval) {
                setStep("approving");
                const approveTx = await writeContractAsync({
                    address:
                        direction === "AtoB"
                            ? ADDRESSES.tokenA
                            : ADDRESSES.tokenB,
                    abi: ERC20_ABI,
                    functionName: "approve",
                    args: [ADDRESSES.amm, maxUint256],
                });
                setTxHash(approveTx);
                setStep("idle");
                return;
            }
            setStep("swapping");
            const tokenIn =
                direction === "AtoB" ? ADDRESSES.tokenA : ADDRESSES.tokenB;
            const minOut = (estimatedOut * 95n) / 100n; // 5% slippage
            const swapTx = await writeContractAsync({
                address: ADDRESSES.amm,
                abi: AMM_ABI,
                functionName: "swap",
                args: [tokenIn, amountInBig, minOut],
            });
            setTxHash(swapTx);
            setStep("idle");
        } catch (err) {
            setError(friendlyError(err));
            setStep("idle");
        }
    }

    return (
        <ConnectGuard>
            <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fade-in">
                <Section
                    title="AMM Marketplace"
                    sub="Constant-product AMM · 0.3% fee"
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
                    {/* Pool stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard
                            label="Reserve A"
                            value={formatAmount(reserveA)}
                            sub="Token A"
                        />
                        <StatCard
                            label="Reserve B"
                            value={formatAmount(reserveB)}
                            sub="Token B"
                        />
                    </div>

                    {/* Swap card */}
                    <div className="card flex flex-col gap-4">
                        {/* Direction toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setDirection("AtoB")}
                                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                                    direction === "AtoB"
                                        ? "border-accent/40 text-accent bg-accent/10"
                                        : "border-border text-subtext hover:text-text"
                                }`}
                            >
                                A → B
                            </button>
                            <button
                                onClick={() => setDirection("BtoA")}
                                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                                    direction === "BtoA"
                                        ? "border-accent/40 text-accent bg-accent/10"
                                        : "border-border text-subtext hover:text-text"
                                }`}
                            >
                                B → A
                            </button>
                            <span className="text-subtext text-xs font-mono ml-auto">
                                Balance:{" "}
                                {tokenBal !== undefined
                                    ? formatAmount(tokenBal as bigint)
                                    : "—"}{" "}
                                {(tokenSymbol as string) ?? ""}
                            </span>
                        </div>

                        <InputField
                            label="Amount In"
                            value={amountIn}
                            onChange={setAmountIn}
                            placeholder="0.0"
                            type="number"
                        />

                        {/* Estimated output */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-subtext font-mono">
                                Estimated out
                            </span>
                            <span className="font-mono text-green">
                                {formatAmount(estimatedOut)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-subtext font-mono">
                                Slippage tolerance
                            </span>
                            <span className="font-mono text-subtext">5%</span>
                        </div>

                        {isSuccess ? (
                            <div className="bg-green/10 border border-green/40 text-green text-sm font-mono rounded-lg p-3 text-center">
                                Transaction confirmed.
                            </div>
                        ) : (
                            <TxButton
                                onClick={handleSwap}
                                loading={step !== "idle" || isConfirming}
                                disabled={!amountIn || amountInBig === 0n}
                            >
                                {step === "approving"
                                    ? "Approving..."
                                    : step === "swapping"
                                      ? "Swapping..."
                                      : needsApproval
                                        ? "Approve token"
                                        : "Swap"}
                            </TxButton>
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
