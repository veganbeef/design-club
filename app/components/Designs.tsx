"use client";

import { useCallback, useState, useMemo } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { generateVoteAttestation } from "../utils/attest/sign";
import { Icon } from "./DemoComponents";
import Image from "next/image";
import { useEthersSigner } from "../utils/attest/useEthers";
import { Signer } from "ethers";
import {TransactionError,  TransactionResponse, Transaction, TransactionButton, TransactionStatus, TransactionStatusAction, TransactionStatusLabel, TransactionToast, TransactionToastIcon, TransactionToastLabel, TransactionToastAction } from "@coinbase/onchainkit/transaction";
import { Abi, Address, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { useNotification } from "@coinbase/onchainkit/minikit";
import { DesignInfo } from '../../lib/db';

type TabProps = {
  setActiveTab: (tab: string) => void;
  designInfoArray: DesignInfo[];
};

// minimal ABI for pay()
const DESIGN_CLUB_ADDRESS = '0xC3B87b7c143D196e0B3bB36Ce003d17611dEfE4a' as Address;//process.env.NEXT_PUBLIC_DESIGN_CLUB_ADDRESS as `0x${string}`;
const payAbi: Abi = [{
  inputs: [],
  name: 'pay',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
}] as const;

export function Designs({ setActiveTab, designInfoArray }: TabProps) {
  const signer = useEthersSigner() as Signer;
  const [voteIndex, setVoteIndex] = useState<number | null>(null);
  const { address } = useAccount();
  const sendNotification = useNotification();

  const handleVote = useCallback(
    async (designId: number) => {
      if (!signer) {
        console.error("No signer available");
        return;
      }
      try {
        const attestation = await generateVoteAttestation(signer, {
          eventId: 1,
          voteIndex: designId,
        });
        console.log("Attestation:", attestation);
      
        // Call API to vote for design
        try {
          // Create request payload with all required fields
          const payload = {
            voter: address, // Hardcoded for now, replace with actual FID when available
            design_id: designId, // Adding 1 to ensure it's not zero
            epoch: 1,
            attestation: attestation
          };
          
          console.log("Sending payload:", payload); // Debug log
          
          const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload, (key, value) => {
              // Convert BigInt values to strings
              return typeof value === 'bigint' 
                ? value.toString() 
                : value;
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Vote failed');
          }
        } catch (error) {
          console.error("Failed to record the vote:", error);
        }

        setVoteIndex(designId);
      } catch (error) {
        console.error("Failed to vote:", error);
      }
    },
    [signer]
  );

  // prepare the sponsored call
  const calls = useMemo(
    () =>
      address
        ? [
            {
              to: DESIGN_CLUB_ADDRESS,
              data: encodeFunctionData({abi: payAbi, functionName: "pay"}),
              value: BigInt(0),
            },
          ]
        : [],
    [address]
  );

  // handle onSuccess notification
  const handleSuccess = useCallback(
    async (response: TransactionResponse) => {
      const txHash = response.transactionReceipts[0].transactionHash;
      console.log("Payment successful:", txHash);
      await sendNotification({
        title: "Deposit Confirmed",
        body: `Your deposit tx ${txHash} succeeded!`,
      });
      // optional: setPaidState(true)
    },
    [sendNotification]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {designInfoArray.map((design, index) => (
        <Card key={index} title={design.title}>
          <div className="space-y-4">
            <div className="relative w-full aspect-video">
              <Image
                src={design.imageUrl}
                alt={design.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-[var(--app-foreground-muted)]">{design.caption}</p>
                <p className="text-sm text-[var(--app-foreground-muted)]">By {design.designerFid}</p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Display vote count */}
                <span className="text-sm text-[var(--app-foreground-muted)]">
                  {design.voteCount} {design.voteCount === 1 ? 'vote' : 'votes'}
                </span>
                
                {voteIndex === index ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[var(--app-foreground-muted)]">Voted</span>
                    <Icon name="check" className="text-green-500" />
                  </div>
                ) : (
                  <Button 
                    variant={voteIndex !== null ? "outline" : "primary"} 
                    size="md"
                    onClick={() => handleVote(design.designId)}
                  >
                    {voteIndex !== null ? "Change Vote" : "Vote"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" onClick={() => setActiveTab("home")}>
        Back to Home
      </Button>
      <div className="mt-4">
        {address ? (
          <Transaction
            calls={calls}
            chainId={84532} // Base Sepolia we should change this tho
            onSuccess={handleSuccess}
            onError={(err: TransactionError) => console.error("Deposit failed:", err)}
          >
              <TransactionButton className="text-white text-md" />

            <TransactionStatus>
              <TransactionStatusAction />
              <TransactionStatusLabel />
            </TransactionStatus>

            <TransactionToast className="mb-4">
              <TransactionToastIcon />
              <TransactionToastLabel />
              <TransactionToastAction />
            </TransactionToast>
          </Transaction>
        ) : (
          <p className="text-yellow-400 text-sm text-center mt-2">
            Connect your wallet to deposit funds
          </p>
        )}
      </div>
    </div>
  );
}