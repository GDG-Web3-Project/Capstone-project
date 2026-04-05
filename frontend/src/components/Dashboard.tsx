"use client";

import { useState, useEffect } from 'react';
import { useDAO } from '@/contexts/DAOContext';
import ProposalCard from './ProposalCard';
import CreateProposalModal from './CreateProposalModal';

const Dashboard = () => {
  const { isConnected, proposals, loadProposals, votingPower, balance } = useDAO();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadProposals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]); // Intentionally excluding loadProposals to prevent infinite loop

  const handleCreateProposal = () => {
    setShowCreateModal(true);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadProposals();
    setIsLoading(false);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center max-w-2xl mx-auto px-6">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-700 rounded-full blur-3xl opacity-25 animate-pulse"></div>
            <div className="relative w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full mx-auto flex items-center justify-center shadow-2xl animate-bounce">
              <span className="text-6xl">🗳️</span>
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-6">
            DAO Governance Platform
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Join the future of decentralized decision-making. Connect your wallet to participate in community governance and shape the future together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Secure & Decentralized</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Community Driven</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm">Transparent</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Stats Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Your Balance</p>
                  <p className="text-2xl font-bold">{parseFloat(balance).toFixed(4)} ETH</p>
                </div>
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Voting Power</p>
                  <p className="text-2xl font-bold">{parseFloat(votingPower).toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Proposals</p>
                  <p className="text-2xl font-bold">{proposals.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              Active Proposals
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and vote on community proposals
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <span className={`text-lg ${isLoading ? 'animate-spin' : ''}`}>🔄</span>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>

            <button
              onClick={handleCreateProposal}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-2 font-semibold"
            >
              <span className="text-xl">✨</span>
              Create Proposal
            </button>
          </div>
        </div>

        {/* Proposals Grid */}
        {proposals.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {proposals.map((proposal, index) => (
              <div
                key={proposal.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProposalCard proposal={proposal} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-3xl opacity-20"></div>
              <div className="relative w-32 h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto flex items-center justify-center shadow-xl">
                <span className="text-6xl">📋</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No Active Proposals Yet
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Be the first to create a proposal and start shaping the future of our DAO!
            </p>

            <button
              onClick={handleCreateProposal}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold text-lg"
            >
              Create the First Proposal
            </button>
          </div>
        )}

        {/* Create Proposal Modal */}
        {showCreateModal && (
          <CreateProposalModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;