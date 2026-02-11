'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { cn, assetPath } from '@/lib/utils';
import { useTheme } from '@/lib/ThemeContext';

interface HeaderProps {
  locale: string;
}

const NAV_ITEMS = [
  { key: 'services', href: '#services' },
  { key: 'gallery', href: '#gallery' },
  { key: 'location', href: '#location' },
] as const;

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-brand-black/90 backdrop-blur-md border-b border-brand-gold/10'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href={assetPath(`/${locale}`)} className="flex items-center">
              <div className="h-14 md:h-16 overflow-hidden">
                <img
                  src={assetPath("/images/logo-icon.png")}
                  alt="57 Total Beauty"
                  className="h-[96px] md:h-[110px] w-auto object-cover object-top"
                  style={{ filter: 'brightness(0) invert(72%) sepia(29%) saturate(619%) hue-rotate(359deg) brightness(90%) contrast(87%)' }}
                />
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-sm font-medium text-brand-white hover:text-brand-gold transition-colors duration-300 tracking-wide uppercase"
                >
                  {t(item.key)}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="relative w-14 h-7 rounded-full border border-brand-gold/30 bg-brand-card/50 hover:border-brand-gold/60 transition-all duration-300 flex items-center px-1"
                aria-label="Toggle theme"
              >
                <Moon size={12} className={cn(
                  'absolute left-1.5 transition-opacity duration-300',
                  theme === 'dark' ? 'opacity-50 text-brand-gold' : 'opacity-0'
                )} />
                <Sun size={12} className={cn(
                  'absolute right-1.5 transition-opacity duration-300',
                  theme === 'light' ? 'opacity-50 text-brand-gold' : 'opacity-0'
                )} />
                <motion.div
                  className="w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center"
                  animate={{ x: theme === 'dark' ? 0 : 24 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {theme === 'dark'
                    ? <Moon size={10} className="text-brand-black" />
                    : <Sun size={10} className="text-brand-black" />
                  }
                </motion.div>
              </button>
              <LanguageSwitcher locale={locale} />
              <a
                href={process.env.NEXT_PUBLIC_LINE_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 border border-brand-gold/60 text-brand-gold text-xs font-medium tracking-[0.15em] uppercase hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
              >
                57 LINE
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-brand-white"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            locale={locale}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
