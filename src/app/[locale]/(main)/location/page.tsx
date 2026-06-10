'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BranchCard } from '@/components/ui/BranchCard';
import { BRANCHES } from '@/lib/constants';
import type { Locale } from '@/types';

function MapEmbed({ src, title, googleMapsUrl }: { src: string; title: string; googleMapsUrl?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-brand-gray-light gap-3">
        <svg className="w-10 h-10 text-brand-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <p className="text-sm">Map unavailable</p>
        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-gold hover:text-brand-champagne transition-colors"
          >
            Open in Google Maps &rarr;
          </a>
        )}
      </div>
    );
  }

  return (
    <iframe
      src={src}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={title}
      onError={() => setFailed(true)}
    />
  );
}

export default function LocationPage() {
  const t = useTranslations('location');
  const locale = useLocale();

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-12">
            <span className="text-brand-gold">&#10022;</span> {t('pageTitle')}
          </h1>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {BRANCHES.map((branch, i) => (
            <ScrollReveal key={branch.id} delay={i * 0.15}>
              <div className="space-y-6">
                <BranchCard branch={branch} locale={locale} />

                {/* Google Maps Embed */}
                <div className="aspect-video bg-brand-card/70 backdrop-blur-xl rounded-[32px] overflow-hidden border border-brand-card/50">
                  <MapEmbed
                    src={branch.googleMapsEmbed}
                    title={`${branch.name[locale as Locale]} Map`}
                    googleMapsUrl={branch.googleMapsUrl}
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
