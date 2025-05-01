"use client";

import { type ReactNode, useCallback, useMemo, useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Icon } from "./DemoComponents";
import Image from "next/image";

type DesignInfo = {
    title: string;
    caption: string;
    designerFid: number;
    imageUrl: string;
};

type TabProps = {
  setActiveTab: (tab: string) => void;
  designInfoArray: DesignInfo[];
};

export function Designs({ setActiveTab, designInfoArray }: TabProps) {
  const [voteIndex, setVoteIndex] = useState<number | null>(null);

  const handleVote = useCallback(async (index: number) => {
    try {
      // TODO: Call API to vote for design
      // const response = await fetch('/api/vote', {
      //   method: 'POST',
      //   body: JSON.stringify({ designIndex: index }),
      // });
      // if (!response.ok) throw new Error('Vote failed');
      
      setVoteIndex(index);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  }, []);

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
              {voteIndex === index ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[var(--app-foreground-muted)]">Voted</span>
                  <Icon name="check" className="text-green-500" />
                </div>
              ) : (
                <Button 
                  variant={voteIndex !== null ? "outline" : "primary"} 
                  size="md"
                  onClick={() => handleVote(index)}
                >
                  {voteIndex !== null ? "Change Vote" : "Vote"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" onClick={() => setActiveTab("home")}>
        Back to Home
      </Button>
    </div>
  );
}