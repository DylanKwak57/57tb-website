'use client';

import { Star } from 'lucide-react';
import type { Review, Locale } from '@/types';

interface ReviewCardProps {
  review: Review;
  locale: string;
}

export function ReviewCard({ review, locale }: ReviewCardProps) {
  return (
    <div className="flex-shrink-0 w-[320px] md:w-[380px] p-6 bg-brand-card/70 backdrop-blur-xl border border-brand-card/50 rounded-[32px]">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            strokeWidth={1.4}
            className={i < review.rating ? 'text-brand-gold fill-brand-gold' : 'text-brand-gray'}
          />
        ))}
      </div>
      <p className="text-brand-gray-light text-sm leading-relaxed mb-4 line-clamp-3">
        &ldquo;{review.text[locale as Locale]}&rdquo;
      </p>
      <span className="text-brand-white font-medium text-sm">{review.name[locale as Locale]}</span>
    </div>
  );
}
