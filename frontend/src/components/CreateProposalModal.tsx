"use client";

import { useState } from 'react';
import { ethers } from 'ethers';
import { useDAO } from '@/contexts/DAOContext';

interface CreateProposalModalProps {
  onClose: () => void;
}

const CreateProposalModal = ({ onClose }: CreateProposalModalProps) => {
  const { governorContract, timelockContract } = useDAO();
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleCreate = async () => {
    if (!governorContract || !timelockContract) return;

    setLoading(true);
    try {
      const targets = [recipient];
      const values = [ethers.parseEther(amount)];
      const calldatas = ['0x']; // Simple ETH transfer
      const desc = `Send ${amount} ETH to ${recipient}: ${description}`;

      setStep(2); // Move to processing step
      const tx = await governorContract.propose(targets, values, calldatas, desc);

      setStep(3); // Move to confirmation step
      await tx.wait();

      setStep(4); // Success step
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Proposal creation failed:', error);
      alert('Proposal creation failed. Please try again.');
      setStep(1);
      setLoading(false);
    }
  };

  const isFormValid = description.trim() && recipient.trim() && amount && parseFloat(amount) > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 animate-modal-appear">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create New Proposal</h2>
                <p className="text-blue-100 text-sm">Submit your idea to the community</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="relative mt-6">
            <div className="flex items-center justify-between">
              {[
                { label: 'Details', icon: '📝' },
                { label: 'Processing', icon: '⚙️' },
                { label: 'Confirming', icon: '⏳' },
                { label: 'Success', icon: '✅' }
              ].map((stepItem, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step > index + 1
                      ? 'bg-blue-500 text-white'
                      : step === index + 1
                      ? 'bg-white text-purple-700 animate-pulse'
                      : 'bg-white bg-opacity-30 text-white'
                  }`}>
                    {step > index + 1 ? '✓' : stepItem.icon}
                  </div>
                  <span className={`text-xs mt-2 ${step >= index + 1 ? 'text-white' : 'text-white text-opacity-60'}`}>
                    {stepItem.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-white bg-opacity-30">
              <div
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Description Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  Proposal Description
                </label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your proposal in detail. What problem does it solve? How will it benefit the community?"
                    className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none min-h-[120px]"
                    rows={4}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {description.length}/500
                  </div>
                </div>
              </div>

              {/* Recipient Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  Recipient Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                    className="w-full p-4 pl-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span className="text-lg">🔗</span>
                  </div>
                </div>
              </div>

              {/* Amount Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  Amount (ETH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.01"
                    min="0"
                    className="w-full p-4 pl-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span className="text-lg">Ξ</span>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {isFormValid && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-blue-200 dark:border-gray-500">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-lg">👀</span>
                    Preview
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Send {amount} ETH</strong> to {recipient.slice(0, 6)}...{recipient.slice(-4)}: {description}
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4 animate-spin">
                <span className="text-2xl text-white">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Processing Your Proposal
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Submitting to the blockchain...
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
                <span className="text-2xl text-white">⏳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Confirming Transaction
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Waiting for blockchain confirmation...
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4 animate-bounce">
                <span className="text-2xl text-white">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Proposal Created Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your proposal has been submitted to the DAO.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 1 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-8 py-6 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!isFormValid || loading}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 font-semibold shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg"></span>
                  Create Proposal
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProposalModal;