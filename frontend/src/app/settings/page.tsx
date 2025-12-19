'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store/authStore';
import { settingsApi } from '@/lib/api/settings.api';
import ImageUpload from '@/components/ImageUpload';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Settings, User, Shield, Bell, CreditCard, LogOut, 
  Lock, Smartphone, Trash2, Mail, MessageSquare, Clock, 
  Newspaper, Wallet, Plus, ArrowRight
} from 'lucide-react';

interface SettingsForm {
  fullName: string;
  username: string;
  bio: string;
  avatar?: File;
}

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  // Password Change State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsApi.updatePassword(passwordData);
      toast.success('Password updated successfully');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you definitely sure? This action is irreversible and will delete all your data.')) {
      try {
        await settingsApi.deleteAccount();
        toast.success('Account deleted');
        // Redirect to logout or home
        window.location.href = '/login';
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to delete account');
      }
    }
  };

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
      const updateData = { ...data, avatar: avatar || undefined };
      
      const res = await settingsApi.updateProfile(updateData);
      
      if (res.success) {
        toast.success('Profile updated successfully!');
        updateUser(res.data);
        router.refresh();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', Icon: User },
    { id: 'security', label: 'Security', Icon: Shield },
    { id: 'notifications', label: 'Notifications', Icon: Bell },
    { id: 'billing', label: 'Billing', Icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Settings className="w-10 h-10 text-indigo-400" />
              Settings
            </h1>
            <p className="text-white/50 mt-2">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                      activeTab === tab.id 
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <tab.Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
                <hr className="my-2 border-white/10" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-8">
                      <div className="w-32 h-32 mb-4">
                        <ImageUpload 
                          label="Change Avatar"
                          onChange={setAvatar}
                          value={user?.avatar}
                        />
                      </div>
                      <p className="text-sm text-white/50">Click to upload a new photo</p>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                      <input
                        type="text"
                        {...register('fullName', { required: 'Full name is required' })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                      {errors.fullName && <p className="mt-2 text-sm text-red-400">{errors.fullName.message}</p>}
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Username</label>
                      <input
                        type="text"
                        {...register('username', { required: 'Username is required' })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                      {errors.username && <p className="mt-2 text-sm text-red-400">{errors.username.message}</p>}
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Bio</label>
                      <textarea
                        {...register('bio')}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Save Changes</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-start gap-4">
                        <Lock className="w-6 h-6 text-indigo-400 shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">Change Password</h3>
                          <p className="text-sm text-white/50 mb-4">Update your password to keep your account secure</p>
                          
                          {isChangingPassword ? (
                            <form onSubmit={handlePasswordUpdate} className="space-y-3 max-w-sm">
                              <input
                                type="password"
                                placeholder="Current Password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                              />
                              <input
                                type="password"
                                placeholder="New Password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                              />
                              <div className="flex gap-2">
                                <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm transition">
                                  Save
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => setIsChangingPassword(false)}
                                  className="text-white/60 hover:text-white px-3 py-1.5 text-sm transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button 
                              onClick={() => setIsChangingPassword(true)}
                              className="bg-linear-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-400 hover:to-purple-500 transition"
                            >
                              Change Password
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-start gap-4">
                        <Smartphone className="w-6 h-6 text-green-400 shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">Two-Factor Authentication</h3>
                          <p className="text-sm text-white/50 mb-4">Add an extra layer of security to your account</p>
                          <button className="px-4 py-2 rounded-lg border border-white/20 text-white/70 font-medium hover:bg-white/5 transition">
                            Enable 2FA
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="flex items-start gap-4">
                        <Trash2 className="w-6 h-6 text-red-400 shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-red-400 mb-1">Danger Zone</h3>
                          <p className="text-sm text-red-300/70 mb-4">Permanently delete your account and all data</p>
                          <button 
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email', Icon: Mail },
                      { id: 'push', label: 'Push Notifications', desc: 'Get notified on your device', Icon: Bell },
                      { id: 'reminders', label: 'Challenge Reminders', desc: 'Daily reminders for check-ins', Icon: Clock },
                      { id: 'social', label: 'Social Updates', desc: 'When someone likes or comments', Icon: MessageSquare },
                      { id: 'marketing', label: 'Marketing Emails', desc: 'Tips and product updates', Icon: Newspaper },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center gap-3">
                          <item.Icon className="w-5 h-5 text-indigo-400" />
                          <div>
                            <p className="font-medium text-white">{item.label}</p>
                            <p className="text-sm text-white/50">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={item.id !== 'marketing'} />
                          <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Billing & Wallet</h2>
                  
                  {/* Wallet Balance */}
                  <div className="bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 rounded-2xl p-6 mb-6 text-center">
                    <p className="text-sm text-white/50 mb-1">Current Balance</p>
                    <p className="text-4xl font-bold text-white">${user?.balance?.amount || 0}</p>
                    <Link href="/wallet/deposit" className="mt-4 inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-indigo-400 hover:to-purple-500 transition">
                      <Plus className="w-4 h-4" />
                      Add Funds
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Payment Methods</h3>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wallet className="w-6 h-6 text-white/50" />
                        <div>
                          <p className="font-medium text-white">No payment method</p>
                          <p className="text-sm text-white/50">Add a card for deposits</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-xl border border-indigo-500/30 text-indigo-400 font-medium hover:bg-indigo-500/10 transition flex items-center gap-2">
                        Add Card
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
