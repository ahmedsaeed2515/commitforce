'use client';

import { useEffect, useState } from 'react';
import { paymentApi } from '@/lib/api/payment.api';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, XCircle, Clock, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: string;
  description?: string;
  challenge?: {
    _id: string;
    title: string;
    status: string;
  };
  paidAt?: string;
  refundedAt?: string;
  createdAt: string;
}

const statusConfig = {
  succeeded: {
    icon: CheckCircle,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    label: 'Completed'
  },
  failed: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    label: 'Failed'
  },
  pending: {
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    label: 'Pending'
  },
  processing: {
    icon: RefreshCw,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    label: 'Processing'
  },
  refunded: {
    icon: RefreshCw,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    label: 'Refunded'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-gray-400',
    bg: 'bg-gray-500/20',
    border: 'border-gray-500/30',
    label: 'Cancelled'
  }
};

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await paymentApi.getPaymentHistory();
      if (res.success) {
        setPayments(res.data);
      }
    } catch (error) {
      toast.error('Failed to load payment history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] py-12 px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/wallet"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Wallet
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Payment History</h1>
          </div>
          <p className="text-white/60">View all your transactions and payments</p>
        </div>

        {/* Payments List */}
        {payments.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
            <CreditCard className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Payments Yet</h3>
            <p className="text-white/60 mb-6">Your payment history will appear here</p>
            <Link
              href="/challenges/create"
              className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-400 hover:to-purple-500 transition"
            >
              Create Challenge
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => {
              const config = statusConfig[payment.status];
              const Icon = config.icon;

              return (
                <div
                  key={payment._id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Challenge Info */}
                      {payment.challenge && (
                        <Link
                          href={`/challenges/${payment.challenge._id}`}
                          className="text-white font-semibold hover:text-indigo-400 transition mb-1 block"
                        >
                          {payment.challenge.title}
                        </Link>
                      )}
                      
                      {/* Description */}
                      {payment.description && (
                        <p className="text-sm text-white/60 mb-2">{payment.description}</p>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-4 text-sm text-white/40">
                        <span>{formatDate(payment.createdAt)}</span>
                        {payment.paidAt && (
                          <span>• Paid: {formatDate(payment.paidAt)}</span>
                        )}
                        {payment.refundedAt && (
                          <span>• Refunded: {formatDate(payment.refundedAt)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Amount */}
                      <div className="text-2xl font-bold text-white">
                        {formatAmount(payment.amount, payment.currency)}
                      </div>

                      {/* Status Badge */}
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} border ${config.border}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                        <span className={`text-sm font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
