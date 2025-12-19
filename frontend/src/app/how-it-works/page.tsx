import Link from 'next/link';
import { Target, Wallet, Camera, Handshake, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      title: '1. Set Your Goal',
      description: 'Choose a habit to build or a goal to achieve. Be specific (e.g., "Run 5km daily").',
      Icon: Target,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      title: '2. Pledge Money',
      description: 'Commit an amount that hurts to lose. We lock this deposit securely via Stripe.',
      Icon: Wallet,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: '3. Prove Progress',
      description: 'Upload daily photo proof or sync your data. Our team or AI verifies your check-ins.',
      Icon: Camera,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: '4. Succeed or Pay',
      description: 'Hit your target? Get 100% of your money back. Fail? The money goes to charity.',
      Icon: Handshake,
      color: 'from-pink-500 to-rose-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            How It <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Works</span>
          </h1>
          <p className="text-xl text-white/50">
            The science of putting your money where your mouth is.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col items-center text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]"
            >
              <div className={`w-20 h-20 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <step.Icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/60">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/challenges/create" 
            className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:from-indigo-400 hover:to-purple-500 transition transform hover:scale-105"
          >
            Start Your First Challenge
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
