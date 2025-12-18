'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { challengeApi } from '@/lib/api/challenge.api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store/authStore';
import CheckInModal from '@/components/CheckInModal';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function ChallengeDetailPage() {
  const params = useParams(); 
  const id = params?.id as string;
  
  const [challenge, setChallenge] = useState<any>(null);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const { user } = useAuthStore();

  const fetchChallenge = async () => {
    try {
      const response = await challengeApi.getById(id);
      if (response.success) {
        setChallenge(response.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch challenge details');
    }
  };

  const fetchCheckIns = async () => {
      try {
          const res = await challengeApi.getCheckIns(id);
          if (res.success) setCheckIns(res.data);
      } catch (e) {
          console.error('Failed to fetch check-ins', e);
      }
  };

  useEffect(() => {
    if (id) {
        // Fetch both challenge and check-ins
        Promise.all([fetchChallenge(), fetchCheckIns()])
          .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { width, height } = useWindowSize();

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Challenge not found</h2>
            <Link href="/challenges" className="mt-4 text-indigo-600 hover:text-indigo-500">
                Back to challenges
            </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?._id === challenge.user._id;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {challenge.status === 'completed' && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="relative h-64 w-full bg-gray-200">
            {challenge.coverImage ? (
                <img 
                    src={challenge.coverImage} 
                    alt={challenge.title} 
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="text-4xl">🏆</span>
                </div>
            )}
            <div className="absolute top-4 right-4 space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    challenge.status === 'active' ? 'bg-green-100 text-green-800' : 
                    challenge.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                }`}>
                    {challenge.status.toUpperCase()}
                </span>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Created by {challenge.user.fullName} • {new Date(challenge.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{challenge.description}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900">
                    {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{challenge.category}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Check-in Frequency</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{challenge.checkInFrequency}</dd>
              </div>

               <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Goal Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{challenge.goalType}</dd>
              </div>

              {challenge.deposit && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Staked Amount</dt>
                    <dd className="mt-1 text-sm font-bold text-green-600">
                        {challenge.deposit.amount} {challenge.deposit.currency}
                    </dd>
                  </div>
              )}
            </dl>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
             {/* Stats Card (Placeholder for now) */}
             <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">0%</dd>
                </div>
             </div>
        </div>

        {/* Actions Row */}
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Progress Log</h2>
            {isOwner && challenge.status === 'active' && (
                <button
                    onClick={() => setIsCheckInModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    ✅ Daily Check-in
                </button>
            )}
        </div>

        {/* Check-ins List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
            <ul className="divide-y divide-gray-200">
                {checkIns.length === 0 ? (
                    <li className="px-4 py-12 text-center text-gray-500">
                        <p>No check-ins yet. Start your journey today!</p>
                    </li>
                ) : (
                    checkIns.map((checkIn) => (
                        <li key={checkIn._id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                       {checkIn.photos && checkIn.photos.length > 0 ? (
                                           <img src={checkIn.photos[0]} alt="Proof" className="h-10 w-10 rounded-full object-cover mr-3" />
                                       ) : (
                                         <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                            📝
                                         </div>
                                       )}
                                       <div>
                                            <p className="text-sm font-medium text-indigo-600 truncate">
                                                {new Date(checkIn.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {checkIn.note || 'No notes provided'}
                                            </p>
                                       </div>
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            checkIn.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {checkIn.verified ? 'Verified' : 'Pending'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(checkIn.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>

        <CheckInModal 
            challengeId={id} 
            isOpen={isCheckInModalOpen} 
            onClose={() => setIsCheckInModalOpen(false)}
            onSuccess={() => {
                fetchCheckIns();
                fetchChallenge();
            }}
        />

        {/* Footer Buttons */}
         <div className="mt-6 flex justify-end space-x-4 pb-8">
            {isOwner && (
                <>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Edit
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Delete
                    </button>
                </>
            )}
             <Link
                href="/challenges"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Back to List
            </Link>
        </div>
      </div>
    </div>
  );
}
