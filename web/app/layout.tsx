import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import Navbar from "./components/Navbar";
import { WalletProvider } from "./lib/wallet-context";
import { NextStepProvider, NextStep } from "nextstepjs";
import { tours } from "./lib/tour-steps";
import TourCard from "./components/TourCard";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Colliquid — Pre-Liquidation Collateral Tokenization",
  description:
    "Unlock $1.5 trillion in idle bank collateral. Tokenize pre-liquidation assets on a sovereign privacy chain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <WalletProvider>
          <NextStepProvider>
            <NextStep steps={tours} cardComponent={TourCard}>
              <Navbar />
              <main className="flex flex-1 flex-col">{children}</main>
            </NextStep>
          </NextStepProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
