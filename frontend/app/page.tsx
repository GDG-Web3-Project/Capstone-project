"use client";

import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi";
import { ABIs, GOVERNANCE_TOKEN_ADDRESS, TIMELOCK_ADDRESS } from "../constants";
import { formatEther } from "viem";
import { StatCard } from "../components/StatCard";
import { ProposalCard } from "../components/ProposalCard";
import { NewProposalModal } from "../components/NewProposalModal";
import { useProposals } from "../hooks/useProposals";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, address } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({ hash });
  
  // Custom hook for proposals
  const { proposals, isLoading: proposalsLoading } = useProposals();

  // 1. Read Token Balance
  const { data: balance, isLoading: balanceLoading } = useReadContract({
    address: GOVERNANCE_TOKEN_ADDRESS as `0x${string}`,
    abi: ABIs.GovernanceToken,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  // 2. Read Actual Voting Power (Votes)
  const { data: votingPower, isLoading: votesLoading } = useReadContract({
    address: GOVERNANCE_TOKEN_ADDRESS as `0x${string}`,
    abi: ABIs.GovernanceToken,
    functionName: "getVotes",
    args: [address as `0x${string}`],
  });

  // 3. Read Treasury Balance (Timelock ETH)
  const { data: treasuryBalance, isLoading: treasuryLoading } = useBalance({
    address: TIMELOCK_ADDRESS as `0x${string}`,
  });

  // 4. Delegate to Self function
  const handleDelegate = () => {
    writeContract({
      address: GOVERNANCE_TOKEN_ADDRESS as `0x${string}`,
      abi: ABIs.GovernanceToken,
      functionName: "delegate",
      args: [address as `0x${string}`],
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 pb-20">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-[2px]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl font-bold text-white">C</div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Capstone DAO</span>
          </div>
          <ConnectKitButton />
        </div>
      </nav>

      <NewProposalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Hero / Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <StatCard 
            label="Token Balance" 
            value={balance ? Number(formatEther(balance as bigint)).toLocaleString() : "0"} 
            unit="$gt" 
            color="blue"
            isLoading={balanceLoading}
          />

          <StatCard 
            label="Actual Voting Power" 
            value={votingPower ? Number(formatEther(votingPower as bigint)).toLocaleString() : "0"} 
            unit="votes" 
            color="emerald"
            isLoading={votesLoading}
          >
            {isConnected && Number(votingPower || 0) === 0 && Number(balance || 0) > 0 && (
              <button 
                onClick={handleDelegate}
                disabled={isWaiting}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
              >
                {isWaiting ? "Delegating..." : "Activate Voting Power"}
              </button>
            )}
          </StatCard>

          <StatCard 
            label="DAO Treasury" 
            value={treasuryBalance ? Number(treasuryBalance.formatted).toFixed(4) : "0"} 
            unit="eth" 
            color="purple"
            isLoading={treasuryLoading}
          />
        </div>
      </section>

      {/* Main Content Area (Proposals) */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Governance Proposals</h2>
            <p className="text-slate-500 mt-1">Review and vote on the future of the Capstone DAO.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-semibold text-sm"
          >
            + New Proposal
          </button>
        </div>

        {proposalsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : proposals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl group hover:border-white/10 transition-colors">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-400">No Proposals Found</h2>
            <p className="text-slate-600 mt-2">Be the first to submit a proposal!</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-white font-semibold active:scale-95"
            >
              + Create New Proposal
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
