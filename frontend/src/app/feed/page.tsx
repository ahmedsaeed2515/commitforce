'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { feedApi } from '@/lib/api/feed.api';
import Link from 'next/link';
import Image from 'next/image';

export default function FeedPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setIsLoading(true);
      const res = await feedApi.getFeed(page);
      if (res.success) {
        setItems(res.data.checkIns);
        // Simplified pagination logic
        if (res.data.checkIns.length < 10) setHasMore(false);
      }
    } catch (err) {
      toast.error('Failed to load feed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Community Feed 🌍</h1>
        
        {isLoading && items.length === 0 ? (
           <div className="space-y-4">
              {[1,2,3].map(i => (
                  <div key={i} className="bg-white h-64 rounded-lg shadow animate-pulse"></div>
              ))}
           </div>
        ) : items.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No activity yet. Be the first!</p>
           </div>
        ) : (
           <div className="space-y-6">
               {items.map((item) => (
                   <div key={item._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="shrink-0">
                                    {item.user.avatar ? (
                                        <Image 
                                            src={item.user.avatar} 
                                            alt={item.user.fullName}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {item.user.fullName[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{item.user.fullName}</p>
                                    <p className="text-xs text-gray-500">
                                        checked in on <Link href={`/challenges/${item.challenge._id}`} className="text-indigo-600 hover:underline">{item.challenge.title}</Link>
                                    </p>
                                </div>
                                <div className="ml-auto text-xs text-gray-400">
                                    {new Date(item.verifiedAt).toLocaleDateString()}
                                </div>
                            </div>
                            
                            {item.photos && item.photos.length > 0 && (
                                <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 max-h-96 flex justify-center">
                                    <Image 
                                        src={item.photos[0]} 
                                        alt="Check-in proof"
                                        width={600}
                                        height={400}
                                        className="object-contain max-h-96 w-full"
                                    />
                                </div>
                            )}
                            
                            <p className="text-gray-700">{item.note}</p>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-sm text-gray-500">
                                <span className="mr-4">🔥 Verified</span>
                                {/* Future: Like button */}
                            </div>
                        </div>
                   </div>
               ))}
           </div>
        )}
      </div>
    </div>
  );
}
