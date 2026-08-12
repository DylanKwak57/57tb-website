'use client';

import { localize } from '@/data/products';
import { PAYMENT_NOTE } from '@/data/order';
import { PRICE_UNKNOWN, priceText, usePrices } from '@/components/prices/PriceProvider';
import type { QuoteResult } from '@/lib/shipping-quote';

/**
 * 합계 블록.
 *
 * 🚨 금액은 장바구니 전체 합계를 받아 표시만 한다 — 여기서 계산하지 않는다(정본 `src/lib/cart-lines.ts`).
 * 🚨 **배송비도 서버에서 온다**(`trading-shipping-quote`) — 빌드에 금액도 계산식도 두지 않는다.
 *    못 받았으면 `—`로 두고 합계를 만들지 않는다.
 * 🚨 배송비는 **무게·지역으로 정해진다**(2026-08-12). 주소를 고르기 전에는 확정할 수 없으므로
 *    "방콕 기준 최소 금액"임을 화면에 밝힌다 — 결제 직전에 금액이 튀면 장바구니를 버린다.
 * 🚨 결제수단 **선택 UI를 두지 않는다** — 손님은 Stripe Checkout 안에서 고른다(2026-08-03 대표님 확정).
 *    여기 있는 건 어떤 수단을 쓸 수 있는지 알려주는 안내 문구뿐이다.
 */
export function OrderPanel({
  locale,
  total,
  priced,
  itemCount,
  quote,
}: {
  locale: string;
  total: number;
  /** 담긴 모든 줄의 가격이 확정됐는지. 하나라도 미정이면 합계를 확정값으로 다루지 않는다. */
  priced: boolean;
  itemCount: number;
  /** 배송비 견적. 아직 못 받았으면 null. */
  quote: QuoteResult | null;
}) {
  const { phase } = usePrices();
  const shippingFee = quote?.status === 'ok' ? quote.quote.fee : null;
  const provinceApplied = quote?.status === 'ok' && quote.quote.provinceApplied;
  const tooHeavy = quote?.status === 'too_heavy';
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

      {/* 배송비는 무게·지역으로 정해진다. 값은 서버가 준다(같은 계산으로 서버가 합계를 다시 만든다). */}
      <div className="flex items-baseline justify-between gap-4 border-b border-brand-gold/20 py-4">
        <span className="text-sm text-brand-gray-light">ค่าสินค้า</span>
        <span className="text-sm text-brand-white">{settled ? priceText(total) : PRICE_UNKNOWN}</span>
      </div>
      <div className="border-b border-brand-gold/20 py-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-brand-gray-light">ค่าจัดส่ง</span>
          <span className="text-sm text-brand-white">{settled ? priceText(shippingFee) : PRICE_UNKNOWN}</span>
        </div>
        {/* 주소를 아직 안 골랐으면 금액이 바뀔 수 있음을 미리 알린다. */}
        {settled && !provinceApplied && (
          <p className="mt-2 text-xs leading-relaxed text-brand-gray">
            ค่าจัดส่งขึ้นอยู่กับน้ำหนักและจังหวัดปลายทาง ยอดจะอัปเดตเมื่อกรอกที่อยู่
          </p>
        )}
        {tooHeavy && (
          <p className="mt-2 text-xs leading-relaxed text-brand-gray">
            คำสั่งซื้อนี้มีน้ำหนักเกินที่ระบบคำนวณอัตโนมัติได้ กรุณาสอบถามค่าจัดส่งทาง LINE
          </p>
        )}
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
