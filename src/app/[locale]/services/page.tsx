'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CategoryFilter } from '@/components/ui/CategoryFilter';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SERVICES, LINE_URL } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import type { Locale, ServiceCategory } from '@/types';

const CATEGORIES: ServiceCategory[] = ['CUT', 'COLOR', 'PERM', 'TREATMENT'];

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();
  const [active, setActive] = useState<string>('ALL');

  const filtered = active === 'ALL'
    ? SERVICES
    : SERVICES.filter((s) => s.category === active);

  const categories = [
    { key: 'ALL', label: t('categories.ALL') },
    ...CATEGORIES.map((c) => ({ key: c, label: t(`categories.${c}`) })),
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-8">
            <span className="text-brand-gold">✦</span> {t('pageTitle')}
          </h1>
        </ScrollReveal>

        <CategoryFilter categories={categories} active={active} onChange={setActive} />

        <div className="space-y-4">
          {filtered.map((service, i) => (
            <ScrollReveal key={service.id} delay={i * 0.05}>
              <div className="p-6 bg-brand-card border border-brand-gold/10 rounded-sm hover:border-brand-gold/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading text-lg font-semibold text-brand-white">
                        {service.name[locale as Locale]}
                      </h3>
                      {service.popular && (
                        <span className="px-2 py-0.5 bg-brand-gold text-brand-black text-xs font-semibold rounded-sm">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-brand-gray text-sm mb-2">
                      {service.description[locale as Locale]}
                    </p>
                    <p className="text-brand-gray text-xs">
                      {t('duration')}: {service.duration}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                      {service.prices.junior !== undefined && (
                        <div>
                          <p className="text-brand-gray text-xs mb-1">Junior</p>
                          <p className="text-brand-white font-semibold">{formatPrice(service.prices.junior)}</p>
                        </div>
                      )}
                      {service.prices.stylist1 !== undefined && (
                        <div>
                          <p className="text-brand-gray text-xs mb-1">Stylist 1</p>
                          <p className="text-brand-white font-semibold">{formatPrice(service.prices.stylist1)}</p>
                        </div>
                      )}
                      {service.prices.stylist2 !== undefined && (
                        <div>
                          <p className="text-brand-gray text-xs mb-1">Stylist 2</p>
                          <p className="text-brand-white font-semibold">{formatPrice(service.prices.stylist2)}</p>
                        </div>
                      )}
                      {service.prices.stylist3 !== undefined && (
                        <div>
                          <p className="text-brand-gray text-xs mb-1">Stylist 3</p>
                          <p className="text-brand-gold font-semibold">{formatPrice(service.prices.stylist3)}</p>
                        </div>
                      )}
                    </div>
                    <a
                      href={LINE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-5 py-2.5 bg-brand-gold text-brand-black text-sm font-semibold rounded-sm hover:bg-brand-champagne transition-colors"
                    >
                      {t('book')}
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
