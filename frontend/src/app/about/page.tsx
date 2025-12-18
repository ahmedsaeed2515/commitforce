
export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">About Us</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            We Build Commitment.
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            CommitForce was born from a simple idea: We achieve more when there's something at stake.
          </p>
        </div>
        
        <div className="mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                   <p className="text-lg text-gray-600 mb-6">
                       To help millions of people bridge the gap between "I want to" and "I did". We provide the financial accountability structure needed to overcome procrastination and build lasting habits.
                   </p>
                   <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Money?</h3>
                   <p className="text-lg text-gray-600">
                       Behavioral science shows that "Loss Aversion" is a powerful motivator. The fear of losing money is often stronger than the desire for a free reward. We harness this psychology to keep you on track.
                   </p>
                </div>
                <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
                    {/* Placeholder for About Image */}
                    <span className="text-gray-400 font-medium">Team Image / Office</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
