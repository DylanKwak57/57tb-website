'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MessageCircle, Phone } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { LINE_URL, BRANCHES } from '@/lib/constants';

export function CTASection() {
  const t = useTranslations('cta');

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative text-center py-16 px-8 border border-brand-gold/30 rounded-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent" />

            <div className="relative z-10">
              <motion.h2
                className="font-heading text-3xl md:text-5xl font-bold text-brand-white mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {t('title')}
              </motion.h2>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-black font-semibold text-sm rounded-sm hover:bg-brand-champagne transition-all duration-300"
                >
                  <MessageCircle size={20} />
                  {t('bookLine')}
                </a>
                <a
                  href={`tel:${BRANCHES[0].phone}`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-brand-gold text-brand-gold font-semibold text-sm rounded-sm hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
                >
                  <Phone size={20} />
                  {t('callNow')}
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
