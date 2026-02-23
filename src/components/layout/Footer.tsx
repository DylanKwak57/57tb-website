'use client';

import { useTranslations } from 'next-intl';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import { SNS_LINKS, LINE_URL } from '@/lib/constants';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-brand-black border-t border-brand-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-heading text-xl font-bold tracking-wider text-brand-white">
              57 <span className="text-brand-gold">Total Beauty</span>
            </span>
            <p className="text-brand-gray text-sm mt-2">{t('hours')}</p>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gray hover:text-brand-gold transition-colors"
              aria-label="LINE"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
            </a>
            <a
              href={SNS_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gray hover:text-brand-gold transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} strokeWidth={1.4} />
            </a>
            <a
              href={SNS_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gray hover:text-brand-gold transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={20} strokeWidth={1.4} />
            </a>
            <a
              href={SNS_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gray hover:text-brand-gold transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} strokeWidth={1.4} />
            </a>
            <a
              href={SNS_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gray hover:text-brand-gold transition-colors"
              aria-label="TikTok"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.43v-7.15a8.16 8.16 0 005.58 2.17V11.3a4.85 4.85 0 01-3.77-1.85V6.69z" />
              </svg>
            </a>
          </div>

          <p className="text-brand-gray text-sm">{t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
