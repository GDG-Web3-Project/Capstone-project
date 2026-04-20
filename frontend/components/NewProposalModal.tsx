"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ABIs, GOVERNOR_CONTRACT_ADDRESS } from "../constants";
import { parseEther } from "viem";

interface NewProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProposalModal({ isOpen, onClose }: NewProposalModalProps) {
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [value, setValue] = useState("");
  
  const { writeContract, data: hash, error } = useWriteContract();
  const { isLoading: isSubmitting } = useWaitForTransactionReceipt({ hash });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default to empty arrays for a simple text proposal if no target is provided
    const targets = target ? [target] : [];
    const values = value ? [parseEther(value)] : [];
    const calldatas = target ? ["0x" as `0x${string}`] : []; // Basic transfer or empty call

    writeContract({
      address: GOVERNOR_CONTRACT_ADDRESS as `0x${string}`,
      abi: ABIs.GovernorContract,
      functionName: "propose",
      args: [targets, values, calldatas, description],
    });
  };

  if (hash && !isSubmitting) {
    // Success state - could add a timeout to close or a success message
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Create New Proposal</h2>
        <p className="text-slate-400 text-sm mb-8">Submit a new action for the DAO to vote on.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What should the DAO do?"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Target (Optional)</label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="0x..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Value (ETH)</label>
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0.0"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs mt-2 italic px-1">
              Error: {error.message.includes("UserRejectedRequestError") ? "Transaction rejected" : "Proposal submission failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {isSubmitting ? "Submitting to Blockchain..." : hash ? "✓ Proposal Submitted!" : "Submit Proposal"}
          </button>
          
          {hash && (
            <p className="text-center text-[10px] text-emerald-400 animate-pulse font-mono">
              Tx: {hash.slice(0, 12)}...{hash.slice(-8)}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
