import { createPublicClient, http, isAddress } from "viem";
import { base, baseSepolia } from "viem/chains";

export type DaoAddresses = {
  governor?: `0x${string}`;
  token?: `0x${string}`;
  timelock?: `0x${string}`;
};

type DaoConfig = {
  chain: typeof base | typeof baseSepolia;
  rpcUrl: string;
  addresses: DaoAddresses;
  isConfigured: boolean;
};

const DEFAULT_RPC = "https://sepolia.base.org";

function parseAddress(value?: string): `0x${string}` | undefined {
  if (!value) return undefined;
  return isAddress(value) ? (value as `0x${string}`) : undefined;
}

export function getDaoConfig(): DaoConfig {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  const chain = chainId === "8453" ? base : baseSepolia;
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || DEFAULT_RPC;
  const addresses = {
    governor: parseAddress(process.env.NEXT_PUBLIC_GOVERNOR_ADDRESS),
    token: parseAddress(process.env.NEXT_PUBLIC_TOKEN_ADDRESS),
    timelock: parseAddress(process.env.NEXT_PUBLIC_TIMELOCK_ADDRESS),
  };
  const isConfigured =
    Boolean(addresses.governor) &&
    Boolean(addresses.token) &&
    Boolean(addresses.timelock);

  return { chain, rpcUrl, addresses, isConfigured };
}

export function getPublicClient() {
  const { chain, rpcUrl } = getDaoConfig();
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
}
