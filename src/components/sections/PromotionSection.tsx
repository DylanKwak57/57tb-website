'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { PromotionBanner } from '@/components/ui/PromotionBanner';
import { PROMOTIONS, LINE_URL } from '@/lib/constants';

export function PromotionSection() {
  const t = useTranslations('promotion');
  const locale = useLocale();

  if (PROMOTIONS.length === 0) return null;

  return (
    <section id="promotion" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={t('sectionTitle')} />

        <div className={`grid grid-cols-1 gap-6 ${
          PROMOTIONS.length === 1
            ? 'max-w-md mx-auto'
            : PROMOTIONS.length === 2
              ? 'sm:grid-cols-2 max-w-3xl mx-auto'
              : 'sm:grid-cols-2 lg:grid-cols-3'
        }`}>
          {PROMOTIONS.map((promo, i) => (
            <ScrollReveal key={promo.id} delay={i * 0.1}>
              <PromotionBanner
                promotion={promo}
                locale={locale}
                bookLabel={t('bookNow')}
                bookingUrl={LINE_URL}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
