'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { challengeApi, CreateChallengeData } from '@/lib/api/challenge.api';
import ImageUpload from '@/components/ImageUpload';

export default function CreateChallengePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<CreateChallengeData>();

  // Watch start date to enforce end date constraints
  const startDate = watch('startDate');

  const onSubmit = async (data: CreateChallengeData) => {
    try {
      setIsLoading(true);
      
      const payload = {
          ...data,
          // If using standard datetime-local input, values are correctly formatted for API usually, 
          // or ensure ISO conversion if needed. Backend accepts ISO strings.
          goalType: 'boolean' as const, 
          checkInFrequency: 'daily',
          isPublic: true 
      };

      const response = await challengeApi.create(payload);
      
      if (response.success) {
        toast.success('Challenge created successfully! 🚀');
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create New Challenge
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
              commit to a goal and track your progress.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
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

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            <div className="sm:col-span-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <div className="mt-1">
                <input
                  id="title"
                  type="text"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="e.g., 30 Days of Coding"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows={4}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="Describe your challenge..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <div className="mt-1">
                <select
                  id="category"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  {...register('category', { required: true })}
                >
                  <option value="fitness">Fitness</option>
                  <option value="health">Health</option>
                  <option value="learning">Learning</option>
                  <option value="productivity">Productivity</option>
                  <option value="habits">Habits</option>
                  <option value="finance">Finance</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
               {/* Spacer or another field */}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <div className="mt-1">
                <input
                  type="date"
                  id="startDate"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  {...register('startDate', { required: 'Start date is required' })}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <div className="mt-1">
                <input
                  type="date"
                  id="endDate"
                  required
                  min={startDate ? String(startDate) : undefined}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  {...register('endDate', { required: 'End date is required' })}
                />
              </div>
            </div>

          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Challenge'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
