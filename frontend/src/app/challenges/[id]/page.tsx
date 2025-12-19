'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { challengeApi } from '@/lib/api/challenge.api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store/authStore';
import CheckInModal from '@/components/CheckInModal';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { 
  Trophy, Calendar, Tag, Clock, Target, Wallet, CheckCircle, 
  ArrowLeft, Edit, Trash2, FileText, ImageOff
} from 'lucide-react';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  startDate: string;
  endDate: string;
  checkInFrequency: string;
  coverImage?: string;
  createdAt: string;
  user: {
      _id: string;
      fullName: string;
  };
  deposit?: {
      amount: number;
      currency: string;
  };
}

interface CheckIn {
  _id: string;
  date: string;
  note?: string;
  photos: string[];
  verified: boolean;
  createdAt: string;
}

export default function ChallengeDetailPage() {
  const params = useParams(); 
  const id = params?.id as string;
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const { user } = useAuthStore();

  const fetchChallenge = async () => {
    try {
      const response = await challengeApi.getById(id);
      if (response.success) {
        setChallenge(response.data);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMsg = err.response?.data?.message || 'Failed to fetch challenge details';
      toast.error(errorMsg);
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
      Promise.all([fetchChallenge(), fetchCheckIns()])
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { width, height } = useWindowSize();

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0a0a1a]">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0a0a1a]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <Target className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Challenge not found</h2>
          <Link href="/challenges" className="text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to challenges
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?._id === challenge.user._id;

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'draft': return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
      case 'completed': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      default: return 'bg-white/10 border-white/20 text-white/60';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative">
      {challenge.status === 'completed' && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden mb-6">
            <div className="relative h-64 w-full bg-linear-to-br from-indigo-500/20 to-purple-500/20">
              {challenge.coverImage ? (
                <Image 
                  src={challenge.coverImage} 
                  alt={challenge.title} 
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Trophy className="w-16 h-16 text-white/20" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusStyles(challenge.status)}`}>
                  {challenge.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="px-6 py-6">
              <h1 className="text-3xl font-bold text-white mb-2">{challenge.title}</h1>
              <p className="text-white/50">
                Created by {challenge.user.fullName} • {new Date(challenge.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="border-t border-white/10 px-6 py-6">
              <p className="text-white/70">{challenge.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Duration
                  </div>
                  <p className="text-white font-medium text-sm">
                    {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                    <Tag className="w-4 h-4" />
                    Category
                  </div>
                  <p className="text-white font-medium capitalize">{challenge.category}</p>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    Check-in
                  </div>
                  <p className="text-white font-medium capitalize">{challenge.checkInFrequency}</p>
                </div>
                
                {challenge.deposit && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
                      <Wallet className="w-4 h-4" />
                      Staked
                    </div>
                    <p className="text-green-400 font-bold">
                      {challenge.deposit.amount} {challenge.deposit.currency}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-400" />
              Progress Log
            </h2>
            {isOwner && challenge.status === 'active' && (
              <button
                onClick={() => setIsCheckInModalOpen(true)}
                className="inline-flex items-center gap-2 bg-linear-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-green-400 hover:to-emerald-500 transition"
              >
                <CheckCircle className="w-5 h-5" />
                Daily Check-in
              </button>
            )}
          </div>

          {/* Check-ins List */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden mb-8">
            {checkIns.length === 0 ? (
              <div className="px-6 py-12 text-center text-white/50">
                <Target className="w-8 h-8 mx-auto mb-3 text-white/30" />
                <p>No check-ins yet. Start your journey today!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {checkIns.map((checkIn) => (
                  <div key={checkIn._id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition">
                    <div className="flex items-center gap-4">
                      {checkIn.photos && checkIn.photos.length > 0 ? (
                        <Image 
                          src={checkIn.photos[0]} 
                          alt="Proof" 
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-xl object-cover" 
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                          <ImageOff className="w-5 h-5 text-white/30" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">
                          {new Date(checkIn.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-white/50">
                          {checkIn.note || 'No notes provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        checkIn.verified 
                          ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                          : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                      }`}>
                        {checkIn.verified ? 'Verified' : 'Pending'}
                      </span>
                      <p className="text-xs text-white/30 mt-1">
                        {new Date(checkIn.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          <div className="flex justify-end gap-4 pb-8">
            {isOwner && (
              <>
                  <Link 
                    href={`/challenges/${id}/edit`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 rounded-xl font-medium hover:bg-white/5 transition"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button 
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this challenge?')) {
                        try {
                          setIsLoading(true);
                          await challengeApi.delete(id);
                          toast.success('Challenge deleted successfully');
                          // Use window.location or router to navigate back
                          window.location.href = '/challenges';
                        } catch (error: unknown) {
                           const err = error as { response?: { data?: { message?: string } } };
                           toast.error(err.response?.data?.message || 'Failed to delete challenge');
                           setIsLoading(false);
                        }
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
              </>
            )}
            <Link
              href="/challenges"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 rounded-xl font-medium hover:bg-white/5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
