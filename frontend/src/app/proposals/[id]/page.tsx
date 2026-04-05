"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useDAO } from '@/contexts/DAOContext';
import Navbar from '@/components/Navbar';
import VoteModal from '@/components/VoteModal';

interface Proposal {
  id: number;
  description: string;
  state: string;
  forVotes: number;
  againstVotes: number;
  endTime: number;
  proposer: string;
  createdAt: number;
  executedAt?: number;
}

export default function ProposalDetailsPage() {
  const { id } = useParams();
  const { isConnected } = useDAO();
  const router = useRouter();
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Initialize mock data with fixed timestamps to avoid Date.now() in render
  const [proposal] = useState<Proposal>(() => ({
    id: parseInt(id as string),
    description: "Fund Q4 Marketing Campaign - $50,000 budget for community growth initiatives including social media advertising, content creation, and community events. This proposal aims to increase DAO visibility and attract new members to participate in governance.",
    state: "Active",
    forVotes: 125000,
    againstVotes: 25000,
    endTime: Date.now() + (86400000 * 3), // 3 days from now
    proposer: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    createdAt: Date.now() - (86400000 * 7), // 7 days ago
  }));

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const totalVotes = proposal.forVotes + proposal.againstVotes;
  const forPercentage = totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 0;
  const quorumRequired = 100000; // Mock quorum
  const quorumPercentage = (totalVotes / quorumRequired) * 100;

  const formatTimeLeft = (endTime: number) => {
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} days ${hours} hours left`;
    if (hours > 0) return `${hours} hours ${minutes} minutes left`;
    return `${minutes} minutes left`;
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'Active': return 'text-emerald-400 bg-emerald-500/20';
      case 'Succeeded': return 'text-blue-400 bg-blue-500/20';
      case 'Defeated': return 'text-red-400 bg-red-500/20';
      case 'Executed': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const timeline = [
    { status: 'Created', date: proposal.createdAt, completed: true },
    { status: 'Voting Started', date: proposal.createdAt + 86400000, completed: true },
    { status: 'Voting Period', date: proposal.endTime - 86400000 * 3, completed: proposal.state !== 'Pending' },
    { status: 'Voting Ended', date: proposal.endTime, completed: ['Succeeded', 'Defeated', 'Executed'].includes(proposal.state) },
    { status: 'Queued for Execution', date: proposal.endTime + 86400000, completed: proposal.state === 'Executed' },
    { status: 'Executed', date: proposal.executedAt || proposal.endTime + 86400000 * 2, completed: proposal.state === 'Executed' }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6 animate-fade-in">
            <Link
              href="/proposals"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Proposals
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Proposal Header */}
              <div className="glass rounded-2xl p-8 animate-fade-in">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">
                      Proposal #{proposal.id}
                    </h1>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.state)}`}>
                      <span className={`w-2 h-2 rounded-full ${
                        proposal.state === 'Active' ? 'bg-emerald-400' :
                        proposal.state === 'Succeeded' ? 'bg-blue-400' :
                        proposal.state === 'Defeated' ? 'bg-red-400' : 'bg-purple-400'
                      }`}></span>
                      {proposal.state}
                    </div>
                  </div>

                  {proposal.state === 'Active' && !hasVoted && (
                    <button
                      onClick={() => setShowVoteModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🗳️ Cast Vote
                    </button>
                  )}
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {proposal.description}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-slate-100 mb-2">Proposer</h3>
                      <p className="text-slate-400 font-mono text-sm">
                        {proposal.proposer}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 mb-2">Created</h3>
                      <p className="text-slate-400 text-sm">
                        {new Date(proposal.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Results */}
              <div className="glass rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold text-slate-100 mb-6">Voting Results</h2>

                <div className="space-y-6">
                  {/* Vote Counts */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">
                        {proposal.forVotes.toLocaleString()}
                      </div>
                      <div className="text-slate-300">For Votes</div>
                      <div className="text-sm text-slate-400 mt-1">
                        {forPercentage.toFixed(1)}%
                      </div>
                    </div>

                    <div className="text-center p-6 bg-red-500/10 rounded-xl border border-red-500/20">
                      <div className="text-3xl font-bold text-red-400 mb-2">
                        {proposal.againstVotes.toLocaleString()}
                      </div>
                      <div className="text-slate-300">Against Votes</div>
                      <div className="text-sm text-slate-400 mt-1">
                        {(100 - forPercentage).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                      <span>Voting Progress</span>
                      <span>{totalVotes.toLocaleString()} / {quorumRequired.toLocaleString()} votes</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(quorumPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-sm text-slate-400 mt-2">
                      {quorumPercentage.toFixed(1)}% of quorum reached
                    </div>
                  </div>

                  {/* Time Remaining */}
                  {proposal.state === 'Active' && (
                    <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                      <div className="text-lg font-semibold text-slate-100 mb-1">
                        ⏰ {formatTimeLeft(proposal.endTime)}
                      </div>
                      <div className="text-slate-400 text-sm">
                        Voting ends on {new Date(proposal.endTime).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Timeline */}
              <div className="glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Proposal Timeline</h3>

                <div className="space-y-4">
                  {timeline.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        step.completed ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}></div>
                      <div className="flex-1">
                        <div className={`font-medium ${step.completed ? 'text-slate-100' : 'text-slate-400'}`}>
                          {step.status}
                        </div>
                        <div className="text-sm text-slate-500">
                          {new Date(step.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Stats</h3>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Votes</span>
                    <span className="text-slate-100 font-semibold">{totalVotes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quorum Required</span>
                    <span className="text-slate-100 font-semibold">{quorumRequired.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Quorum</span>
                    <span className="text-emerald-400 font-semibold">{quorumPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Proposal ID</span>
                    <span className="text-slate-100 font-mono">#{proposal.id}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Actions</h3>

                <div className="space-y-3">
                  {proposal.state === 'Active' && !hasVoted && (
                    <button
                      onClick={() => setShowVoteModal(true)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      🗳️ Cast Your Vote
                    </button>
                  )}

                  {hasVoted && (
                    <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="text-emerald-400 font-semibold">✅ Vote Submitted</div>
                      <div className="text-slate-400 text-sm">Thank you for participating</div>
                    </div>
                  )}

                  <Link
                    href="/proposals"
                    className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-all duration-200 text-center block"
                  >
                    View All Proposals
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vote Modal */}
      {showVoteModal && (
        <VoteModal
          proposalId={proposal.id}
          onClose={() => {
            setShowVoteModal(false);
            setHasVoted(true);
          }}
        />
      )}
    </div>
  );
}