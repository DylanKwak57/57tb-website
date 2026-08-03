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
        {/* 2026-08-03: 브랜드별 min-height 예외를 없애고 전 카드 공통 규칙으로 통일.
            영문 줄에 min-h-[2.5em](leading-tight 기준 2줄)을 줘서 이름 길이와 무관하게 높이가 같다 —
            모바일에서 "Keratin Perfume Hair Mist"처럼 2줄로 접히는 카드와 1줄 카드가 섞이면
            같은 행의 카드 높이가 어긋난다. */}
        <div className="p-3 md:p-4">
          <p className="min-h-[2.5em] text-sm font-medium leading-tight text-brand-white md:text-base">
            {primaryName}
          </p>
          {/* 태국어 줄도 2줄분을 확보한다 — "คอลลาเจน เพอร์ฟูม แฮร์ มิสต์"처럼 긴 이름만
              2줄로 접혀 그 카드만 16px 높아지는 것을 막는다(text-xs 줄높이 1rem 기준). */}
          {secondaryName && <p className="mt-1 min-h-[2rem] text-xs text-brand-gray">{secondaryName}</p>}
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
