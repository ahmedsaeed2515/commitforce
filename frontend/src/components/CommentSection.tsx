'use client';

import { useState, useEffect, useCallback } from 'react';
import { commentApi } from '@/lib/api/comment.api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Heart, Trash2, Send, MessageSquare } from 'lucide-react';

interface Comment {
    _id: string;
    user: {
        _id: string;
        fullName: string;
        username: string;
        avatar?: string;
    };
    content: string;
    likes: string[];
    createdAt: string;
}

interface CommentSectionProps {
    checkInId: string;
    currentUserId?: string;
}

export default function CommentSection({ checkInId, currentUserId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await commentApi.getComments(checkInId);
            if (res.success) {
                setComments(res.data.comments);
            }
        } catch {
            console.error('Failed to load comments');
        } finally {
            setIsLoading(false);
        }
    }, [checkInId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setIsSubmitting(true);
            const res = await commentApi.createComment(checkInId, newComment);
            if (res.success) {
                setComments([res.data, ...comments]);
                setNewComment('');
                toast.success('Comment added!');
            }
        } catch {
            toast.error('Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async (commentId: string) => {
        try {
            await commentApi.likeComment(commentId);
            setComments(comments.map(c => {
                if (c._id === commentId) {
                    const hasLiked = currentUserId && c.likes.includes(currentUserId);
                    return {
                        ...c,
                        likes: hasLiked 
                            ? c.likes.filter(id => id !== currentUserId)
                            : [...c.likes, currentUserId || '']
                    };
                }
                return c;
            }));
        } catch {
            toast.error('Failed to like comment');
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await commentApi.deleteComment(commentId);
            setComments(comments.filter(c => c._id !== commentId));
            toast.success('Comment deleted');
        } catch {
            toast.error('Failed to delete comment');
        }
    };

    return (
        <div className="mt-4">
            <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments ({comments.length})
            </h3>

            {/* New Comment Form */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                        maxLength={500}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className="px-4 py-2.5 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>

            {/* Comments List */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl"></div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <p className="text-white/40 text-center py-4 text-sm">No comments yet. Be the first!</p>
            ) : (
                <div className="space-y-3">
                    {comments.map(comment => (
                        <div key={comment._id} className="flex gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                            <div className="shrink-0">
                                {comment.user.avatar ? (
                                    <Image
                                        src={comment.user.avatar}
                                        alt={comment.user.fullName}
                                        width={36}
                                        height={36}
                                        className="rounded-full ring-2 ring-white/10"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                        {comment.user.fullName[0]}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-white text-sm">
                                        {comment.user.fullName}
                                        <span className="text-white/40 text-xs ml-2">@{comment.user.username}</span>
                                    </p>
                                    <span className="text-xs text-white/30">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-white/70 mt-1 text-sm">{comment.content}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <button
                                        onClick={() => handleLike(comment._id)}
                                        className={`text-xs flex items-center gap-1 transition ${
                                            currentUserId && comment.likes.includes(currentUserId)
                                                ? 'text-red-400'
                                                : 'text-white/40 hover:text-red-400'
                                        }`}
                                    >
                                        <Heart className={`w-3.5 h-3.5 ${currentUserId && comment.likes.includes(currentUserId) ? 'fill-current' : ''}`} />
                                        {comment.likes.length}
                                    </button>
                                    {currentUserId === comment.user._id && (
                                        <button
                                            onClick={() => handleDelete(comment._id)}
                                            className="text-xs text-white/30 hover:text-red-400 transition flex items-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
