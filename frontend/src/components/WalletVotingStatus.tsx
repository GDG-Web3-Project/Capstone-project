"use client";

import { formatUnits, isAddressEqual, zeroAddress } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { tokenAbi } from "@/lib/abis";
import { getDaoConfig } from "@/lib/chain";

export default function WalletVotingStatus() {
  const { address, isConnected } = useAccount();
  const { addresses, isConfigured } = getDaoConfig();
  const tokenAddress = addresses.token;

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "symbol",
    query: { enabled: Boolean(tokenAddress) },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "decimals",
    query: { enabled: Boolean(tokenAddress) },
  });

  const { data: votingPower } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "getVotes",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && tokenAddress) },
  });

  const { data: delegate } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "delegates",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && tokenAddress) },
  });

  const { writeContractAsync, isPending } = useWriteContract();

  if (!isConfigured) {
    return (
      <div className="walletCard">
        <div className="walletTitle">Your voting power</div>
        <p className="walletMeta">
          Set contract addresses to read wallet voting data.
        </p>
      </div>
    );
  }

  if (!isConnected || !address) {
    return (
      <div className="walletCard">
        <div className="walletTitle">Your voting power</div>
        <p className="walletMeta">Connect your wallet to see votes.</p>
      </div>
    );
  }

  const formattedVotes = formatUnits(
    votingPower ?? BigInt(0),
    decimals ?? 18
  );
  const tokenSymbol = symbol || "TOKEN";
  const delegateAddress = delegate ?? zeroAddress;
  const delegateStatus = isAddressEqual(delegateAddress, zeroAddress)
    ? "Not delegated"
    : isAddressEqual(delegateAddress, address)
      ? "Self-delegated"
      : `Delegated to ${delegateAddress.slice(0, 6)}...${delegateAddress.slice(-4)}`;

  const canDelegate = Boolean(
    address &&
      tokenAddress &&
      !isAddressEqual(delegateAddress, address)
  );

  async function handleDelegate() {
    if (!address || !tokenAddress) return;
    await writeContractAsync({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "delegate",
      args: [address],
    });
  }

  return (
    <div className="walletCard">
      <div className="walletTitle">Your voting power</div>
      <div className="walletValue">
        {formattedVotes} {tokenSymbol}
      </div>
      <div className="walletMeta">{delegateStatus}</div>
      <div className="walletActions">
        <button
          className="button buttonGhost buttonSmall"
          type="button"
          onClick={handleDelegate}
          disabled={!canDelegate || isPending}
        >
          {isPending ? "Delegating..." : "Delegate to self"}
        </button>
      </div>
    </div>
  );
}
