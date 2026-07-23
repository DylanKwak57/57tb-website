import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ValentineProductDetail } from '@/components/products/ValentineProductDetail';
import { getProduct, localize, productName, PRODUCTS } from '@/data/products';
import { resolveDetailAssets } from '@/lib/product-detail';
import { assetPath } from '@/lib/utils';

const localeCode: Record<string, string> = { th: 'th_TH', en: 'en_US', ko: 'ko_KR' };

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product || product.brand !== 'valentine') return {};
  const title = `${productName(product, locale)} — 57 Total Beauty`;
  const description = localize(product.description, locale, product.defaultLocale ?? 'th') || productName(product, locale);
  const url = `https://57tb.art/${locale}/products/${slug}`;
  return { title, description, alternates: { canonical: url }, robots: { index: false, follow: false }, openGraph: { title, description, url, locale: localeCode[locale] ?? 'th_TH', type: 'website', images: [{ url: `https://57tb.art/products/${slug}/thumb.webp`, alt: productName(product, locale) }] } };
}

function LegacyProductDetail({ locale, product }: { locale: string; product: NonNullable<ReturnType<typeof getProduct>> }) {
  const assets = resolveDetailAssets(product, locale);
  return (
    <div className="min-h-screen pb-16 pt-20">
      <div className="sticky top-16 z-30 border-b border-brand-gold/10 bg-brand-black/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[860px] items-center justify-between gap-4 px-4 py-3">
          <p className="truncate text-sm font-medium text-brand-white md:text-base">{product.nameEn}</p>
          <a className="shrink-0 text-sm font-medium text-brand-gold transition-colors hover:text-brand-champagne" href={assetPath(`/${locale}/products`)}>← BELLISTA</a>
        </div>
      </div>
      <div className="mx-auto max-w-[860px]">
        {assets.chunks.map((chunk, index) => <img alt={chunk.alt} className="block w-full" height={chunk.height} key={chunk.src} loading={index < 2 ? 'eager' : 'lazy'} src={assetPath(chunk.src)} width={chunk.width} />)}
      </div>
      <div className="mx-auto mt-8 max-w-[860px] px-4">
        <div className="rounded-2xl border border-brand-gold/20 bg-brand-card p-6 text-center">
          <p className="font-medium text-brand-white">{product.status === 'available' ? 'เร็ว ๆ นี้' : 'Coming Soon'}</p>
          {product.status === 'available' && <p className="mt-2 text-sm leading-relaxed text-brand-gray">พร้อมจำหน่ายเร็ว ๆ นี้ที่ร้าน 57 Total Beauty</p>}
        </div>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return product.brand === 'valentine' ? <ValentineProductDetail product={product} /> : <LegacyProductDetail locale={locale} product={product} />;
}
