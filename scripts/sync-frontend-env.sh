#!/usr/bin/env bash
set -euo pipefail

NETWORK="${1:-84532}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_PATH="$REPO_ROOT/contracts/broadcast/DeployDAO.s.sol/$NETWORK/run-latest.json"
ENV_PATH="$REPO_ROOT/frontend/.env.local"

if [[ ! -f "$DEPLOY_PATH" ]]; then
  echo "Deploy file not found: $DEPLOY_PATH" >&2
  exit 1
fi

get_field() {
  local name="$1"
  jq -r ".transactions[] | select(.contractName == \"$name\") | .contractAddress" "$DEPLOY_PATH" | tail -n 1
}

TOKEN="$(get_field "GovernanceToken")"
TIMELOCK="$(get_field "TimeLock")"
GOVERNOR="$(get_field "GovernorContract")"

if [[ -z "$TOKEN" || -z "$TIMELOCK" || -z "$GOVERNOR" || "$TOKEN" == "null" ]]; then
  echo "Missing contract addresses in deploy output." >&2
  exit 1
fi

PROPOSAL_FROM_BLOCK="$(jq -r '.receipts[] | select(.contractAddress == "'"$GOVERNOR"'") | .blockNumber' "$DEPLOY_PATH" | tail -n 1)"
if [[ -z "$PROPOSAL_FROM_BLOCK" || "$PROPOSAL_FROM_BLOCK" == "null" ]]; then
  PROPOSAL_FROM_BLOCK=0
else
  PROPOSAL_FROM_BLOCK=$((16#${PROPOSAL_FROM_BLOCK#0x}))
fi

WALLETCONNECT_ID=""
if [[ -f "$ENV_PATH" ]]; then
  WALLETCONNECT_ID="$(grep -E '^NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=' "$ENV_PATH" | tail -n 1 | cut -d'=' -f2-)"
fi

cat > "$ENV_PATH" <<EOF
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${WALLETCONNECT_ID}
NEXT_PUBLIC_CHAIN_ID=${NETWORK}
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_GOVERNOR_ADDRESS=${GOVERNOR}
NEXT_PUBLIC_TOKEN_ADDRESS=${TOKEN}
NEXT_PUBLIC_TIMELOCK_ADDRESS=${TIMELOCK}
NEXT_PUBLIC_PROPOSAL_FROM_BLOCK=${PROPOSAL_FROM_BLOCK}
EOF

echo "Updated $ENV_PATH"
