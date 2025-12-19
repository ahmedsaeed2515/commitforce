'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { clubApi } from '@/lib/api/club.api';
import { useAuthStore } from '@/lib/store/authStore';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { 
  Trophy, Users, Star, Target, Crown, LogOut, UserPlus,
  Dumbbell, BookOpen, Code, Salad, Zap, GraduationCap
} from 'lucide-react';

interface ClubMember {
    _id: string;
    fullName: string;
    username: string;
    avatar?: string;
    completedChallenges?: number;
}

interface Club {
    _id: string;
    name: string;
    description?: string;
    avatar?: string;
    coverImage?: string;
    category: string;
    owner: ClubMember;
    admins: ClubMember[];
    members: ClubMember[];
    totalPoints: number;
    totalChallengesCompleted: number;
    isPrivate: boolean;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    fitness: Dumbbell,
    reading: BookOpen,
    coding: Code,
    nutrition: Salad,
    productivity: Zap,
    learning: GraduationCap,
    other: Trophy
};

export default function ClubDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const clubId = params.id as string;

    const [club, setClub] = useState<Club | null>(null);
    const [isLoading, setIsLoading] = useState(true);



    const fetchClub = async () => {
        try {
            setIsLoading(true);
            const res = await clubApi.getById(clubId);
            if (res.success) {
                setClub(res.data);
            }
        } catch {
            toast.error('Club not found');
            router.push('/clubs');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (clubId) fetchClub();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clubId]);

    const handleJoin = async () => {
        try {
            await clubApi.join(clubId);
            toast.success('Joined club!');
            fetchClub();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to join');
        }
    };

    const handleLeave = async () => {
        try {
            await clubApi.leave(clubId);
            toast.success('Left club');
            fetchClub();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to leave');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a1a] py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="h-48 bg-white/5 rounded-xl animate-pulse mb-6"></div>
                    <div className="h-8 bg-white/5 w-1/3 rounded animate-pulse mb-4"></div>
                    <div className="h-4 bg-white/5 w-2/3 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (!club) return null;

    const isMember = user && club.members.some(m => m._id === user._id);
    const isOwner = user && club.owner._id === user._id;
    const CategoryIcon = categoryIcons[club.category] || Trophy;

    return (
        <div className="min-h-screen bg-[#0a0a1a]">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
            </div>

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Cover & Header */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                        <div className="h-48 bg-linear-to-r from-indigo-500/20 to-purple-500/20 relative">
                            {club.coverImage && (
                                <Image
                                    src={club.coverImage}
                                    alt={club.name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div className="p-6 -mt-12 relative">
                            <div className="flex items-end gap-4">
                                <div className="w-24 h-24 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-2xl flex items-center justify-center ring-4 ring-[#0a0a1a]">
                                    <CategoryIcon className="w-12 h-12 text-white" />
                                </div>
                                <div className="flex-1 pb-2">
                                    <h1 className="text-2xl font-bold text-white">{club.name}</h1>
                                    <p className="text-white/50">{club.members.length} members • {club.category}</p>
                                </div>
                                {!isOwner && (
                                    isMember ? (
                                        <button
                                            onClick={handleLeave}
                                            className="px-4 py-2.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Leave Club
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleJoin}
                                            className="px-4 py-2.5 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-400 hover:to-purple-500 transition flex items-center gap-2"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Join Club
                                        </button>
                                    )
                                )}
                            </div>

                            {club.description && (
                                <p className="mt-4 text-white/60">{club.description}</p>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-400" />
                                        <p className="text-2xl font-bold text-white">{club.totalPoints}</p>
                                    </div>
                                    <p className="text-sm text-white/50">Total Points</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Target className="w-5 h-5 text-green-400" />
                                        <p className="text-2xl font-bold text-white">{club.totalChallengesCompleted}</p>
                                    </div>
                                    <p className="text-sm text-white/50">Challenges Done</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Users className="w-5 h-5 text-purple-400" />
                                        <p className="text-2xl font-bold text-white">{club.members.length}</p>
                                    </div>
                                    <p className="text-sm text-white/50">Members</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Members Section */}
                    <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-400" />
                            Members
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {club.members.map(member => (
                                <div key={member._id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                                    {member.avatar ? (
                                        <Image
                                            src={member.avatar}
                                            alt={member.fullName}
                                            width={40}
                                            height={40}
                                            className="rounded-full ring-2 ring-white/10"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {member.fullName[0]}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-white truncate">{member.fullName}</p>
                                        <p className="text-xs text-white/50">@{member.username}</p>
                                    </div>
                                    {member._id === club.owner._id && (
                                        <span className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                            <Crown className="w-3 h-3" />
                                            Owner
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
