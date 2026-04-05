"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDAO } from '@/contexts/DAOContext';
import Navbar from '@/components/Navbar';

export default function CreateProposalPage() {
  const { isConnected } = useDAO();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    estimatedCost: '',
    duration: '7' // days
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const categories = [
    'General',
    'Finance',
    'Development',
    'Marketing',
    'Community',
    'Governance',
    'Security'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (formData.estimatedCost && isNaN(Number(formData.estimatedCost))) {
      newErrors.estimatedCost = 'Estimated cost must be a valid number';
    }

    if (!formData.duration || isNaN(Number(formData.duration))) {
      newErrors.duration = 'Duration must be a valid number';
    } else if (Number(formData.duration) < 1 || Number(formData.duration) > 30) {
      newErrors.duration = 'Duration must be between 1 and 30 days';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock proposal creation - in real app this would interact with the contract
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // Redirect to proposals page with success message
      router.push('/proposals?created=true');
    } catch (error) {
      console.error('Error creating proposal:', error);
      setErrors({ submit: 'Failed to create proposal. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <Link
              href="/proposals"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Proposals
            </Link>

            <h1 className="text-4xl font-bold text-slate-100 mb-4">
              Create New Proposal
            </h1>
            <p className="text-slate-400 text-lg">
              Submit a proposal for community consideration and voting
            </p>
          </div>

          {/* Form */}
          <div className="glass rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-100 mb-2">
                  Proposal Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.title ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Enter a clear, descriptive title for your proposal"
                />
                {errors.title && (
                  <p className="mt-1 text-red-400 text-sm">{errors.title}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-100 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-slate-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-100 mb-2">
                  Proposal Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={8}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none ${
                    errors.description ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Provide detailed information about your proposal, including objectives, implementation plan, expected outcomes, and any relevant background information..."
                />
                {errors.description && (
                  <p className="mt-1 text-red-400 text-sm">{errors.description}</p>
                )}
                <p className="mt-2 text-slate-400 text-sm">
                  {formData.description.length}/5000 characters (minimum 50)
                </p>
              </div>

              {/* Estimated Cost */}
              <div>
                <label htmlFor="estimatedCost" className="block text-sm font-semibold text-slate-100 mb-2">
                  Estimated Cost (USD)
                </label>
                <input
                  type="number"
                  id="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.estimatedCost ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Leave blank if no budget is required"
                  min="0"
                  step="0.01"
                />
                {errors.estimatedCost && (
                  <p className="mt-1 text-red-400 text-sm">{errors.estimatedCost}</p>
                )}
              </div>

              {/* Voting Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-semibold text-slate-100 mb-2">
                  Voting Duration (Days) *
                </label>
                <input
                  type="number"
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.duration ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Number of days for voting (1-30)"
                  min="1"
                  max="30"
                />
                {errors.duration && (
                  <p className="mt-1 text-red-400 text-sm">{errors.duration}</p>
                )}
              </div>

              {/* Proposal Requirements */}
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Proposal Requirements</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>You must hold governance tokens to submit a proposal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Proposal will be reviewed by moderators before going to vote</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Minimum quorum of 100,000 votes required for validity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Successful proposals are queued for execution after voting period</span>
                  </li>
                </ul>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-400">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Proposal...
                    </div>
                  ) : (
                    '📝 Submit Proposal'
                  )}
                </button>

                <Link
                  href="/proposals"
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-all duration-200 text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-8 glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Need Help?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-100 mb-2">Writing Effective Proposals</h4>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Be specific about objectives and outcomes</li>
                  <li>• Include implementation timeline</li>
                  <li>• Provide budget breakdown if applicable</li>
                  <li>• Consider potential risks and mitigation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 mb-2">Getting Support</h4>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Discuss ideas in community forums</li>
                  <li>• Get feedback before submitting</li>
                  <li>• Join proposal working groups</li>
                  <li>• Contact governance facilitators</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}