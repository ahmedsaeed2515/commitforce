'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { challengeApi } from '@/lib/api/challenge.api';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await challengeApi.getAll(); // Fetches my challenges
      if (res.success) {
        setChallenges(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile data');
    } finally {
        setIsLoading(false);
    }
  };

  if (!user) return null; // Should be handled by protected route/middleware

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
             <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-600"></div>
             <div className="px-6 pb-6 relative">
                 <div className="-mt-16 mb-4 flex justify-between items-end">
                     <div className="relative">
                        {user.avatar ? (
                            <Image 
                                src={user.avatar} 
                                alt={user.fullName}
                                width={128}
                                height={128}
                                className="rounded-full border-4 border-white shadow-lg bg-white"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
                                {user.fullName[0]}
                            </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                     </div>
                     <div className="mb-2">
                         <Link href="/settings" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white">
                             Edit Profile
                         </Link>
                     </div>
                 </div>
                 
                 <div>
                     <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
                     <p className="text-gray-500">@{user.username}</p>
                 </div>

                 {/* Stats Cards */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <p className="text-sm text-gray-500">Challenges</p>
                        <p className="text-2xl font-bold text-gray-900">{user.totalChallenges || challenges.length}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <p className="text-sm text-gray-500">Success Rate</p>
                        <p className="text-2xl font-bold text-green-600">{user.successRate || 0}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <p className="text-sm text-gray-500">Total Given</p>
                        <p className="text-2xl font-bold text-red-500">${user.totalDonated || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <p className="text-sm text-gray-500">Wallet</p>
                        <p className="text-2xl font-bold text-indigo-600">${user.balance?.amount || 0}</p>
                    </div>
                 </div>
             </div>
        </div>

        {/* Active Challenges */}
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Active Challenges 🔥</h2>
            {isLoading ? (
                <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
            ) : activeChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeChallenges.map(challenge => (
                        <Link href={`/challenges/${challenge._id}`} key={challenge._id} className="block group">
                             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition hover:shadow-md">
                                 <div className="flex justify-between items-start mb-4">
                                     <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition">{challenge.title}</h3>
                                     <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Active</span>
                                 </div>
                                 <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                     <div className="h-full bg-green-500 w-1/3"></div> {/* Mock progress */}
                                 </div>
                                 <div className="mt-4 flex justify-between text-sm text-gray-500">
                                     <span>Ends {new Date(challenge.endDate).toLocaleDateString()}</span>
                                     <span>{challenge.checkInFrequency} check-ins</span>
                                 </div>
                             </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">You have no active challenges.</p>
                    <Link href="/challenges/create" className="text-indigo-600 font-medium hover:underline">
                        Create one now &rarr;
                    </Link>
                </div>
            )}
        </div>

        {/* History (Completed) */}
        {completedChallenges.length > 0 && (
             <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Past Achievements 🏆</h2>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                     <ul className="divide-y divide-gray-100">
                         {completedChallenges.map(challenge => (
                             <li key={challenge._id} className="p-4 hover:bg-gray-50 transition">
                                <Link href={`/challenges/${challenge._id}`} className="flex justify-between items-center">
                                    <div>
                                         <p className="font-medium text-gray-900">{challenge.title}</p>
                                         <p className="text-sm text-gray-500">{new Date(challenge.endDate).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-green-600 font-bold">Success</span>
                                </Link>
                             </li>
                         ))}
                     </ul>
                </div>
             </div>
        )}
      </div>
    </div>
  );
}
