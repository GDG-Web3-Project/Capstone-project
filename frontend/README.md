# DAO Governance Frontend

A modern, responsive frontend for the decentralized governance DAO built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Wallet Connection**: Connect MetaMask or other Web3 wallets
- **Proposal Management**: View, create, and vote on proposals
- **Real-time Updates**: Live proposal states and voting results
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Mode**: Automatic dark/light theme support
- **Modern UI**: Gradient backgrounds, smooth animations, and stunning visuals

## Tech Stack

- **Next.js 14** - React framework with app router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Ethers.js** - Ethereum blockchain interaction
- **Context API** - State management

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Journey

1. **Connect Wallet**: Click "Connect Wallet" to link your MetaMask
2. **View Dashboard**: See your token balance and voting power
3. **Browse Proposals**: Check active proposals with voting progress
4. **Create Proposal**: Submit new proposals for fund transfers
5. **Vote**: Cast votes on active proposals using your voting power
6. **Track Execution**: Monitor proposal states through queue and execution

## Smart Contract Integration

The frontend interacts with three main contracts:
- **GovernanceToken**: ERC20Votes for token holding and delegation
- **GovernorContract**: Manages proposals, voting, and execution
- **TimelockController**: Enforces 2-day delay on fund movements

## UI Highlights

- **Gradient Backgrounds**: Beautiful blue-to-indigo gradients
- **Card Animations**: Hover effects and smooth transitions
- **Progress Bars**: Visual voting results
- **Modal Dialogs**: Clean proposal creation and voting interfaces
- **Responsive Grid**: Adapts to different screen sizes

## Security

- Client-side validation for proposal creation
- MetaMask integration for secure transactions
- Read-only operations for non-connected users
