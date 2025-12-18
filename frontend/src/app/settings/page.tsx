'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store/authStore';
import { settingsApi } from '@/lib/api/settings.api';
import ImageUpload from '@/components/ImageUpload';
import { useRouter } from 'next/navigation';

interface SettingsForm {
  fullName: string;
  username: string;
  bio: string;
  avatar?: File;
}

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsForm>({
    defaultValues: {
      fullName: user?.fullName || '',
      username: user?.username || '',
      bio: user?.bio || ''
    }
  });

  const onSubmit = async (data: SettingsForm) => {
    try {
      setIsSubmitting(true);
      const updateData = { ...data, avatar };
      
      const res = await settingsApi.updateProfile(updateData);
      
      if (res.success) {
        toast.success('Profile updated successfully');
        // Update local store
        updateUser(res.data);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Account Settings</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Avatar */}
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                     <div className="flex justify-center">
                         <div className="w-32">
                             <ImageUpload 
                                label="Change Avatar"
                                onChange={setAvatar}
                                value={user?.avatar}
                             />
                         </div>
                     </div>
                </div>

                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        {...register('fullName', { required: 'Full name is required' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
                </div>

                 {/* Username */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        {...register('username', { required: 'Username is required' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                     {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
                </div>

                 {/* Bio */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        {...register('bio')}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}
