import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black">
      <div className="text-center">
        <h1 className="font-heading text-8xl font-bold text-brand-gold mb-4">404</h1>
        <p className="text-brand-gray-light text-lg mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-black font-semibold rounded-full hover:bg-brand-champagne transition-colors"
        >
          Go Home →
        </Link>
      </div>
    </div>
  );
}
