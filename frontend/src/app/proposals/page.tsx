"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDAO } from '@/contexts/DAOContext';
import Navbar from '@/components/Navbar';

interface Proposal {
  id: number;
  description: string;
  state: string;
  forVotes: number;
  againstVotes: number;
  endTime: number;
  proposer?: string;
}

export default function ProposalsPage() {
  const { isConnected, proposals, loadProposals } = useDAO();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'active' | 'passed' | 'rejected' | 'executed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
    loadProposals();
  }, [isConnected, router, loadProposals]);

  if (!isConnected) {
    return null;
  }

  // Mock data for demonstration - in real app this would come from the contract
  const mockProposals: Proposal[] = [
    {
      id: 1,
      description: "Fund Q4 Marketing Campaign - $50,000 budget for community growth initiatives",
      state: "Active",
      forVotes: 125000,
      againstVotes: 25000,
      endTime: Date.now() + 86400000 * 3, // 3 days from now
      proposer: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
      id: 2,
      description: "Upgrade Smart Contracts - Implement gas optimization and security improvements",
      state: "Active",
      forVotes: 98000,
      againstVotes: 52000,
      endTime: Date.now() + 86400000 * 7, // 7 days from now
      proposer: "0x8ba1f109551bD432803012645261768497d"
    },
    {
      id: 3,
      description: "Partnership with DeFi Protocol - Strategic alliance for cross-platform integration",
      state: "Succeeded",
      forVotes: 200000,
      againstVotes: 30000,
      endTime: Date.now() - 86400000 * 2, // 2 days ago
      proposer: "0x3f4E77b8c2a7c3b9F8c1D2e3A4b5C6d7E8f9A0b"
    },
    {
      id: 4,
      description: "Community Treasury Allocation - Distribute 10% of treasury to active contributors",
      state: "Defeated",
      forVotes: 75000,
      againstVotes: 125000,
      endTime: Date.now() - 86400000 * 5, // 5 days ago
      proposer: "0x1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T"
    },
    {
      id: 5,
      description: "Launch NFT Collection - Create limited edition governance NFTs for members",
      state: "Executed",
      forVotes: 180000,
      againstVotes: 20000,
      endTime: Date.now() - 86400000 * 10, // 10 days ago
      proposer: "0x9A8b7C6d5E4f3G2h1I0j9K8l7M6n5O4p3Q2r1S0t"
    }
  ];

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesFilter = filter === 'all' ||
      (filter === 'active' && proposal.state === 'Active') ||
      (filter === 'passed' && proposal.state === 'Succeeded') ||
      (filter === 'rejected' && proposal.state === 'Defeated') ||
      (filter === 'executed' && proposal.state === 'Executed');

    const matchesSearch = proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.id.toString().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'Active': return 'bg-emerald-500';
      case 'Succeeded': return 'bg-blue-500';
      case 'Defeated': return 'bg-red-500';
      case 'Executed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'Active': return '🟢';
      case 'Succeeded': return '✅';
      case 'Defeated': return '❌';
      case 'Executed': return '⚡';
      default: return '⏳';
    }
  };

  const formatTimeLeft = (endTime: number) => {
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-100 mb-2">Proposals</h1>
                <p className="text-slate-400">
                  Browse and vote on community proposals
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

          {/* Filters and Search */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search proposals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'All', count: mockProposals.length },
                    { key: 'active', label: 'Active', count: mockProposals.filter(p => p.state === 'Active').length },
                    { key: 'passed', label: 'Passed', count: mockProposals.filter(p => p.state === 'Succeeded').length },
                    { key: 'rejected', label: 'Rejected', count: mockProposals.filter(p => p.state === 'Defeated').length },
                    { key: 'executed', label: 'Executed', count: mockProposals.filter(p => p.state === 'Executed').length }
                  ].map(({ key, label, count }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key as any)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        filter === key
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Proposals Grid */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {filteredProposals.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProposals.map((proposal, index) => (
                  <Link
                    key={proposal.id}
                    href={`/proposals/${proposal.id}`}
                    className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-slide-in group"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getStatusColor(proposal.state)}`}>
                        {getStatusIcon(proposal.state)}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        proposal.state === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                        proposal.state === 'Succeeded' ? 'bg-blue-500/20 text-blue-400' :
                        proposal.state === 'Defeated' ? 'bg-red-500/20 text-red-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {proposal.state}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-100 mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                      {proposal.description}
                    </h3>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">For:</span>
                        <span className="text-emerald-400 font-medium">{proposal.forVotes.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Against:</span>
                        <span className="text-red-400 font-medium">{proposal.againstVotes.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${proposal.forVotes + proposal.againstVotes > 0 ?
                              (proposal.forVotes / (proposal.forVotes + proposal.againstVotes)) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Proposal #{proposal.id}</span>
                      <span className={proposal.state === 'Active' ? 'text-emerald-400' : 'text-slate-500'}>
                        {formatTimeLeft(proposal.endTime)}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>By:</span>
                        <span className="font-mono">
                          {proposal.proposer ? `${proposal.proposer.slice(0, 6)}...${proposal.proposer.slice(-4)}` : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">No proposals found</h3>
                <p className="text-slate-400 mb-6">
                  {searchTerm ? 'Try adjusting your search terms or filters' : 'No proposals match the selected filter'}
                </p>
                <button
                  onClick={() => {
                    setFilter('all');
                    setSearchTerm('');
                  }}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Proposal Statistics</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    {mockProposals.filter(p => p.state === 'Active').length}
                  </div>
                  <div className="text-slate-400 text-sm">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {mockProposals.filter(p => p.state === 'Succeeded').length}
                  </div>
                  <div className="text-slate-400 text-sm">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    {mockProposals.filter(p => p.state === 'Defeated').length}
                  </div>
                  <div className="text-slate-400 text-sm">Rejected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {mockProposals.filter(p => p.state === 'Executed').length}
                  </div>
                  <div className="text-slate-400 text-sm">Executed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}