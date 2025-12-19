'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  Bot, Flame, Trophy, BarChart3, Gamepad2, Shield,
  Play, ArrowRight, Check, Star, Zap, Target, Users,
  Lock, FileCheck, Globe, Heart, Sparkles, TrendingUp,
  Calendar, Clock, Award, ChevronRight, Plus, Camera
} from 'lucide-react';

// Animated Counter with easing
function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, isVisible]);
  
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Floating particles
function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{left: string, top: string, animationDuration: string, animationDelay: string}>>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newParticles = [...Array(30)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${8 + Math.random() * 4}s`,
        animationDelay: `${Math.random() * 8}s`,
      }));
      setParticles(newParticles);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: p.left,
            top: p.top,
            animation: `float-particle ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  );
}

// Testimonial Data
const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Marathon Runner',
    company: 'Nike Run Club',
    avatar: 'S',
    quote: 'I finally completed my first marathon after using CommitForce. The financial stake made me actually show up every day!',
    result: 'Lost 30 lbs',
  },
  {
    name: 'David Chen',
    role: 'Software Engineer',
    company: 'Google',
    avatar: 'D',
    quote: 'Lost 30 pounds in 3 months. The AI verification kept me honest, and the community support was incredible.',
    result: '45-day streak',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Entrepreneur',
    company: 'Y Combinator',
    avatar: 'E',
    quote: 'Best investment in myself. The gamification features made achieving my goals actually fun!',
    result: '$5K saved',
  },
];

// Feature cards
const features = [
  { 
    Icon: Bot, 
    title: 'AI Verification', 
    desc: 'Our advanced AI automatically verifies your check-ins with 99.9% accuracy. No more cheating yourself.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  { 
    Icon: Flame, 
    title: 'Streak System', 
    desc: 'Build unstoppable momentum with streaks, freezes, and streak-based rewards that keep you going.',
    gradient: 'from-orange-500 to-red-600',
  },
  { 
    Icon: Trophy, 
    title: 'Clubs & Teams', 
    desc: 'Create or join clubs, compete on leaderboards, and achieve together with like-minded people.',
    gradient: 'from-purple-500 to-pink-600',
  },
  { 
    Icon: BarChart3, 
    title: 'Smart Analytics', 
    desc: 'Deep insights into your progress with predictive success probability and personalized tips.',
    gradient: 'from-green-500 to-emerald-600',
  },
  { 
    Icon: Gamepad2, 
    title: 'Gamification', 
    desc: 'Earn XP, unlock exclusive badges, level up, and compete on global leaderboards.',
    gradient: 'from-indigo-500 to-violet-600',
  },
  { 
    Icon: Shield, 
    title: 'Bank-Level Security', 
    desc: 'Your funds are protected with Stripe\'s enterprise-grade security. 100% safe.',
    gradient: 'from-slate-500 to-gray-600',
  },
];

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99,102,241,0.15) 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(139,92,246,0.1) 0%, transparent 50%)
          `
        }}
      />
      
      {/* Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[50px_50px] pointer-events-none" />
      
      <ParticleBackground />

      {/* Glowing Orbs */}
      <div className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '4s', animationDelay: '2s' }} />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-2xl bg-linear-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  Commit
                </span>
                <span className="font-black text-2xl bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Force
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Testimonials', 'Pricing'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-white/50 hover:text-white text-sm font-medium transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-all duration-300" />
                <div className="relative bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-3 bg-linear-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full px-5 py-2.5 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm text-white/70">
                  <Sparkles className="w-4 h-4 inline mr-1 text-yellow-400" />
                  Over 10,000 goals achieved this month
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-8">
                <span className="text-white block">Turn Your</span>
                <span className="block mt-2 bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Dreams Into
                </span>
                <span className="block mt-2 bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Reality
                </span>
              </h1>

              <p className="text-xl text-white/50 mb-10 max-w-lg leading-relaxed">
                The <span className="text-white font-semibold">only platform</span> where your money is on the line. 
                Commit financially, verify with AI, and join <span className="text-indigo-400">10,000+</span> achievers.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/register" className="group relative">
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-all duration-300" />
                  <div className="relative flex items-center justify-center gap-3 bg-linear-to-r from-indigo-500 to-purple-600 px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden">
                    <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    <span className="relative">Start Free Trial</span>
                    <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                <Link href="#demo" className="group flex items-center justify-center gap-3 bg-white/5 border border-white/10 backdrop-blur-sm px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                  </div>
                  <span>Watch Demo</span>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {['S', 'M', 'A', 'J', 'K'].map((letter, i) => (
                    <div 
                      key={i} 
                      className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 border-3 border-[#030014] flex items-center justify-center text-white font-bold hover:scale-110 hover:z-10 transition-transform cursor-pointer"
                    >
                      {letter}
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-500 to-rose-600 border-3 border-[#030014] flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform cursor-pointer">
                    +9K
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-white/40">Rated <span className="text-white">4.9/5</span> from 2,000+ reviews</p>
                </div>
              </div>
            </div>

            {/* Right - Dashboard Card */}
            <div className={`relative transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 rounded-3xl blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                
                <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full blur-lg opacity-50" />
                        <div className="relative w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                          S
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white">Sarah&apos;s Journey</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/50">Level 12</span>
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-yellow-400">2,450 XP</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                      </span>
                      <span className="text-sm font-medium text-green-400">Active</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { Icon: Flame, value: '15', label: 'Streak', color: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/30', iconColor: 'text-orange-400' },
                      { Icon: Target, value: '$250', label: 'Staked', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', iconColor: 'text-green-400' },
                      { Icon: TrendingUp, value: '92%', label: 'Success', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', iconColor: 'text-blue-400' },
                    ].map((stat, i) => (
                      <div key={i} className={`bg-linear-to-br ${stat.color} border ${stat.border} rounded-2xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}>
                        <stat.Icon className={`w-6 h-6 mx-auto mb-2 ${stat.iconColor}`} />
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-white/50">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Challenge */}
                  <div className="bg-linear-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5 mb-6 group hover:border-indigo-500/40 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-indigo-300 transition-colors">Marathon Training</p>
                          <p className="text-sm text-white/50">Day 45 of 90</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-indigo-400">50%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/50">Badges:</span>
                      <div className="flex -space-x-2">
                        {[Trophy, Zap, Award, Star, Target].map((Icon, i) => (
                          <div key={i} className="w-9 h-9 rounded-full bg-linear-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center hover:scale-125 hover:z-10 transition-transform cursor-pointer">
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Floating Notifications */}
                <div className="absolute -top-6 -right-6 bg-linear-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30 rounded-2xl px-5 py-3 shadow-xl shadow-green-500/10" style={{ animation: 'float 3s ease-in-out infinite' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-400">Check-in Verified!</p>
                      <p className="text-xs text-white/50">Just now</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-6 bg-linear-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl px-5 py-3 shadow-xl shadow-purple-500/10" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-purple-400">+50 XP Earned!</p>
                      <p className="text-xs text-white/50">Keep it up!</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-10 bg-linear-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-500/30 rounded-2xl px-4 py-2 shadow-xl shadow-orange-500/10" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '3s' }}>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-semibold text-orange-400">15 Day Streak!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-14 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-linear-to-b from-white to-transparent rounded-full" style={{ animation: 'scroll-indicator 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="relative py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-white/30 mb-10 uppercase tracking-widest">Trusted by teams at innovative companies</p>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            {['Google', 'Microsoft', 'Meta', 'Amazon', 'Spotify', 'Netflix'].map((company, i) => (
              <span key={i} className="text-2xl font-bold text-white/20 hover:text-white/40 transition-colors cursor-pointer">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 10000, suffix: '+', label: 'Active Users', Icon: Users },
              { value: 500000, suffix: '', prefix: '$', label: 'Total Committed', Icon: Target },
              { value: 85, suffix: '%', label: 'Success Rate', Icon: TrendingUp },
              { value: 50000, suffix: '+', prefix: '$', label: 'Given to Charity', Icon: Heart },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.Icon className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="text-4xl md:text-5xl font-black text-white mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                </p>
                <p className="text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full px-5 py-2 text-sm text-indigo-400 mb-6">
              <Sparkles className="w-4 h-4" />
              Powerful Features
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Everything You Need to
              <span className="block mt-2 bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="group relative bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
                <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className={`relative w-16 h-16 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <feature.Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.desc}</p>
                
                <div className="mt-6 flex items-center gap-2 text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-5 py-2 text-sm text-purple-400 mb-6">
              <Zap className="w-4 h-4" />
              How It Works
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Three Simple Steps
            </h2>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-linear-to-r from-transparent via-indigo-500/30 to-transparent hidden lg:block" />

            <div className="grid lg:grid-cols-3 gap-12">
              {[
                { step: '01', Icon: Target, title: 'Set Your Challenge', desc: 'Define your goal with a deadline and commit your money.' },
                { step: '02', Icon: Camera, title: 'Track Progress', desc: 'Check in regularly with proof. Our AI verifies automatically.' },
                { step: '03', Icon: Trophy, title: 'Achieve & Earn', desc: 'Complete and get your money back plus bonus rewards.' },
              ].map((item, i) => (
                <div key={i} className="relative text-center group">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/25 group-hover:scale-110 transition-transform">
                      <item.Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-[#030014] font-black text-sm flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-white/50 leading-relaxed max-w-sm mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 bg-linear-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full px-5 py-2 text-sm text-green-400 mb-6">
              <Users className="w-4 h-4" />
              Testimonials
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Loved by
              <span className="bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Thousands</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="group relative bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500">
                <div className="flex items-center gap-1 mb-6">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <p className="text-white/70 text-lg leading-relaxed mb-8">&ldquo;{t.quote}&rdquo;</p>
                
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 text-sm font-medium px-4 py-1.5 rounded-full">
                    <TrendingUp className="w-4 h-4" />
                    {t.result}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-sm text-white/50">{t.role} • {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 bg-linear-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-full px-5 py-2 text-sm text-pink-400 mb-6">
              <Sparkles className="w-4 h-4" />
              Pricing
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Simple, Transparent
              <span className="block mt-2 bg-linear-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Pricing</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                period: 'forever',
                description: 'Perfect for getting started',
                features: ['3 Active Challenges', 'Basic Analytics', 'Community Access', 'Email Support'],
                cta: 'Get Started',
                popular: false,
                gradient: 'from-gray-500/10 to-slate-500/10',
                border: 'border-white/10',
              },
              {
                name: 'Pro',
                price: '$9',
                period: '/month',
                description: 'For serious achievers',
                features: ['Unlimited Challenges', 'Advanced Analytics', 'AI Verification', 'Priority Support', 'Custom Badges', 'Club Creation'],
                cta: 'Start Free Trial',
                popular: true,
                gradient: 'from-indigo-500/20 to-purple-500/20',
                border: 'border-indigo-500/40',
              },
              {
                name: 'Team',
                price: '$29',
                period: '/month',
                description: 'For teams & orgs',
                features: ['Everything in Pro', 'Team Management', 'Custom Branding', 'API Access', 'Dedicated Manager', 'SSO Integration'],
                cta: 'Contact Sales',
                popular: false,
                gradient: 'from-purple-500/10 to-pink-500/10',
                border: 'border-white/10',
              },
            ].map((plan, i) => (
              <div key={i} className={`relative bg-linear-to-br ${plan.gradient} backdrop-blur-sm border-2 ${plan.border} rounded-3xl p-8 ${plan.popular ? 'scale-105' : ''} hover:scale-105 transition-transform duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold px-6 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/50 text-sm mb-6">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  {plan.period && <span className="text-white/50">{plan.period}</span>}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-white/70">
                      <Check className="w-5 h-5 text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                
                <Link href="/register" className={`block text-center py-4 rounded-2xl font-bold transition-all duration-300 ${plan.popular ? 'bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl hover:shadow-indigo-500/25' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 rounded-[3rem] blur-3xl" />
            
            <div className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[3rem] p-16 md:p-20 overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-size-[20px_20px]" />
              </div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                  Ready to Transform
                  <span className="block mt-2">Your Life?</span>
                </h2>
                <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                  Join 10,000+ achievers who have already committed to their dreams.
                </p>
                <Link href="/register" className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-black/25">
                  Start Your Journey Today
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-white/60 text-sm mt-6">No credit card required • 14-day free trial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="font-black text-2xl text-white">CommitForce</span>
              </Link>
              <p className="text-white/40 mb-8 max-w-sm leading-relaxed">
                The accountability platform that puts your money where your goals are.
              </p>
            </div>

            {[
              { title: 'Product', links: [
                { name: 'Features', href: '#features' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'Testimonials', href: '#testimonials' },
                { name: 'Help Center', href: '/help' },
              ]},
              { title: 'Company', links: [
                { name: 'About', href: '/about' },
                { name: 'How It Works', href: '/how-it-works' },
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'Achievements', href: '/achievements' },
              ]},
              { title: 'Legal', links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Help Center', href: '/help' },
                { name: 'Security', href: '#' },
              ]},
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold text-white mb-6">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link href={link.href} className="text-white/40 hover:text-white transition-colors">{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/30 text-sm">© 2025 CommitForce. All rights reserved.</p>
            <div className="flex items-center gap-8 text-sm text-white/30">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                SSL Secured
              </span>
              <span className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-500" />
                SOC2 Compliant
              </span>
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-500" />
                GDPR Ready
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        @keyframes scroll-indicator {
          0%, 100% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0.5; transform: translateY(6px); }
        }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
