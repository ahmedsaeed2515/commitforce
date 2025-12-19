'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { clubApi } from '@/lib/api/club.api';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { 
  Trophy, Users, Search, Plus, Star, CheckCircle, 
  Dumbbell, BookOpen, Code, Salad, Zap, GraduationCap, Heart, X, Lock, Globe
} from 'lucide-react';
import { ClubCardSkeleton } from '@/components/ui/Skeletons';

interface ClubMember {
    _id: string;
    fullName: string;
    avatar?: string;
}

interface Club {
    _id: string;
    name: string;
    description?: string;
    avatar?: string;
    category: string;
    members: ClubMember[];
    totalPoints: number;
    totalChallengesCompleted: number;
    owner: {
        fullName: string;
        avatar?: string;
    };
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    fitness: Dumbbell,
    reading: BookOpen,
    coding: Code,
    nutrition: Salad,
    productivity: Zap,
    learning: GraduationCap,
    health: Heart,
    other: Trophy
};

const categoryGradients: Record<string, string> = {
    fitness: 'from-orange-500/20 to-red-500/20',
    reading: 'from-blue-500/20 to-indigo-500/20',
    coding: 'from-green-500/20 to-teal-500/20',
    nutrition: 'from-lime-500/20 to-green-500/20',
    productivity: 'from-yellow-500/20 to-orange-500/20',
    learning: 'from-purple-500/20 to-pink-500/20',
    health: 'from-pink-500/20 to-rose-500/20',
    other: 'from-indigo-500/20 to-purple-500/20'
};

export default function ClubsPage() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const categories = ['fitness', 'reading', 'coding', 'nutrition', 'productivity', 'learning', 'other'];

    const fetchClubs = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await clubApi.search(searchQuery, selectedCategory);
            if (res.success) {
                setClubs(res.data.clubs);
            }
        } catch {
            toast.error('Failed to load clubs');
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        fetchClubs();
    }, [fetchClubs]);

    const handleJoin = async (clubId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await clubApi.join(clubId);
            toast.success('Joined club successfully!');
            fetchClubs();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to join club');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a1a]">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
            </div>

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <Trophy className="w-10 h-10 text-yellow-400" />
                                Team Clubs
                            </h1>
                            <p className="text-white/50 text-lg">Join forces and conquer challenges together!</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition" />
                            <div className="relative bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-indigo-400 hover:to-purple-500 transition-all">
                                <Plus className="w-5 h-5" />
                                Create Club
                            </div>
                        </button>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Total Clubs', value: clubs.length, Icon: Trophy, color: 'from-indigo-500/20 to-indigo-500/5', border: 'border-indigo-500/20', iconColor: 'text-indigo-400' },
                            { label: 'Total Members', value: clubs.reduce((acc, c) => acc + c.members.length, 0), Icon: Users, color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20', iconColor: 'text-green-400' },
                            { label: 'Challenges Done', value: clubs.reduce((acc, c) => acc + c.totalChallengesCompleted, 0), Icon: CheckCircle, color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20', iconColor: 'text-purple-400' },
                        ].map((stat, i) => (
                            <div key={i} className={`bg-linear-to-br ${stat.color} backdrop-blur-sm border ${stat.border} rounded-2xl p-4 text-center`}>
                                <stat.Icon className={`w-6 h-6 mx-auto mb-2 ${stat.iconColor}`} />
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-sm text-white/50">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search clubs..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        selectedCategory === ''
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    All
                                </button>
                                {categories.map(cat => {
                                    const Icon = categoryIcons[cat] || Trophy;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                                                selectedCategory === cat
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Clubs Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <ClubCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : clubs.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-16 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                <Trophy className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No Clubs Found</h3>
                            <p className="text-white/50 mb-6">Be the first to create a club!</p>
                            <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 transition-all">
                                <Plus className="w-5 h-5" />
                                Create Your Club
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clubs.map((club, index) => {
                                const CategoryIcon = categoryIcons[club.category] || Trophy;
                                return (
                                    <Link
                                        href={`/clubs/${club._id}`}
                                        key={club._id}
                                        className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:scale-[1.02] transition-all"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        {/* Header */}
                                        <div className={`h-28 bg-linear-to-br ${categoryGradients[club.category] || categoryGradients.other} relative overflow-hidden`}>
                                            {club.avatar && (
                                                <Image
                                                    src={club.avatar}
                                                    alt={club.name}
                                                    fill
                                                    className="object-cover opacity-30"
                                                />
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <CategoryIcon className="w-12 h-12 text-white/50 group-hover:scale-125 transition-transform duration-500" />
                                            </div>
                                            
                                            {/* Members avatars */}
                                            <div className="absolute bottom-3 left-4 flex -space-x-2">
                                                {club.members.slice(0, 5).map((member, i) => (
                                                    <React.Fragment key={member._id || i}>
                                                        {member.avatar ? (
                                                            <Image
                                                                src={member.avatar}
                                                                alt=""
                                                                width={28}
                                                                height={28}
                                                                className="rounded-full ring-2 ring-[#0a0a1a]"
                                                                style={{ zIndex: 5 - i }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-[#0a0a1a] flex items-center justify-center text-xs text-white font-bold"
                                                                style={{ zIndex: 5 - i }}
                                                            >
                                                                {member?.fullName?.[0] || '?'}
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                                {club.members.length > 5 && (
                                                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-[#0a0a1a] flex items-center justify-center text-xs text-white font-bold">
                                                        +{club.members.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition line-clamp-1">
                                                    {club.name}
                                                </h3>
                                                <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-medium px-2 py-1 rounded-full shrink-0">
                                                    {club.category}
                                                </span>
                                            </div>
                                            
                                            <p className="text-white/50 text-sm line-clamp-2 mb-4 min-h-[40px]">
                                                {club.description || 'Join us on our journey!'}
                                            </p>

                                            {/* Stats */}
                                            <div className="flex items-center justify-between text-sm mb-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-white/60 flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {club.members.length}
                                                    </span>
                                                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                                                        <Star className="w-4 h-4" />
                                                        {club.totalPoints} pts
                                                    </span>
                                                </div>
                                                <span className="text-green-400 flex items-center gap-1">
                                                    <CheckCircle className="w-4 h-4" />
                                                    {club.totalChallengesCompleted}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <span className="flex-1 text-center px-4 py-2.5 rounded-xl bg-white/5 text-white/70 font-medium group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition">
                                                    View Club
                                                </span>
                                                <button
                                                    onClick={(e) => handleJoin(club._id, e)}
                                                    className="px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg transition transform hover:scale-105"
                                                >
                                                    Join
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Create Modal */}
                    {showCreateModal && (
                        <CreateClubModal 
                            onClose={() => setShowCreateModal(false)} 
                            onSuccess={fetchClubs}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// Create Club Modal Component
function CreateClubModal({ 
    onClose, 
    onSuccess
}: { 
    onClose: () => void; 
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'other',
        isPrivate: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Club name is required');
            return;
        }

        try {
            setIsSubmitting(true);
            await clubApi.create(formData);
            toast.success('Club created successfully!');
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Failed to create club');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = ['fitness', 'reading', 'coding', 'nutrition', 'productivity', 'learning', 'other'];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-[#0a0a1a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 pb-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Create New Club</h2>
                                <p className="text-white/50 text-sm">Build your team together</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition text-white/50 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="createClubForm" onSubmit={handleSubmit} className="space-y-5">
                        {/* Club Name */}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Club Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                placeholder="e.g., Fitness Warriors"
                                maxLength={50}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[80px] resize-none"
                                placeholder="What's your club about?"
                                rows={2}
                                maxLength={500}
                            ></textarea>
                            <p className="text-xs text-white/30 mt-1">{formData.description.length}/500</p>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(key => {
                                    const Icon = categoryIcons[key] || Trophy;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: key })}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                                                formData.category === key
                                                    ? 'bg-indigo-500 text-white shadow-lg scale-105'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="capitalize">{key}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Private Toggle */}
                        <div 
                            className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                                formData.isPrivate ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
                        >
                            <div className={`w-12 h-7 rounded-full relative transition-colors ${
                                formData.isPrivate ? 'bg-indigo-500' : 'bg-white/20'
                            }`}>
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                    formData.isPrivate ? 'translate-x-6' : 'translate-x-1'
                                }`}></div>
                            </div>
                            <div className="flex-1">
                                <span className="font-medium text-white">Private Club</span>
                                <span className="block text-sm text-white/50">
                                    {formData.isPrivate ? 'Only invited members can join' : 'Anyone can join this club'}
                                </span>
                            </div>
                            {formData.isPrivate ? (
                                <Lock className="w-5 h-5 text-indigo-400" />
                            ) : (
                                <Globe className="w-5 h-5 text-white/50" />
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 pt-4 border-t border-white/10">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 font-medium hover:bg-white/5 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="createClubForm"
                            disabled={isSubmitting || !formData.name.trim()}
                            className="flex-1 bg-linear-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Create Club
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
