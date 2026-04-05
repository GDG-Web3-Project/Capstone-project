"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useDAO } from '@/contexts/DAOContext';
import WalletConnectModal from '@/components/WalletConnectModal';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  const { isConnected } = useDAO();
  const [showWalletModal, setShowWalletModal] = useState(false);

  if (isConnected) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-100 mb-4">
                Welcome to DAO Governance
              </h1>
              <p className="text-xl text-slate-400 mb-8">
                Access your dashboard and participate in community governance
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-teal-900/20"></div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f766e' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-100 mb-6">
                Decentralized
                <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Governance
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join a community-driven DAO where token holders vote on proposals,
                control treasury funds, and shape the future of decentralized governance.
              </p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3"
                >
                  <span className="text-2xl">🔗</span>
                  Connect Wallet
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </button>

                <Link
                  href="/wallet-setup"
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg border border-slate-700"
                >
                  Get Wallet
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="glass rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🗳️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Token-Based Voting</h3>
                  <p className="text-slate-400 text-sm">
                    Vote on proposals with your governance tokens. Your voting power reflects your stake in the community.
                  </p>
                </div>

                <div className="glass rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Treasury Control</h3>
                  <p className="text-slate-400 text-sm">
                    Community-controlled treasury funds proposals for development, marketing, and ecosystem growth.
                  </p>
                </div>

                <div className="glass rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Secure & Transparent</h3>
                  <p className="text-slate-400 text-sm">
                    All proposals and votes are recorded on-chain, ensuring transparency and immutability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">How DAO Governance Works</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A simple, transparent process for community decision-making
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Link your Web3 wallet to access the governance platform",
                icon: "🔗"
              },
              {
                step: "02",
                title: "Review Proposals",
                description: "Browse active proposals and understand their impact",
                icon: "📋"
              },
              {
                step: "03",
                title: "Cast Your Vote",
                description: "Use your voting power to support or oppose proposals",
                icon: "🗳️"
              },
              {
                step: "04",
                title: "Execute Decisions",
                description: "Approved proposals are executed through smart contracts",
                icon: "⚡"
              }
            ].map((item, index) => (
              <div key={index} className="text-center animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.icon}
                </div>
                <div className="text-sm text-emerald-400 font-semibold mb-2">{item.step}</div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-100 mb-6">
            Ready to Shape the Future?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of community members in decentralized governance
          </p>
          <button
            onClick={() => setShowWalletModal(true)}
            className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Wallet Connect Modal */}
      {showWalletModal && (
        <WalletConnectModal onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
}
