"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { generateVoteAttestation } from "../utils/attest/sign";
import { Icon } from "./DemoComponents";
import Image from "next/image";
import { useEthersSigner } from "../utils/attest/useEthers";
import { Signer } from "ethers";
import { TransactionError, TransactionResponse, Transaction, TransactionButton, TransactionStatus, TransactionStatusAction, TransactionStatusLabel, TransactionToast, TransactionToastIcon, TransactionToastLabel, TransactionToastAction } from "@coinbase/onchainkit/transaction";
import { Abi, Address, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { useMiniKit, useNotification, useViewProfile } from "@coinbase/onchainkit/minikit";
import { DesignInfo } from '../../lib/db';

// Type definition for Neynar user data
interface NeynarUser {
  fid: number;
  username: string;
  display_name?: string;
  pfp_url?: string;
  follower_count?: number;
  following_count?: number;
  score?: number;
}

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

// USDC approval ABI & constants
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as Address;
const erc20Abi: Abi = [{
  inputs: [
    { internalType: "address", name: "spender", type: "address" },
    { internalType: "uint256", name: "amount", type: "uint256" }
  ],
  name: "approve",
  outputs: [{ internalType: "bool", name: "", type: "bool" }],
  stateMutability: "nonpayable",
  type: "function"
}] as const;

export function Designs({ setActiveTab, designInfoArray }: TabProps) {
  const signer = useEthersSigner() as Signer;
  const [votedDesignId, setVotedDesignId] = useState<number | null>(null);
  const { address } = useAccount();
  const sendNotification = useNotification();
  const [designerUsers, setDesignerUsers] = useState<Record<number, NeynarUser>>({});
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const { context } = useMiniKit();
  const viewProfile = useViewProfile();
  const [error, setError] = useState<string | null>(null);

  // Add this effect to log received designInfoArray
  useEffect(() => {
    if (designInfoArray.length > 0) {
      console.log('Designs received in component:', designInfoArray);
      console.log('First design vote count:', designInfoArray[0]?.voteCount);
    }
  }, [designInfoArray]);

  // Fetch designer user info from Neynar API
  useEffect(() => {
    const fetchDesignerUsers = async () => {
      if (!designInfoArray.length) return;

      try {
        setIsLoadingUsers(true);

        // Extract unique designer FIDs
        const fids = Array.from(new Set(designInfoArray.map(design => design.designerFid)));

        // Skip if no FIDs
        if (fids.length === 0) return;

        // Create comma-separated list of FIDs for query parameter
        const fidsParam = fids.join(',');

        // Fetch data from Neynar API with correct query parameter format
        const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fidsParam}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY || 'NEYNAR_API_DOCS',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();

        // Create a map of fid to user data
        const userMap: Record<number, NeynarUser> = {};
        data.users.forEach((user: NeynarUser) => {
          userMap[user.fid] = user;
        });

        setDesignerUsers(userMap);
      } catch (error) {
        console.error('Error fetching designer users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchDesignerUsers();
  }, [designInfoArray]);

  const handleVote = useCallback(
    async (designId: number) => {
      if (!signer) {
        console.error("No signer available");
        setError("Please connect your wallet to vote");
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

          // Set the voted design ID instead of index
          setVotedDesignId(designId);
        } catch (error) {
          console.error("Failed to record the vote:", error);
        }
      } catch (error) {
        console.error("Failed to vote:", error);
        setError("Failed to vote. Please try again.");
      }
    },
    [signer, address]
  );

  // prepare the sponsored calls: first approve USDC, then pay()
  const calls = useMemo(
    () =>
      address
        ? [
            {
              to: USDC_ADDRESS,
              data: encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [DESIGN_CLUB_ADDRESS, BigInt(500000)] }),
              value: BigInt(0),
            },
            {
              to: DESIGN_CLUB_ADDRESS,
              data: encodeFunctionData({ abi: payAbi, functionName: "pay", args: [] }),
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

  const handleUserLinkClick = useCallback((fid: number) => {
    if (context) {
      viewProfile(fid);
    } else {
      window.open(`https://warpcast.com/${designerUsers[fid].username}`, '_blank');
    }
  }, [context, designerUsers, viewProfile]);

  return (
    <div className="space-y-6 animate-fade-in">
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600">Error</h3>
              <button 
                onClick={() => setError(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-700">{error}</p>
            <div className="mt-4 flex justify-end">
              <Button
                variant="primary"
                onClick={() => setError(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {designInfoArray.map((design, index) => (
        <Card
          key={index}
          title={design.title}
          className={votedDesignId === design.designId ? "border-2 border-green-500" : ""}
        >
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
                {/* Display username and score instead of just FID */}
                <div className="text-sm text-[var(--app-foreground-muted)]">
                  {isLoadingUsers ? (
                    <span>Loading designer info...</span>
                  ) : designerUsers[design.designerFid] ? (
                    <div className="flex flex-col">
                      <span>By <button onClick={() => handleUserLinkClick(design.designerFid)} className="text-blue-500 hover:underline">@{designerUsers[design.designerFid].username}</button></span>
                      <div className="flex flex-wrap mt-1 gap-1">
                        {designerUsers[design.designerFid].score && (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                            Score: {designerUsers[design.designerFid].score?.toLocaleString()}
                          </span>
                        )}
                        {designerUsers[design.designerFid].follower_count && (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                            {designerUsers[design.designerFid].follower_count?.toLocaleString()} followers
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span>By FID: {design.designerFid}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {/* Display vote count */}
                <span className="text-sm text-[var(--app-foreground-muted)]">
                  {Number(design.voteCount) || 0} {Number(design.voteCount) === 1 ? 'vote' : 'votes'}
                </span>

                {/* Check votedDesignId against design.designId, not index */}
                {votedDesignId === design.designId ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[var(--app-foreground-muted)]">Voted</span>
                    <Icon name="check" className="text-green-500" />
                  </div>
                ) : (
                  <Button
                    variant={votedDesignId !== null ? "outline" : "primary"}
                    size="md"
                    onClick={() => handleVote(design.designId)}
                  >
                    {votedDesignId !== null ? "Change Vote" : "Vote"}
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