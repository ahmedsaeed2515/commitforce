'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { challengeApi, CreateChallengeData } from '@/lib/api/challenge.api';
import ImageUpload from '@/components/ImageUpload';
import { Target, FileText, Tag, Calendar, ArrowLeft, Rocket, Wallet } from 'lucide-react';

export default function CreateChallengePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<CreateChallengeData>();

  const startDate = watch('startDate');

  const onSubmit = async (data: CreateChallengeData) => {
    try {
      setIsLoading(true);
      
      const payload = {
        ...data,
        goalType: 'boolean' as const, 
        checkInFrequency: 'daily',
        isPublic: true 
      };

      const response = await challengeApi.create(payload);
      
      if (response.success) {
        toast.success('Challenge created successfully!');
        router.push('/dashboard');
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        const errorMsg = axiosError.response?.data?.message || 'Failed to create challenge';
        toast.error(errorMsg);
      } else {
        toast.error('Failed to create challenge');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Create New Challenge
              </h2>
              <p className="mt-2 text-white/50">
                Commit to a goal and track your progress.
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              
              {/* Cover Image Upload */}
              <Controller
                control={control}
                name="coverImage"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload 
                    onChange={onChange} 
                    value={value as File} 
                    label="Challenge Cover Image (Optional)" 
                  />
                )}
              />

              <div className="space-y-5">
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="e.g., 30 Days of Coding"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && <p className="text-red-400 text-xs mt-2">{errors.title.message as string}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                    placeholder="Describe your challenge..."
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && <p className="text-red-400 text-xs mt-2">{errors.description.message as string}</p>}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    {...register('category', { required: true })}
                  >
                    <option value="fitness" className="bg-[#0a0a1a]">Fitness</option>
                    <option value="health" className="bg-[#0a0a1a]">Health</option>
                    <option value="learning" className="bg-[#0a0a1a]">Learning</option>
                    <option value="productivity" className="bg-[#0a0a1a]">Productivity</option>
                    <option value="habits" className="bg-[#0a0a1a]">Habits</option>
                    <option value="finance" className="bg-[#0a0a1a]">Finance</option>
                    <option value="custom" className="bg-[#0a0a1a]">Custom</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      {...register('startDate', { required: 'Start date is required' })}
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      required
                      min={startDate ? String(startDate) : undefined}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      {...register('endDate', { required: 'End date is required' })}
                    />
                  </div>

                  {/* Pledge Amount */}
                  <div className="col-span-2 pt-4 border-t border-white/10">
                    <label htmlFor="pledge" className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                       <Wallet className="w-4 h-4" />
                       Commitment Stake (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                      <input
                        id="pledge"
                        type="number"
                        min="0"
                        step="5"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="0.00"
                        {...register('deposit.amount', { valueAsNumber: true })}
                      />
                      <input type="hidden" {...register('deposit.currency')} value="USD" />
                    </div>
                    <p className="text-xs text-white/40 mt-2">
                       Stake money on your goal. If you fail, it goes to charity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-4 py-3 border border-white/10 rounded-xl font-medium text-white/70 hover:bg-white/5 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
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
                      <Rocket className="w-5 h-5" />
                      Create Challenge
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
