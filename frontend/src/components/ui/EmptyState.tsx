'use client';

import Link from 'next/link';
import { 
  Target, Globe, Trophy, Users, Medal, Bell, MessageSquare, 
  BarChart3, Search, AlertCircle, LucideIcon
} from 'lucide-react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: 'default' | 'minimal' | 'large';
}

// Map string icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Target,
  Globe,
  Trophy,
  Users,
  Medal,
  Bell,
  MessageSquare,
  BarChart3,
  Search,
  AlertCircle,
};

/**
 * Reusable Empty State Component
 * Shows when there's no data to display
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  const sizeClasses = {
    minimal: 'py-8 px-4',
    default: 'py-12 px-6',
    large: 'py-20 px-8',
  };

  const iconSizes = {
    minimal: 'w-10 h-10',
    default: 'w-14 h-14',
    large: 'w-20 h-20',
  };

  const titleSizes = {
    minimal: 'text-lg',
    default: 'text-2xl',
    large: 'text-3xl',
  };

  const IconComponent = iconMap[icon] || Target;

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center ${sizeClasses[variant]}`}>
      <div className={`${iconSizes[variant]} mx-auto mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center`}>
        <IconComponent className={`${variant === 'minimal' ? 'w-5 h-5' : variant === 'large' ? 'w-10 h-10' : 'w-7 h-7'} text-indigo-400`} />
      </div>
      <h3 className={`font-bold text-white mb-2 ${titleSizes[variant]}`}>
        {title}
      </h3>
      <p className="text-white/50 max-w-md mx-auto mb-6">{description}</p>
      
      {action && (
        action.href ? (
          <Link 
            href={action.href} 
            className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 transition"
          >
            {action.label}
          </Link>
        ) : (
          <button 
            onClick={action.onClick} 
            className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 transition"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

// Pre-configured Empty States for common scenarios
export const emptyStates = {
  challenges: (
    <EmptyState
      icon="Target"
      title="No Challenges Yet"
      description="Ready to commit to your goals? Start your first challenge and make real progress!"
      action={{ label: 'Create Challenge', href: '/challenges/create' }}
    />
  ),
  
  feed: (
    <EmptyState
      icon="Globe"
      title="No Activity Yet"
      description="Be the first to share your progress with the community!"
      action={{ label: 'Start a Challenge', href: '/challenges' }}
    />
  ),
  
  clubs: (
    <EmptyState
      icon="Trophy"
      title="No Clubs Found"
      description="Join a club to connect with like-minded achievers or create your own!"
      action={{ label: 'Create a Club', href: '/clubs/create' }}
    />
  ),
  
  users: (
    <EmptyState
      icon="Users"
      title="No Users Found"
      description="Try adjusting your search criteria or check back later."
    />
  ),
  
  badges: (
    <EmptyState
      icon="Medal"
      title="No Badges Yet"
      description="Complete challenges and maintain streaks to earn badges!"
      action={{ label: 'View Challenges', href: '/challenges' }}
    />
  ),
  
  notifications: (
    <EmptyState
      icon="Bell"
      title="All Caught Up!"
      description="You have no new notifications. Check back later!"
      variant="minimal"
    />
  ),
  
  comments: (
    <EmptyState
      icon="MessageSquare"
      title="No Comments Yet"
      description="Be the first to leave a comment!"
      variant="minimal"
    />
  ),
  
  analytics: (
    <EmptyState
      icon="BarChart3"
      title="No Data Available"
      description="Complete some challenges to see your analytics!"
      action={{ label: 'Start a Challenge', href: '/challenges/create' }}
    />
  ),

  search: (
    <EmptyState
      icon="Search"
      title="No Results Found"
      description="We couldn't find what you're looking for. Try different keywords."
      variant="minimal"
    />
  ),
  
  error: (
    <EmptyState
      icon="AlertCircle"
      title="Something Went Wrong"
      description="We encountered an error. Please try again later."
      variant="default"
    />
  ),
};

export default EmptyState;
