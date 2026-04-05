# Capstone DAO

A token-based governance system with a timelocked treasury. This repo is a monorepo with smart contracts in Foundry and a Next.js frontend.

## Structure

- contracts/ - Foundry project (Solidity contracts, scripts, tests)
- frontend/ - Next.js app (UI for proposals, voting, and execution)

## Contracts

Run all Foundry commands from the contracts directory.

```shell
cd contracts
forge build
forge test
forge fmt
```

### Environment

Copy the example env file and set your RPC and private key locally.

```shell
cd contracts
cp .env.example .env
```

### Deploy

```shell
cd contracts
forge script script/DeployDAO.s.sol:DeployDAO --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Sync frontend env

Update frontend env values from the latest deploy output.

```powershell
./scripts/sync-frontend-env.ps1
```

### Verify (Base Sepolia)

Set a BaseScan API key in your shell and then verify each contract.

```shell
cd contracts
export BASESCAN_API_KEY=<your_basescan_api_key>

forge verify-contract \
	--chain-id 84532 \
	--num-of-optimizations 200 \
	--via-ir \
	--compiler-version v0.8.33 \
	0x9aFB588A9e165663Ef7988348a23E8fF88c0BB03 \
	src/GovernanceToken.sol:GovernanceToken \
	--constructor-args $(cast abi-encode "constructor(address)" 0x9139F0cfd25408972CDE3194f465a146714C4129) \
	--verifier basescan \
	--verifier-api-key $BASESCAN_API_KEY

forge verify-contract \
	--chain-id 84532 \
	--num-of-optimizations 200 \
	--via-ir \
	--compiler-version v0.8.33 \
	0xf030609fbBD06402A718CCcE781A59DcDd93858f \
	src/TimeLock.sol:TimeLock \
	--constructor-args $(cast abi-encode "constructor(uint256,address[],address[],address)" 172800 [] [] 0x9139F0cfd25408972CDE3194f465a146714C4129) \
	--verifier basescan \
	--verifier-api-key $BASESCAN_API_KEY

forge verify-contract \
	--chain-id 84532 \
	--num-of-optimizations 200 \
	--via-ir \
	--compiler-version v0.8.33 \
	0x60033dbd68527fe62c75eC5D250721E456Bf8073 \
	src/GovernorContract.sol:GovernorContract \
	--constructor-args $(cast abi-encode "constructor(address,address)" 0x9aFB588A9e165663Ef7988348a23E8fF88c0BB03 0xf030609fbBD06402A718CCcE781A59DcDd93858f) \
	--verifier basescan \
	--verifier-api-key $BASESCAN_API_KEY
```
