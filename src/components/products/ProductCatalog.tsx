'use client';

import { useLocale } from 'next-intl';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { orderEntry } from '@/data/order';
import { assetPath } from '@/lib/utils';

export type ProductCardData = { slug: string; nameTh: string; nameEn: string; nameKo?: string; status: 'available' | 'coming-soon' | 'discontinued'; brand: string; line: string };
/** id = 상세페이지 뒤로가기(`/products#<id>`)가 가리키는 앵커. Product.brand 값과 같게 둔다. */
type Group = { id: string; brand: string; sections: { title: string; products: ProductCardData[] }[] };

function ProductCard({ product, index }: { product: ProductCardData; index: number }) {
  const locale = useLocale();
  const comingSoon = product.status === 'coming-soon';
  const isValentine = product.brand === 'valentine';
  // 카드는 브랜드 구분 없이 항상 영문(위) + 태국어(아래) 두 줄로 쓴다.
  // 2026-08-03: 발렌타인만 로케일 기반 이름을 쓰던 예외를 제거했다 — 태국어 페이지에서
  // 태국어가 첫 줄로 올라가면 두 줄이 같아져 보조 줄이 사라지고 카드가 한 줄로 보였다.
  // 2026-11-08 대표님 "일관성이 없잖아": 용량 표기를 카드 맨 아래 한 줄로 통일한다.
  //  - 용량 하나인 제품은 이름 끝의 용량("… 150ml" / "… 150 มล.")을 **카드에서만** 떼어 아래 줄로 옮긴다.
  //    (데이터의 이름은 그대로 — 주문 기록 · 노션 · My Hair Fit 이 같은 이름을 쓴다)
  //  - 용량이 여러 개인 제품(카페인 샴푸·트리트먼트 · 퍼퓸 미스트)은 `order.ts` 선택지로 "200 / 750 มล.".
  //  - 용량이 없는 제품(스케일링 겔 등)은 빈 줄 — 높이만 확보해 같은 행 카드 높이를 맞춘다.
  const enVolume = product.nameEn.match(/\s*(\d+)\s*(ml|g)$/i);
  const primaryName = enVolume ? product.nameEn.slice(0, enVolume.index).trim() : product.nameEn;
  const thName = product.nameTh.replace(/\s*\d+\s*(มล|ก)\.?$/, '').trim();
  const secondaryName = thName === primaryName ? null : thName;
  const variants = orderEntry(product.slug)?.variants;
  const volumeLine =
    variants && variants.length > 1
      ? `${variants.map((v) => v.id).join(' / ')} มล.`
      : enVolume
        ? `${enVolume[1]} ${enVolume[2].toLowerCase() === 'g' ? 'ก.' : 'มล.'}`
        : null;

  return (
    <ScrollReveal delay={index * 0.05} className="h-full">
      <a
        href={assetPath(`/${locale}/products/${product.slug}`)}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-gold/10 bg-brand-card transition-all duration-300 hover:border-brand-gold/30"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={assetPath(`/products/${product.slug}/thumb.webp`)}
            alt={primaryName}
            loading="lazy"
            className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
              isValentine ? 'object-contain p-3' : 'object-cover'
            } ${comingSoon ? 'grayscale opacity-60' : ''}`}
          />
          {comingSoon && (
            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm">
              Coming Soon
            </span>
          )}
        </div>
        {/* 2026-11-08 대표님 "모바일 UI 안 예쁘다": 이름 줄에 2줄 높이를 비워 두던 방식(8/3)은 영어 이름이 한 줄인
            카드에만 이름 아래 빈칸이 생겨 태국어 줄 위치가 카드마다 달랐다 →
            영어 · 태국어는 위에 붙여 쓰고, 용량은 카드 맨 아래에 붙인다. 같은 행 카드 높이는 격자가 맞춘다(h-full). */}
        <div className="flex flex-1 flex-col p-3 md:p-4">
          <p className="text-sm font-medium leading-snug text-brand-white md:text-base">{primaryName}</p>
          {secondaryName && <p className="mt-1 text-xs leading-snug text-brand-gray">{secondaryName}</p>}
          {volumeLine && (
            <p className="mt-auto pt-3 text-xs font-medium text-brand-champagne" lang="th">
              {volumeLine}
            </p>
          )}
        </div>
      </a>
    </ScrollReveal>
  );
}

export function ProductCatalog({ groups }: { groups: Group[] }) {
  return (
    <div className="min-h-screen pb-16 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
              57 PRODUCTS
            </h1>
            <p className="mt-3 text-sm tracking-wide text-brand-champagne md:text-base">
              Smart &amp; Beauty by 57 Total Beauty
            </p>
          </div>
        </ScrollReveal>

        {groups.map((group, groupIndex) => (
          <section
            key={group.brand}
            id={group.id}
            className={`mt-16 scroll-mt-28 border-t border-brand-gold/10 pt-16 ${
              groupIndex === 0 ? 'mt-0 border-t-0 pt-0' : ''
            }`}
          >
            <ScrollReveal>
              <h2 className="mb-2 text-center font-heading text-3xl font-bold tracking-tight md:text-5xl">
                {group.brand}
              </h2>
            </ScrollReveal>

            {group.sections.map((section) => (
              <section key={section.title} className="mt-10 first:mt-8">
                <ScrollReveal>
                  <h3 className="mb-6 font-heading text-xl font-bold tracking-tight md:text-2xl">
                    <span className="text-brand-gold">✦</span> {section.title}
                  </h3>
                </ScrollReveal>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                  {section.products.map((product, index) => (
                    <ProductCard key={product.slug} product={product} index={index} />
                  ))}
                </div>
              </section>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
