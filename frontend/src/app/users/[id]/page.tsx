'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { userApi } from '@/lib/api/user.api';
import { useAuthStore } from '@/lib/store/authStore';
import { 
  User, ArrowLeft, Flame, Target, Calendar, 
  Users, MessageCircle, Star, CheckCircle,
  Loader2, MapPin, Link as LinkIcon
} from 'lucide-react';

interface UserProfile {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: string;
  stats?: {
    totalChallenges: number;
    completedChallenges: number;
    currentStreak: number;
    longestStreak: number;
    totalPoints: number;
    level: number;
  };
  badges?: string[];
  clubs?: { _id: string; name: string }[];
  recentChallenges?: { _id: string; title: string; status: string }[];
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const userId = params?.id as string;
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userApi.getById(userId);
        if (response.success) {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        toast.error('User not found');
        router.push('/users');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, router]);

  const handleFollow = async () => {
    // TODO: Implement follow API
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? 'Unfollowed user' : 'Following user!');
  };

  const handleMessage = () => {
    router.push('/messages');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
          <p className="text-white/60 mb-6">The user you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/users"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === userProfile._id;

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link 
            href="/users" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Users
          </Link>

          {/* Profile Header */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden mb-8">
            {/* Cover */}
            <div className="h-32 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30" />

            {/* Profile Info */}
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12">
                {/* Avatar */}
                <div className="relative">
                  {userProfile.avatar ? (
                    <Image
                      src={userProfile.avatar}
                      alt={userProfile.fullName}
                      width={120}
                      height={120}
                      className="rounded-2xl border-4 border-[#0a0a1a] object-cover"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-[#0a0a1a] flex items-center justify-center text-4xl font-bold text-white">
                      {userProfile.fullName[0]}
                    </div>
                  )}
                  {/* Level Badge */}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-[#0a0a1a] flex items-center justify-center text-white font-bold text-sm">
                    {userProfile.stats?.level || 1}
                  </div>
                </div>

                {/* Name & Username */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">{userProfile.fullName}</h1>
                  <p className="text-white/50">@{userProfile.username}</p>
                  {userProfile.bio && (
                    <p className="text-white/70 mt-2">{userProfile.bio}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    {userProfile.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {userProfile.location}
                      </span>
                    )}
                    {userProfile.website && (
                      <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:underline">
                        <LinkIcon className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!isOwnProfile && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2.5 rounded-xl font-medium transition ${
                        isFollowing 
                          ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button
                      onClick={handleMessage}
                      className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {isOwnProfile && (
                  <Link
                    href="/settings"
                    className="px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition"
                  >
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Challenges', value: userProfile.stats?.totalChallenges || 0, Icon: Target, color: 'from-indigo-500/20 to-indigo-500/5', iconColor: 'text-indigo-400' },
              { label: 'Completed', value: userProfile.stats?.completedChallenges || 0, Icon: CheckCircle, color: 'from-green-500/20 to-green-500/5', iconColor: 'text-green-400' },
              { label: 'Streak', value: userProfile.stats?.currentStreak || 0, Icon: Flame, color: 'from-orange-500/20 to-orange-500/5', iconColor: 'text-orange-400' },
              { label: 'Points', value: userProfile.stats?.totalPoints || 0, Icon: Star, color: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center`}>
                <stat.Icon className={`w-6 h-6 mx-auto mb-2 ${stat.iconColor}`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Challenges (if available) */}
          {userProfile.recentChallenges && userProfile.recentChallenges.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Recent Challenges
              </h3>
              <div className="space-y-3">
                {userProfile.recentChallenges.map((challenge) => (
                  <Link
                    key={challenge._id}
                    href={`/challenges/${challenge._id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
                  >
                    <span className="text-white font-medium">{challenge.title}</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      challenge.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      challenge.status === 'active' ? 'bg-indigo-500/20 text-indigo-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {challenge.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Clubs (if available) */}
          {userProfile.clubs && userProfile.clubs.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Clubs
              </h3>
              <div className="flex flex-wrap gap-3">
                {userProfile.clubs.map((club) => (
                  <Link
                    key={club._id}
                    href={`/clubs/${club._id}`}
                    className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition"
                  >
                    {club.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
