'use client';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
          <p className="text-gray-500 mb-6">
            We apologize for the inconvenience. Our team has been notified.
          </p>
          <div className="space-y-3">
             <button
                onClick={() => reset()}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
             >
                Try Again
             </button>
             <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
             >
                Back to Home
             </button>
          </div>
        </div>
      </body>
    </html>
  );
}
