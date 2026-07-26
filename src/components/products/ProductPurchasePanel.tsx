'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { type Variant } from '@/data/order';
import { localize } from '@/data/products';
import { assetPath } from '@/lib/utils';

/**
 * 제품 상세 상단 구매 블록 (쇼피/라자다형 2열 구조).
 *
 * 🚨 가격·용량 옵션 정본은 `src/data/order.ts`다. 여기서 값을 계산·보정하지 않고 받은 값만 표시한다.
 * 🚨 결제는 개인 판매자(57TB TRADING) 주문 화면(`/order`)에서 진행한다 — 여기서 결제로 직접 가지 않는다.
 *    주문은 장바구니 전체 기준이라 '바로 구매'도 담은 뒤 `/order`로 보낸다.
 */

const MAX_QUANTITY = 20;
const ADDED_FEEDBACK_MS = 2000;

export function ProductPurchasePanel({
  locale,
  slug,
  nameEn,
  nameTh,
  price,
  variants,
  images,
  shipping,
  sellerName,
  sellerDisclosure,
}: {
  locale: string;
  slug: string;
  nameEn: string;
  nameTh: string;
  /** 옵션 없는 제품의 단일가. 옵션 제품은 null이고 variants가 가격을 가진다. */
  price: number | null;
  variants?: Variant[];
  images: string[];
  /** 배송 정책 본문. 미확정이면 'กำลังอัปเดต'. */
  shipping: string;
  sellerName: string;
  sellerDisclosure: string;
}) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [variantId, setVariantId] = useState<string | null>(variants?.[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 상세 이미지가 2만 px를 넘어, 상단 구매 버튼이 화면을 벗어나면 하단 고정 바를 띄운다.
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => () => {
    if (addedTimer.current) clearTimeout(addedTimer.current);
  }, []);

  useEffect(() => {
    const target = buttonsRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting), { threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const selectedVariant = variants?.find((variant) => variant.id === variantId) ?? null;
  const unitPrice = selectedVariant ? selectedVariant.price : price;
  const mainImage = images[activeImage] ?? images[0];

  const handleAdd = () => {
    addItem(slug, variantId, quantity);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
  };

  return (
    <section className="mx-auto max-w-[1180px] px-4 md:px-6" lang="th">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10">
        <div>
          <img
            alt={nameEn}
            className="aspect-square w-full border border-brand-gold/20 bg-brand-card object-cover"
            decoding="async"
            height="1080"
            key={mainImage}
            loading="eager"
            src={assetPath(mainImage)}
            width="1080"
          />
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-8">
              {images.map((image, index) => (
                <button
                  aria-label={`${nameEn} ${index + 1}`}
                  aria-pressed={index === activeImage}
                  className={`block border bg-brand-card transition-colors ${
                    index === activeImage ? 'border-brand-gold' : 'border-brand-gold/20 hover:border-brand-gold/60'
                  }`}
                  key={image}
                  onClick={() => setActiveImage(index)}
                  type="button"
                >
                  {/* 썸네일은 첫 화면에 모두 보이고 장당 20~35KB뿐이다.
                      lazy로 두면 디코딩이 늦어 실제로 빈칸이 노출된다(2026-07-26 대표님 화면에서 발생) → eager. */}
                  <img
                    alt=""
                    className="aspect-square w-full object-cover"
                    decoding="sync"
                    height="1080"
                    loading="eager"
                    src={assetPath(image)}
                    width="1080"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-serif text-2xl leading-tight text-brand-white md:text-3xl">{nameEn}</h1>
          <p className="mt-2 text-sm text-brand-gray">{nameTh}</p>

          <p aria-live="polite" className="mt-5 font-serif text-3xl text-brand-gold md:text-4xl">
            {unitPrice === null ? 'กำลังอัปเดต' : `฿${unitPrice.toLocaleString('en-US')}`}
          </p>

          <dl className="mt-6 divide-y divide-brand-gold/15 border-y border-brand-gold/20">
            <div className="grid grid-cols-[104px_1fr] gap-4 py-3">
              <dt className="text-sm text-brand-gray">ผู้จำหน่าย</dt>
              <dd className="text-sm text-brand-white">{sellerName}</dd>
            </div>
            <div className="grid grid-cols-[104px_1fr] gap-4 py-3">
              <dt className="text-sm text-brand-gray">การจัดส่ง</dt>
              <dd className="text-sm leading-relaxed text-brand-white">{shipping}</dd>
            </div>
          </dl>

          {variants && variants.length > 0 && (
            <fieldset className="mt-6">
              <legend className="mb-3 text-sm text-brand-gray">ขนาด</legend>
              <div className="grid grid-cols-3 gap-2">
                {variants.map((variant) => {
                  const selected = variant.id === variantId;
                  return (
                    <button
                      aria-pressed={selected}
                      className={`min-h-14 border px-2 py-2 text-center transition-colors ${
                        selected
                          ? 'border-brand-gold bg-brand-gold text-brand-black'
                          : 'border-brand-gold/30 text-brand-white hover:border-brand-gold'
                      }`}
                      key={variant.id}
                      onClick={() => setVariantId(variant.id)}
                      type="button"
                    >
                      <span className="block text-sm font-medium">{localize(variant.label, locale)}</span>
                      <span className="mt-0.5 block text-xs">฿{variant.price.toLocaleString('en-US')}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-sm text-brand-gray">จำนวน</span>
            <div className="flex items-center gap-3">
              <button
                aria-label="ลดจำนวน"
                className="flex h-11 w-11 items-center justify-center border border-brand-gold/35 text-lg text-brand-white transition-colors hover:border-brand-gold disabled:opacity-40"
                disabled={quantity <= 1}
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                type="button"
              >
                −
              </button>
              <span aria-live="polite" className="min-w-10 text-center font-serif text-xl text-brand-white">
                {quantity}
              </span>
              <button
                aria-label="เพิ่มจำนวน"
                className="flex h-11 w-11 items-center justify-center border border-brand-gold/35 text-lg text-brand-white transition-colors hover:border-brand-gold disabled:opacity-40"
                disabled={quantity >= MAX_QUANTITY}
                onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
                type="button"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2" ref={buttonsRef}>
            <button
              className="flex min-h-12 items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
              onClick={handleAdd}
              type="button"
            >
              {added ? 'เพิ่มลงตะกร้าแล้ว' : 'เพิ่มลงตะกร้า'}
            </button>
            <a
              className="flex min-h-12 items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black"
              href={assetPath(`/${locale}/order`)}
              onClick={() => addItem(slug, variantId, quantity)}
            >
              ซื้อทันที
            </a>
          </div>
          <p aria-live="polite" className="sr-only">
            {added ? 'เพิ่มลงตะกร้าแล้ว' : ''}
          </p>

          <p className="mt-5 text-xs leading-relaxed text-brand-gray">{sellerDisclosure}</p>
        </div>
      </div>

      {/* 하단 고정 구매 바 — 상단 버튼이 화면에서 사라진 동안만 뜬다(쇼피·라자다 방식).
          수량·옵션 상태를 위 패널과 공유하므로 손님이 고른 그대로 담긴다. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-brand-gold/25 bg-brand-black/95 backdrop-blur-sm transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* 아이폰 홈 인디케이터 영역에 버튼이 걸려 잘렸다(2026-07-26 대표님 폰) → 하단 패딩에 safe-area를 더한다.
            env()는 viewport-fit=cover가 없으면 0이므로 기본 여백 20px을 함께 준다. */}
        <div
          className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 pt-3 md:px-6"
          style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
        >
          <img alt="" className="hidden h-12 w-12 shrink-0 rounded object-cover sm:block" src={assetPath(images[0])} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-brand-gray">{nameEn}</p>
            <p className="text-base font-bold text-brand-white">
              {unitPrice === null ? '—' : `฿${(unitPrice * quantity).toLocaleString('en-US')}`}
              {quantity > 1 && <span className="ml-2 text-xs font-normal text-brand-gray">× {quantity}</span>}
            </p>
          </div>
          <button
            className="min-h-11 shrink-0 border border-brand-gold px-4 text-xs font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black sm:text-sm"
            onClick={handleAdd}
            type="button"
          >
            {added ? 'เพิ่มแล้ว' : 'ใส่ตะกร้า'}
          </button>
          <a
            className="flex min-h-11 shrink-0 items-center bg-brand-gold px-4 text-xs font-bold text-brand-black sm:text-sm"
            href={assetPath(`/${locale}/order`)}
            onClick={() => addItem(slug, variantId, quantity)}
          >
            ซื้อทันที
          </a>
        </div>
      </div>
    </section>
  );
}
