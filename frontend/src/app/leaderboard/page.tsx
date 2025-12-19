'use client';

import { useEffect, useState } from 'react';
import { leaderboardApi } from '@/lib/api/leaderboard.api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Trophy, Crown, Target, Wallet } from 'lucide-react';
import { LeaderboardRowSkeleton, PodiumSkeleton } from '@/components/ui/Skeletons';

interface LeaderboardUser {
  _id: string;
  fullName: string;
  username: string;
  avatar?: string;
  completedChallenges: number;
  totalEarned?: number;
  points?: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const res = await leaderboardApi.getLeaderboard(20);
      if (res.success) {
        setUsers(res.data);
      }
    } catch {
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white mb-4 flex items-center justify-center gap-4">
              <Trophy className="w-12 h-12 text-yellow-400" />
              Hall of Fame
            </h1>
            <p className="text-xl text-white/50">
              Top performers committed to their goals
            </p>
          </div>

          {isLoading ? (
            <>
              <PodiumSkeleton />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <LeaderboardRowSkeleton key={i} index={i} />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* 3D Podium */}
              {top3.length >= 3 && (
                <div className="mb-16">
                  <div className="flex items-end justify-center gap-4">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center">
                      <PodiumUser user={top3[1]} rank={2} />
                      <div className="w-32 h-28 rounded-t-2xl bg-linear-to-b from-gray-400 to-gray-500 flex items-center justify-center shadow-xl border border-white/10">
                        <span className="text-6xl font-black text-white/80">2</span>
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center -mt-8">
                      <div className="mb-2">
                        <Crown className="w-10 h-10 text-yellow-400 animate-bounce" />
                      </div>
                      <PodiumUser user={top3[0]} rank={1} isWinner />
                      <div className="w-36 h-40 rounded-t-2xl bg-linear-to-b from-yellow-400 to-yellow-500 flex items-center justify-center shadow-2xl relative overflow-hidden border border-white/10">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        <span className="text-7xl font-black text-white/80">1</span>
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center">
                      <PodiumUser user={top3[2]} rank={3} />
                      <div className="w-32 h-24 rounded-t-2xl bg-linear-to-b from-orange-400 to-orange-500 flex items-center justify-center shadow-xl border border-white/10">
                        <span className="text-5xl font-black text-white/80">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rest of leaderboard */}
              <div className="space-y-3">
                {rest.map((user, index) => (
                  <div
                    key={user._id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 hover:border-white/20 transition-all"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Rank */}
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white/50 text-lg">
                      #{index + 4}
                    </div>

                    {/* Avatar */}
                    <div className="shrink-0">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.fullName}
                          width={48}
                          height={48}
                          className="rounded-full border-2 border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {user.fullName?.[0]}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{user.fullName}</p>
                      <p className="text-sm text-white/50">@{user.username}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1.5 text-indigo-400">
                          <Target className="w-4 h-4" />
                          <p className="text-2xl font-bold">{user.completedChallenges}</p>
                        </div>
                        <p className="text-xs text-white/40">Challenges</p>
                      </div>
                      {user.totalEarned && user.totalEarned > 0 && (
                        <div className="text-center hidden sm:block">
                          <div className="flex items-center gap-1.5 text-green-400">
                            <Wallet className="w-4 h-4" />
                            <p className="text-2xl font-bold">${user.totalEarned}</p>
                          </div>
                          <p className="text-xs text-white/40">Earned</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function PodiumUser({ user, rank, isWinner = false }: { user: LeaderboardUser; rank: number; isWinner?: boolean }) {
  const size = isWinner ? 'w-20 h-20' : 'w-16 h-16';
  const ringColor = rank === 1 ? 'ring-yellow-400' : rank === 2 ? 'ring-gray-400' : 'ring-orange-400';

  return (
    <div className="flex flex-col items-center mb-4">
      <div className={`${size} rounded-full ring-4 ${ringColor} shadow-xl overflow-hidden bg-[#0a0a1a] mb-2 hover:scale-110 transition-transform`}>
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.fullName}
            width={isWinner ? 80 : 64}
            height={isWinner ? 80 : 64}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
            {user.fullName?.[0]}
          </div>
        )}
      </div>
      <p className={`font-bold text-white ${isWinner ? 'text-lg' : 'text-sm'} text-center max-w-[100px] truncate`}>
        {user.fullName}
      </p>
      <p className="text-xs text-white/50">@{user.username}</p>
      <div className="mt-2 flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-medium px-3 py-1 rounded-full">
        <Target className="w-3 h-3" />
        <span>{user.completedChallenges}</span>
      </div>
    </div>
  );
}
