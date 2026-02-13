'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRef, useEffect, useCallback } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ReviewCard } from '@/components/ui/ReviewCard';
import { REVIEWS } from '@/lib/constants';

const AUTO_SCROLL_SPEED = 0.5; // pixels per frame
const PAUSE_AFTER_INTERACTION = 3000; // ms to pause after user interaction

export function ReviewsSection() {
  const t = useTranslations('reviews');
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const pausedUntilRef = useRef<number>(0);

  const pauseAutoScroll = useCallback(() => {
    pausedUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION;
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const animate = () => {
      if (Date.now() > pausedUntilRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScroll = scrollWidth - clientWidth;

        if (scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += AUTO_SCROLL_SPEED;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    container.addEventListener('pointerdown', pauseAutoScroll);
    container.addEventListener('wheel', pauseAutoScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationRef.current);
      container.removeEventListener('pointerdown', pauseAutoScroll);
      container.removeEventListener('wheel', pauseAutoScroll);
    };
  }, [pauseAutoScroll]);

  return (
    <section id="reviews" className="py-24 md:py-32 bg-brand-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={t('sectionTitle')} />
      </div>

      <ScrollReveal>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 scrollbar-hide max-w-7xl mx-auto"
        >
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} locale={locale} />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
