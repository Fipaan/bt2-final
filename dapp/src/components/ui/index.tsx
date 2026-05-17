"use client";
import { cn } from "@/lib/utils";
import { ARBITRUM_SEPOLIA_CHAIN_ID } from "@/lib/contracts";

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({
  label, value, sub, accent = false,
}: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={cn("card-sm flex flex-col gap-1", accent && "border-accent/30 bg-accent/5")}>
      <span className="stat-label">{label}</span>
      <span className={cn("stat-value", accent && "text-accent")}>{value}</span>
      {sub && <span className="text-subtext text-xs font-mono">{sub}</span>}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({
  children, color = "default",
}: { children: React.ReactNode; color?: "default" | "green" | "red" | "orange" | "purple" | "accent" }) {
  const colors = {
    default: "border-border text-subtext",
    green:   "border-green/40 text-green bg-green/10",
    red:     "border-red/40 text-red bg-red/10",
    orange:  "border-orange/40 text-orange bg-orange/10",
    purple:  "border-purple/40 text-purple bg-purple/10",
    accent:  "border-accent/40 text-accent bg-accent/10",
  };
  return <span className={cn("badge", colors[color])}>{children}</span>;
}

// ── TxButton ─────────────────────────────────────────────────────────────────
export function TxButton({
  onClick, loading, disabled, children, variant = "primary", className,
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
}) {
  const cls = variant === "primary" ? "btn-primary" : variant === "danger" ? "btn-danger" : "btn-ghost";
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(cls, className)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {children}
        </span>
      ) : children}
    </button>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export function Section({
  title, sub, children, action,
}: { title: string; sub?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-white text-lg">{title}</h2>
          {sub && <p className="text-subtext text-sm mt-0.5">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card flex items-center justify-center py-12 text-subtext text-sm font-mono">
      {message}
    </div>
  );
}

export function Notice({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error" | "success" | "warning";
}) {
  const tones = {
    default: "border-border text-subtext bg-surface",
    error: "border-red/40 text-red bg-red/10",
    success: "border-green/40 text-green bg-green/10",
    warning: "border-orange/40 text-orange bg-orange/10",
  };
  if (!message) return null;
  return <div className={cn("rounded-lg border p-3 text-sm font-mono", tones[tone])}>{message}</div>;
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider() {
  return <div className="border-t border-border" />;
}

// ── InputField ────────────────────────────────────────────────────────────────
export function InputField({
  label, value, onChange, placeholder, type = "text", hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-mono text-subtext uppercase tracking-widest">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
      {hint && <span className="text-xs text-subtext font-mono">{hint}</span>}
    </div>
  );
}

// ── ConnectGuard ──────────────────────────────────────────────────────────────
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-subtext font-body text-sm">Connect your wallet to continue</p>
        <ConnectButton />
      </div>
    );
  }
  if (chainId !== ARBITRUM_SEPOLIA_CHAIN_ID) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24">
        <div className="card flex flex-col items-center gap-4 text-center">
          <div>
            <h2 className="font-display font-bold text-white text-lg">Wrong network</h2>
            <p className="text-subtext text-sm mt-1">
              This dApp is configured for Arbitrum Sepolia.
            </p>
          </div>
          <TxButton
            onClick={() => switchChain({ chainId: ARBITRUM_SEPOLIA_CHAIN_ID })}
            loading={isPending}
          >
            Switch to Arbitrum Sepolia
          </TxButton>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
