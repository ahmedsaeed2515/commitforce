'use client';

import { useEffect, useState } from 'react';
import { leaderboardApi } from '@/lib/api/leaderboard.api';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const res = await leaderboardApi.getLeaderboard(20); // Top 20
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-100 border-yellow-400 text-yellow-800'; // Gold
      case 1: return 'bg-gray-100 border-gray-400 text-gray-800';     // Silver
      case 2: return 'bg-orange-100 border-orange-400 text-orange-800'; // Bronze
      default: return 'bg-white border-gray-100 text-gray-600';
    }
  };

  const getMedal = (index: number) => {
    switch (index) {
      case 0: return '🥇'; 
      case 1: return '🥈';
      case 2: return '🥉'; 
      default: return `#${index + 1}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                Hall of Fame 🏆
            </h1>
            <p className="mt-4 text-xl text-gray-500">
                Top performers committed to their goals.
            </p>
        </div>
        
        {isLoading ? (
           <div className="space-y-4">
              {[1,2,3,4,5].map(i => (
                  <div key={i} className="bg-white h-20 rounded-xl shadow animate-pulse"></div>
              ))}
           </div>
        ) : (
           <div className="space-y-4">
               {users.map((user, index) => (
                   <div 
                        key={user._id} 
                        className={`
                            relative flex items-center p-4 rounded-xl shadow-sm border-l-4 transition-transform hover:scale-[1.01] hover:shadow-md
                            ${getRankStyle(index)}
                        `}
                   >
                        <div className="shrink-0 w-12 h-12 flex items-center justify-center text-2xl font-bold mr-6">
                            {getMedal(index)}
                        </div>
                        
                        <div className="shrink-0 mr-4">
                             {user.avatar ? (
                                <Image 
                                    src={user.avatar} 
                                    alt={user.fullName}
                                    width={48}
                                    height={48}
                                    className="rounded-full border-2 border-white shadow-sm"
                                />
                             ) : (
                                <div className="h-12 w-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {user.fullName?.[0]}
                                </div>
                             )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-lg font-bold truncate">
                                {user.fullName}
                            </p>
                            <p className="text-sm opacity-75">
                                @{user.username}
                            </p>
                        </div>

                        <div className="text-right ml-4">
                            <p className="text-2xl font-black">
                                {user.completedChallenges}
                            </p>
                            <p className="text-xs uppercase tracking-wider font-semibold opacity-75">
                                Challenges
                            </p>
                        </div>
                         
                         {/* Optional: Show Earned amount if relevant */}
                        {user.totalEarned > 0 && (
                             <div className="text-right ml-6 pl-6 border-l border-gray-300/50 hidden sm:block">
                                <p className="text-xl font-bold text-green-600">
                                    ${user.totalEarned}
                                </p>
                                <p className="text-xs uppercase tracking-wider font-semibold opacity-75">
                                    Earned
                                </p>
                            </div>
                        )}
                   </div>
               ))}
           </div>
        )}
      </div>
    </div>
  );
}
