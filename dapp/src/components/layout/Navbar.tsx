"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
    { href: "/", label: "Dashboard" },
    { href: "/inventory", label: "Inventory" },
    { href: "/craft", label: "Craft" },
    { href: "/amm", label: "AMM" },
    { href: "/vault", label: "Vault" },
    { href: "/dao", label: "DAO" },
    { href: "/vesting", label: "Vesting" },
];

export function Navbar() {
    const pathname = usePathname();
    return (
        <nav className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 shrink-0"
                >
                    <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                        <span className="text-bg font-display font-bold text-sm">
                            G
                        </span>
                    </div>
                    <span className="font-display font-bold text-white text-sm hidden sm:block">
                        GameFi<span className="text-accent">Economy</span>
                    </span>
                </Link>

                {/* Links */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {NAV.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-sm font-body transition-colors whitespace-nowrap",
                                pathname === href
                                    ? "bg-accent/10 text-accent font-medium"
                                    : "text-subtext hover:text-text hover:bg-surface2",
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Wallet */}
                <div className="shrink-0">
                    <ConnectButton
                        chainStatus="icon"
                        showBalance={false}
                        accountStatus="avatar"
                    />
                </div>
            </div>
        </nav>
    );
}
