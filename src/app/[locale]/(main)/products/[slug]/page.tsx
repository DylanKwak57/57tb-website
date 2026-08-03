import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPurchasePanel } from '@/components/products/ProductPurchasePanel';
import { ValentineProductDetail } from '@/components/products/ValentineProductDetail';
import { productGallery } from '@/data/gallery';
import { basePrice, isOrderable, orderEntry, POLICY, SELLER } from '@/data/order';
import { BRAND_LABEL, getProduct, localize, productName, PRODUCTS } from '@/data/products';
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
  const orderable = isOrderable(product.slug);
  const entry = orderEntry(product.slug);
  // 배송 정책은 미확정이면 정본(order.ts POLICY)이 null이다 — 임의 문구를 만들지 않는다.
  const shippingPolicy = POLICY.find((item) => item.key === 'shipping');
  const shipping = shippingPolicy?.body ? localize(shippingPolicy.body, locale) : 'กำลังอัปเดต';
  // orderable 제품은 하단 고정 구매 바가 있어 본문 마지막이 가려진다 → 바 높이만큼 여유를 둔다.
  return (
    <div className={`min-h-screen pt-20 ${orderable ? 'pb-32' : 'pb-16'}`}>
      <div className="sticky top-16 z-30 border-b border-brand-gold/10 bg-brand-black/90 backdrop-blur-sm">
        {/* 뒤로가기만 둔다. 화살표가 ←이므로 좌측에 두고, 폭은 아래 breadcrumb·구매 패널(1180)과 맞춰 정렬선을 일치시킨다.
            제품명은 바로 아래 breadcrumb과 구매 패널 제목에 이미 있어 여기서는 뺐다 (2026-07-26 대표님 지시). */}
        <div className={`mx-auto flex items-center px-4 py-3 md:px-6 ${orderable ? 'max-w-[1180px]' : 'max-w-[860px]'}`}>
          <a
            className="text-sm font-medium text-brand-gold transition-colors hover:text-brand-champagne"
            href={assetPath(`/${locale}/products#${product.brand}`)}
          >
            ← {BRAND_LABEL[product.brand] ?? '57 PRODUCTS'}
          </a>
        </div>
      </div>
      {orderable && (
        <>
          <nav aria-label="breadcrumb" className="mx-auto mt-5 max-w-[1180px] px-4 md:px-6">
            <p className="flex flex-wrap items-center gap-2 text-xs text-brand-gray">
              <a className="text-brand-gold transition-colors hover:text-brand-champagne" href={assetPath(`/${locale}/products`)}>57 PRODUCTS</a>
              <span aria-hidden="true">›</span>
              <span>{product.brand.toUpperCase()}</span>
              <span aria-hidden="true">›</span>
              <span className="text-brand-white">{productName(product, locale)}</span>
            </p>
          </nav>
          <div className="mt-4">
            {/* 결제는 개인 판매자(57TB TRADING) 주문 화면에서 진행한다. 회사 페이지에서 결제로 직접 점프하지 않는다. */}
            <ProductPurchasePanel
              images={productGallery(product.slug)}
              locale={locale}
              nameEn={product.nameEn}
              nameTh={product.nameTh}
              price={entry?.variants?.length ? null : basePrice(product.slug)}
              sellerDisclosure={localize(SELLER.disclosure, locale)}
              sellerName={SELLER.name}
              shipping={shipping}
              slug={product.slug}
              variants={entry?.variants}
            />
          </div>
        </>
      )}
      <div className={`mx-auto max-w-[860px] ${orderable ? 'mt-10 md:mt-14' : ''}`}>
        {assets.chunks.map((chunk, index) => <img alt={chunk.alt} className="block w-full" height={chunk.height} key={chunk.src} loading={index < 2 ? 'eager' : 'lazy'} src={assetPath(chunk.src)} width={chunk.width} />)}
      </div>
      {!orderable && (
        <div className="mx-auto mt-8 max-w-[860px] px-4">
          <div className="rounded-2xl border border-brand-gold/20 bg-brand-card p-6 text-center">
            <p className="font-medium text-brand-white">{product.status === 'available' ? 'เร็ว ๆ นี้' : 'Coming Soon'}</p>
            {product.status === 'available' && <p className="mt-2 text-sm leading-relaxed text-brand-gray">พร้อมจำหน่ายเร็ว ๆ นี้ที่ร้าน 57 Total Beauty</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return product.brand === 'valentine' ? <ValentineProductDetail locale={locale} product={product} /> : <LegacyProductDetail locale={locale} product={product} />;
}
