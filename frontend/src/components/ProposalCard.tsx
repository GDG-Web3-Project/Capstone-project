"use client";

import { useState, useEffect } from 'react';
import { useDAO } from '@/contexts/DAOContext';
import VoteModal from './VoteModal';

interface Proposal {
  id: number;
  description: string;
  state: string;
  forVotes: number;
  againstVotes: number;
  endTime: number;
}

interface ProposalCardProps {
  proposal: Proposal;
}

const ProposalCard = ({ proposal }: ProposalCardProps) => {
  const { votingPower } = useDAO();
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const totalVotes = proposal.forVotes + proposal.againstVotes;
  const forPercentage = totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 0;

  useEffect(() => {
    const updateTimeLeft = () => {
      setTimeLeft(Math.max(0, Math.floor((proposal.endTime - Date.now()) / (1000 * 60 * 60 * 24))));
    };
    
    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [proposal.endTime]);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Succeeded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Defeated': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Queued': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
            {proposal.description}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(proposal.state)}`}>
            {proposal.state}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>For: {proposal.forVotes.toLocaleString()}</span>
              <span>Against: {proposal.againstVotes.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${forPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Total Votes: {totalVotes.toLocaleString()}</span>
            <span>{timeLeft} days left</span>
          </div>

          {proposal.state === 'Active' && parseFloat(votingPower) > 0 && (
            <button
              onClick={() => setShowVoteModal(true)}
              className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
            >
              Vote ({votingPower} power)
            </button>
          )}

          {proposal.state === 'Succeeded' && (
            <button className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200">
              Queue for Execution
            </button>
          )}

          {proposal.state === 'Queued' && (
            <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200">
              Execute Proposal
            </button>
          )}
        </div>
      </div>

      {showVoteModal && (
        <VoteModal
          proposalId={proposal.id}
          onClose={() => setShowVoteModal(false)}
        />
      )}
    </div>
  );
};

export default ProposalCard;