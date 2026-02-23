'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-black">
      {/* Subtle atmosphere glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,var(--color-brand-gold)_0%,transparent_70%)] opacity-[0.06]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Pre-title */}
        <motion.p
          className="text-brand-gold text-xs md:text-sm tracking-[0.4em] uppercase font-medium mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Since 2012 &middot; Bangkok
        </motion.p>

        {/* Main title */}
        <motion.h1
          className="font-heading leading-[0.9]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="block text-7xl md:text-[10rem] lg:text-[12rem] font-extralight tracking-tight text-brand-gold">
            57
          </span>
          <span className="block text-3xl md:text-5xl lg:text-6xl font-extralight tracking-[0.15em] text-brand-gold/90 -mt-2 md:-mt-4">
            TOTAL BEAUTY
          </span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          className="mx-auto mt-10 mb-8 h-px w-20 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />

        {/* Tagline */}
        <motion.p
          className="font-heading text-sm md:text-base tracking-[0.2em] uppercase text-brand-champagne/60 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          The Korean &amp; Thai HairStylish By Professional And Solution.
        </motion.p>

        {/* Subtitle (localized) */}
        <motion.p
          className="mt-4 text-brand-gray-light/40 text-xs md:text-sm max-w-md mx-auto tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          {t('subtitle')}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-brand-gray text-xs tracking-[0.2em] uppercase">
          {t('scroll')}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} strokeWidth={1.4} className="text-brand-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
