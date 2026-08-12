'use client';

import { localize } from '@/data/products';
import { PAYMENT_NOTE } from '@/data/order';
import { PRICE_UNKNOWN, priceText, usePrices } from '@/components/prices/PriceProvider';

/**
 * 합계 블록.
 *
 * 🚨 금액은 장바구니 전체 합계를 받아 표시만 한다 — 여기서 계산하지 않는다(정본 `src/lib/cart-lines.ts`).
 * 🚨 **배송비도 서버에서 온다**(`trading-prices`의 `shippingFee`) — 빌드에 금액을 두지 않는다.
 *    못 받았으면 `—`로 두고 합계를 만들지 않는다.
 * 🚨 결제수단 **선택 UI를 두지 않는다** — 손님은 Stripe Checkout 안에서 고른다(2026-08-03 대표님 확정).
 *    여기 있는 건 어떤 수단을 쓸 수 있는지 알려주는 안내 문구뿐이다.
 */
export function OrderPanel({
  locale,
  total,
  priced,
  itemCount,
}: {
  locale: string;
  total: number;
  /** 담긴 모든 줄의 가격이 확정됐는지. 하나라도 미정이면 합계를 확정값으로 다루지 않는다. */
  priced: boolean;
  itemCount: number;
}) {
  const { shippingFee, phase } = usePrices();
  const settled = priced && phase === 'ok' && shippingFee !== null;

  return (
    <div className="border-y border-brand-gold/30 bg-brand-card px-5 py-6 md:px-8 md:py-8" lang="th">
      <div className="border-b border-brand-gold/20 pb-5">
        <p className="text-sm font-medium text-brand-white">วิธีชำระเงิน</p>
        <p className="mt-2 text-xs leading-relaxed text-brand-gray-light">{localize(PAYMENT_NOTE, locale)}</p>
      </div>

      <div className="flex items-baseline justify-between gap-4 border-b border-brand-gold/20 py-5">
        <span className="text-sm text-brand-gray-light">จำนวนรายการ</span>
        <span className="text-sm text-brand-white">{itemCount}</span>
      </div>

      {/* 배송비는 주문 1건당 정액이다. 값은 서버가 준다(같은 값으로 서버가 합계를 다시 계산한다). */}
      <div className="flex items-baseline justify-between gap-4 border-b border-brand-gold/20 py-4">
        <span className="text-sm text-brand-gray-light">ค่าสินค้า</span>
        <span className="text-sm text-brand-white">{settled ? priceText(total) : PRICE_UNKNOWN}</span>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-b border-brand-gold/20 py-4">
        <span className="text-sm text-brand-gray-light">ค่าจัดส่ง</span>
        <span className="text-sm text-brand-white">{settled ? priceText(shippingFee) : PRICE_UNKNOWN}</span>
      </div>

      <div className="flex items-baseline justify-between gap-4 py-5">
        <span className="text-sm font-medium text-brand-white">ยอดรวมทั้งหมด</span>
        <span className="font-serif text-2xl text-brand-gold">
          {settled ? priceText(total + (shippingFee ?? 0)) : PRICE_UNKNOWN}
        </span>
      </div>

      {/* 🚨 결제 버튼을 여기 두지 않는다. 제출은 아래 `OrderForm`이 담당한다 —
          주문번호가 먼저 만들어져야 그 번호로 Stripe 세션을 만들 수 있다. */}
    </div>
  );
}
