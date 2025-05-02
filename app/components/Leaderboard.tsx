"use client";

import { useCallback, useState, useEffect } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { useMiniKit, useViewProfile } from "@coinbase/onchainkit/minikit";
import Image from "next/image";
import { DesignInfo } from "@/lib/db";

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

export function Leaderboard({ setActiveTab, designInfoArray }: TabProps) {
  const [designerUsers, setDesignerUsers] = useState<Record<number, NeynarUser>>({});
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const { context } = useMiniKit();
  const viewProfile = useViewProfile();

  // Fetch designer user info from Neynar API
  useEffect(() => {
    const fetchDesignerUsers = async () => {
      if (!designInfoArray.length) return;

      try {
        setIsLoadingUsers(true);
        const fids = Array.from(new Set(designInfoArray.map(design => design.designerFid)));
        if (fids.length === 0) return;

        const fidsParam = fids.join(',');
        const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fidsParam}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY || 'NEYNAR_API_DOCS',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
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

  const handleUserLinkClick = useCallback((fid: number) => {
    if (context) {
      viewProfile(fid);
    } else {
      window.open(`https://warpcast.com/${designerUsers[fid].username}`, '_blank');
    }
  }, [context, designerUsers, viewProfile]);

  // Calculate total votes per designer
  const designerScores = designInfoArray.reduce((acc, design) => {
    acc[design.designerFid] = (acc[design.designerFid] || 0) + (design.voteCount || 0);
    return acc;
  }, {} as Record<number, number>);

  // Sort designers by score
  const sortedDesigners = Object.entries(designerScores)
    .sort(([, a], [, b]) => b - a)
    .map(([fid, score]) => ({
      fid: Number(fid),
      score,
      user: designerUsers[Number(fid)]
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Designer Leaderboard">
        <div className="space-y-4">
          {isLoadingUsers ? (
            <div className="text-center py-4">Loading leaderboard...</div>
          ) : (
            <div className="space-y-3">
              {sortedDesigners.map((designer, index) => (
                <div
                  key={designer.fid}
                  className="flex items-center justify-between p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-[var(--app-accent)] text-white rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-3">
                      {designer.user?.pfp_url && (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={designer.user.pfp_url}
                            alt={designer.user.username}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <button
                          onClick={() => handleUserLinkClick(designer.fid)}
                          className="text-[var(--app-accent)] hover:underline font-medium"
                        >
                          @{designer.user?.username || designer.fid}
                        </button>
                        {designer.user?.follower_count && (
                          <p className="text-sm text-[var(--app-foreground-muted)]">
                            {designer.user.follower_count.toLocaleString()} followers
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="star" className="text-yellow-500" />
                    <span className="font-medium">{designer.score.toLocaleString()} votes</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
      <Button variant="outline" onClick={() => setActiveTab("designs")}>
        Back
      </Button>
    </div>
  );
}
