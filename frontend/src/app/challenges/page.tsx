'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { challengeApi } from '@/lib/api/challenge.api';
import toast from 'react-hot-toast';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  startDate: string;
  endDate: string;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
        setFilteredChallenges(challenges);
    } else {
        setFilteredChallenges(challenges.filter(c => c.status === filter));
    }
  }, [filter, challenges]);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      const response = await challengeApi.getAll();
      if (response.success) {
        const data = response.data.challenges || response.data;
        setChallenges(data);
        setFilteredChallenges(data);
      }
    } catch (error) {
      toast.error('Failed to fetch challenges');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
          <Link
            href="/challenges/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Challenge
          </Link>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
            {['all', 'active', 'completed', 'failed'].map((status) => (
                <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-full border text-sm capitalize transition-colors ${
                        filter === status 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No challenges found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new challenge.</p>
            <div className="mt-6">
              <Link
                href="/challenges/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Challenge
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <div key={challenge._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        challenge.status === 'active' ? 'bg-green-100 text-green-800' : 
                        challenge.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                     }`}>
                        {challenge.status}
                     </span>
                     <span className="text-xs text-gray-500 capitalize">{challenge.category}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 truncate">
                    {challenge.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-3">
                    {challenge.description}
                  </p>
                  <div className="mt-4">
                     <div className="text-sm text-gray-500">
                        {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                     </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <Link href={`/challenges/${challenge._id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
