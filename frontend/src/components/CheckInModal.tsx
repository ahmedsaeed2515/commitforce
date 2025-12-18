'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { challengeApi } from '@/lib/api/challenge.api';
import ImageUpload from './ImageUpload';

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
  const { register, handleSubmit, control, formState: { errors } } = useForm<CheckInData>();

  const onSubmit = async (data: CheckInData) => {
    try {
      setIsLoading(true);
      await challengeApi.checkIn(challengeId, data);
      toast.success('Checked in successfully! 🎉');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to check in');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Daily Check-in
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">How did it go?</label>
                <textarea
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  rows={3}
                  placeholder="Share your progress..."
                  {...register('note')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Proof Image (Optional)</label>
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

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                >
                  {isLoading ? 'Checking in...' : 'Check In'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
