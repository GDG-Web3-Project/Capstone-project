"use client";

import { useState } from 'react';
import { useDAO } from '@/contexts/DAOContext';

interface WalletConnectModalProps {
  onClose: () => void;
}

export default function WalletConnectModal({ onClose }: WalletConnectModalProps) {
  const { connectWallet, isConnected } = useDAO();
  const [connecting, setConnecting] = useState<string | null>(null);

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect to your MetaMask wallet',
      popular: true
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect with WalletConnect protocol',
      popular: false
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '📱',
      description: 'Connect to Coinbase Wallet',
      popular: false
    },
    {
      id: 'freighter',
      name: 'Freighter',
      icon: '🚀',
      description: 'Connect to Freighter wallet',
      popular: false
    }
  ];

  const handleWalletConnect = async (walletId: string) => {
    setConnecting(walletId);
    try {
      await connectWallet();
      if (isConnected) {
        onClose();
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 animate-modal-appear">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>

          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Connect Wallet</h2>
              <p className="text-emerald-100 text-sm">Choose your preferred wallet</p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleWalletConnect(wallet.id)}
                disabled={connecting !== null}
                className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-xl border border-slate-600 hover:border-emerald-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center text-2xl group-hover:bg-emerald-600 transition-colors duration-200">
                      {wallet.icon}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-100">{wallet.name}</h3>
                        {wallet.popular && (
                          <span className="px-2 py-1 bg-emerald-600 text-xs text-white rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm">{wallet.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {connecting === wallet.id ? (
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-slate-700/50 rounded-xl border border-slate-600">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-white">ℹ️</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 mb-1">New to Web3?</h4>
                <p className="text-slate-400 text-sm mb-3">
                  A wallet lets you securely connect to the DAO platform, vote on proposals, and interact with treasury governance.
                </p>
                <a
                  href="/wallet-setup"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                >
                  Learn more about wallets
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}