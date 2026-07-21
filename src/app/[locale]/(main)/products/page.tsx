'use client';

import { useLocale } from 'next-intl';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SCALP_PRODUCTS, PROTEIN_PRODUCTS, ACHOA_PRODUCTS, type Product } from '@/data/products';
import { assetPath } from '@/lib/utils';

function ProductCard({ product, index }: { product: Product; index: number }) {
  const locale = useLocale();
  const isComingSoon = product.status === 'coming-soon';

  return (
    <ScrollReveal delay={index * 0.05}>
      <a
        href={assetPath(`/${locale}/products/${product.slug}`)}
        className="group relative block bg-brand-card rounded-2xl overflow-hidden border border-brand-gold/10 hover:border-brand-gold/30 transition-all duration-300"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={assetPath(`/products/${product.slug}/thumb.webp`)}
            alt={product.nameEn}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isComingSoon ? 'grayscale opacity-60' : ''
            }`}
          />
          {isComingSoon && (
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium tracking-wide">
              Coming Soon
            </span>
          )}
        </div>
        <div className="p-3 md:p-4">
          <p className="text-brand-white font-medium text-sm md:text-base leading-tight">
            {product.nameEn}
          </p>
          <p className="text-brand-gray text-xs mt-1">{product.nameTh}</p>
        </div>
      </a>
    </ScrollReveal>
  );
}

function ProductSection({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  return (
    <section className="mt-10 first:mt-8">
      <ScrollReveal>
        <h3 className="font-heading text-xl md:text-2xl font-bold tracking-tight mb-6">
          <span className="text-brand-gold">&#10022;</span> {title}
        </h3>
      </ScrollReveal>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {products.map((product, i) => (
          <ProductCard key={product.slug} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}

function BrandBlock({
  brand,
  children,
}: {
  brand: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 first:mt-0 pt-16 first:pt-0 border-t border-brand-gold/10 first:border-t-0">
      <ScrollReveal>
        <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-center mb-2">
          {brand}
        </h2>
      </ScrollReveal>
      {children}
    </section>
  );
}

export default function ProductsPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight">
              57 PRODUCTS
            </h1>
            <p className="text-brand-champagne text-sm md:text-base mt-3 tracking-wide">
              Smart & Beauty by 57 Total Beauty
            </p>
          </div>
        </ScrollReveal>

        <BrandBlock brand="BELLISTA">
          <ProductSection title="Scalp Care Line" products={SCALP_PRODUCTS} />
          <ProductSection title="Hair Perfume Line" products={PROTEIN_PRODUCTS} />
        </BrandBlock>

        <BrandBlock brand="ACHOA">
          <ProductSection title="One-Shot Treatment" products={ACHOA_PRODUCTS} />
        </BrandBlock>
      </div>
    </div>
  );
}
