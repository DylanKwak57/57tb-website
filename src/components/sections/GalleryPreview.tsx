'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GALLERY_ITEMS } from '@/lib/constants';
import { assetPath } from '@/lib/utils';
import type { Locale } from '@/types';

export function GalleryPreview() {
  const t = useTranslations('gallery');
  const locale = useLocale();
  const items = GALLERY_ITEMS.slice(0, 6);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={t('sectionTitle')} />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.1}>
              <div className="group relative aspect-square bg-brand-card rounded-sm overflow-hidden border border-brand-white/[0.04] hover:border-brand-gold/30 transition-all duration-500">
                <img
                  src={assetPath(item.afterImage)}
                  alt={item.description?.[locale as Locale] || ''}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-brand-white text-xs md:text-sm font-medium leading-tight">
                    {item.description?.[locale as Locale] || ''}
                  </p>
                  <span className="text-brand-gold/70 text-[10px] uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-10 text-center">
          <a
            href={assetPath(`/${locale}/gallery`)}
            className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-champagne transition-colors font-medium text-sm tracking-wide"
          >
            {t('viewAll')} →
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
