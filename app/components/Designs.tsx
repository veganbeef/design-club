"use client";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
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
            <div className="space-y-2">
              <p className="text-[var(--app-foreground-muted)]">{design.caption}</p>
              <p className="text-sm text-[var(--app-foreground-muted)]">By {design.designerFid}</p>
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