'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SERVICES, LINE_URL } from '@/lib/constants';
import { formatPrice, assetPath } from '@/lib/utils';
import type { Locale, Service } from '@/types';

const LEVELS = ['junior', 'stylist1', 'stylist2', 'stylist3'] as const;

const BASE_HIGHLIGHT_IDS = [
  'cut',
  'digital-perm',
  'volume-magic',
  'color-gosen',
  'bleach-highlight',
];

const LEVEL_LAST_HIGHLIGHT: Record<string, string> = {
  junior: 'lpp',
  stylist1: 'one-shot',
  stylist2: 'one-shot',
  stylist3: 'premium-3-step',
};

function getHighlightServices(level: string) {
  const ids = [...BASE_HIGHLIGHT_IDS, LEVEL_LAST_HIGHLIGHT[level]];
  return SERVICES.filter((s) => ids.includes(s.id));
}

function getRemainingServices(level: string) {
  const ids = [...BASE_HIGHLIGHT_IDS, LEVEL_LAST_HIGHLIGHT[level]];
  return SERVICES.filter((s) => !ids.includes(s.id));
}

function displayPrice(service: Service, level: string) {
  const price = service.prices[level as keyof typeof service.prices];
  if (!price) return '-';
  return service.priceRange ? `${formatPrice(price)}~` : formatPrice(price);
}

export function ServicesPreview() {
  const t = useTranslations('services');
  const locale = useLocale() as Locale;
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);

  const toggle = (level: string) => {
    setExpandedLevel((prev) => (prev === level ? null : level));
  };

  return (
    <section id="services" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={t('sectionTitle')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEVELS.map((level, i) => {
            const isExpanded = expandedLevel === level;
            const highlightServices = getHighlightServices(level);
            const remainingServices = getRemainingServices(level);

            return (
              <ScrollReveal key={level} delay={i * 0.1}>
                <div className="h-full flex flex-col bg-brand-card/30 border border-brand-white/[0.04] rounded-sm hover:border-brand-gold/20 transition-all duration-500 group">
                  {/* Level header */}
                  <div className="p-6 pb-4 border-b border-brand-white/[0.04] text-center">
                    <h3 className="font-heading text-lg font-light tracking-[0.1em] text-brand-gold">
                      {t(`levels.${level}`)}
                    </h3>
                  </div>

                  {/* Highlight services */}
                  <div className="flex-1 p-6 space-y-3">
                    {highlightServices.map((service) => {
                      const price = service.prices[level];
                      return (
                        <div key={service.id} className="flex items-center justify-between">
                          <span className="text-brand-gray-light text-sm">
                            {service.name[locale]}
                          </span>
                          <span className={`text-sm font-medium ${price ? 'text-brand-champagne' : 'text-brand-gray/30'}`}>
                            {displayPrice(service, level)}
                          </span>
                        </div>
                      );
                    })}

                    {/* Expanded: remaining services */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 mt-3 border-t border-brand-white/[0.04] space-y-3">
                            {remainingServices.map((service) => {
                              const price = service.prices[level];
                              return (
                                <div key={service.id} className="flex items-center justify-between">
                                  <span className="text-brand-gray-light text-sm">
                                    {service.name[locale]}
                                  </span>
                                  <span className={`text-sm font-medium ${price ? 'text-brand-champagne' : 'text-brand-gray/30'}`}>
                                    {displayPrice(service, level)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Toggle button */}
                    <button
                      onClick={() => toggle(level)}
                      className="w-full pt-2 text-brand-gold/60 hover:text-brand-gold text-xs tracking-wide transition-colors flex items-center justify-center gap-1"
                    >
                      <span>{isExpanded ? 'Close' : `+${remainingServices.length} more`}</span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block"
                      >
                        ↓
                      </motion.span>
                    </button>
                  </div>

                  {/* Book CTA */}
                  <div className="p-6 pt-4">
                    <a
                      href={LINE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-2.5 border border-brand-gold/30 text-brand-gold text-xs tracking-[0.15em] uppercase hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
                    >
                      {t('book')}
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal className="mt-10 text-center">
          <a
            href={assetPath(`/${locale}/services`)}
            className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-champagne transition-colors font-medium text-sm tracking-wide"
          >
            {t('viewAll')} →
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
