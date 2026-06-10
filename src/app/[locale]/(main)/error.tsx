'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="text-brand-gold text-6xl font-heading font-bold">Oops</div>
        <p className="text-brand-gray-light text-lg max-w-md">
          Something went wrong. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-block px-6 py-3 bg-brand-gold text-brand-black font-semibold rounded-full hover:bg-brand-champagne transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
