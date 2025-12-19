import { Target, Heart, TrendingUp, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Target className="w-4 h-4" />
            About Us
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
            We Build <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Commitment</span>.
          </h1>
          <p className="max-w-xl mx-auto text-xl text-white/60">
            CommitForce was born from a simple idea: We achieve more when there&apos;s something at stake.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-white/60">
                To help millions of people bridge the gap between &quot;I want to&quot; and &quot;I did&quot;. We provide the financial accountability structure needed to overcome procrastination and build lasting habits.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Why Money?</h3>
              </div>
              <p className="text-white/60">
                Behavioral science shows that &quot;Loss Aversion&quot; is a powerful motivator. The fear of losing money is often stronger than the desire for a free reward. We harness this psychology to keep you on track.
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 rounded-3xl h-96 flex flex-col items-center justify-center">
            <div className="text-center">
              <Zap className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <p className="text-white/50 font-medium">Powered by Commitment</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-20">
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '85%', label: 'Success Rate' },
            { value: '$500K+', label: 'Committed' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
