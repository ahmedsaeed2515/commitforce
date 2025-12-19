'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { verificationApi } from '@/lib/api/verification.api';
import Image from 'next/image';
import { ShieldCheck, CheckCircle, XCircle, ImageOff, User, Calendar, PartyPopper } from 'lucide-react';

interface CheckIn {
  _id: string;
  photos: string[];
  challenge: {
    title: string;
  };
  user: {
    fullName: string;
  };
  note?: string;
  date: string;
}

export default function VerificationPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPendingCheckIns();
  }, []);

  const fetchPendingCheckIns = async () => {
    try {
      setIsLoading(true);
      const output = await verificationApi.getPendingCheckIns();
      if (output.success) {
        setCheckIns(output.data);
      }
    } catch {
        toast.error('Failed to load pending check-ins');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (checkInId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      setProcessingId(checkInId);
      const res = await verificationApi.verifyCheckIn(checkInId, status, notes);
      if (res.success) {
        toast.success(`Check-in ${status}`);
        setCheckIns(prev => prev.filter(c => c._id !== checkInId));
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMsg = (err as any).response?.data?.message || 'Verification failed';
      toast.error(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-white/50">Loading pending verifications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
            Pending Verifications
          </h1>
          
          {checkIns.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-12 text-center rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <PartyPopper className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white/50">No pending check-ins to verify.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {checkIns.map((checkIn) => (
                <div key={checkIn._id} className="bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden rounded-2xl flex flex-col hover:border-white/20 transition-all">
                  <div className="h-48 w-full bg-white/5 relative">
                    {checkIn.photos && checkIn.photos.length > 0 ? (
                      <Image
                        src={checkIn.photos[0]}
                        alt="Proof"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-white/30">
                        <ImageOff className="w-8 h-8 mb-2" />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-lg text-white">{checkIn.challenge.title}</h3>
                    <p className="text-sm text-white/50 mb-2 flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {checkIn.user.fullName}
                    </p>
                    <p className="text-sm text-white/60 bg-white/5 p-2 rounded-lg mb-4">
                      &quot;{checkIn.note || 'No notes'}&quot;
                    </p>
                    <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm mb-2 focus:ring-2 focus:ring-indigo-500/50 outline-none placeholder:text-white/20"
                        placeholder="Add a note to user (optional)..."
                        rows={2}
                        onChange={(e) => {
                            setAdminNotes(prev => ({ ...prev, [checkIn._id]: e.target.value }));
                        }}
                        value={adminNotes[checkIn._id] || ''}
                    />
                    <div className="text-xs text-white/30 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(checkIn.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 flex space-x-2 border-t border-white/10">
                    <button
                      onClick={() => handleVerify(checkIn._id, 'approved', adminNotes[checkIn._id])}
                      disabled={processingId === checkIn._id}
                      className="flex-1 bg-green-500/20 border border-green-500/30 text-green-400 py-2.5 px-4 rounded-xl hover:bg-green-500/30 disabled:opacity-50 font-medium transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerify(checkIn._id, 'rejected', adminNotes[checkIn._id])}
                      disabled={processingId === checkIn._id}
                      className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-2.5 px-4 rounded-xl hover:bg-red-500/30 disabled:opacity-50 font-medium transition flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
