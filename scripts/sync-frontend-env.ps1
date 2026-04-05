Param(
  [string]$Network = "84532"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$deployPath = Join-Path $repoRoot "contracts\broadcast\DeployDAO.s.sol\$Network\run-latest.json"
$envPath = Join-Path $repoRoot "frontend\.env.local"

if (-not (Test-Path $deployPath)) {
  Write-Error "Deploy file not found: $deployPath"
}

$json = Get-Content -Raw $deployPath | ConvertFrom-Json
$txs = $json.transactions
$receipts = $json.receipts

function Get-ContractAddress([string]$name) {
  return ($txs | Where-Object { $_.contractName -eq $name } | Select-Object -Last 1).contractAddress
}

function HexToInt([string]$hex) {
  if (-not $hex) { return $null }
  $clean = $hex.Replace("0x", "")
  return [Convert]::ToInt64($clean, 16)
}

$token = Get-ContractAddress "GovernanceToken"
$timelock = Get-ContractAddress "TimeLock"
$governor = Get-ContractAddress "GovernorContract"

if (-not $token -or -not $timelock -or -not $governor) {
  Write-Error "Missing contract addresses in deploy output."
}

$governorReceipt = $receipts | Where-Object { $_.contractAddress -eq $governor } | Select-Object -Last 1
$proposalFromBlock = HexToInt $governorReceipt.blockNumber
if (-not $proposalFromBlock) { $proposalFromBlock = 0 }

$existingLines = @()
if (Test-Path $envPath) {
  $existingLines = Get-Content $envPath
}

function Get-EnvValue([string[]]$lines, [string]$key) {
  foreach ($line in $lines) {
    if ($line.StartsWith("$key=")) {
      return $line.Substring($key.Length + 1)
    }
  }
  return ""
}

$walletConnect = Get-EnvValue $existingLines "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"

$envLines = @(
  "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$walletConnect",
  "NEXT_PUBLIC_CHAIN_ID=$Network",
  "NEXT_PUBLIC_RPC_URL=https://sepolia.base.org",
  "NEXT_PUBLIC_GOVERNOR_ADDRESS=$governor",
  "NEXT_PUBLIC_TOKEN_ADDRESS=$token",
  "NEXT_PUBLIC_TIMELOCK_ADDRESS=$timelock",
  "NEXT_PUBLIC_PROPOSAL_FROM_BLOCK=$proposalFromBlock"
)

$envLines | Set-Content -Path $envPath -Encoding UTF8
Write-Host "Updated $envPath"
