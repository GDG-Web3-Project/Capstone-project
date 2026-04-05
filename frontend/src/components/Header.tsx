"use client";

import { useDAO } from '@/contexts/DAOContext';

const Header = () => {
  const { account, connectWallet, disconnectWallet, isConnected, balance, votingPower } = useDAO();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          DAO Governance
        </h1>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <>
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm text-gray-600 dark:text-gray-400">Balance: {balance} GOV</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Voting Power: {votingPower}</span>
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </div>
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={connectWallet}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;