import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      title: '1. Set Your Goal',
      description: 'Choose a habit to build or a goal to achieve. Be specific (e.g., "Run 5km daily").',
      icon: '🎯'
    },
    {
      title: '2. Pledge Money',
      description: 'Commit an amount setup that hurts to lose. We lock this deposit securely via Stripe.',
      icon: '💸'
    },
    {
      title: '3. Prove Progress',
      description: 'Upload daily photo proof or sync your data. Our team or AI verifies your check-ins.',
      icon: '📸'
    },
    {
      title: '4. Succeed or Pay',
      description: 'Hit your target? Get 100% of your money back. Fail? The money goes to charity.',
      icon: '🤝'
    }
  ];

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            How It Works
        </h1>
        <p className="mt-4 text-xl text-gray-500">
            The science of putting your money where your mouth is.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {steps.map((step, idx) => (
             <div key={idx} className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 transition hover:shadow-lg">
                 <div className="text-5xl mb-6">{step.icon}</div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                 <p className="text-gray-600">{step.description}</p>
             </div>
          ))}
      </div>

      <div className="mt-16 text-center">
          <Link href="/challenges/create" className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-indigo-700 transition transform hover:scale-105">
              Start Your First Challenge
          </Link>
      </div>
    </div>
  );
}
