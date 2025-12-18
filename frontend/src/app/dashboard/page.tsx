'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import { challengeApi } from '@/lib/api/challenge.api';
import { feedApi } from '@/lib/api/feed.api';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [activeChallenges, setActiveChallenges] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User Challenges
        const challengesRes = await challengeApi.getAll({ status: 'active' });
        if (challengesRes.success) {
            setActiveChallenges(challengesRes.data.challenges || challengesRes.data);
        }

        // Fetch Recent Feed (My feed or global?) -> Let's show Global for inspiration
        const feedRes = await feedApi.getFeed(1, 3); // Get top 3 items
        if (feedRes.success) {
            setRecentActivity(feedRes.data.checkIns);
        }
      } catch (error) {
        console.error('Error loading dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (!user) return null; // Or skeleton

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
             {/* Decorative Circles */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-xl"></div>
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-white opacity-10 blur-lg"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
                 <div>
                     <h1 className="text-3xl font-bold mb-2">Welcome back, {user.fullName.split(' ')[0]}! 👋</h1>
                     <p className="text-indigo-100 max-w-lg">
                         You have {activeChallenges.length} active commitments today. Keep pushing your limits!
                     </p>
                 </div>
                 <div className="mt-6 md:mt-0">
                     <Link 
                        href="/challenges/create"
                        className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold shadow hover:bg-gray-50 transition transform hover:-translate-y-0.5 inline-block"
                     >
                        + New Challenge
                     </Link>
                 </div>
             </div>
        </div>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4 text-2xl">💰</div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Wallet Balance</p>
                    <p className="text-2xl font-bold text-gray-900">${user.balance?.amount || 0}</p>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4 text-2xl">🔥</div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Active Streaks</p>
                    <p className="text-2xl font-bold text-gray-900">{activeChallenges.length}</p>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4 text-2xl">🏆</div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{user.completedChallenges || 0}</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 3. Active Challenges List */}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Your Commitments</h2>
                    <Link href="/challenges" className="text-sm text-indigo-600 hover:text-indigo-500">View All</Link>
                </div>
                
                {loading ? (
                    <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
                ) : activeChallenges.length > 0 ? (
                    activeChallenges.slice(0, 3).map(challenge => (
                        <div key={challenge._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                             <div>
                                 <h3 className="font-bold text-gray-900 text-lg">{challenge.title}</h3>
                                 <p className="text-sm text-gray-500">{new Date(challenge.endDate).toLocaleDateString()} • {challenge.checkInFrequency} check-ins</p>
                             </div>
                             <Link 
                                href={`/challenges/${challenge._id}`}
                                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100"
                             >
                                Check In
                             </Link>
                        </div>
                    ))
                ) : (
                     <div className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-300">
                         <p className="text-gray-500 mb-4">No active challenges. Time to set a goal!</p>
                     </div>
                )}
            </div>

            {/* 4. Community Inspiration (Mini Feed) */}
            <div className="space-y-4">
                 <h2 className="text-xl font-bold text-gray-900">Community Buzz</h2>
                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 divide-y">
                     {recentActivity.length > 0 ? (
                         recentActivity.map((item: any) => (
                             <div key={item._id} className="py-3 flex items-start space-x-3">
                                 <div className="shrink-0">
                                     {item.user?.avatar ? (
                                         <img src={item.user.avatar} className="w-8 h-8 rounded-full" alt="" />
                                     ) : (
                                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                             {item.user?.fullName?.[0]}
                                         </div>
                                     )}
                                 </div>
                                 <div>
                                     <p className="text-sm text-gray-900">
                                         <span className="font-semibold">{item.user?.fullName}</span> checked in to <span className="font-medium text-indigo-600">{item.challenge?.title}</span>
                                     </p>
                                     <p className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleTimeString()}</p>
                                 </div>
                             </div>
                         ))
                     ) : (
                         <p className="text-sm text-gray-500 py-2">No recent activity.</p>
                     )}
                     <div className="pt-2 text-center">
                         <Link href="/feed" className="text-xs font-medium text-gray-500 hover:text-indigo-600">View Global Feed &rarr;</Link>
                     </div>
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
}
