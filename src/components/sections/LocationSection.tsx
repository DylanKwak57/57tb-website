'use client';

import { useTranslations, useLocale } from 'next-intl';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BranchCard } from '@/components/ui/BranchCard';
import { BRANCHES } from '@/lib/constants';

export function LocationSection() {
  const t = useTranslations('location');
  const locale = useLocale();

  return (
    <section id="location" className="py-24 md:py-32 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title={t('sectionTitle')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BRANCHES.map((branch, i) => (
            <ScrollReveal key={branch.id} delay={i * 0.15}>
              <BranchCard branch={branch} locale={locale} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
