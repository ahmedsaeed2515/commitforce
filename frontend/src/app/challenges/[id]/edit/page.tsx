'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { challengeApi, CreateChallengeData } from '@/lib/api/challenge.api';
import ImageUpload from '@/components/ImageUpload';
import { Target, FileText, Tag, Calendar, ArrowLeft, Save, Loader2, Wallet } from 'lucide-react';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  deposit?: {
    amount: number;
    currency: string;
  };
}

export default function EditChallengePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  
  const { register, handleSubmit, control, formState: { errors }, watch, reset } = useForm<CreateChallengeData>();
  const startDate = watch('startDate');

  // Fetch challenge data
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await challengeApi.getById(id);
        if (response.success) {
          setChallenge(response.data);
          // Reset form with existing data
          reset({
            title: response.data.title,
            description: response.data.description,
            category: response.data.category,
            startDate: response.data.startDate?.split('T')[0],
            endDate: response.data.endDate?.split('T')[0],
            deposit: response.data.deposit || { amount: 0, currency: 'USD' },
          });
        }
      } catch (error) {
        console.error('Failed to fetch challenge:', error);
        toast.error('Failed to load challenge data');
        router.push('/challenges');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchChallenge();
    }
  }, [id, reset, router]);

  const onSubmit = async (data: CreateChallengeData) => {
    try {
      setIsLoading(true);
      
      const payload = {
        ...data,
        goalType: 'boolean' as const,
        checkInFrequency: 'daily',
        isPublic: true,
      };

      const response = await challengeApi.update(id, payload);
      
      if (response.success) {
        toast.success('Challenge updated successfully!');
        router.push(`/challenges/${id}`);
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        const errorMsg = axiosError.response?.data?.message || 'Failed to update challenge';
        toast.error(errorMsg);
      } else {
        toast.error('Failed to update challenge');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <Target className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Challenge Not Found</h2>
          <p className="text-white/60 mb-6">The challenge you&apos;re trying to edit doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/challenges')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Edit Challenge
              </h2>
              <p className="mt-2 text-white/50">
                Update your challenge details
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
                    existingImage={challenge.coverImage}
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
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-amber-400 hover:to-orange-500 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
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
