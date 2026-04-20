"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { foundry, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";

// This tells Wagmi to connect to local Anvil node (127.0.0.1:8545)
const config = createConfig(
    getDefaultConfig({
        chains: [foundry, mainnet],
        transports: {
            [foundry.id]: http("http://127.0.0.1:8545"),
            [mainnet.id]: http(),
        },
        walletConnectProjectId: "", // can leave this empty for local dev
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
