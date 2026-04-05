"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Extend the Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
      selectedAddress?: string;
      chainId?: string;
    };
  }
}
const GOVERNANCE_TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function getVotes(address) view returns (uint256)",
  "function delegate(address)",
  "function totalSupply() view returns (uint256)"
];

const GOVERNOR_ABI = [
  "function propose(address[],uint256[],bytes[],string) returns (uint256)",
  "function castVote(uint256,uint8)",
  "function queue(address[],uint256[],bytes[],bytes32)",
  "function execute(address[],uint256[],bytes[],bytes32)",
  "function state(uint256) view returns (uint8)",
  "function getVotes(address,uint256) view returns (uint256)",
  "function proposalThreshold() view returns (uint256)",
  "function votingDelay() view returns (uint256)",
  "function votingPeriod() view returns (uint256)"
];

const TIMELOCK_ABI = [
  "function getMinDelay() view returns (uint256)"
];

interface Proposal {
  id: number;
  description: string;
  state: string;
  forVotes: number;
  againstVotes: number;
  endTime: number;
}

interface DAOContextType {
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  tokenContract: ethers.Contract | null;
  governorContract: ethers.Contract | null;
  timelockContract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  balance: string;
  votingPower: string;
  proposals: Proposal[];
  loadProposals: () => Promise<void>;
}

const DAOContext = createContext<DAOContextType | undefined>(undefined);

// Contract addresses (replace with deployed addresses)
const TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with deployed address
const GOVERNOR_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Replace with deployed address
const TIMELOCK_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // Replace with deployed address

export const DAOProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [governorContract, setGovernorContract] = useState<ethers.Contract | null>(null);
  const [timelockContract, setTimelockContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState('0');
  const [votingPower, setVotingPower] = useState('0');
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const isConnected = !!account;

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        const address = await web3Signer.getAddress();

        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(address);

        // Initialize contracts (only if addresses are valid)
        if (TOKEN_ADDRESS !== '0x5FbDB2315678afecb367f032d93F642f64180aa3' && 
            GOVERNOR_ADDRESS !== '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' && 
            TIMELOCK_ADDRESS !== '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0') {
          const token = new ethers.Contract(TOKEN_ADDRESS, GOVERNANCE_TOKEN_ABI, web3Signer);
          const governor = new ethers.Contract(GOVERNOR_ADDRESS, GOVERNOR_ABI, web3Signer);
          const timelock = new ethers.Contract(TIMELOCK_ADDRESS, TIMELOCK_ABI, web3Signer);

          setTokenContract(token);
          setGovernorContract(governor);
          setTimelockContract(timelock);

          // Load user data
          await loadUserData(token, address);
        } else {
          console.warn('Contract addresses not configured. Please update TOKEN_ADDRESS, GOVERNOR_ADDRESS, and TIMELOCK_ADDRESS in DAOContext.tsx');
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setTokenContract(null);
    setGovernorContract(null);
    setTimelockContract(null);
    setBalance('0');
    setVotingPower('0');
  };

  const loadUserData = async (token: ethers.Contract, address: string) => {
    try {
      const bal = await token.balanceOf(address);
      const votes = await token.getVotes(address);
      setBalance(ethers.formatEther(bal));
      setVotingPower(ethers.formatEther(votes));
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadProposals = async () => {
    if (!governorContract) return;
    // In real app, you'd need to track proposal IDs
    // For demo, assume some proposals
    setProposals([
      {
        id: 1,
        description: 'Send 5 ETH to Marketing Team',
        state: 'Active',
        forVotes: 300000,
        againstVotes: 100000,
        endTime: Date.now() + 86400000 * 7
      }
    ]);
  };

  useEffect(() => {
    if (account && tokenContract) {
      loadUserData(tokenContract, account);
    }
  }, [account, tokenContract]);

  return (
    <DAOContext.Provider value={{
      provider,
      signer,
      account,
      tokenContract,
      governorContract,
      timelockContract,
      connectWallet,
      disconnectWallet,
      isConnected,
      balance,
      votingPower,
      proposals,
      loadProposals
    }}>
      {children}
    </DAOContext.Provider>
  );
};

export const useDAO = () => {
  const context = useContext(DAOContext);
  if (context === undefined) {
    throw new Error('useDAO must be used within a DAOProvider');
  }
  return context;
};