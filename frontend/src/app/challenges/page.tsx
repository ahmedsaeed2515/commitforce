'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { challengeApi } from '@/lib/api/challenge.api';
import toast from 'react-hot-toast';
import { 
  Target, Activity, CheckCircle, XCircle, Plus, Users, Search, Calendar,
  TrendingUp, Wallet, Clock, ChevronRight, Camera, Dumbbell, BookOpen, 
  Code, Salad, Zap, GraduationCap, Heart, Sparkles, Filter
} from 'lucide-react';
import { ChallengeGridSkeleton } from '@/components/ui/Skeletons';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  startDate: string;
  endDate: string;
  deposit?: {
    amount: number;
    currency: string;
  };
  progress?: number;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  fitness: Dumbbell,
  reading: BookOpen,
  coding: Code,
  nutrition: Salad,
  productivity: Zap,
  learning: GraduationCap,
  health: Heart,
  meditation: Sparkles,
  other: Target
};

const statusConfig: Record<string, { gradient: string; border: string; badge: string; Icon: React.ComponentType<{ className?: string }> }> = {
  active: { 
    gradient: 'from-green-500/20 to-emerald-500/20', 
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-400',
    Icon: Activity
  },
  completed: { 
    gradient: 'from-blue-500/20 to-indigo-500/20', 
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-400',
    Icon: CheckCircle
  },
  failed: { 
    gradient: 'from-red-500/20 to-pink-500/20', 
    border: 'border-red-500/30',
    badge: 'bg-red-500/20 text-red-400',
    Icon: XCircle
  },
  draft: { 
    gradient: 'from-gray-500/20 to-slate-500/20', 
    border: 'border-gray-500/30',
    badge: 'bg-gray-500/20 text-gray-400',
    Icon: Target
  },
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchChallenges = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await challengeApi.getAll();
      if (response.success) {
        const data = response.data.challenges || response.data;
        setChallenges(data);
        setFilteredChallenges(data);
      }
    } catch {
      toast.error('Failed to fetch challenges');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  useEffect(() => {
    let filtered = challenges;
    
    if (filter !== 'all') {
      filtered = filtered.filter(c => c.status === filter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredChallenges(filtered);
  }, [filter, challenges, searchQuery]);

  const getChallengeProgress = (challenge: Challenge) => {
    const start = new Date(challenge.startDate).getTime();
    const end = new Date(challenge.endDate).getTime();
    const now = Date.now();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const stats = {
    total: challenges.length,
    active: challenges.filter(c => c.status === 'active').length,
    completed: challenges.filter(c => c.status === 'completed').length,
    totalStaked: challenges.reduce((sum, c) => sum + (c.deposit?.amount || 0), 0),
    successRate: challenges.length > 0 
      ? Math.round((challenges.filter(c => c.status === 'completed').length / challenges.length) * 100) 
      : 0,
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Target className="w-8 h-8 text-indigo-400" />
                Your Challenges
              </h1>
              <p className="text-white/50">Track and manage your commitments</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/challenges/create" 
                className="relative group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition" />
                <div className="relative bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-indigo-400 hover:to-purple-500 transition-all">
                  <Plus className="w-5 h-5" />
                  Solo Challenge
                </div>
              </Link>
              <Link 
                href="/challenges/create-group" 
                className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                <Users className="w-5 h-5" />
                Group
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total', value: stats.total, Icon: Target, color: 'from-indigo-500/20 to-indigo-500/5', border: 'border-indigo-500/20', iconColor: 'text-indigo-400' },
              { label: 'Active', value: stats.active, Icon: Activity, color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20', iconColor: 'text-green-400' },
              { label: 'Completed', value: stats.completed, Icon: CheckCircle, color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20', iconColor: 'text-blue-400' },
              { label: 'Total Staked', value: `$${stats.totalStaked}`, Icon: Wallet, color: 'from-yellow-500/20 to-yellow-500/5', border: 'border-yellow-500/20', iconColor: 'text-yellow-400' },
              { label: 'Success Rate', value: `${stats.successRate}%`, Icon: TrendingUp, color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20', iconColor: 'text-purple-400' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className={`bg-linear-to-br ${stat.color} backdrop-blur-sm border ${stat.border} rounded-2xl p-4 hover:scale-[1.02] transition-all`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  <span className="text-sm text-white/50">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
              {[
                { key: 'all', label: 'All', Icon: Filter },
                { key: 'active', label: 'Active', Icon: Activity },
                { key: 'completed', label: 'Done', Icon: CheckCircle },
                { key: 'failed', label: 'Failed', Icon: XCircle },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all flex items-center gap-1.5 ${
                    filter === item.key
                      ? 'bg-indigo-500 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.Icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Challenges Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ChallengeGridSkeleton key={i} />
              ))}
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <Target className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {searchQuery || filter !== 'all' ? 'No Challenges Found' : 'No Challenges Yet'}
              </h3>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                {searchQuery || filter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start your journey by creating your first challenge. Put your money where your goals are!'}
              </p>
              {!searchQuery && filter === 'all' && (
                <Link 
                  href="/challenges/create" 
                  className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Challenge
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge, index) => {
                const config = statusConfig[challenge.status] || statusConfig.draft;
                const CategoryIcon = categoryIcons[challenge.category] || Target;
                const progress = getChallengeProgress(challenge);
                const daysLeft = getDaysRemaining(challenge.endDate);

                return (
                  <Link
                    key={challenge._id}
                    href={`/challenges/${challenge._id}`}
                    className={`group bg-linear-to-br ${config.gradient} backdrop-blur-sm border ${config.border} rounded-2xl overflow-hidden hover:scale-[1.02] transition-all`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center">
                            <CategoryIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                              {challenge.title}
                            </h3>
                            <p className="text-sm text-white/50 capitalize">{challenge.category}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.badge}`}>
                          <config.Icon className="w-3 h-3" />
                          {challenge.status}
                        </span>
                      </div>

                      <p className="text-sm text-white/60 line-clamp-2 mb-4 min-h-[40px]">
                        {challenge.description || 'No description provided'}
                      </p>

                      {/* Progress Bar for Active */}
                      {challenge.status === 'active' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-white/50">Progress</span>
                            <span className="text-indigo-400 font-medium">{progress}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          {challenge.deposit && challenge.deposit.amount > 0 && (
                            <span className="text-green-400 font-semibold flex items-center gap-1">
                              <Wallet className="w-4 h-4" />
                              ${challenge.deposit.amount}
                            </span>
                          )}
                          {challenge.status === 'active' && daysLeft > 0 && (
                            <span className="text-white/50 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {daysLeft} days
                            </span>
                          )}
                        </div>
                        <div className="text-white/40 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(challenge.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
                      <span className="text-sm text-white/50">
                        {challenge.status === 'active' ? 'Ready to check in?' : 'View details'}
                      </span>
                      <span className="text-indigo-400 font-medium text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        {challenge.status === 'active' ? (
                          <>
                            <Camera className="w-4 h-4" />
                            Check In
                          </>
                        ) : 'Details'}
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
