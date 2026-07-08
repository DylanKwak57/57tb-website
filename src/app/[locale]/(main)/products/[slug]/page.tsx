import { notFound } from 'next/navigation';
import { PRODUCTS, getProduct } from '@/data/products';
import productsImages from '@/data/products-images.json';
import { assetPath } from '@/lib/utils';

type ProductsImages = Record<string, { chunks: number; height: number; width: number }>;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const meta = (productsImages as ProductsImages)[slug];
  const chunks = meta?.chunks ?? 0;
  const isAvailable = product.status === 'available';

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* 상단 바 */}
      <div className="sticky top-16 z-30 bg-brand-black/90 backdrop-blur-sm border-b border-brand-gold/10">
        <div className="max-w-[860px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-brand-white font-medium text-sm md:text-base truncate">
            {product.nameEn}
          </p>
          <a
            href={assetPath(`/${locale}/products`)}
            className="shrink-0 text-brand-gold hover:text-brand-champagne text-sm font-medium transition-colors"
          >
            &#8592; BELLISTA
          </a>
        </div>
      </div>

      {/* 상세 이미지 스택 */}
      <div className="max-w-[860px] mx-auto">
        {Array.from({ length: chunks }).map((_, i) => (
          <img
            key={i}
            src={assetPath(
              `/products/${slug}/c${String(i).padStart(2, '0')}.webp`
            )}
            alt={`${product.nameEn} ${i + 1}`}
            width={1290}
            loading={i < 2 ? 'eager' : 'lazy'}
            className="block w-full"
          />
        ))}
      </div>

      {/* 구매 영역 */}
      <div className="max-w-[860px] mx-auto px-4 mt-8">
        {/* TODO: Omise 구매 링크 자리 */}
        {isAvailable ? (
          <div className="rounded-2xl border border-brand-gold/20 bg-brand-card p-6 text-center">
            <p className="text-brand-white font-medium">เร็ว ๆ นี้</p>
            <p className="text-brand-gray text-sm mt-2 leading-relaxed">
              พร้อมจำหน่ายเร็ว ๆ นี้ที่ร้าน 57 Total Beauty
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-gold/20 bg-brand-card p-6 text-center">
            <p className="text-brand-white font-medium">Coming Soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
