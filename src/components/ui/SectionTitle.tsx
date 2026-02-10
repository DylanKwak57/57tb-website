'use client';

import { ScrollReveal } from './ScrollReveal';

interface SectionTitleProps {
  title: string;
  className?: string;
}

export function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <ScrollReveal className={className}>
      <div className="mb-16 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-8 h-px bg-brand-gold/30" />
          <span className="text-brand-gold text-xs tracking-[0.3em] uppercase font-medium">✦</span>
          <div className="w-8 h-px bg-brand-gold/30" />
        </div>
        <h2 className="font-heading text-2xl md:text-4xl font-light tracking-[0.08em] text-brand-white">
          {title}
        </h2>
      </div>
    </ScrollReveal>
  );
}
