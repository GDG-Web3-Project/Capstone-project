"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDAO } from '@/contexts/DAOContext';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const { isConnected, account, balance, votingPower, proposals, loadProposals } = useDAO();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
    loadProposals();
  }, [isConnected, router, loadProposals]);

  if (!isConnected) {
    return null; // Will redirect
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const stats = [
    {
      title: 'Treasury Balance',
      value: `${parseFloat(balance).toFixed(4)} ETH`,
      icon: '💰',
      color: 'from-emerald-500 to-teal-500',
      change: '+2.5%'
    },
    {
      title: 'Your Voting Power',
      value: parseFloat(votingPower).toFixed(2),
      icon: '⚡',
      color: 'from-blue-500 to-cyan-500',
      change: '+15.2%'
    },
    {
      title: 'Active Proposals',
      value: proposals.length.toString(),
      icon: '📋',
      color: 'from-purple-500 to-pink-500',
      change: '+3'
    },
    {
      title: 'Executed Proposals',
      value: '12',
      icon: '✅',
      color: 'from-green-500 to-emerald-500',
      change: '+2'
    }
  ];

  const recentActivity = [
    {
      type: 'vote',
      description: 'You voted "For" on proposal #3',
      time: '2 hours ago',
      icon: '🗳️'
    },
    {
      type: 'proposal',
      description: 'New proposal created: "Q4 Marketing Budget"',
      time: '1 day ago',
      icon: '📝'
    },
    {
      type: 'execution',
      description: 'Proposal #1 executed successfully',
      time: '2 days ago',
      icon: '⚡'
    },
    {
      type: 'vote',
      description: 'Proposal #2 reached quorum',
      time: '3 days ago',
      icon: '🎯'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-100 mb-2">Dashboard</h1>
                <p className="text-slate-400">
                  Welcome back, {shortenAddress(account || '')}
                </p>
              </div>
              <div className="mt-4 lg:mt-0">
                <Link
                  href="/create"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <span>✨</span>
                  Create Proposal
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-emerald-400 font-medium">{stat.change}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-1">{stat.value}</h3>
                  <p className="text-slate-400 text-sm">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Proposals */}
            <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-100">Recent Proposals</h2>
                  <Link
                    href="/proposals"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                  >
                    View all →
                  </Link>
                </div>

                {proposals.length > 0 ? (
                  <div className="space-y-4">
                    {proposals.slice(0, 3).map((proposal) => (
                      <div key={proposal.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:bg-slate-800/70 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            proposal.state === 'Active' ? 'bg-emerald-600' :
                            proposal.state === 'Succeeded' ? 'bg-blue-600' :
                            proposal.state === 'Defeated' ? 'bg-red-600' : 'bg-gray-600'
                          }`}>
                            {proposal.state === 'Active' ? '🟢' :
                             proposal.state === 'Succeeded' ? '✅' :
                             proposal.state === 'Defeated' ? '❌' : '⏳'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-100 line-clamp-1">
                              {proposal.description}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              Proposal #{proposal.id} • {proposal.state}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-100 font-semibold">
                            {proposal.forVotes + proposal.againstVotes} votes
                          </div>
                          <div className="text-slate-400 text-sm">
                            {Math.floor((proposal.endTime - Date.now()) / (1000 * 60 * 60 * 24))} days left
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📋</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">No proposals yet</h3>
                    <p className="text-slate-400 mb-4">Be the first to create a proposal for the DAO</p>
                    <Link
                      href="/create"
                      className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-semibold transition-all duration-200"
                    >
                      Create Proposal
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="glass rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">Recent Activity</h2>

                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-100 text-sm leading-relaxed">
                          {activity.description}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700">
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-100 mb-2">DAO Mission</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      "Building a transparent and community-driven governance system that empowers token holders to shape the future of decentralized finance."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Quick Actions</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <Link
                  href="/create"
                  className="group p-6 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Create Proposal</h3>
                  <p className="text-slate-400 text-sm">Submit a new proposal for community voting</p>
                </Link>

                <Link
                  href="/proposals"
                  className="group p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🗳️</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Vote on Proposals</h3>
                  <p className="text-slate-400 text-sm">Participate in active governance decisions</p>
                </Link>

                <div className="group p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">View Analytics</h3>
                  <p className="text-slate-400 text-sm">Track voting patterns and proposal success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}