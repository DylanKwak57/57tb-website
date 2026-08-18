'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import {
  CHECKOUT_CLOSED_LABEL,
  SOLD_OUT_LABEL, STOCK_ALERT_LABEL, STOCK_ALERT_DONE_LABEL,
  PRICE_BLOCKED_LABEL, PRICE_ENQUIRY_LABEL, PRICE_LOGIN_LABEL, PRICE_UNKNOWN, priceText, usePrices,
} from '@/components/prices/PriceProvider';
import { applyShippingFee, lineEnquiryUrl, SELLER, type Variant } from '@/data/order';
import { localize } from '@/data/products';
import { assetPath } from '@/lib/utils';

/**
 * 제품 상세 상단 구매 블록 (쇼피/라자다형 2열 구조).
 *
 * 🚨 **가격은 빌드에 없다** — 서버(`trading-prices`)에서 받아 온 값만 표시한다(브랜드사 조건: 비회원·해외 비노출).
 *    받지 못한 상태에서 금액을 지어내지 않는다. 상태별로 로그인 안내 · 문의 안내 · `—`를 보여 준다.
 * 🚨 가격 문의 품목(`enquiryOnly`)은 가격을 아예 받지 않고 **장바구니에도 담지 않는다** — LINE 문의만 안내한다.
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
  /** 용량 옵션(id·라벨만). 가격은 서버에서 온다. */
  variants?: Variant[];
  images: string[];
  /** 배송 정책 본문. 미확정이면 'กำลังอัปเดต'. 배송비 자리표시자는 받은 값으로 채운다. */
  shipping: string;
  sellerName: string;
  sellerDisclosure: string;
}) {
  const { addItem } = useCart();
  const prices = usePrices();
  const [activeImage, setActiveImage] = useState(0);
  const [variantId, setVariantId] = useState<string | null>(variants?.[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [alerting, setAlerting] = useState(false);
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

  const enquiryOnly = prices.isEnquiryOnly(slug);
  const unitPrice = enquiryOnly ? null : prices.unitPrice(slug, variantId);
  // 🚨 가격을 실제로 받은 상태에서만 담기·구매를 연다.
  //    프리렌더 직후(loading)에도 열어 두면, 문의 품목인지 판매 가능 지역인지 모르는 채로 담기게 된다.
  //    결제가 아직 안 열린 구간에서는 가격은 보여주되 담기·구매는 닫는다(서버도 접수를 거부한다).
  // 재고: 모르면 null → 막지 않는다(조회 실패로 정상 판매를 죽이지 않는다).
  // 이 값은 앱 진입 시점 기준이라, 주문 직전 최신 판정은 `trading-shipping-quote`의 soldOut이 맡는다.
  const inStock = prices.inStock(slug, variantId);
  const soldOut = inStock === false;
  const alertDone = prices.hasStockAlert(slug, variantId);
  const canBuy = !enquiryOnly && !soldOut && prices.phase === 'ok' && prices.checkoutOpen;
  // 가격은 보이는데 버튼만 죽어 있으면 손님이 이유를 모른다 → 한 줄 안내를 띄운다.
  const showCheckoutClosed = !enquiryOnly && prices.phase === 'ok' && !prices.checkoutOpen;
  const showLogin = !enquiryOnly && prices.phase === 'no_auth' && prices.canSignIn;
  const showEnquiry = enquiryOnly || prices.phase === 'blocked' || (prices.phase === 'no_auth' && !prices.canSignIn);
  const mainImage = images[activeImage] ?? images[0];
  // 배송 정책 문구의 배송비 자리는 서버 값으로만 채운다(모르면 그 줄이 빠진다).
  const shippingText = applyShippingFee(shipping, prices.shippingFee === null ? null : priceText(prices.shippingFee));

  const handleAdd = () => {
    if (!canBuy) return;
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

          {/* 가격 자리 — 상태에 따라 금액 · 로그인 버튼 · 문의 안내 중 하나만 나온다. */}
          <div aria-live="polite" className="mt-5">
            {enquiryOnly ? (
              <a
                className="flex min-h-12 w-full items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black sm:w-auto sm:px-8"
                href={lineEnquiryUrl()}
                rel="noopener noreferrer"
                target="_blank"
              >
                {PRICE_ENQUIRY_LABEL}
              </a>
            ) : showLogin ? (
              <button
                className="flex min-h-12 w-full items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black sm:w-auto sm:px-8"
                onClick={prices.signIn}
                type="button"
              >
                {PRICE_LOGIN_LABEL}
              </button>
            ) : showEnquiry ? (
              <div>
                <p className="text-sm text-brand-white">{PRICE_BLOCKED_LABEL}</p>
                <a
                  className="mt-3 flex min-h-12 w-full items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black sm:w-auto sm:px-8"
                  href={lineEnquiryUrl()}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {localize(SELLER.contact.label, locale)}
                </a>
              </div>
            ) : (
              /* 🚨 품절은 **가격 옆**에 배지로 둔다 (2026-08-18 대표님 지적).
                 버튼 아래 작은 회색 글씨는 손님이 버튼을 눌러 본 뒤에야 발견해 순서가 거꾸로였다.
                 bg-brand-gold(#5C5248) + text-brand-black(#DFD9D1) = 이 페이지에서 대비가 가장 큰 조합(실측). */
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-serif text-3xl text-brand-gold md:text-4xl">{priceText(unitPrice)}</p>
                {soldOut && (
                  <span className="inline-flex items-center bg-brand-gold px-3.5 py-1.5 text-sm font-bold tracking-wide text-brand-black">
                    {SOLD_OUT_LABEL}
                  </span>
                )}
              </div>
            )}
          </div>

          <dl className="mt-6 divide-y divide-brand-gold/15 border-y border-brand-gold/20">
            <div className="grid grid-cols-[104px_1fr] gap-4 py-3">
              <dt className="text-sm text-brand-gray">ผู้จำหน่าย</dt>
              <dd className="text-sm text-brand-white">{sellerName}</dd>
            </div>
            <div className="grid grid-cols-[104px_1fr] gap-4 py-3">
              <dt className="text-sm text-brand-gray">การจัดส่ง</dt>
              <dd className="text-sm leading-relaxed text-brand-white">{shippingText}</dd>
            </div>
          </dl>

          {variants && variants.length > 0 && (
            <fieldset className="mt-6">
              <legend className="mb-3 text-sm text-brand-gray">ขนาด</legend>
              <div className="grid grid-cols-3 gap-2">
                {variants.map((variant) => {
                  const selected = variant.id === variantId;
                  // 옵션별 가격도 서버 값이다. 못 받았으면 라벨(용량)만 보여 준다.
                  const variantPrice = enquiryOnly ? null : prices.unitPrice(slug, variant.id);
                  const variantSoldOut = prices.inStock(slug, variant.id) === false;
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
                      {variantSoldOut ? (
                        <span className="mt-0.5 block text-xs opacity-70">{SOLD_OUT_LABEL}</span>
                      ) : (
                        variantPrice !== null && (
                          <span className="mt-0.5 block text-xs">{priceText(variantPrice)}</span>
                        )
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* 못 사는 물건의 수량을 고르게 두지 않는다 (2026-08-18 C안). */}
          {!soldOut && (
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
          )}

          {/* 🚨 가격을 못 받은 상태(해외·판매 중단)와 문의 품목은 담기·구매를 열지 않는다.
              🚨 품절이면 두 버튼 대신 **품절 표시 하나**로 대체한다 (2026-08-18 C안, 쇼피·라자다 방식).
                 손님이 행동하려는 지점에서 이유를 알려 준다 — 위 배지만으로는 시선이 떨어져 있었다. */}
          {soldOut ? (
            <div className="mt-6" ref={buttonsRef}>
              <div
                aria-disabled="true"
                className="flex min-h-12 w-full cursor-not-allowed items-center justify-center border border-brand-gold/30 px-4 py-3 text-sm font-bold text-brand-gray"
              >
                {SOLD_OUT_LABEL}
              </div>
              {/* 📣 재입고 알림 (2026-08-18 대표님 발안) — 재고가 돌아오면 LINE 으로 1회 안내한다.
                  신청은 회원만 가능하므로, 로그인 전에는 위 로그인 버튼이 먼저 뜬다. */}
              {alertDone ? (
                /* 🚨 신청 완료는 "손님이 방금 한 행동의 결과"다 — 작은 회색 글씨로 두면
                   눌렸는지조차 알기 어렵다(2026-08-18 대표님 지적). 버튼과 같은 크기·형태로 둔다. */
                <div className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 border border-brand-gold bg-brand-gold/10 px-4 py-3 text-center text-sm font-bold leading-snug text-brand-gold">
                  <span aria-hidden="true">✓</span>
                  <span>{STOCK_ALERT_DONE_LABEL}</span>
                </div>
              ) : (
                <button
                  className="mt-3 flex min-h-12 w-full items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black disabled:opacity-40"
                  disabled={alerting || prices.phase !== 'ok'}
                  onClick={async () => {
                    setAlerting(true);
                    try {
                      await prices.requestAlert(slug, variantId, nameTh || nameEn);
                    } finally {
                      setAlerting(false);
                    }
                  }}
                  type="button"
                >
                  {STOCK_ALERT_LABEL}
                </button>
              )}
            </div>
          ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2" ref={buttonsRef}>
            <button
              className="flex min-h-12 items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canBuy}
              onClick={handleAdd}
              type="button"
            >
              {added ? 'เพิ่มลงตะกร้าแล้ว' : 'เพิ่มลงตะกร้า'}
            </button>
            {canBuy ? (
              <a
                className="flex min-h-12 items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black"
                href={assetPath(`/${locale}/order`)}
                onClick={() => addItem(slug, variantId, quantity)}
              >
                ซื้อทันที
              </a>
            ) : (
              <span
                aria-disabled="true"
                className="flex min-h-12 cursor-not-allowed items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black opacity-40"
              >
                ซื้อทันที
              </span>
            )}
          </div>
          )}
          {/* 결제 미오픈 안내만 남긴다 — 품절은 위 배지와 버튼 자리가 이미 말한다. */}
          {!soldOut && showCheckoutClosed ? (
            <p className="mt-3 text-center text-xs text-brand-gray">{CHECKOUT_CLOSED_LABEL}</p>
          ) : null}
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
            <p className="flex flex-wrap items-center gap-2 text-base font-bold text-brand-white">
              <span>{unitPrice === null ? PRICE_UNKNOWN : priceText(unitPrice * quantity)}</span>
              {unitPrice !== null && quantity > 1 && !soldOut && (
                <span className="text-xs font-normal text-brand-gray">× {quantity}</span>
              )}
              {soldOut && (
                <span className="inline-flex items-center bg-brand-gold px-2.5 py-1 text-xs font-bold tracking-wide text-brand-black">
                  {SOLD_OUT_LABEL}
                </span>
              )}
            </p>
          </div>
          {canBuy ? (
            <>
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
            </>
          ) : soldOut ? null : showCheckoutClosed ? (
            /* 🚨 결제 미오픈은 "가격 문의"와 다른 상태다 — 가격을 이미 보여 주고 있으므로
               LINE 문의로 보내면 손님이 "가격이 안 보인다"로 오해한다(2026-08-12 대표님 화면).
               PC 패널과 같은 문구를 쓴다. */
            <span
              aria-disabled="true"
              className="shrink-0 text-center text-xs leading-tight text-brand-gray"
            >
              {CHECKOUT_CLOSED_LABEL}
            </span>
          ) : (
            /* 담을 수 없는 상태(문의 품목·해외·비회원)에서만 LINE 문의로 보낸다. */
            <a
              className="flex min-h-11 shrink-0 items-center bg-brand-gold px-4 text-xs font-bold text-brand-black sm:text-sm"
              href={lineEnquiryUrl()}
              rel="noopener noreferrer"
              target="_blank"
            >
              {PRICE_ENQUIRY_LABEL}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
