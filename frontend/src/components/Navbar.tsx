'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
                CommitForce
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/challenges" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Challenges
              </Link>
              <Link href="/feed" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Feed
              </Link>
              <Link href="/leaderboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Leaderboard
              </Link>
              <Link href="/gamification" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                🎮 Progress
              </Link>
              {user?.role === 'admin' && (
                  <Link href="/admin/checks" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Approvals
                  </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Wallet Balance */}
            <div className="mr-4 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full hidden sm:block">
               💰 ${user?.balance?.amount || 0}
            </div>
            
            <NotificationDropdown />

             <div className="ml-3 relative group">
                <button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    {user?.avatar ? (
                        <Image 
                            src={user.avatar} 
                            alt={user.fullName || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                            {user?.fullName?.[0]}
                        </div>
                    )}
                </button>
                {/* Dropdown (Simplified hover for MVP) */}
                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                    <Link href="/wallet/deposit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Deposit Funds
                    </Link>
                     <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign out
                    </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
