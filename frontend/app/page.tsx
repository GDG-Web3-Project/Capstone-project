"use client";

import { ConnectKitButton } from "connectkit";
import { useAccount, useReadContract, useChainId } from "wagmi";
import { ABIs, GOVERNANCE_TOKEN_ADDRESS } from "../constants";

export default function Home() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();

  // 1. Read balance from Governance Token
  const { data: balance, isError, isLoading } = useReadContract({
    address: GOVERNANCE_TOKEN_ADDRESS as `0x${string}`,
    abi: ABIs.GovernanceToken,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950 text-white font-sans">
      <div className="flex flex-col gap-8 items-center max-w-2xl w-full text-center">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Capstone DAO Bridge
        </h1>

        <ConnectKitButton />

        {isConnected ? (
          <div className="w-full grid grid-cols-1 gap-4 mt-8">
            {/* Connection Status Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-left">
              <h2 className="text-xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Backend Connected
              </h2>

              <div className="space-y-3 font-mono text-sm">
                <p><span className="text-gray-400">Your Wallet:</span> {address}</p>
                <p><span className="text-gray-400">Network ID:</span> {chainId} (Anvil)</p>
                <p><span className="text-gray-400">Contract:</span> {GOVERNANCE_TOKEN_ADDRESS}</p>

                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-lg">
                  <span className="font-sans">Your $GT Balance:</span>
                  <span className="font-bold text-2xl text-blue-400">
                    {isLoading ? "Loading..." : balance ? Number(balance) / 1e18 : "0"} $GT
                  </span>
                </div>
                {isError && <p className="text-red-400 mt-2">Error reading contract. Check Anvil logs!</p>}
              </div>
            </div>

            <p className="text-gray-500 text-xs italic">
              Verification Tip: If you use the first Anvil account (Account #0), you should see a balance of 1000 $GT.
            </p>
          </div>
        ) : (
          <p className="text-gray-400 animate-bounce">Please connect your wallet to verify the bridge</p>
        )}
      </div>
    </main>
  );
}
