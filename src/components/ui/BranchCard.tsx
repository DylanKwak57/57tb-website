'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import type { Branch, Locale } from '@/types';

interface BranchCardProps {
  branch: Branch;
  locale: string;
}

export function BranchCard({ branch, locale }: BranchCardProps) {
  const t = useTranslations('location');

  return (
    <div className="h-full flex flex-col p-6 md:p-8 bg-brand-card border border-brand-gold/10 rounded-sm hover:border-brand-gold/30 transition-colors">
      <h3 className="font-heading text-xl font-bold text-brand-gold mb-6">
        {branch.name[locale as Locale]}
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-brand-gold mt-0.5 shrink-0" />
          <p className="text-brand-gray-light text-sm">
            {branch.address[locale as Locale]}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={18} className="text-brand-gold shrink-0" />
          <a
            href={`tel:${branch.phone}`}
            className="text-brand-white text-sm hover:text-brand-gold transition-colors"
          >
            {branch.phone}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Clock size={18} className="text-brand-gold shrink-0" />
          <p className="text-brand-gray-light text-sm">
            {branch.hours} ({t('daily')})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Navigation size={18} className="text-brand-gold shrink-0" />
          <p className="text-brand-gray-light text-sm">
            {branch.nearestTransport[locale as Locale]}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-auto pt-6">
        <a
          href={branch.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-brand-gold text-brand-gold text-sm font-medium rounded-sm hover:bg-brand-gold hover:text-brand-black transition-colors"
        >
          {t('directions')}
        </a>
        <a
          href={`tel:${branch.phone}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-gold text-brand-black text-sm font-medium rounded-sm hover:bg-brand-champagne transition-colors"
        >
          {t('call')}
        </a>
      </div>
    </div>
  );
}
