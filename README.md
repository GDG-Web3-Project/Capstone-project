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

### Deploy

```shell
cd contracts
forge script script/DeployDAO.s.sol:DeployDAO --rpc-url <your_rpc_url> --private-key <your_private_key>
```
