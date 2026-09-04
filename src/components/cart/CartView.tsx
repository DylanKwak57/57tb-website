'use client';

import { useCart, MAX_QUANTITY } from '@/components/cart/CartProvider';
import { useCartAddParam } from '@/components/cart/useCartAddParam';
import {
  PRICE_BLOCKED_LABEL, PRICE_LOGIN_LABEL, PRICE_UNKNOWN, SOLD_OUT_LABEL, priceText, usePrices,
} from '@/components/prices/PriceProvider';
import { lineEnquiryUrl } from '@/data/order';
import { cartPriced, cartTotal, resolveCartLines } from '@/lib/cart-lines';
import { assetPath } from '@/lib/utils';

/**
 * 장바구니 화면.
 *
 * 🚨 가격·합계 계산은 `src/lib/cart-lines.ts` 하나만 쓴다 — 주문(결제) 화면과 금액이 갈리면 안 된다.
 * 🚨 **가격은 빌드에 없다.** 서버에서 받은 값이 있을 때만 금액을 보여 주고,
 *    비회원이면 로그인 안내 · 해외/중단이면 LINE 문의 안내로 대신한다(결제도 막힌다).
 * 🚨 결제는 장바구니 전체를 `/order`로 보낸다. 예전에는 2종 이상이면 LINE 문의로 빠졌다(2026-07-26 대표님 지적).
 */

export function CartView({ locale }: { locale: string }) {
  const { items, ready, setQuantity, removeItem } = useCart();
  const prices = usePrices();
  // 추천 페이지에서 넘어온 `?add=` 딥링크를 담는다(다른 origin이라 이 경로밖에 없다).
  // 담는 동안에는 "비었습니다"를 보이지 않는다 — `pending`이 그 구간이다.
  const addParam = useCartAddParam(prices.phase !== 'loading', prices.isEnquiryOnly);

  const lines = resolveCartLines(items, locale, prices);
  const priced = cartPriced(lines);
  const total = cartTotal(lines);
  const showLogin = prices.phase === 'no_auth' && prices.canSignIn;
  const showEnquiry = prices.phase === 'blocked' || (prices.phase === 'no_auth' && !prices.canSignIn);
  // 가격을 못 받으면 결제로 넘기지 않는다 — 금액을 모르는 채 결제 화면에 세우지 않는다.
  // 결제가 아직 안 열린 구간도 같다(서버가 접수를 거부하므로 미리 막는다).
  const canCheckout = prices.phase === 'ok' && priced && prices.checkoutOpen;

  return (
    <div className="min-h-screen bg-brand-black pb-16 pt-24" lang="th">
      <section className="mx-auto max-w-[900px] px-4 md:px-6">
        <h1 className="font-serif text-2xl text-brand-white md:text-3xl">ตะกร้าสินค้า</h1>

        {addParam.added && lines.length > 0 && (
          <p className="mt-4 border border-brand-gold/25 bg-brand-card px-4 py-3 text-sm text-brand-champagne">
            เพิ่มสินค้าที่แนะนำลงตะกร้าแล้วค่ะ
          </p>
        )}

        {!ready || addParam.pending ? (
          <div aria-busy="true" className="mt-8 min-h-40" />
        ) : lines.length === 0 ? (
          <div className="mt-8 border border-brand-gold/20 bg-brand-card px-5 py-10 text-center">
            <p className="text-sm text-brand-white">ยังไม่มีสินค้าในตะกร้า</p>
            <a
              className="mt-5 inline-flex min-h-11 items-center border border-brand-gold px-6 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
              href={assetPath(`/${locale}/products`)}
            >
              เลือกสินค้าต่อ
            </a>
          </div>
        ) : (
          <>
            <ul className="mt-8 divide-y divide-brand-gold/15 border-y border-brand-gold/20">
              {lines.map((line) => (
                <li className="flex gap-4 py-5" key={`${line.slug}:${line.variantId ?? 'single'}`}>
                  <img
                    alt={line.nameEn}
                    className="h-20 w-20 shrink-0 border border-brand-gold/15 bg-brand-card object-cover"
                    height="160"
                    src={assetPath(`/products/${line.slug}/thumb.webp`)}
                    width="160"
                  />
                  <div className="min-w-0 flex-1">
                    <a
                      className="block text-sm font-medium leading-tight text-brand-white transition-colors hover:text-brand-gold"
                      href={assetPath(`/${locale}/products/${line.slug}`)}
                    >
                      {line.nameEn}
                    </a>
                    <p className="mt-1 truncate text-xs text-brand-gray">{line.nameTh}</p>
                    {line.variantLabel && <p className="mt-1 text-xs text-brand-champagne">{line.variantLabel}</p>}
                    <p className="mt-2 font-serif text-lg text-brand-gold">{priceText(line.unitPrice)}</p>
                    {/* 품절 안내 (2026-08-18). 앱 진입 시점 재고라 낡을 수 있어 결정은 주문 화면이 한다. */}
                    {prices.inStock(line.slug, line.variantId) === false && (
                      <p className="mt-1 text-xs text-brand-gray">{SOLD_OUT_LABEL}</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          aria-label="ลดจำนวน"
                          className="flex h-10 w-10 items-center justify-center border border-brand-gold/35 text-base text-brand-white transition-colors hover:border-brand-gold disabled:opacity-40"
                          disabled={line.quantity <= 1}
                          onClick={() => setQuantity(line.slug, line.variantId, line.quantity - 1)}
                          type="button"
                        >
                          −
                        </button>
                        <span aria-live="polite" className="min-w-8 text-center text-sm text-brand-white">{line.quantity}</span>
                        <button
                          aria-label="เพิ่มจำนวน"
                          className="flex h-10 w-10 items-center justify-center border border-brand-gold/35 text-base text-brand-white transition-colors hover:border-brand-gold disabled:opacity-40"
                          disabled={line.quantity >= MAX_QUANTITY}
                          onClick={() => setQuantity(line.slug, line.variantId, line.quantity + 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="min-h-10 text-xs text-brand-gray underline underline-offset-4 transition-colors hover:text-brand-gold"
                        onClick={() => removeItem(line.slug, line.variantId)}
                        type="button"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-baseline justify-between gap-4">
              <span className="text-sm text-brand-white">ยอดรวม</span>
              <span className="font-serif text-2xl text-brand-gold">
                {priced && prices.phase === 'ok' ? priceText(total) : PRICE_UNKNOWN}
              </span>
            </div>

            {/* 가격을 못 받은 상태 안내 — 손님이 다음에 뭘 하면 되는지 한 줄로 알려 준다. */}
            {showLogin && (
              <button
                className="mt-5 flex min-h-12 w-full items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
                onClick={prices.signIn}
                type="button"
              >
                {PRICE_LOGIN_LABEL}
              </button>
            )}
            {showEnquiry && (
              <a
                className="mt-5 flex min-h-12 w-full items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
                href={lineEnquiryUrl()}
                rel="noopener noreferrer"
                target="_blank"
              >
                {PRICE_BLOCKED_LABEL}
              </a>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                className="flex min-h-12 items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
                href={assetPath(`/${locale}/products`)}
              >
                เลือกสินค้าต่อ
              </a>
              {canCheckout ? (
                <a
                  className="flex min-h-12 items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black"
                  href={assetPath(`/${locale}/order`)}
                >
                  ชำระเงิน
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  className="flex min-h-12 cursor-not-allowed items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black opacity-40"
                >
                  ชำระเงิน
                </span>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
