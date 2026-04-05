"use client";

import { useState } from 'react';
import { useDAO } from '@/contexts/DAOContext';

interface VoteModalProps {
  proposalId: number;
  onClose: () => void;
}

const VoteModal = ({ proposalId, onClose }: VoteModalProps) => {
  const { governorContract, votingPower } = useDAO();
  const [vote, setVote] = useState<'for' | 'against'>('for');
  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    if (!governorContract) return;

    setLoading(true);
    try {
      const tx = await governorContract.castVote(proposalId, vote === 'for' ? 1 : 0);
      await tx.wait();
      alert('Vote cast successfully!');
      onClose();
    } catch (error) {
      console.error('Voting failed:', error);
      alert('Voting failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Cast Your Vote
        </h3>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your voting power: <span className="font-semibold text-blue-600">{votingPower}</span>
          </p>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="vote"
                value="for"
                checked={vote === 'for'}
                onChange={() => setVote('for')}
                className="mr-3"
              />
              <span className="text-green-600 font-medium">For ✅</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="vote"
                value="against"
                checked={vote === 'against'}
                onChange={() => setVote('against')}
                className="mr-3"
              />
              <span className="text-red-600 font-medium">Against ❌</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleVote}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Voting...' : 'Cast Vote'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteModal;