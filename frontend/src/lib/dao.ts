import { formatEther, formatUnits } from "viem";
import { governorAbi, timelockAbi, tokenAbi } from "./abis";
import { getDaoConfig, getPublicClient } from "./chain";

export type DaoSnapshot = {
  governorName: string;
  chainName: string;
  treasuryEth: string;
  timelockDelay: string;
  quorum: string;
  proposalThreshold: string;
  totalSupply: string;
  tokenSymbol: string;
  isConfigured: boolean;
};

const EMPTY_SNAPSHOT: DaoSnapshot = {
  governorName: "",
  chainName: "Base Sepolia",
  treasuryEth: "-",
  timelockDelay: "-",
  quorum: "-",
  proposalThreshold: "-",
  totalSupply: "-",
  tokenSymbol: "",
  isConfigured: false,
};

export async function getDaoSnapshot(): Promise<DaoSnapshot> {
  const config = getDaoConfig();
  if (!config.isConfigured) {
    return {
      ...EMPTY_SNAPSHOT,
      chainName: config.chain.name,
      isConfigured: false,
    };
  }

  const client = getPublicClient();
  const blockNumber = await client.getBlockNumber();
  const zero = BigInt(0);
  const quorumBlock = blockNumber > zero ? blockNumber - BigInt(1) : zero;

  const [
    governorName,
    votingDelay,
    votingPeriod,
    quorum,
    proposalThreshold,
    tokenSymbol,
    tokenDecimals,
    totalSupply,
    timelockDelay,
    treasuryEth,
  ] = await Promise.all([
    client.readContract({
      address: config.addresses.governor!,
      abi: governorAbi,
      functionName: "name",
    }),
    client.readContract({
      address: config.addresses.governor!,
      abi: governorAbi,
      functionName: "votingDelay",
    }),
    client.readContract({
      address: config.addresses.governor!,
      abi: governorAbi,
      functionName: "votingPeriod",
    }),
    client.readContract({
      address: config.addresses.governor!,
      abi: governorAbi,
      functionName: "quorum",
      args: [quorumBlock],
    }),
    client.readContract({
      address: config.addresses.governor!,
      abi: governorAbi,
      functionName: "proposalThreshold",
    }),
    client.readContract({
      address: config.addresses.token!,
      abi: tokenAbi,
      functionName: "symbol",
    }),
    client.readContract({
      address: config.addresses.token!,
      abi: tokenAbi,
      functionName: "decimals",
    }),
    client.readContract({
      address: config.addresses.token!,
      abi: tokenAbi,
      functionName: "totalSupply",
    }),
    client.readContract({
      address: config.addresses.timelock!,
      abi: timelockAbi,
      functionName: "getMinDelay",
    }),
    client.getBalance({ address: config.addresses.timelock! }),
  ]);

  return {
    governorName,
    chainName: config.chain.name,
    treasuryEth: `${formatEther(treasuryEth)} ETH`,
    timelockDelay: formatSeconds(timelockDelay),
    quorum: `${formatUnits(quorum, tokenDecimals)} ${tokenSymbol}`,
    proposalThreshold: `${formatUnits(proposalThreshold, tokenDecimals)} ${tokenSymbol}`,
    totalSupply: `${formatUnits(totalSupply, tokenDecimals)} ${tokenSymbol}`,
    tokenSymbol,
    isConfigured: true,
  };
}

function formatSeconds(value: bigint): string {
  const seconds = Number(value);
  if (seconds >= 3600 && seconds % 3600 === 0) {
    return `${seconds / 3600} hours`;
  }
  if (seconds >= 60 && seconds % 60 === 0) {
    return `${seconds / 60} minutes`;
  }
  return `${seconds} seconds`;
}

export function summarizeGovernorSettings(
  votingDelay: bigint,
  votingPeriod: bigint,
  proposalThreshold: bigint
): string {
  return `Delay ${votingDelay} blocks · Period ${votingPeriod} blocks · Threshold ${proposalThreshold}`;
}
