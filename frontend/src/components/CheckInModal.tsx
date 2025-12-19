'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { challengeApi } from '@/lib/api/challenge.api';
import ImageUpload from './ImageUpload';
import { X, CheckCircle, Camera, MessageSquare } from 'lucide-react';

interface CheckInModalProps {
  challengeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CheckInData {
  note: string;
  image?: File;
  value?: number;
}

export default function CheckInModal({ challengeId, isOpen, onClose, onSuccess }: CheckInModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control } = useForm<CheckInData>();

  const onSubmit = async (data: CheckInData) => {
    try {
      setIsLoading(true);
      await challengeApi.checkIn(challengeId, data);
      toast.success('Checked in successfully!');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to check in');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="relative bg-[#0a0a1a] border border-white/10 rounded-2xl max-w-lg w-full shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white" id="modal-title">
                Daily Check-in
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                How did it go?
              </label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                rows={3}
                placeholder="Share your progress..."
                {...register('note')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Proof Image (Optional)
              </label>
              <div className="mt-1">
                <Controller
                  control={control}
                  name="image"
                  render={({ field: { onChange, value } }) => (
                    <ImageUpload 
                      onChange={onChange} 
                      value={value as File} 
                      label="Upload Proof"
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-white/10 rounded-xl font-medium text-white/70 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-linear-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Check In
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
