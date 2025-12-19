'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

/**
 * Base Skeleton with shimmer effect
 * Adjusted for Dark Theme
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-white/5 rounded-lg ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

/**
 * Challenge Grid Skeleton
 */
export function ChallengeGridSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-72 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      <div>
        <div className="flex justify-between mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Card Skeleton - For feed items, challenge cards, etc.
 */
export function CardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      
      {/* Image placeholder */}
      <Skeleton className="w-full h-64" />
      
      {/* Content */}
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        
        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-full ml-auto" />
        </div>
      </div>
    </div>
  );
}

/**
 * Stat Card Skeleton - For dashboard stats
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Challenge Row Skeleton
 */
export function ChallengeRowSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-24 rounded-xl" />
    </div>
  );
}

/**
 * User Card Skeleton
 */
export function UserCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
      <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
      <Skeleton className="h-5 w-32 mx-auto mb-2" />
      <Skeleton className="h-4 w-24 mx-auto mb-4" />
      <div className="flex justify-center gap-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

/**
 * Leaderboard Row Skeleton
 */
export function LeaderboardRowSkeleton({ index }: { index: number }) {
  return (
    <div 
      className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

/**
 * Podium Skeleton - For top 3 leaderboard
 */
export function PodiumSkeleton() {
  return (
    <div className="flex items-end justify-center gap-4 mb-8">
      {/* 2nd Place */}
      <div className="flex flex-col items-center w-32">
        <Skeleton className="w-16 h-16 rounded-full mb-3" />
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-32 w-full rounded-t-lg" />
      </div>
      
      {/* 1st Place */}
      <div className="flex flex-col items-center w-36">
        <Skeleton className="w-20 h-20 rounded-full mb-3" />
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-40 w-full rounded-t-lg" />
      </div>
      
      {/* 3rd Place */}
      <div className="flex flex-col items-center w-32">
        <Skeleton className="w-14 h-14 rounded-full mb-3" />
        <Skeleton className="h-4 w-18 mb-2" />
        <Skeleton className="h-24 w-full rounded-t-lg" />
      </div>
    </div>
  );
}

/**
 * Badge Skeleton
 */
export function BadgeSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
      <div className="text-center">
        <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
        <Skeleton className="h-4 w-20 mx-auto mb-2" />
        <Skeleton className="h-3 w-24 mx-auto" />
      </div>
    </div>
  );
}

/**
 * Club Card Skeleton
 */
export function ClubCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-72 flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2 w-full">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex-1 space-y-2 mb-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Comment Skeleton
 */
export function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-3 border-b border-white/5 last:border-0">
      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/**
 * Quest Skeleton
 */
export function QuestSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  );
}

const Skeletons = {
  Skeleton,
  CardSkeleton,
  StatCardSkeleton,
  ChallengeRowSkeleton,
  UserCardSkeleton,
  LeaderboardRowSkeleton,
  PodiumSkeleton,
  BadgeSkeleton,
  ClubCardSkeleton,
  CommentSkeleton,
  QuestSkeleton,
  ChallengeGridSkeleton,
};

export default Skeletons;
