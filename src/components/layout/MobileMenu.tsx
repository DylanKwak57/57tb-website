'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LINE_URL } from '@/lib/constants';

interface MobileMenuProps {
  locale: string;
  onClose: () => void;
}

const NAV_ITEMS = [
  { key: 'services', href: '#services' },
  { key: 'gallery', href: '#gallery' },
  { key: 'location', href: '#location' },
] as const;

export function MobileMenu({ locale, onClose }: MobileMenuProps) {
  const t = useTranslations('nav');

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-40 bg-brand-black/98 backdrop-blur-lg pt-20"
    >
      <nav className="flex flex-col items-center gap-8 mt-12">
        {NAV_ITEMS.map((item, i) => (
          <motion.a
            key={item.key}
            href={item.href}
            onClick={onClose}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-2xl font-heading font-medium text-brand-white hover:text-brand-gold transition-colors tracking-wider uppercase"
          >
            {t(item.key)}
          </motion.a>
        ))}
        <motion.a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 px-8 py-3 bg-brand-gold text-brand-black font-semibold text-lg rounded-sm"
        >
          {t('book')}
        </motion.a>
      </nav>
    </motion.div>
  );
}
