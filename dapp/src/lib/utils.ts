import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatAmount(
    value: bigint,
    decimals = 18,
    displayDecimals = 4,
): string {
    if (value === 0n) return "0";
    const divisor = 10n ** BigInt(decimals);
    const whole = value / divisor;
    const frac = value % divisor;
    if (frac === 0n) return whole.toString();
    const fracStr = frac
        .toString()
        .padStart(decimals, "0")
        .slice(0, displayDecimals)
        .replace(/0+$/, "");
    return fracStr ? `${whole}.${fracStr}` : whole.toString();
}

export function shortenAddress(addr: string): string {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function parseAmount(value: string, decimals = 18): bigint {
    if (!value || value === "") return 0n;
    const [whole, frac = ""] = value.split(".");
    const fracPadded = frac.slice(0, decimals).padEnd(decimals, "0");
    return BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(fracPadded);
}

export const PROPOSAL_STATES: Record<number, { label: string; color: string }> =
    {
        0: { label: "Pending", color: "text-orange" },
        1: { label: "Active", color: "text-green" },
        2: { label: "Canceled", color: "text-subtext" },
        3: { label: "Defeated", color: "text-red" },
        4: { label: "Succeeded", color: "text-green" },
        5: { label: "Queued", color: "text-accent" },
        6: { label: "Expired", color: "text-subtext" },
        7: { label: "Executed", color: "text-purple" },
    };

export const SUPPORT_LABELS: Record<number, string> = {
    0: "Against",
    1: "For",
    2: "Abstain",
};
