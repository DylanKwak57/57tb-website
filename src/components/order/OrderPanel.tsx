'use client';

import { useState } from 'react';
import { localize } from '@/data/products';
import { PAYMENT_METHODS, SHIPPING_FEE, type PaymentMethod } from '@/data/order';
import { money } from '@/lib/cart-lines';

/**
 * 결제수단·합계·QR 블록.
 *
 * 🚨 금액은 장바구니 전체 합계를 받아 표시만 한다 — 여기서 계산하지 않는다(정본 `src/lib/cart-lines.ts`).
 * 🚨 수량·옵션 변경은 장바구니 화면에서 한다. 결제 화면에서 금액이 흔들리면 QR과 어긋난다.
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
  const [method, setMethod] = useState<PaymentMethod>('transfer');

  return (
    <div className="border-y border-brand-gold/30 bg-brand-card px-5 py-6 md:px-8 md:py-8" lang="th">
      <fieldset className="border-b border-brand-gold/20 pb-5">
        <legend className="mb-3 text-sm font-medium text-brand-white">วิธีชำระเงิน</legend>
        <div className="grid gap-2">
          {PAYMENT_METHODS.map((option) => (
            <label
              className={`flex min-h-14 cursor-pointer items-start gap-3 border p-3 transition-colors ${
                method === option.id ? 'border-brand-gold bg-brand-dark/20' : 'border-brand-gold/25'
              }`}
              key={option.id}
            >
              <input
                checked={method === option.id}
                className="mt-1 h-5 w-5 shrink-0 accent-[#5C5248]"
                name="payment-method"
                onChange={() => setMethod(option.id)}
                type="radio"
                value={option.id}
              />
              <span>
                <span className="block text-sm font-medium text-brand-white">
                  {localize(option.label, locale)}
                  {!option.ready && <span className="ml-2 text-xs font-normal text-brand-champagne">เตรียมเปิดใช้งาน</span>}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-brand-gray-light">{localize(option.note, locale)}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-baseline justify-between gap-4 border-b border-brand-gold/20 py-5">
        <span className="text-sm text-brand-gray-light">จำนวนรายการ</span>
        <span className="text-sm text-brand-white">{itemCount}</span>
      </div>

      {/* 배송비는 주문 1건당 정액이다(정본 SHIPPING_FEE). 서버도 같은 값으로 합계를 다시 계산한다. */}
      <div className="flex items-baseline justify-between gap-4 border-b border-brand-gold/20 py-4">
        <span className="text-sm text-brand-gray-light">ค่าสินค้า</span>
        <span className="text-sm text-brand-white">{priced ? money(total) : '—'}</span>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-b border-brand-gold/20 py-4">
        <span className="text-sm text-brand-gray-light">ค่าจัดส่ง</span>
        <span className="text-sm text-brand-white">{money(SHIPPING_FEE)}</span>
      </div>

      <div className="flex items-baseline justify-between gap-4 py-5">
        <span className="text-sm font-medium text-brand-white">ยอดรวมทั้งหมด</span>
        <span className="font-serif text-2xl text-brand-gold">
          {priced ? money(total + SHIPPING_FEE) : 'กำลังอัปเดตราคา'}
        </span>
      </div>

      {/* 🚨 주문 버튼과 QR을 여기 두지 않는다.
          제출은 아래 `OrderForm`이 담당하고, QR은 주문번호가 발급된 뒤 `OrderComplete`에서만 보여준다 —
          주문번호 없이 입금하면 어느 주문의 입금인지 맞출 수 없다. */}
    </div>
  );
}
