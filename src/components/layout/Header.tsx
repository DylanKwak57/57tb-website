'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { cn, assetPath } from '@/lib/utils';
import { useTheme } from '@/lib/ThemeContext';
import { LINE_URL } from '@/lib/constants';

interface HeaderProps {
  locale: string;
}

const NAV_ITEMS = [
  { key: 'services', section: '#services', page: '/services' },
  { key: 'gallery', section: '#gallery', page: '/gallery' },
  { key: 'reviews', section: '#reviews' },
  { key: 'promotion', section: '#promotion' },
  { key: 'location', section: '#location', page: '/location' },
] as const;

// Light theme: darken logo to warm brown
const LOGO_FILTER_LIGHT = 'brightness(0) invert(22%) sepia(10%) saturate(600%) hue-rotate(350deg) brightness(95%) contrast(90%)';
// Dark theme: tint logo to gold
const LOGO_FILTER_DARK = 'brightness(0) invert(72%) sepia(29%) saturate(619%) hue-rotate(359deg) brightness(90%) contrast(87%)';

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if we're on the homepage (with as-needed locale prefix, default locale has no prefix)
  const isHome = pathname === '/' || pathname === `/${locale}`;

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
          <div className="flex items-center justify-between h-16 md:h-20 lg:h-24">
            <a href={assetPath(`/${locale}`)} className="flex items-center">
              <img
                src={assetPath("/images/logo-header.png")}
                alt="57 Total Beauty"
                className="h-12 md:h-14 lg:h-16 w-auto"
                style={{ filter: theme === 'dark' ? LOGO_FILTER_DARK : LOGO_FILTER_LIGHT }}
              />
            </a>

            <nav className="hidden md:flex items-center gap-8 lg:gap-12">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.key}
                  href={isHome ? item.section : 'page' in item ? `/${locale}${item.page}` : `/${locale}/${item.section}`}
                  className="text-sm lg:text-base font-medium text-brand-white hover:text-brand-gold transition-colors duration-300 tracking-wide uppercase"
                >
                  {t(item.key)}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3 lg:gap-4">
              <button
                onClick={toggleTheme}
                className="relative w-14 h-7 lg:w-16 lg:h-8 rounded-full border border-brand-gold/30 bg-brand-card/50 hover:border-brand-gold/60 transition-all duration-300 flex items-center px-1"
                aria-label="Toggle theme"
              >
                <Sun size={12} className={cn(
                  'absolute left-1.5 transition-opacity duration-300',
                  theme === 'light' ? 'opacity-50 text-brand-gold' : 'opacity-0'
                )} />
                <Moon size={12} className={cn(
                  'absolute right-1.5 transition-opacity duration-300',
                  theme === 'dark' ? 'opacity-50 text-brand-gold' : 'opacity-0'
                )} />
                <motion.div
                  className="w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center"
                  animate={{ x: theme === 'light' ? 0 : 24 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {theme === 'light'
                    ? <Sun size={10} className="text-brand-black" />
                    : <Moon size={10} className="text-brand-black" />
                  }
                </motion.div>
              </button>
              <LanguageSwitcher locale={locale} />
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 lg:px-8 lg:py-3 border border-brand-gold/60 text-brand-gold text-xs lg:text-sm font-medium tracking-[0.15em] uppercase hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
              >
                57 LINE
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-brand-white"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={24} strokeWidth={1.4} /> : <Menu size={24} strokeWidth={1.4} />}
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
