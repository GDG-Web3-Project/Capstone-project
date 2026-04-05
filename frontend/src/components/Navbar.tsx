"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useDAO } from '@/contexts/DAOContext';
import WalletConnectModal from './WalletConnectModal';

export default function Navbar() {
  const { isConnected, account, disconnectWallet } = useDAO();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard', protected: true },
    { href: '/proposals', label: 'Proposals', protected: true },
    { href: '/create', label: 'Create', protected: true },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold text-slate-100">DAO Gov</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                (!item.protected || isConnected) && (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300 text-sm font-mono">
                      {shortenAddress(account || '')}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <span className="text-sm">🔗</span>
                  Connect Wallet
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-slate-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-slate-800 py-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  (!item.protected || isConnected) && (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 font-medium px-2 py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                ))}

                {isConnected ? (
                  <div className="flex items-center justify-between px-2 py-2 bg-slate-800 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-slate-300 text-sm font-mono">
                        {shortenAddress(account || '')}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setIsMenuOpen(false);
                      }}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowWalletModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg transition-all duration-200 w-full justify-center"
                  >
                    <span className="text-sm">🔗</span>
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Wallet Connect Modal */}
      {showWalletModal && (
        <WalletConnectModal onClose={() => setShowWalletModal(false)} />
      )}
    </>
  );
}