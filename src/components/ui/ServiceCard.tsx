'use client';

import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import { LINE_URL } from '@/lib/constants';
import type { Service, Locale } from '@/types';

interface ServiceCardProps {
  service: Service;
  locale: string;
}

export function ServiceCard({ service, locale }: ServiceCardProps) {
  const t = useTranslations('services');
  const minPrice = Math.min(
    ...Object.values(service.prices).filter((p): p is number => p !== undefined)
  );

  return (
    <div className="group relative p-6 bg-brand-card border border-brand-gold/10 rounded-sm hover:border-brand-gold/30 transition-all duration-300">
      {service.popular && (
        <span className="absolute top-4 right-4 px-2 py-0.5 bg-brand-gold text-brand-black text-xs font-semibold rounded-sm">
          Popular
        </span>
      )}

      <h3 className="font-heading text-lg font-semibold text-brand-white mb-2">
        {service.name[locale as Locale]}
      </h3>
      <p className="text-brand-gray text-sm mb-4 line-clamp-2">
        {service.description[locale as Locale]}
      </p>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-brand-gray text-xs">{t('from')}</span>
        <span className="text-brand-gold text-xl font-bold font-heading">
          {formatPrice(minPrice)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-brand-gray text-xs">
          {t('duration')}: {service.duration}
        </span>
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold text-sm font-medium hover:text-brand-champagne transition-colors"
        >
          {t('book')} →
        </a>
      </div>
    </div>
  );
}
