"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function WalletSetupPage() {
  const wallets = [
    {
      name: 'MetaMask',
      icon: '🦊',
      description: 'The most popular Web3 wallet with millions of users worldwide.',
      features: ['Browser extension', 'Mobile app', 'Hardware wallet support', 'DeFi integration'],
      downloadUrl: 'https://metamask.io/download/',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Coinbase Wallet',
      icon: '📱',
      description: 'Secure wallet from Coinbase with built-in exchange features.',
      features: ['Mobile first', 'Built-in exchange', 'NFT support', 'Easy to use'],
      downloadUrl: 'https://www.coinbase.com/wallet',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Freighter',
      icon: '🚀',
      description: 'Fast and secure wallet for Stellar network and beyond.',
      features: ['Lightning fast', 'Multi-network', 'Hardware wallet ready', 'Developer friendly'],
      downloadUrl: 'https://www.freighter.app/',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Mobile-first wallet with advanced security features.',
      features: ['Mobile optimized', 'DApp browser', 'Staking support', 'Multi-chain'],
      downloadUrl: 'https://trustwallet.com/',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-slate-100 mb-6">
              Get Started with
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Web3 Wallets
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              A wallet is your gateway to the decentralized world. It securely stores your digital assets
              and lets you interact with blockchain applications like our DAO governance platform.
            </p>
          </div>

          {/* What is a Wallet Section */}
          <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-100 mb-4">What is a Web3 Wallet?</h2>
                <p className="text-slate-400 text-lg">
                  Think of it as your digital bank account for the decentralized internet
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🔐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 mb-2">Secure Storage</h3>
                      <p className="text-slate-400 text-sm">
                        Your private keys and assets are stored securely, giving you full control over your funds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🗳️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 mb-2">Voting Power</h3>
                      <p className="text-slate-400 text-sm">
                        Use your governance tokens to vote on proposals and influence DAO decisions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🌐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 mb-2">DApp Access</h3>
                      <p className="text-slate-400 text-sm">
                        Connect to decentralized applications and interact with smart contracts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">💎</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 mb-2">NFT & Tokens</h3>
                      <p className="text-slate-400 text-sm">
                        Store and manage your NFTs, tokens, and other digital collectibles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Options */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-100 mb-4">Choose Your Wallet</h2>
              <p className="text-slate-400 text-lg">
                Select a wallet that fits your needs and start your Web3 journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {wallets.map((wallet, index) => (
                <div
                  key={wallet.name}
                  className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300 animate-slide-in"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${wallet.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                      {wallet.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-100">{wallet.name}</h3>
                      <p className="text-slate-400">{wallet.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-100 mb-3">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {wallet.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={wallet.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>Download {wallet.name}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Already have a wallet? */}
          <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-100 mb-4">Already have a wallet?</h3>
              <p className="text-slate-400 mb-6">
                Great! Connect your existing wallet to start participating in DAO governance.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span>🔗</span>
                Connect Wallet
              </Link>
            </div>
          </div>

          {/* Security Tips */}
          <div className="mt-16 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-slate-100 mb-4">Security Best Practices</h3>
                <p className="text-slate-400">Keep your assets safe in the Web3 world</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">🔑</span>
                  </div>
                  <h4 className="font-semibold text-slate-100 mb-2">Backup Your Seed Phrase</h4>
                  <p className="text-slate-400 text-sm">
                    Never share your recovery phrase. Store it securely offline.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">🔒</span>
                  </div>
                  <h4 className="font-semibold text-slate-100 mb-2">Use Hardware Wallets</h4>
                  <p className="text-slate-400 text-sm">
                    For large amounts, consider hardware wallets for extra security.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">✅</span>
                  </div>
                  <h4 className="font-semibold text-slate-100 mb-2">Verify URLs</h4>
                  <p className="text-slate-400 text-sm">
                    Always check you're on the correct website before connecting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}