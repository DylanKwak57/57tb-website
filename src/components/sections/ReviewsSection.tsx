'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ReviewCard } from '@/components/ui/ReviewCard';
import { REVIEWS } from '@/lib/constants';

export function ReviewsSection() {
  const t = useTranslations('reviews');
  const locale = useLocale();

  return (
    <section id="reviews" className="py-24 md:py-32 bg-brand-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={t('sectionTitle')} />
      </div>

      <ScrollReveal>
        <div className="flex gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 scrollbar-hide max-w-7xl mx-auto">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} locale={locale} />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
