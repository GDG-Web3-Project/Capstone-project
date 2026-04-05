# Decentralized Governance DAO

This project implements a decentralized autonomous organization (DAO) using smart contracts on Ethereum. The system consists of three main components: a governance token, a governor contract, and a timelock controller.

## Architecture

- **GovernanceToken**: An ERC20 token with voting capabilities (ERC20Votes) that allows token holders to participate in governance.
- **GovernorContract**: Manages proposals, voting, and execution through the timelock.
- **Timelock**: A time-locked controller that holds the treasury funds and enforces delays on proposal execution.

## Features

- **Proposal Creation**: Token holders can propose actions like fund transfers.
- **Voting**: Token-weighted voting with configurable delay and period.
- **Timelock**: Mandatory delay (2 days) before proposal execution.
- **Quorum**: Minimum 4% of total supply must vote for quorum.

## Testing

The project uses Foundry for comprehensive testing:

- Unit tests for the full proposal and voting flow
- Time travel testing using `vm.warp` and `vm.roll`
- Gas usage analysis

Run tests with:
```bash
forge test
```

## Deployment

Deploy the contracts using the provided script:

```bash
forge script script/Deploy.s.sol --broadcast --rpc-url <your-rpc-url>
```

## Frontend

A modern, responsive Next.js frontend is included in the `frontend/` directory.

### Features
- Connect MetaMask wallet
- View token balance and voting power
- Create and vote on proposals
- Real-time proposal status updates
- Responsive design with dark mode

### Setup
```bash
cd frontend
npm install
npm run dev
```

## User Journey

1. **Proposal**: A token holder submits a proposal (e.g., "Send 5 ETH to Marketing Team").
2. **Voting**: Other token holders vote "Aye" or "Nay" during the voting period.
3. **Queue**: If passed, the proposal is queued for execution.
4. **Execution**: After the timelock delay, the proposal is executed automatically.

## Security

- No single person controls the funds; all actions require community approval.
- Timelock provides a safety window for the community to react.
- Voting power snapshots prevent manipulation.

## Foundry Advantages

- **Fork Testing**: Simulate interactions with real Ethereum assets.
- **Time Travel**: Test voting and timelock logic instantly.
- **Fuzzing**: Ensure voting math integrity with random inputs.
