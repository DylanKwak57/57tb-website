'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { OrderComplete } from '@/components/order/OrderComplete';
import { OrderForm, type CreatedOrder } from '@/components/order/OrderForm';
import { OrderPanel } from '@/components/order/OrderPanel';
import { lineEnquiryUrl, POLICY, SELLER } from '@/data/order';
import { localize } from '@/data/products';
import { cartPriced, cartTotal, money, resolveCartLines } from '@/lib/cart-lines';
import { payFailureMessage, recallPayToken, startPayment } from '@/lib/checkout';
import { assetPath } from '@/lib/utils';

/**
 * Stripe 결제창에서 취소하고 돌아온 손님 안내 — 이미 만들어진 주문으로 **다시 결제**하게 한다.
 * 여기서 새 주문을 만들면 같은 주문이 두 건 생긴다.
 */
function CanceledNotice({ locale, orderNo }: { locale: string; orderNo: string }) {
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  async function retry() {
    if (retrying) return;
    setRetrying(true);
    setError(null);
    // 결제창에서 취소하고 돌아온 경로라 state가 비어 있다 → 접수 때 저장해 둔 토큰을 꺼내 쓴다.
    const failure = await startPayment(orderNo, locale, recallPayToken(orderNo));
    if (failure) setError(payFailureMessage(failure));
    setRetrying(false);
  }

  return (
    <section className="mx-auto mt-5 max-w-[1180px] px-4 md:px-6" lang="th">
      <div className="border border-brand-champagne/40 bg-brand-card px-5 py-5 md:px-8">
        <p className="text-sm font-medium text-brand-white">ยังไม่ได้ชำระเงิน</p>
        <p className="mt-2 text-xs leading-relaxed text-brand-gray-light">
          คำสั่งซื้อ {orderNo} รอการชำระเงินอยู่ กดปุ่มด้านล่างเพื่อชำระเงินต่อ
        </p>
        {error && <p aria-live="polite" className="mt-3 text-sm text-brand-champagne">{error}</p>}
        <button
          className="mt-4 flex min-h-12 w-full items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:px-8"
          disabled={retrying}
          onClick={retry}
          type="button"
        >
          {retrying ? 'กำลังดำเนินการ…' : 'ชำระเงินต่อ'}
        </button>
      </div>
    </section>
  );
}

/**
 * 주문(결제) 화면 — 장바구니에 담긴 전부를 한 번에 주문한다.
 *
 * 🚨 예전에는 `/order/<제품>`으로 제품 하나만 주문할 수 있어, 장바구니에 2종 이상이면
 *    결제로 갈 화면이 없어 LINE 문의로 빠졌다(2026-07-26 대표님 지적). 그래서 장바구니 기준으로 통합했다.
 * 🚨 합계·가격 계산은 `src/lib/cart-lines.ts` 하나만 쓴다 — 장바구니 화면과 금액이 갈리면 안 된다.
 */
export function OrderView({ locale }: { locale: string }) {
  const { items, ready } = useCart();
  // 접수는 됐지만 결제창을 못 연 경우에만 쓰는 상태(정상 흐름은 Stripe로 바로 넘어간다).
  const [created, setCreated] = useState<CreatedOrder | null>(null);
  // Stripe에서 취소하고 돌아온 주문번호(`?canceled=1&no=…`).
  const [canceledOrderNo, setCanceledOrderNo] = useState<string | null>(null);
  // 정적 export라 서버에서 쿼리를 읽을 수 없다 → 브라우저에서 한 번 읽는다.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('canceled') === '1') setCanceledOrderNo(params.get('no'));
  }, []);
  const lines = resolveCartLines(items, locale);
  const priced = cartPriced(lines);
  const total = cartTotal(lines);

  return (
    <div className="min-h-screen bg-brand-black pb-16 pt-20">
      <section className="mx-auto max-w-[1180px] px-4 md:px-6" lang="th">
        <a
          className="inline-flex min-h-11 items-center text-sm text-brand-gold underline underline-offset-4"
          href={assetPath(`/${locale}/cart`)}
        >
          ← กลับไปที่ตะกร้าสินค้า
        </a>
      </section>

      {/* 판매자 고지 — 결제 직전 화면에서 회사(법인)와 개인 판매자를 분리해 표시한다. */}
      <section className="mx-auto mt-5 max-w-[1180px] px-4 md:px-6" lang="th">
        <div className="border border-brand-gold/30 bg-brand-card px-5 py-5 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">จำหน่ายโดย</p>
          <p className="mt-2 font-serif text-2xl text-brand-white">{SELLER.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray-light">{localize(SELLER.disclosure, locale)}</p>
          <a
            className="mt-4 inline-flex min-h-11 items-center text-sm text-brand-gold underline underline-offset-4"
            href={lineEnquiryUrl()}
            rel="noopener noreferrer"
            target="_blank"
          >
            {localize(SELLER.contact.label, locale)}
          </a>
        </div>
      </section>

      {canceledOrderNo && !created && <CanceledNotice locale={locale} orderNo={canceledOrderNo} />}

      {/* 🚨 결제 취소로 돌아온 화면에서는 새 주문 폼을 감춘다.
          같이 띄우면 손님이 아래 폼을 다시 제출해 **같은 물건으로 주문이 두 건** 생긴다
          (복귀하면서 컴포넌트가 새로 만들어져 멱등키도 새로 발급된다). 재결제만 하게 둔다. */}
      {canceledOrderNo && !created ? null : created ? (
        <section className="mt-6">
          <OrderComplete locale={locale} order={created} />
        </section>
      ) : !ready ? (
        <section className="mx-auto mt-6 max-w-[1180px] px-4 md:px-6" lang="th">
          <p className="text-sm text-brand-gray">กำลังโหลด…</p>
        </section>
      ) : lines.length === 0 ? (
        <section className="mx-auto mt-6 max-w-[1180px] px-4 md:px-6" lang="th">
          <div className="border border-brand-gold/25 bg-brand-card p-6 text-center">
            <p className="text-sm text-brand-gray-light">ยังไม่มีสินค้าในตะกร้า</p>
            <a
              className="mt-5 inline-flex min-h-12 items-center justify-center border border-brand-gold px-6 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
              href={assetPath(`/${locale}/products`)}
            >
              เลือกสินค้า
            </a>
          </div>
        </section>
      ) : (
        <section className="mx-auto mt-6 grid max-w-[1180px] gap-6 px-4 md:grid-cols-[1fr_.9fr] md:px-6" lang="th">
          <div className="border border-brand-gold/25 bg-brand-card p-5 md:p-7">
            <h2 className="text-sm font-medium text-brand-white">รายการสินค้า</h2>
            <ul className="mt-4 divide-y divide-brand-gold/15 border-y border-brand-gold/15">
              {lines.map((line) => (
                <li className="flex gap-4 py-4" key={`${line.slug}:${line.variantId ?? 'base'}`}>
                  <img
                    alt=""
                    className="h-20 w-20 shrink-0 border border-brand-gold/15 object-cover"
                    height="160"
                    src={assetPath(`/products/${line.slug}/thumb.webp`)}
                    width="160"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight text-brand-white">{line.nameEn}</p>
                    <p className="mt-0.5 truncate text-xs text-brand-gray">{line.nameTh}</p>
                    {line.variantLabel && <p className="mt-1 text-xs text-brand-champagne">{line.variantLabel}</p>}
                    <p className="mt-2 text-xs text-brand-gray-light">
                      {line.unitPrice === null ? 'กำลังอัปเดตราคา' : `${money(line.unitPrice)} × ${line.quantity}`}
                    </p>
                  </div>
                  <p className="shrink-0 font-serif text-base text-brand-gold">
                    {line.unitPrice === null ? '—' : money(line.unitPrice * line.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            {/* 수량 변경은 장바구니에서 한다 — 결제 화면에서 금액이 흔들리지 않게. */}
            <a
              className="mt-4 inline-flex min-h-11 items-center text-xs text-brand-gray underline underline-offset-4 transition-colors hover:text-brand-gold"
              href={assetPath(`/${locale}/cart`)}
            >
              แก้ไขจำนวนสินค้า
            </a>

            <dl className="mt-6 divide-y divide-brand-gold/20 border-t border-brand-gold/20">
              {POLICY.map((item) => (
                <div className="grid gap-1 py-4 md:grid-cols-[170px_1fr] md:gap-6" key={item.key}>
                  <dt className="text-sm font-medium text-brand-gold">{localize(item.label, locale)}</dt>
                  <dd className="text-sm leading-relaxed text-brand-gray-light">
                    {item.body ? localize(item.body, locale) : 'กำลังอัปเดต'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <OrderPanel itemCount={lines.length} locale={locale} priced={priced} total={total} />
            <div className="mt-6">
              <OrderForm lines={lines} locale={locale} onCreated={setCreated} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
