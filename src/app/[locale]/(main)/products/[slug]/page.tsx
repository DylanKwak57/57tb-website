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

/**
 * 제품 상세 메타데이터.
 *
 * 2026-08-03: 발렌타인에만 적용하던 제한(`brand !== 'valentine'` → `{}`)을 없애 전 제품에 적용한다.
 * 그전에는 벨리스타·ACHOA가 부모 layout의 값을 상속해 **모든 제품이 같은 제목("57 Products —
 * 57 Total Beauty")·같은 사이트 공통 설명·같은 OG 이미지**로 나갔다. 제품 페이지는 검색에서
 * 빼는 대신 **링크·QR로만 진입**하는 정책이라(products/layout.tsx), 링크를 LINE·페이스북에
 * 공유했을 때의 미리보기가 오히려 더 중요하다.
 *
 * `robots: noindex`는 그 정책이므로 그대로 유지한다.
 * description은 제품에 설명 필드가 있으면 쓰고, 없으면 **이름·브랜드 같은 확인된 사실만 조합**한다
 * (없는 설명을 지어내지 않는다).
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const name = productName(product, locale);
  const title = `${name} — 57 Total Beauty`;
  const brandLabel = BRAND_LABEL[product.brand] ?? '57 TOTAL BEAUTY';
  const written = product.description ? localize(product.description, locale, product.defaultLocale ?? 'th') : '';
  const description = written || [product.nameEn, product.nameTh, brandLabel].filter(Boolean).join(' · ');
  const url = `https://57tb.art/${locale}/products/${slug}`;
  return { title, description, alternates: { canonical: url }, robots: { index: false, follow: false }, openGraph: { title, description, url, locale: localeCode[locale] ?? 'th_TH', type: 'website', images: [{ url: `https://57tb.art/products/${slug}/thumb.webp`, alt: name }] } };
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
      {/* 사용법 — 상세 이미지 안에만 있으면 확대해야 읽히고 복사·검색이 안 된다. 문구는 products.ts의
          검증된 출처(라벨 또는 발행된 상세 이미지)에서만 온다. */}
      {product.howToUse && (
        <section className="mx-auto mt-10 max-w-[860px] px-4" lang="th">
          <div className="rounded-2xl border border-brand-gold/20 bg-brand-card p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">How to use</p>
            <h2 className="mt-2 text-2xl font-bold text-brand-white">วิธีใช้</h2>
            <ol className="mt-6 space-y-4">
              {product.howToUse.steps.map((step, index) => (
                <li className="flex gap-4" key={localize(step, locale)}>
                  <span aria-hidden="true" className="font-serif text-lg leading-none text-brand-gold">{String(index + 1).padStart(2, '0')}</span>
                  <span className="leading-relaxed text-brand-white">{localize(step, locale)}</span>
                </li>
              ))}
            </ol>
            {product.howToUse.note && (
              <p className="mt-6 border-t border-brand-gold/20 pt-4 text-sm text-brand-gray">{localize(product.howToUse.note, locale)}</p>
            )}
          </div>
        </section>
      )}
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
