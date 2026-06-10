'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
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

  const closeLightbox = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selected, closeLightbox]);

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
                className="group relative aspect-square w-full bg-brand-card rounded-2xl overflow-hidden border border-brand-gold/10 hover:border-brand-gold/30 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={assetPath(item.afterImage)}
                  alt={item.description?.[locale as Locale] || ''}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-medium leading-tight">
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
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close preview"
            className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl z-10"
          >
            &#10005;
          </button>
          <img
            src={assetPath(selectedItem.afterImage)}
            alt={selectedItem.description?.[locale as Locale] || ''}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function GallerySkeleton() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-12 w-64 bg-brand-card rounded-2xl animate-pulse mb-8" />
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-brand-card rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-brand-card rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<GallerySkeleton />}>
      <GalleryContent />
    </Suspense>
  );
}
