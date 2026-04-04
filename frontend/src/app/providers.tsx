"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { ReactNode, useMemo } from "react";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { http } from "wagmi";

const queryClient = new QueryClient();

function buildConfig() {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  const chain = chainId === "8453" ? base : baseSepolia;
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.base.org";
  const projectId =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

  return getDefaultConfig({
    appName: "Capstone DAO",
    projectId,
    chains: [chain],
    transports: {
      [chain.id]: http(rpcUrl),
    },
  });
}

export default function Providers({ children }: { children: ReactNode }) {
  const config = useMemo(() => buildConfig(), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
