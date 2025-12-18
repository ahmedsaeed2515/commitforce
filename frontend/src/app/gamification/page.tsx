'use client';

import StreakWidget from '@/components/StreakWidget';
import BadgesDisplay from '@/components/BadgesDisplay';

export default function GamificationPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Your Progress 🎮
                    </h1>
                    <p className="text-gray-600">
                        Track your streaks, earn badges, and level up!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-1">
                        <StreakWidget />
                    </div>
                    
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Quick Stats 📊
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                                    <div className="text-sm text-blue-600 font-medium">Level</div>
                                    <div className="text-3xl font-black text-blue-700">1</div>
                                </div>
                                <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                                    <div className="text-sm text-purple-600 font-medium">Points</div>
                                    <div className="text-3xl font-black text-purple-700">0</div>
                                </div>
                                <div className="bg-linear-to-br from-green-50 to-green-100 p-4 rounded-xl">
                                    <div className="text-sm text-green-600 font-medium">Badges</div>
                                    <div className="text-3xl font-black text-green-700">0/7</div>
                                </div>
                                <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl">
                                    <div className="text-sm text-yellow-600 font-medium">Rank</div>
                                    <div className="text-3xl font-black text-yellow-700">#-</div>
                                </div>
                            </div>

                            <div className="mt-6 bg-linear-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">💡</div>
                                    <div>
                                        <div className="font-bold text-gray-900">Pro Tip</div>
                                        <div className="text-sm text-gray-600">
                                            Check in daily to maintain your streak and earn freeze tokens!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <BadgesDisplay />
            </div>
        </div>
    );
}
