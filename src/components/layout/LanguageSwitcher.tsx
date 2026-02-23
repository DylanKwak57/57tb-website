'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn, BASE_PATH } from '@/lib/utils';

const LANGUAGES = [
  { code: 'th', label: 'TH', flag: '🇹🇭' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'ko', label: 'KO', flag: '🇰🇷' },
] as const;

interface LanguageSwitcherProps {
  locale: string;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const switchLocale = (code: string) => {
    const segments = pathname.split('/');
    segments[1] = code;
    window.location.href = `${BASE_PATH}${segments.join('/')}`;
  };

  const current = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm lg:text-base text-brand-white hover:text-brand-gold transition-colors"
        aria-label="Switch language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={1.4} />
        <span className="font-medium">{current.label}</span>
      </button>

      {open && (
        <div role="listbox" aria-label="Select language" className="absolute right-0 mt-2 w-32 bg-brand-card border border-brand-card/80 rounded-2xl shadow-xl overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                switchLocale(lang.code);
                setOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors',
                lang.code === locale
                  ? 'bg-brand-gold/10 text-brand-gold'
                  : 'text-brand-gray-light hover:bg-brand-dark hover:text-brand-white'
              )}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
