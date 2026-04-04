"use client";

import { useEffect, useMemo, useState } from "react";
import { Address, formatUnits } from "viem";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { governorAbi } from "@/lib/abis";
import { getDaoConfig } from "@/lib/chain";

const STATUS_LABELS = [
  "Pending",
  "Active",
  "Canceled",
  "Defeated",
  "Succeeded",
  "Queued",
  "Expired",
  "Executed",
] as const;

type ProposalEvent = {
  proposalId: bigint;
  proposer: Address;
  description: string;
  startBlock: bigint;
  endBlock: bigint;
};

export default function ProposalList() {
  const { address, isConnected } = useAccount();
  const client = usePublicClient();
  const { addresses, isConfigured } = getDaoConfig();
  const governorAddress = addresses.governor;
  const [proposals, setProposals] = useState<ProposalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fromBlock = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_PROPOSAL_FROM_BLOCK;
    return raw ? BigInt(raw) : 0n;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProposals() {
      if (!client || !governorAddress) return;
      setIsLoading(true);
      setError(null);
      try {
        const logs = await client.getLogs({
          address: governorAddress,
          abi: governorAbi,
          eventName: "ProposalCreated",
          fromBlock,
          toBlock: "latest",
        });

        const mapped = logs.map((log) => ({
          proposalId: log.args.proposalId as bigint,
          proposer: log.args.proposer as Address,
          description: log.args.description as string,
          startBlock: log.args.startBlock as bigint,
          endBlock: log.args.endBlock as bigint,
        }));

        if (isMounted) {
          setProposals(mapped.reverse());
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to load proposals.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (isConfigured) {
      loadProposals();
    }

    return () => {
      isMounted = false;
    };
  }, [client, governorAddress, fromBlock, isConfigured]);

  if (!isConfigured) {
    return (
      <div className="card">
        <div className="cardTitle">On-chain proposals</div>
        <div className="cardMeta">Set contract addresses to load proposals.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="cardTitle">Loading proposals...</div>
        <div className="cardMeta">Fetching events from the chain.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="cardTitle">Proposal feed error</div>
        <div className="cardMeta">{error}</div>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="card">
        <div className="cardTitle">No proposals yet</div>
        <div className="cardMeta">Create the first proposal to get started.</div>
      </div>
    );
  }

  return (
    <div className="grid">
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.proposalId.toString()}
          proposal={proposal}
          governorAddress={governorAddress!}
          isConnected={isConnected}
          address={address}
        />
      ))}
    </div>
  );
}

type ProposalCardProps = {
  proposal: ProposalEvent;
  governorAddress: Address;
  isConnected: boolean;
  address?: Address;
};

function ProposalCard({
  proposal,
  governorAddress,
  isConnected,
  address,
}: ProposalCardProps) {
  const { writeContractAsync, isPending } = useWriteContract();
  const { data: state } = useReadContract({
    address: governorAddress,
    abi: governorAbi,
    functionName: "state",
    args: [proposal.proposalId],
    query: { enabled: Boolean(governorAddress) },
  });

  const stateLabel =
    typeof state === "number" ? STATUS_LABELS[state] : "Unknown";

  async function handleVote(support: number) {
    await writeContractAsync({
      address: governorAddress,
      abi: governorAbi,
      functionName: "castVote",
      args: [proposal.proposalId, support],
    });
  }

  const shortProposer = `${proposal.proposer.slice(0, 6)}...${proposal.proposer.slice(-4)}`;

  return (
    <article className="card">
      <div className="cardTitle">{proposal.description}</div>
      <div className="cardMeta">Status: {stateLabel}</div>
      <div className="cardMeta">Proposer: {shortProposer}</div>
      <div className="cardMeta">
        Voting window: {formatUnits(proposal.startBlock, 0)} - {" "}
        {formatUnits(proposal.endBlock, 0)}
      </div>
      <div className="voteRow">
        <button
          className="button buttonSmall"
          type="button"
          onClick={() => handleVote(1)}
          disabled={!isConnected || isPending}
        >
          Vote For
        </button>
        <button
          className="button buttonGhost buttonSmall"
          type="button"
          onClick={() => handleVote(0)}
          disabled={!isConnected || isPending}
        >
          Vote Against
        </button>
        <button
          className="button buttonGhost buttonSmall"
          type="button"
          onClick={() => handleVote(2)}
          disabled={!isConnected || isPending}
        >
          Abstain
        </button>
      </div>
      {!isConnected ? (
        <div className="cardMeta">Connect a wallet to vote.</div>
      ) : null}
      {address && isPending ? (
        <div className="cardMeta">Submitting vote...</div>
      ) : null}
    </article>
  );
}
