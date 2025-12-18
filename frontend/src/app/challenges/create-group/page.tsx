'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { groupChallengeApi } from '@/lib/api/groupChallenge.api';
import toast from 'react-hot-toast';

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
                startDate: new Date(),
                endDate: new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000),
                checkInFrequency: 'daily',
                requiredCheckIns: formData.duration,
                goalType: 'boolean'
            };

            const res = await groupChallengeApi.create(challengeData, validEmails);
            
            if (res.success) {
                toast.success('Challenge created! Invitations sent 🔥');
                router.push(`/challenges/${res.data._id}`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create challenge');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Create Group Challenge 🔥
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Challenge friends or create a group competition!
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Challenge Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Challenge Type
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setChallengeType('duel')}
                                    className={`p-4 rounded-lg border-2 transition ${
                                        challengeType === 'duel'
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="text-2xl mb-2">⚔️</div>
                                    <div className="font-bold">1v1 Duel</div>
                                    <div className="text-sm text-gray-500">Winner takes all</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setChallengeType('group')}
                                    className={`p-4 rounded-lg border-2 transition ${
                                        challengeType === 'group'
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="text-2xl mb-2">👥</div>
                                    <div className="font-bold">Group Pool</div>
                                    <div className="text-sm text-gray-500">Multiple participants</div>
                                </button>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Challenge Title
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                placeholder="30-Day Fitness Challenge"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                rows={3}
                                placeholder="Describe the challenge..."
                            />
                        </div>

                        {/* Deposit & Duration */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deposit ($)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="10"
                                    value={formData.deposit}
                                    onChange={(e) => setFormData({...formData, deposit: parseInt(e.target.value)})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (Days)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="7"
                                    max="90"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Invite Users */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {challengeType === 'duel' ? 'Opponent Email' : 'Invite Participants'}
                            </label>
                            {invitedEmails.map((email, index) => (
                                <input
                                    key={index}
                                    type="email"
                                    value={email}
                                    onChange={(e) => handleEmailChange(index, e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-2"
                                    placeholder="friend@example.com"
                                />
                            ))}
                            {challengeType === 'group' && (
                                <button
                                    type="button"
                                    onClick={handleAddEmail}
                                    className="text-indigo-600 text-sm font-medium hover:underline"
                                >
                                    + Add Another
                                </button>
                            )}
                        </div>

                        {/* Prize Pool Preview */}
                        <div className="bg-indigo-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Prize Pool</div>
                            <div className="text-3xl font-bold text-indigo-600">
                                ${formData.deposit * (invitedEmails.filter(e => e.trim()).length + 1)}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Challenge & Send Invites 🚀'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
