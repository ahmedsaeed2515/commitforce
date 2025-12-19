'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, ArrowLeft, Search, ChevronDown, ChevronUp,
  Target, CreditCard, Users, Trophy, Shield, Mail,
  Flame, Settings, Bell, MessageCircle
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  // Getting Started
  {
    category: 'Getting Started',
    question: 'What is CommitForce?',
    answer: 'CommitForce is a goal commitment platform that helps you achieve your personal challenges. By creating challenges with optional monetary stakes, you increase your accountability and motivation to succeed.'
  },
  {
    category: 'Getting Started',
    question: 'How do I create an account?',
    answer: 'Click the "Sign Up" button on the homepage. Enter your email, create a password, and choose a username. You\'ll receive a verification email to confirm your account.'
  },
  {
    category: 'Getting Started',
    question: 'Is CommitForce free to use?',
    answer: 'Yes! Creating an account and basic challenge features are completely free. The optional deposit feature allows you to add stakes to your challenges, but this is entirely optional.'
  },
  // Challenges
  {
    category: 'Challenges',
    question: 'How do I create a challenge?',
    answer: 'Go to Dashboard > Create Challenge. Set a title, description, category, start/end dates, and optionally add a monetary stake. Your challenge will be active from the start date.'
  },
  {
    category: 'Challenges',
    question: 'What is a check-in?',
    answer: 'A check-in is how you track your daily progress. You can add notes and photos to document your journey. Regular check-ins are essential for maintaining your streak and completing your challenge.'
  },
  {
    category: 'Challenges',
    question: 'Can I edit or delete a challenge?',
    answer: 'Yes, you can edit challenge details or delete a challenge from the challenge detail page. Note that some changes may affect your progress tracking.'
  },
  // Payments
  {
    category: 'Payments',
    question: 'How do deposits work?',
    answer: 'When creating a challenge, you can optionally stake money. If you successfully complete your challenge, your deposit is refunded. If you fail, the money goes to charity or the community pool.'
  },
  {
    category: 'Payments',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit/debit cards, Apple Pay, Google Pay, and other methods through our secure Stripe payment integration.'
  },
  {
    category: 'Payments',
    question: 'How do refunds work?',
    answer: 'If you complete your challenge according to the defined criteria, your deposit is automatically refunded to your original payment method within 5-7 business days.'
  },
  {
    category: 'Payments',
    question: 'Is my payment information secure?',
    answer: 'Absolutely. We use Stripe, a PCI-DSS Level 1 certified payment processor. We never store your card details on our servers.'
  },
  // Social Features
  {
    category: 'Social',
    question: 'What are Clubs?',
    answer: 'Clubs are communities where you can join other users with similar goals. Share progress, motivate each other, and compete on club leaderboards.'
  },
  {
    category: 'Social',
    question: 'How does the leaderboard work?',
    answer: 'The leaderboard ranks users based on their total points earned from completing challenges, maintaining streaks, and earning badges.'
  },
  // Gamification
  {
    category: 'Gamification',
    question: 'What are streaks?',
    answer: 'A streak counts consecutive days you\'ve completed check-ins. Longer streaks earn you bonus points and special badges. Missing a day resets your streak to zero.'
  },
  {
    category: 'Gamification',
    question: 'How do I earn badges?',
    answer: 'Badges are earned by completing specific achievements like finishing challenges, maintaining streaks, or reaching certain levels. Check the Achievements page to see all available badges.'
  },
  // Account
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page. Enter your email, and we\'ll send you a password reset link valid for 1 hour.'
  },
  {
    category: 'Account',
    question: 'How do I delete my account?',
    answer: 'Go to Settings > Account > Delete Account. Note that this action is permanent and will delete all your data, challenges, and progress.'
  },
];

const CATEGORIES = [
  { name: 'Getting Started', icon: <Target className="w-5 h-5" />, color: 'text-green-400' },
  { name: 'Challenges', icon: <Trophy className="w-5 h-5" />, color: 'text-amber-400' },
  { name: 'Payments', icon: <CreditCard className="w-5 h-5" />, color: 'text-blue-400' },
  { name: 'Social', icon: <Users className="w-5 h-5" />, color: 'text-purple-400' },
  { name: 'Gamification', icon: <Flame className="w-5 h-5" />, color: 'text-orange-400' },
  { name: 'Account', icon: <Settings className="w-5 h-5" />, color: 'text-indigo-400' },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Filter FAQs based on search and category
  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Help Center</h1>
            <p className="text-white/60 max-w-md mx-auto">
              Find answers to common questions about CommitForce
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !selectedCategory 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              All Topics
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.name 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <span className={selectedCategory === cat.name ? 'text-white' : cat.color}>
                  {cat.icon}
                </span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4 mb-12">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No results found for &quot;{searchQuery}&quot;</p>
                <p className="text-white/40 text-sm mt-2">Try different keywords or browse by category</p>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => {
                const category = CATEGORIES.find(c => c.name === faq.category);
                const isExpanded = expandedItems.includes(index);
                
                return (
                  <div 
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-5 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className={category?.color}>
                        {category?.icon}
                      </span>
                      <span className="flex-1 font-medium text-white">{faq.question}</span>
                      {isExpanded 
                        ? <ChevronUp className="w-5 h-5 text-white/40" />
                        : <ChevronDown className="w-5 h-5 text-white/40" />
                      }
                    </button>
                    {isExpanded && (
                      <div className="px-6 pb-5 pl-16">
                        <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Link 
              href="/dashboard"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
            >
              <Target className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-white mb-1">Create Challenge</h3>
              <p className="text-white/50 text-sm">Start your journey today</p>
            </Link>
            
            <Link 
              href="/settings"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
            >
              <Settings className="w-8 h-8 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-white mb-1">Account Settings</h3>
              <p className="text-white/50 text-sm">Manage your preferences</p>
            </Link>
            
            <Link 
              href="/achievements"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
            >
              <Trophy className="w-8 h-8 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-white mb-1">View Achievements</h3>
              <p className="text-white/50 text-sm">Track your badges</p>
            </Link>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-8 text-center">
            <MessageCircle className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Still need help?</h2>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Our support team is here to help you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@commitforce.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
              <Link 
                href="/terms"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
              >
                <Shield className="w-5 h-5" />
                Terms & Privacy
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-4 justify-center mt-12 pt-8 border-t border-white/10">
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
