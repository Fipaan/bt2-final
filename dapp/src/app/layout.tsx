import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
    title: "GameFi Economy",
    description: "On-chain gaming protocol — ERC-1155 item economy",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-bg font-body text-text antialiased min-h-screen">
                <Providers>
                    <Navbar />
                    <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
                </Providers>
            </body>
        </html>
    );
}
