import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Put Your Money</span>
                  <span className="block bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    Where Your Goals Are
                  </span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Commit to your goals with financial stakes. Complete your challenges and earn rewards, 
                  or support charity if you don't succeed.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 md:py-4 md:text-lg md:px-10 transition shadow-lg hover:shadow-xl"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Simple steps to achieve your goals
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-medium text-gray-900">Set Your Challenge</h3>
                <p className="mt-2 text-base text-gray-500">
                  Define your goal and commitment amount
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 text-cyan-600 text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-medium text-gray-900">Make Progress</h3>
                <p className="mt-2 text-base text-gray-500">
                  Track your journey with regular check-ins
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-medium text-gray-900">Get Rewarded</h3>
                <p className="mt-2 text-base text-gray-500">
                  Complete your goal and earn your money back plus rewards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to commit?</span>
            <span className="block">Start your first challenge today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-100">
            Join thousands of people achieving their goals with financial commitment.
          </p>
          <Link
            href="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition shadow-lg hover:shadow-xl"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/about" className="text-gray-400 hover:text-gray-500">
              About
            </Link>
            <Link href="/how-it-works" className="text-gray-400 hover:text-gray-500">
              How It Works
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-500">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-500">
              Privacy
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2025 CommitForce. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
