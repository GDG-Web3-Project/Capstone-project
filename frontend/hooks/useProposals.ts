"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { ABIs, GOVERNOR_CONTRACT_ADDRESS } from "../constants";
import { parseAbiItem } from "viem";

export interface Proposal {
  id: string;
  proposer: string;
  description: string;
  voteStart: bigint;
  voteEnd: bigint;
  targets: readonly string[];
  values: readonly bigint[];
  signatures: readonly string[];
  calldatas: readonly `0x${string}`[];
}

export function useProposals() {
  const publicClient = usePublicClient();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProposals() {
      if (!publicClient) return;
      
      try {
        setIsLoading(true);
        // Get logs for ProposalCreated event
        const logs = await publicClient.getLogs({
          address: GOVERNOR_CONTRACT_ADDRESS as `0x${string}`,
          event: parseAbiItem("event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 voteStart, uint256 voteEnd, string description)"),
          fromBlock: 0n, // Start from the beginning on local node
        });

        const formattedProposals = logs.map((log) => {
          const args = log.args as any;
          return {
            id: args.proposalId.toString(),
            proposer: args.proposer,
            description: args.description,
            voteStart: args.voteStart,
            voteEnd: args.voteEnd,
            targets: args.targets,
            values: args.values,
            signatures: args.signatures,
            calldatas: args.calldatas,
          };
        });

        setProposals(formattedProposals.reverse()); // Newest first
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProposals();
  }, [publicClient]);

  return { proposals, isLoading };
}
