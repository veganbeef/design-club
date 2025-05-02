"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/Button";
import { Designs } from "./components/Designs";
import { Leaderboard } from "./components/Leaderboard";
import { Upload } from "./components/Upload";
import { Explainer } from "./components/Explainer";
import { DesignInfo } from "../lib/db";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [activeTab, setActiveTab] = useState("designs");
  const [designs, setDesigns] = useState<DesignInfo[]>([]);
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    async function fetchDesigns() {
      try {
        const response = await fetch('/api/designs');
        if (!response.ok) {
          throw new Error('Failed to fetch designs');
        }
        const result = await response.json();
        console.log(result);
        setDesigns(result);
      } catch (e) {
        console.error('Error fetching designs:', e);
        setDesigns([]);
      }
    }
    fetchDesigns();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <div className="text-center mb-6">
          <h1 className="font-serif text-4xl font-bold text-[var(--app-accent)] tracking-tight">
            DesignClub
          </h1>
          <p className="text-sm text-[var(--app-foreground-muted)] mt-1">
            No tokens. No liquidity. Just a cool shirt.
          </p>
        </div>
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                {!context && (
                  <ConnectWallet>
                    <Name className="text-inherit" />
                  </ConnectWallet>
                )}
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("upload")}
              className="text-[var(--app-foreground-muted)]"
            >
              Upload a Design
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab("leaderboard")}
            >
              Leaderboard
            </Button>
          </div>
        </header>

        <main className="flex-1">
          {activeTab === "designs" && (
            <Designs designInfoArray={designs} />
          )}
          {activeTab === "leaderboard" && (
            <Leaderboard setActiveTab={setActiveTab} designInfoArray={designs} />
          )}
          {activeTab === "upload" && (
            <Upload setActiveTab={setActiveTab} />
          )}
          {activeTab === "explainer" && (
            <Explainer setActiveTab={setActiveTab} />
          )}
        </main>

        <footer className="mt-2 pt-4 flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--app-foreground-muted)]"
            onClick={() => setActiveTab("explainer")}
          >
            How does it work?
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
