// src/components/LiveBlocksProvider.tsx
"use client";
import { LiveblocksProvider } from "@liveblocks/react/suspense";

const LiveBlocksProvider = ({ children }: { children: React.ReactNode }) => {
  if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
    throw new Error("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not set");
  }

  return (
    <LiveblocksProvider authEndpoint={"/api/auth-endpoint"} throttle={16}>
      {children}
    </LiveblocksProvider>
  );
};

export default LiveBlocksProvider;
