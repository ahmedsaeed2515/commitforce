'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { feedApi } from '@/lib/api/feed.api';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import CommentSection from '@/components/CommentSection';
import { CardSkeleton } from '@/components/ui/Skeletons';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  Globe, Heart, MessageCircle, CheckCircle, Sparkles, ChevronRight
} from 'lucide-react';

interface FeedItem {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    avatar?: string;
    username: string;
  };
  challenge: {
    _id: string;
    title: string;
  };
  photos?: string[];
  note?: string;
  verifiedAt: string;
  likes?: string[];
}

export default function FeedPage() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await feedApi.getFeed(1, 10);
      if (res.success) {
        setItems(res.data.checkIns);
        setHasMore(res.data.checkIns.length >= 10);
        setPage(1);
      }
    } catch {
      toast.error('Failed to load feed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await feedApi.getFeed(nextPage, 10);
      
      if (res.success) {
        const newItems = res.data.checkIns;
        if (newItems.length === 0) {
          setHasMore(false);
        } else {
          setItems(prev => [...prev, ...newItems]);
          setPage(nextPage);
          setHasMore(newItems.length >= 10);
        }
      }
    } catch {
      toast.error('Failed to load more');
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, isLoadingMore, loadMore]);

  const handleLike = async (itemId: string) => {
    try {
      await feedApi.likeCheckIn(itemId);
      setLikedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    } catch {
      toast.error('Failed to like');
    }
  };

  const toggleComments = (itemId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Globe className="w-10 h-10 text-blue-400" />
              Community Feed
            </h1>
            <p className="text-white/50">See what others are achieving</p>
          </div>

          {/* Feed Content */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon="Globe"
              title="No Activity Yet"
              description="Be the first to share your progress with the community!"
              action={{ label: 'Start a Challenge', href: '/challenges' }}
            />
          ) : (
            <div className="space-y-6">
              {items.map((item, index) => (
                <article
                  key={item._id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* User Header */}
                  <div className="p-5 flex items-center gap-4">
                    <Link href={`/users/${item.user.username}`} className="shrink-0">
                      {item.user.avatar ? (
                        <Image
                          src={item.user.avatar}
                          alt={item.user.fullName}
                          width={48}
                          height={48}
                          className="rounded-full ring-2 ring-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-white/10">
                          {item.user.fullName[0]}
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/users/${item.user.username}`} className="font-bold text-white hover:text-indigo-400 transition">
                        {item.user.fullName}
                      </Link>
                      <p className="text-sm text-white/50">
                        checked in on{' '}
                        <Link href={`/challenges/${item.challenge._id}`} className="text-indigo-400 hover:underline font-medium">
                          {item.challenge.title}
                        </Link>
                      </p>
                    </div>
                    <div className="text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-full">
                      {getTimeAgo(item.verifiedAt)}
                    </div>
                  </div>

                  {/* Photo */}
                  {item.photos && item.photos.length > 0 && (
                    <div className="relative overflow-hidden group">
                      <Image
                        src={item.photos[0]}
                        alt="Check-in proof"
                        width={600}
                        height={400}
                        className="w-full h-auto max-h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    {item.note && (
                      <p className="text-white/70 mb-4">{item.note}</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleLike(item._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all transform hover:scale-105 ${
                          likedItems.has(item._id) || item.likes?.includes(user?._id || '')
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedItems.has(item._id) ? 'fill-current' : ''}`} />
                        <span className="font-medium">
                          {(item.likes?.length || 0) + (likedItems.has(item._id) && !item.likes?.includes(user?._id || '') ? 1 : 0)}
                        </span>
                      </button>

                      <button
                        onClick={() => toggleComments(item._id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all transform hover:scale-105"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">Comments</span>
                      </button>

                      <div className="ml-auto flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </div>
                    </div>

                    {/* Comments Section */}
                    {expandedComments.has(item._id) && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <CommentSection checkInId={item._id} />
                      </div>
                    )}
                  </div>
                </article>
              ))}

              {/* Infinite Scroll Loading Indicator */}
              <div ref={loadMoreRef} className="py-8">
                {isLoadingMore && (
                  <div className="flex justify-center items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
                {!hasMore && items.length > 0 && (
                  <p className="text-center text-white/30 text-sm flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    You&apos;ve seen it all!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
