'use client';

import { useState } from 'react';
import apiClient from '@/lib/api/client';
import toast from 'react-hot-toast';
import { Snowflake, Star, Wallet, X, Zap } from 'lucide-react';

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
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Purchase failed');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-[#0a0a1a] border border-white/10 rounded-2xl max-w-md w-full shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Snowflake className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Purchase Streak Freeze
                                </h2>
                                <p className="text-sm text-white/50">Protect your streak</p>
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
                
                <div className="p-6">
                    <p className="text-white/60 mb-6">
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
                                    ? 'border-indigo-500 bg-indigo-500/10' 
                                    : 'border-white/10 hover:border-white/20 bg-white/5'
                                }
                                ${!canAffordPoints && 'opacity-50 cursor-not-allowed'}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-lg text-white flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-400" />
                                        {FREEZE_COST_POINTS} Points
                                    </div>
                                    <div className="text-sm text-white/50">
                                        You have: {userPoints} points
                                    </div>
                                </div>
                                {!canAffordPoints && (
                                    <span className="text-red-400 text-sm">Insufficient</span>
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
                                    ? 'border-green-500 bg-green-500/10' 
                                    : 'border-white/10 hover:border-white/20 bg-white/5'
                                }
                                ${!canAffordMoney && 'opacity-50 cursor-not-allowed'}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-lg text-white flex items-center gap-2">
                                        <Wallet className="w-5 h-5 text-green-400" />
                                        ${FREEZE_COST_MONEY}
                                    </div>
                                    <div className="text-sm text-white/50">
                                        Balance: ${userBalance}
                                    </div>
                                </div>
                                {!canAffordMoney && (
                                    <span className="text-red-400 text-sm">Insufficient</span>
                                )}
                            </div>
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-white/10 rounded-xl font-medium text-white/70 hover:bg-white/5 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePurchase}
                            disabled={isProcessing || (!canAffordPoints && !canAffordMoney)}
                            className="flex-1 bg-linear-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-400 hover:to-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Purchase
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
