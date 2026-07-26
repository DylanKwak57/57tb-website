'use client';

import { useCart, MAX_QUANTITY } from '@/components/cart/CartProvider';
import { cartPriced, cartTotal, money, resolveCartLines } from '@/lib/cart-lines';
import { assetPath } from '@/lib/utils';

/**
 * 장바구니 화면.
 *
 * 🚨 가격·합계 계산은 `src/lib/cart-lines.ts` 하나만 쓴다 — 주문(결제) 화면과 금액이 갈리면 안 된다.
 * 🚨 결제는 장바구니 전체를 `/order`로 보낸다. 예전에는 2종 이상이면 LINE 문의로 빠졌다(2026-07-26 대표님 지적).
 */

export function CartView({ locale }: { locale: string }) {
  const { items, ready, setQuantity, removeItem } = useCart();

  const lines = resolveCartLines(items, locale);
  const priced = cartPriced(lines);
  const total = cartTotal(lines);

  return (
    <div className="min-h-screen bg-brand-black pb-16 pt-24" lang="th">
      <section className="mx-auto max-w-[900px] px-4 md:px-6">
        <h1 className="font-serif text-2xl text-brand-white md:text-3xl">ตะกร้าสินค้า</h1>

        {!ready ? (
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
                    <p className="mt-2 font-serif text-lg text-brand-gold">
                      {line.unitPrice === null ? 'กำลังอัปเดต' : money(line.unitPrice)}
                    </p>

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
              <span className="font-serif text-2xl text-brand-gold">{priced ? money(total) : 'กำลังอัปเดต'}</span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                className="flex min-h-12 items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
                href={assetPath(`/${locale}/products`)}
              >
                เลือกสินค้าต่อ
              </a>
              <a
                className="flex min-h-12 items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black"
                href={assetPath(`/${locale}/order`)}
              >
                ชำระเงิน
              </a>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
