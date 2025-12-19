'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { groupChallengeApi } from '@/lib/api/groupChallenge.api';
import toast from 'react-hot-toast';
import { 
  Flame, Swords, Users, FileText, Wallet, Calendar, 
  Mail, Plus, Trophy, Rocket
} from 'lucide-react';

export default function CreateGroupChallengePage() {
    const router = useRouter();
    const [challengeType, setChallengeType] = useState<'duel' | 'group'>('duel');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'fitness',
        deposit: 50,
        duration: 30,
        prizeDistribution: 'winner_takes_all'
    });
    const [invitedEmails, setInvitedEmails] = useState<string[]>(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddEmail = () => {
        setInvitedEmails([...invitedEmails, '']);
    };

    const handleEmailChange = (index: number, value: string) => {
        const updated = [...invitedEmails];
        updated[index] = value;
        setInvitedEmails(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const validEmails = invitedEmails.filter(email => email.trim() !== '');
            
            if (challengeType === 'duel' && validEmails.length !== 1) {
                toast.error('Duel requires exactly 1 opponent!');
                return;
            }

            const challengeData = {
                ...formData,
                challengeType,
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000).toISOString(),
                checkInFrequency: 'daily',
                requiredCheckIns: formData.duration,
                goalType: 'boolean',
                isPublic: false,
                deposit: {
                    amount: formData.deposit,
                    currency: 'USD'
                }
            };

            const res = await groupChallengeApi.create(challengeData, validEmails);
            
            if (res.success) {
                toast.success('Challenge created! Invitations sent!');
                router.push(`/challenges/${res.data._id}`);
            }
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toast.error((error as any).response?.data?.message || 'Failed to create challenge');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a1a]">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
            </div>

            <div className="relative z-10 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Flame className="w-8 h-8 text-orange-400" />
                            <h1 className="text-3xl font-bold text-white">
                                Create Group Challenge
                            </h1>
                        </div>
                        <p className="text-white/50 mb-8">
                            Challenge friends or create a group competition!
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Challenge Type */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-3">
                                    Challenge Type
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setChallengeType('duel')}
                                        className={`p-6 rounded-xl border-2 transition ${
                                            challengeType === 'duel'
                                                ? 'border-indigo-500 bg-indigo-500/10'
                                                : 'border-white/10 bg-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <Swords className={`w-8 h-8 mx-auto mb-2 ${challengeType === 'duel' ? 'text-indigo-400' : 'text-white/50'}`} />
                                        <div className="font-bold text-white">1v1 Duel</div>
                                        <div className="text-sm text-white/50">Winner takes all</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setChallengeType('group')}
                                        className={`p-6 rounded-xl border-2 transition ${
                                            challengeType === 'group'
                                                ? 'border-indigo-500 bg-indigo-500/10'
                                                : 'border-white/10 bg-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <Users className={`w-8 h-8 mx-auto mb-2 ${challengeType === 'group' ? 'text-indigo-400' : 'text-white/50'}`} />
                                        <div className="font-bold text-white">Group Pool</div>
                                        <div className="text-sm text-white/50">Multiple participants</div>
                                    </button>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Challenge Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="30-Day Fitness Challenge"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Description
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                                    rows={3}
                                    placeholder="Describe the challenge..."
                                />
                            </div>

                            {/* Deposit & Duration */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                                        <Wallet className="w-4 h-4" />
                                        Deposit ($)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="10"
                                        value={formData.deposit}
                                        onChange={(e) => setFormData({...formData, deposit: parseInt(e.target.value)})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Duration (Days)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="7"
                                        max="90"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Invite Users */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {challengeType === 'duel' ? 'Opponent Email' : 'Invite Participants'}
                                </label>
                                {invitedEmails.map((email, index) => (
                                    <input
                                        key={index}
                                        type="email"
                                        value={email}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all mb-2"
                                        placeholder="friend@example.com"
                                    />
                                ))}
                                {challengeType === 'group' && (
                                    <button
                                        type="button"
                                        onClick={handleAddEmail}
                                        className="text-indigo-400 text-sm font-medium hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Another
                                    </button>
                                )}
                            </div>

                            {/* Prize Pool Preview */}
                            <div className="bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 p-6 rounded-xl text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Trophy className="w-5 h-5 text-yellow-400" />
                                    <span className="text-sm text-white/60">Prize Pool</span>
                                </div>
                                <div className="text-4xl font-bold text-white">
                                    ${formData.deposit * (invitedEmails.filter(e => e.trim()).length + 1)}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-linear-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:from-indigo-400 hover:to-purple-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Rocket className="w-5 h-5" />
                                        Create Challenge & Send Invites
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
