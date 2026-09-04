'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LINE_URL } from '@/lib/constants';
import { assetPath } from '@/lib/utils';

interface MobileMenuProps {
  locale: string;
  onClose: () => void;
}

// 🚨 카테고리 라벨은 언어와 무관하게 영어 고정 · PRODUCTS 맨 끝 (2026-09-04 대표님 확정). Header.tsx와 같은 목록 — 둘을 함께 고칠 것.
type NavItem = { key: string; label: string; section?: string; page?: string };
const NAV_ITEMS: NavItem[] = [
  { key: 'services', label: 'Services', section: '#services', page: '/services' },
  { key: 'gallery', label: 'Gallery', section: '#gallery', page: '/gallery' },
  { key: 'reviews', label: 'Reviews', section: '#reviews' },
  { key: 'promotion', label: 'Promotion', section: '#promotion' },
  { key: 'location', label: 'Location', section: '#location', page: '/location' },
  { key: 'products', label: 'Products', page: '/products' },
] as const;

export function MobileMenu({ locale, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === '/';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-40 bg-brand-black/[0.97] backdrop-blur-lg pt-20"
    >
      <nav className="flex flex-col items-center gap-8 mt-12">
        {NAV_ITEMS.map((item, i) => (
          <motion.a
            key={item.key}
            href={isHome && item.section ? item.section : item.page ? `/${locale}${item.page}` : `/${locale}/${item.section}`}
            onClick={onClose}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-2xl font-heading font-medium text-brand-white hover:text-brand-gold transition-colors tracking-wider uppercase"
          >
            {item.label}
          </motion.a>
        ))}
        <motion.a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 px-8 py-3 bg-brand-gold text-brand-black font-semibold text-lg tracking-[0.15em] uppercase rounded-full"
        >
          {/* 2026-09-04 대표님 확정: 데스크톱 버튼과 같은 `57 LINE`으로 통일(언어 무관). 자간도 데스크톱 버튼(0.15em)과 맞춘다. */}
          57 LINE
        </motion.a>
      </nav>
    </motion.div>
  );
}
