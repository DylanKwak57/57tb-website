'use client';

import { useLocale } from 'next-intl';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { assetPath } from '@/lib/utils';

export type ProductCardData = { slug: string; nameTh: string; nameEn: string; nameKo?: string; status: 'available' | 'coming-soon'; brand: string; line: string };
/** id = 상세페이지 뒤로가기(`/products#<id>`)가 가리키는 앵커. Product.brand 값과 같게 둔다. */
type Group = { id: string; brand: string; sections: { title: string; products: ProductCardData[] }[] };

function ProductCard({ product, index }: { product: ProductCardData; index: number }) {
  const locale = useLocale();
  const comingSoon = product.status === 'coming-soon';
  const isValentine = product.brand === 'valentine';
  // 카드는 브랜드 구분 없이 항상 영문(위) + 태국어(아래) 두 줄로 쓴다.
  // 2026-08-03: 발렌타인만 로케일 기반 이름을 쓰던 예외를 제거했다 — 태국어 페이지에서
  // 태국어가 첫 줄로 올라가면 두 줄이 같아져 보조 줄이 사라지고 카드가 한 줄로 보였다.
  const primaryName = product.nameEn;
  const secondaryName = product.nameTh === primaryName ? null : product.nameTh;

  return (
    <ScrollReveal delay={index * 0.05}>
      <a
        href={assetPath(`/${locale}/products/${product.slug}`)}
        className={`group relative block overflow-hidden rounded-2xl border border-brand-gold/10 bg-brand-card transition-all duration-300 hover:border-brand-gold/30 ${isValentine ? 'h-full' : ''}`}
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
        {/* 2026-08-03: 발렌타인 전용 min-height를 제거했다 — 이름이 한 줄뿐이던 시절의 값이라
            두 줄로 바뀐 지금은 카드 하단에 빈 공간만 남겼다. 다른 제품과 같은 여백을 쓴다. */}
        <div className="p-3 md:p-4">
          <p className="text-sm font-medium leading-tight text-brand-white md:text-base">
            {primaryName}
          </p>
          {secondaryName && <p className="mt-1 text-xs text-brand-gray">{secondaryName}</p>}
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
