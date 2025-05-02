"use client";

import dynamic from "next/dynamic";
import { FrameProvider } from "./providers/FrameProvider";

const WagmiProvider = dynamic(
  () => import("./providers/WagmiProvider"),
  {
    ssr: false,
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider>
      <FrameProvider>
        {children}
      </FrameProvider>
    </WagmiProvider>
  );
}