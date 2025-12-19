'use client';

import { useState, useEffect, useCallback } from 'react';
import { userApi } from '@/lib/api/user.api';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Users, Search, Target, UserPlus, Sparkles } from 'lucide-react';

interface User {
    _id: string;
    fullName: string;
    username: string;
    avatar?: string;
    completedChallenges: number;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [recommended, setRecommended] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchRecommended();
    }, []);

    useEffect(() => {
        if (searchQuery.length >= 2) {
            searchUsers();
        } else {
            setUsers([]);
        }
    }, [searchQuery]);

    const fetchRecommended = async () => {
        try {
            const res = await userApi.getRecommended();
            if (res.success) {
                setRecommended(res.data);
            }
        } catch {
            console.error('Failed to fetch recommended users');
        }
    };

    const searchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await userApi.search(searchQuery);
            if (res.success) {
                setUsers(res.data.users);
            }
        } catch {
            toast.error('Search failed');
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    const displayUsers = searchQuery.length >= 2 ? users : recommended;
    const title = searchQuery.length >= 2 ? `Search Results for "${searchQuery}"` : 'Recommended Friends';

    return (
        <div className="min-h-screen bg-[#0a0a1a]">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
            </div>

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-400" />
                        Discover Users
                    </h1>

                    {/* Search Box */}
                    <div className="mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or username..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-lg"
                            />
                        </div>
                        {searchQuery && searchQuery.length < 2 && (
                            <p className="text-sm text-white/40 mt-2">Type at least 2 characters to search</p>
                        )}
                    </div>

                    {/* Results Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            {searchQuery.length >= 2 ? (
                                <Search className="w-5 h-5 text-indigo-400" />
                            ) : (
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                            )}
                            {title}
                        </h2>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : displayUsers.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                    <UserPlus className="w-8 h-8 text-indigo-400" />
                                </div>
                                <p className="text-white/50">
                                    {searchQuery.length >= 2 
                                        ? 'No users found matching your search.' 
                                        : 'Start a challenge to get friend recommendations!'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {displayUsers.map(user => (
                                    <Link
                                        key={user._id}
                                        href={`/users/${user.username}`}
                                        className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group"
                                    >
                                        {user.avatar ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.fullName}
                                                width={56}
                                                height={56}
                                                className="rounded-full ring-2 ring-white/10"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                                {user.fullName[0]}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white group-hover:text-indigo-400 transition truncate">{user.fullName}</p>
                                            <p className="text-sm text-white/50">@{user.username}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1.5 text-indigo-400">
                                                <Target className="w-4 h-4" />
                                                <p className="text-lg font-bold">{user.completedChallenges}</p>
                                            </div>
                                            <p className="text-xs text-white/40">Challenges</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
