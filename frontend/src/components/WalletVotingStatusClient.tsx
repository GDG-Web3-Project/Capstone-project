"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const WalletVotingStatus = dynamic(
  () => import("@/components/WalletVotingStatus"),
  { ssr: false }
);

export default function WalletVotingStatusClient(
  props: ComponentProps<typeof WalletVotingStatus>
) {
  return <WalletVotingStatus {...props} />;
}
