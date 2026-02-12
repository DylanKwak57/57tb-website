'use client';

import { useTranslations } from 'next-intl';
import { Scissors, Sparkles, BadgeDollarSign } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const FEATURES = [
  { key: 'expertise', icon: Scissors },
  { key: 'products', icon: Sparkles },
  { key: 'price', icon: BadgeDollarSign },
] as const;

export function AboutSection() {
  const t = useTranslations('about');

  return (
    <section className="py-24 md:py-32 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={t('sectionTitle')} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.key} delay={i * 0.15}>
                <div className="text-center p-10 h-full bg-brand-card/30 border border-brand-white/[0.04] rounded-sm hover:border-brand-gold/20 transition-all duration-500 group">
                  <div className="inline-flex items-center justify-center w-[90px] h-[90px] mb-8">
                    <Icon size={53} className="text-brand-gold/80 group-hover:text-brand-gold transition-colors duration-500" />
                  </div>
                  <h3 className="font-heading text-lg font-light tracking-[0.1em] mb-4 text-brand-white">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="text-brand-gray/70 text-sm leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
