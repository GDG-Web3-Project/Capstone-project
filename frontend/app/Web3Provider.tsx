"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { foundry, mainnet, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";

// Support both local Anvil and Base Sepolia
const config = createConfig(
    getDefaultConfig({
        chains: [foundry, baseSepolia, mainnet],
        transports: {
            [foundry.id]: http("http://127.0.0.1:8545"),
            [baseSepolia.id]: http(),
            [mainnet.id]: http(),
        },
        walletConnectProjectId: "", 
        appName: "Capstone DAO",
    }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider debugMode>{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
