"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { ABIs, GOVERNOR_CONTRACT_ADDRESS } from "../constants";
import { Proposal } from "../hooks/useProposals";
import { formatEther } from "viem";

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isVoting } = useWaitForTransactionReceipt({ hash });

  // 1. Fetch Proposal State
  const { data: state } = useReadContract({
    address: GOVERNOR_CONTRACT_ADDRESS as `0x${string}`,
    abi: ABIs.GovernorContract,
    functionName: "state",
    args: [BigInt(proposal.id)],
  });

  // 2. Fetch Proposal Votes (Against, For, Abstain)
  const { data: votes } = useReadContract({
    address: GOVERNOR_CONTRACT_ADDRESS as `0x${string}`,
    abi: ABIs.GovernorContract,
    functionName: "proposalVotes",
    args: [BigInt(proposal.id)],
  });

  // 3. Fetch if user has already voted
  const { data: hasVoted } = useReadContract({
    address: GOVERNOR_CONTRACT_ADDRESS as `0x${string}`,
    abi: ABIs.GovernorContract,
    functionName: "hasVoted",
    args: [BigInt(proposal.id), address as `0x${string}`],
    query: { enabled: !!address },
  });

  const states = [
    { label: "Pending", color: "bg-orange-500/20 text-orange-400" },
    { label: "Active", color: "bg-emerald-500/20 text-emerald-400" },
    { label: "Canceled", color: "bg-slate-500/20 text-slate-400" },
    { label: "Defeated", color: "bg-red-500/20 text-red-400" },
    { label: "Succeeded", color: "bg-blue-500/20 text-blue-400" },
    { label: "Queued", color: "bg-purple-500/20 text-purple-400" },
    { label: "Expired", color: "bg-slate-500/20 text-slate-400" },
    { label: "Executed", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" },
  ];

  const currentState = state !== undefined ? states[state as number] : { label: "Loading...", color: "bg-slate-800 text-slate-400" };
  const showVoting = state === 1 && isConnected && !hasVoted;

  const handleVote = (support: number) => {
    writeContract({
      address: GOVERNOR_CONTRACT_ADDRESS as `0x${string}`,
      abi: ABIs.GovernorContract,
      functionName: "castVote",
      args: [BigInt(proposal.id), support],
    });
  };

  const voteCounts = votes as [bigint, bigint, bigint] | undefined;
  const totalVotes = voteCounts ? voteCounts[0] + voteCounts[1] + voteCounts[2] : 0n;

  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1">Proposal #{proposal.id.slice(0, 8)}...</span>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {proposal.description || "No Description Provided"}
          </h3>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${currentState.color}`}>
          {currentState.label}
        </div>
      </div>

      {/* Vote Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase mb-1">For</p>
          <p className="text-lg font-bold text-emerald-400">{voteCounts ? formatEther(voteCounts[1]) : "0"}</p>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase mb-1">Against</p>
          <p className="text-lg font-bold text-red-400">{voteCounts ? formatEther(voteCounts[0]) : "0"}</p>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase mb-1">Abstain</p>
          <p className="text-lg font-bold text-slate-400">{voteCounts ? formatEther(voteCounts[2]) : "0"}</p>
        </div>
      </div>

      {/* Voting Actions */}
      {showVoting ? (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 font-medium">Cast your vote:</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "For", value: 1, color: "bg-emerald-500 hover:bg-emerald-400" },
              { label: "Against", value: 0, color: "bg-red-500 hover:bg-red-400" },
              { label: "Abstain", value: 2, color: "bg-slate-700 hover:bg-slate-600" },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => handleVote(btn.value)}
                disabled={isVoting}
                className={`py-2 rounded-xl text-slate-950 font-bold text-sm transition-all active:scale-95 disabled:opacity-50 ${btn.color}`}
              >
                {isVoting ? "..." : btn.label}
              </button>
            ))}
          </div>
        </div>
      ) : hasVoted ? (
        <div className="py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium text-center">
          ✓ You have already voted on this proposal
        </div>
      ) : null}

      <div className="space-y-4 mt-8">
        {/* Progress Info */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Voting Power Cast</span>
            <span>Total: {Number(formatEther(totalVotes)).toLocaleString()}</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[15%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">Proposer</span>
            <span className="text-sm font-mono text-slate-400">{proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">Ends at block</span>
            <span className="text-sm text-slate-400">{proposal.voteEnd.toString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
