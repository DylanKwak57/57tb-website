'use client';

import type { Promotion, Locale } from '@/types';
import { assetPath } from '@/lib/utils';

interface PromotionBannerProps {
  promotion: Promotion;
  locale: string;
  bookLabel: string;
  bookingUrl: string;
}

export function PromotionBanner({
  promotion,
  locale,
  bookLabel,
  bookingUrl,
}: PromotionBannerProps) {
  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="relative overflow-hidden rounded-sm border border-brand-gold/10 hover:border-brand-gold/30 transition-colors">
        <div className="aspect-square overflow-hidden bg-brand-card">
          <img
            src={assetPath(promotion.image)}
            alt={promotion.title[locale as Locale]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex items-center justify-center py-3 bg-brand-card border-t border-brand-gold/10">
          <span className="inline-flex items-center gap-2 text-brand-gold text-sm font-medium tracking-wide group-hover:text-brand-champagne transition-colors">
            {bookLabel} →
          </span>
        </div>
      </div>
    </a>
  );
}
