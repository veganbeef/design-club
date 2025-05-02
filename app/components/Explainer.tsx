"use client";

import { Card } from "./Card";
import { Button } from "./Button";
import { Icon } from "./Icon";

type TabProps = {
  setActiveTab: (tab: string) => void;
};

export function Explainer({ setActiveTab }: TabProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="How Design Club Works">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[var(--app-accent)] text-white rounded-full">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold">Monthly Design Submissions</h3>
                <p className="text-[var(--app-foreground-muted)]">
                  Artists from the Farcaster and crypto ecosystem submit their designs for consideration.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[var(--app-accent)] text-white rounded-full">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold">Member Voting</h3>
                <p className="text-[var(--app-foreground-muted)]">
                  Design Club members vote on their favorite design each month.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[var(--app-accent)] text-white rounded-full">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold">T-Shirt Production</h3>
                <p className="text-[var(--app-foreground-muted)]">
                  The winning design is printed on high-quality T-shirts.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[var(--app-accent)] text-white rounded-full">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold">Distribution & Rewards</h3>
                <p className="text-[var(--app-foreground-muted)]">
                  T-shirts are shipped to members, and the winning artist receives 10% of the monthly revenue.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              onClick={() => setActiveTab("designs")}
            >
              Back to Designs
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
