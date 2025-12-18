'use client';

import { useState } from 'react';
import apiClient from '@/lib/api/client';
import toast from 'react-hot-toast';

interface FreezePurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userPoints: number;
    userBalance: number;
}

export default function FreezePurchaseModal({ 
    isOpen, 
    onClose, 
    onSuccess,
    userPoints,
    userBalance
}: FreezePurchaseModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'points' | 'money'>('points');
    const [isProcessing, setIsProcessing] = useState(false);

    const FREEZE_COST_POINTS = 100;
    const FREEZE_COST_MONEY = 2;

    const canAffordPoints = userPoints >= FREEZE_COST_POINTS;
    const canAffordMoney = userBalance >= FREEZE_COST_MONEY;

    const handlePurchase = async () => {
        setIsProcessing(true);

        try {
            const res = await apiClient.post('/gamification/freeze/purchase', {
                paymentMethod
            });

            if (res.data.success) {
                toast.success(res.data.message);
                onSuccess();
                onClose();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Purchase failed');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Purchase Streak Freeze 🧊
                </h2>
                
                <p className="text-gray-600 mb-6">
                    A freeze token protects your streak if you miss a day. Choose your payment method:
                </p>

                <div className="space-y-3 mb-6">
                    {/* Points Option */}
                    <button
                        onClick={() => setPaymentMethod('points')}
                        disabled={!canAffordPoints}
                        className={`
                            w-full p-4 rounded-xl border-2 text-left transition
                            ${paymentMethod === 'points' 
                                ? 'border-indigo-600 bg-indigo-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }
                            ${!canAffordPoints && 'opacity-50 cursor-not-allowed'}
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-bold text-lg">⭐ {FREEZE_COST_POINTS} Points</div>
                                <div className="text-sm text-gray-500">
                                    You have: {userPoints} points
                                </div>
                            </div>
                            {!canAffordPoints && (
                                <span className="text-red-500 text-sm">Insufficient</span>
                            )}
                        </div>
                    </button>

                    {/* Money Option */}
                    <button
                        onClick={() => setPaymentMethod('money')}
                        disabled={!canAffordMoney}
                        className={`
                            w-full p-4 rounded-xl border-2 text-left transition
                            ${paymentMethod === 'money' 
                                ? 'border-green-600 bg-green-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }
                            ${!canAffordMoney && 'opacity-50 cursor-not-allowed'}
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-bold text-lg">💵 ${FREEZE_COST_MONEY}</div>
                                <div className="text-sm text-gray-500">
                                    Balance: ${userBalance}
                                </div>
                            </div>
                            {!canAffordMoney && (
                                <span className="text-red-500 text-sm">Insufficient</span>
                            )}
                        </div>
                    </button>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePurchase}
                        disabled={isProcessing || (!canAffordPoints && !canAffordMoney)}
                        className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Processing...' : 'Purchase'}
                    </button>
                </div>
            </div>
        </div>
    );
}
