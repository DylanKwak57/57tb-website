'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { CategoryFilter } from '@/components/ui/CategoryFilter';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GALLERY_ITEMS } from '@/lib/constants';
import facebookGalleryData from '@/data/facebook-gallery.json';
import { assetPath } from '@/lib/utils';
import type { Locale, GalleryItem, GalleryStyle } from '@/types';

const ALL_GALLERY_ITEMS: GalleryItem[] = [
  ...GALLERY_ITEMS,
  ...(facebookGalleryData as GalleryItem[]),
];

const STYLES: GalleryStyle[] = ['Hair Color', 'Volume Magic', 'Digital Perm', 'Mix Perm', 'S Perm', 'Balayage'];

function GalleryContent() {
  const t = useTranslations('gallery');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const styleParam = searchParams.get('style');
  const initialStyle = styleParam && STYLES.includes(styleParam as GalleryStyle) ? styleParam : 'ALL';
  const [active, setActive] = useState<string>(initialStyle);
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = active === 'ALL'
    ? ALL_GALLERY_ITEMS
    : ALL_GALLERY_ITEMS.filter((item) => item.style === active);

  const categories = [
    { key: 'ALL', label: t('viewAll') },
    ...STYLES.map((s) => ({ key: s, label: s })),
  ];

  const selectedItem = ALL_GALLERY_ITEMS.find((item) => item.id === selected);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-8">
            <span className="text-brand-gold">&#10022;</span> {t('pageTitle')}
          </h1>
        </ScrollReveal>

        <CategoryFilter
          categories={categories}
          active={active}
          onChange={setActive}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.06}>
              <button
                onClick={() => setSelected(selected === item.id ? null : item.id)}
                className="group relative aspect-square w-full bg-brand-card rounded-sm overflow-hidden border border-brand-gold/10 hover:border-brand-gold/30 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={assetPath(item.afterImage)}
                  alt={item.description?.[locale as Locale] || ''}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-brand-white text-xs font-medium leading-tight">
                    {item.description?.[locale as Locale] || ''}
                  </p>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 text-brand-white/70 hover:text-brand-white text-2xl z-10"
          >
            &#10005;
          </button>
          <img
            src={assetPath(selectedItem.afterImage)}
            alt={selectedItem.description?.[locale as Locale] || ''}
            className="max-w-full max-h-[85vh] object-contain rounded-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense>
      <GalleryContent />
    </Suspense>
  );
}
