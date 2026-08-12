'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CategoryFilter } from '@/components/ui/CategoryFilter';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
  PRICE_ENQUIRY_LABEL, PRICE_LOGIN_LABEL, PRICE_UNKNOWN, priceText, usePrices,
} from '@/components/prices/PriceProvider';
import { SERVICES, LINE_URL } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import type { Locale, ServiceCategory } from '@/types';

const CATEGORIES: ServiceCategory[] = ['CUT', 'COLOR', 'PERM', 'TREATMENT', 'PRODUCT'];

/**
 * 서버에서 받아 오는 가격 한 칸 (2026-08-12).
 *
 * 🚨 금액은 빌드 산출물에 없다 — `usePrices()`가 받아 온 값만 쓴다. 기본값·근사값을 만들지 않는다.
 * 🚨 상태별 표시: ok=금액 / no_auth=LINE 로그인 안내 / blocked=LINE 문의 안내 / loading=`—`.
 *    이 컴포넌트가 마운트될 때만 가격 조회가 시작된다(시술만 보는 손님에게는 요청이 안 나간다).
 */
function GatedPrice({ priceKey }: { priceKey: string }) {
  const prices = usePrices();
  const price = prices.phase === 'ok' ? prices.unitPrice(priceKey, null) : null;

  if (price !== null) {
    return <p className="text-brand-gold font-semibold whitespace-nowrap">{priceText(price)}</p>;
  }

  if (prices.phase === 'loading') {
    return <p className="text-brand-gray font-semibold">{PRICE_UNKNOWN}</p>;
  }

  if (prices.phase === 'no_auth' && prices.canSignIn) {
    return (
      <button
        type="button"
        onClick={prices.signIn}
        className="max-w-[240px] px-4 py-2 border border-brand-gold/40 text-brand-gold text-xs leading-snug rounded-full hover:bg-brand-gold hover:text-brand-black transition-colors"
      >
        {PRICE_LOGIN_LABEL}
      </button>
    );
  }

  return <p className="max-w-[240px] text-brand-gray text-xs leading-snug">{PRICE_ENQUIRY_LABEL}</p>;
}

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();
  const [active, setActive] = useState<string>('ALL');

  const filtered = active === 'ALL'
    ? SERVICES
    : SERVICES.filter((s) => s.category === active);

  const categories = [
    { key: 'ALL', label: t('categories.ALL') },
    ...CATEGORIES.map((c) => ({ key: c, label: t(`categories.${c}`) })),
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-8">
            <span className="text-brand-gold">✦</span> {t('pageTitle')}
          </h1>
        </ScrollReveal>

        <CategoryFilter categories={categories} active={active} onChange={setActive} />

        <div className="space-y-4">
          {filtered.map((service, i) => (
            <ScrollReveal key={service.id} delay={i * 0.05}>
              <div className="p-6 bg-brand-card/70 backdrop-blur-xl border border-brand-card/50 rounded-[32px] hover:border-brand-gold/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading text-lg font-semibold text-brand-white">
                        {service.name[locale as Locale]}
                      </h3>
                      {service.popular && (
                        <span className="px-2 py-0.5 bg-brand-gold text-brand-black text-xs font-semibold rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-brand-gray text-xs">
                      {t('duration')}: {service.duration}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    {service.priceKey ? (
                      <GatedPrice priceKey={service.priceKey} />
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 text-center">
                        {service.prices.junior !== undefined && (
                          <div>
                            <p className="text-brand-gray text-xs mb-1">Junior</p>
                            <p className="text-brand-white font-semibold">{formatPrice(service.prices.junior)}</p>
                          </div>
                        )}
                        {service.prices.stylist1 !== undefined && (
                          <div>
                            <p className="text-brand-gray text-xs mb-1">Stylist 1</p>
                            <p className="text-brand-white font-semibold">{formatPrice(service.prices.stylist1)}</p>
                          </div>
                        )}
                        {service.prices.stylist2 !== undefined && (
                          <div>
                            <p className="text-brand-gray text-xs mb-1">Stylist 2</p>
                            <p className="text-brand-white font-semibold">{formatPrice(service.prices.stylist2)}</p>
                          </div>
                        )}
                        {service.prices.stylist3 !== undefined && (
                          <div>
                            <p className="text-brand-gray text-xs mb-1">Stylist 3</p>
                            <p className="text-brand-white font-semibold">{formatPrice(service.prices.stylist3)}</p>
                          </div>
                        )}
                        {service.prices.stylist4 !== undefined && (
                          <div>
                            <p className="text-brand-gray text-xs mb-1">Stylist 4</p>
                            <p className="text-brand-gold font-semibold">{formatPrice(service.prices.stylist4)}</p>
                          </div>
                        )}
                      </div>
                    )}
                    <a
                      href={LINE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-5 py-2.5 bg-brand-gold text-brand-black text-sm font-semibold rounded-full hover:bg-brand-champagne transition-colors"
                    >
                      {t('book')}
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
