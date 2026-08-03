'use client';

import { useState } from 'react';
import { lineEnquiryUrl } from '@/data/order';
import { money } from '@/lib/cart-lines';
import { payFailureMessage, startPayment } from '@/lib/checkout';
import { assetPath } from '@/lib/utils';
import type { CreatedOrder } from './OrderForm';

/**
 * 주문은 접수됐지만 **결제가 아직 끝나지 않은** 상태의 화면.
 *
 * 정상 흐름에서는 이 화면이 보이지 않는다 — 접수 직후 Stripe 결제창으로 넘어가기 때문이다.
 * 결제창 열기가 실패했을 때만 여기로 떨어져 다시 시도한다.
 *
 * 🚨 장바구니를 비우지 않는다. 결제가 끝난 뒤 성공 화면(`/order/success`)에서 비운다 —
 *    여기서 비우면 결제를 못 한 손님이 담아둔 것까지 잃는다.
 * 🚨 "주문 완료"라고 쓰지 않는다. 결제 전이므로 손님이 끝난 줄 알면 안 된다.
 */
export function OrderComplete({ locale, order }: { locale: string; order: CreatedOrder }) {
  const [error, setError] = useState<string | null>(order.payError ?? null);
  const [retrying, setRetrying] = useState(false);

  async function retry() {
    if (retrying) return;
    setRetrying(true);
    setError(null);
    const failure = await startPayment(order.orderNo, locale);
    if (failure) setError(payFailureMessage(failure));
    setRetrying(false);
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 md:px-6" lang="th">
      <div className="border border-brand-gold/30 bg-brand-card p-5 md:p-7">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">รับคำสั่งซื้อแล้ว</p>
        <p className="mt-2 font-serif text-3xl text-brand-white">{order.orderNo}</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-gray-light">
          ยังไม่ได้ชำระเงิน กรุณากดปุ่มด้านล่างเพื่อชำระเงิน
          <br />
          คำสั่งซื้อจะยืนยันหลังชำระเงินสำเร็จ
        </p>
        <p className="mt-4 font-serif text-2xl text-brand-gold">{money(order.total)}</p>

        {error && <p aria-live="polite" className="mt-4 text-sm text-brand-champagne">{error}</p>}

        <button
          className="mt-5 flex min-h-12 w-full items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          disabled={retrying}
          onClick={retry}
          type="button"
        >
          {retrying ? 'กำลังดำเนินการ…' : 'ชำระเงิน'}
        </button>
      </div>

      <div className="mt-5 border border-brand-gold/25 bg-brand-card p-5">
        <p className="text-sm font-medium text-brand-white">ต้องการความช่วยเหลือ</p>
        <p className="mt-2 text-xs leading-relaxed text-brand-gray-light">
          หากชำระเงินไม่สำเร็จ กรุณาแจ้งเลขที่คำสั่งซื้อ {order.orderNo} ทาง LINE
        </p>
        <a
          className="mt-4 flex min-h-12 items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
          href={lineEnquiryUrl()}
          rel="noopener noreferrer"
          target="_blank"
        >
          สอบถามทาง LINE
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          className="flex min-h-12 flex-1 items-center justify-center border border-brand-gold/40 px-4 py-3 text-sm text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
          href={assetPath(`/${locale}/order/status?no=${encodeURIComponent(order.orderNo)}`)}
        >
          ตรวจสอบสถานะคำสั่งซื้อ
        </a>
      </div>
    </div>
  );
}
