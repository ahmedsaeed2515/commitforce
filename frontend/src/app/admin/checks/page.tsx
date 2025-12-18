'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { verificationApi } from '@/lib/api/verification.api';

export default function VerificationPage() {
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

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
    } catch (err: any) {
        toast.error('Failed to load pending check-ins');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (checkInId: string, status: 'approved' | 'rejected') => {
    try {
      setProcessingId(checkInId);
      const res = await verificationApi.verifyCheckIn(checkInId, status);
      if (res.success) {
        toast.success(`Check-in ${status}`);
        // Remove from list
        setCheckIns(prev => prev.filter(c => c._id !== checkInId));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
      return <div className="p-8 text-center">Loading pending verifications...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pending Verifications</h1>
        
        {checkIns.length === 0 ? (
           <div className="bg-white p-12 text-center rounded-lg shadow text-gray-500">
               No pending check-ins to verify. 🎉
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {checkIns.map((checkIn) => (
                    <div key={checkIn._id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col">
                        <div className="h-48 w-full bg-gray-200 relative">
                            {checkIn.photos && checkIn.photos.length > 0 ? (
                                <img src={checkIn.photos[0]} alt="Proof" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                        </div>
                        <div className="p-4 flex-1">
                            <h3 className="font-bold text-lg">{checkIn.challenge.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">User: {checkIn.user.fullName}</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mb-4">
                                "{checkIn.note || 'No notes'}"
                            </p>
                            <div className="text-xs text-gray-400 mb-4">
                                {new Date(checkIn.date).toLocaleString()}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 flex space-x-2 border-t border-gray-100">
                            <button
                                onClick={() => handleVerify(checkIn._id, 'approved')}
                                disabled={processingId === checkIn._id}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleVerify(checkIn._id, 'rejected')}
                                disabled={processingId === checkIn._id}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
           </div>
        )}
      </div>
    </div>
  );
}
