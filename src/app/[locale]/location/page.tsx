'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BranchCard } from '@/components/ui/BranchCard';
import { BRANCHES } from '@/lib/constants';

export default function LocationPage() {
  const t = useTranslations('location');
  const locale = useLocale();

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-12">
            <span className="text-brand-gold">✦</span> {t('pageTitle')}
          </h1>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {BRANCHES.map((branch, i) => (
            <ScrollReveal key={branch.id} delay={i * 0.15}>
              <div className="space-y-6">
                <BranchCard branch={branch} locale={locale} />

                {/* Google Maps Embed */}
                <div className="aspect-video bg-brand-card rounded-sm overflow-hidden border border-brand-gold/10">
                  <iframe
                    src={branch.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${branch.name.en} Map`}
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
