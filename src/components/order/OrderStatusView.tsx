'use client';

import { useEffect, useState } from 'react';
import { OrderStatusDetail } from '@/components/order/OrderStatusDetail';
import { lineEnquiryUrl } from '@/data/order';
import { fetchOrderStatus, statusErrorMessage, type OrderStatus } from '@/lib/order-status';
import { assetPath } from '@/lib/utils';

/**
 * 주문 상태 조회 화면 — 손님이 주문번호 + 전화번호 뒷 4자리로 확인한다.
 *
 * 🚨 주문번호는 TB-YYMM-NNN로 추측 가능하다 → 전화 뒷 4자리를 함께 받아 남의 주문이 열리지 않게 한다
 *    (대조는 서버가 한다. 실패는 "없는 주문"과 같은 응답이라 존재 여부가 새지 않는다).
 * 🚨 이 화면에는 이름·주소가 나오지 않는다. 서버가 애초에 돌려주지 않는다.
 */
export function OrderStatusView({ locale }: { locale: string }) {
  const [orderNo, setOrderNo] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // LINE 카드·결제 완료 화면에서 넘어오면 주문번호가 채워져 있다(정적 export라 브라우저에서 읽는다).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const no = params.get('no');
    if (no) setOrderNo(no);
  }, []);

  const canSubmit = !loading && orderNo.trim().length > 0 && phoneLast4.replace(/\D/g, '').length === 4;

  async function lookup() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    const result = await fetchOrderStatus({
      orderNo: orderNo.trim(),
      phoneLast4: phoneLast4.replace(/\D/g, ''),
    });
    setLoading(false);
    if (result.ok) setOrder(result.order);
    else setError(statusErrorMessage(result.reason));
  }

  const field = 'mt-2 w-full border border-brand-gold/30 bg-brand-black/40 px-4 py-3 text-sm text-brand-white placeholder:text-brand-gray focus:border-brand-gold focus:outline-none';

  return (
    <div className="min-h-screen bg-brand-black pb-16 pt-20">
      <section className="mx-auto max-w-[720px] px-4 md:px-6" lang="th">
        <h1 className="font-serif text-2xl text-brand-white">ตรวจสอบสถานะคำสั่งซื้อ</h1>

        <div className="mt-5 border border-brand-gold/25 bg-brand-card p-5 md:p-7">
          <div>
            <label className="text-xs text-brand-gray" htmlFor="status-order-no">เลขที่คำสั่งซื้อ</label>
            <input
              className={field}
              id="status-order-no"
              onChange={(event) => setOrderNo(event.target.value)}
              placeholder="TB-2608-001"
              value={orderNo}
            />
          </div>
          <div className="mt-4">
            <label className="text-xs text-brand-gray" htmlFor="status-phone">เบอร์โทรศัพท์ 4 ตัวท้าย</label>
            <input
              className={field}
              id="status-phone"
              inputMode="numeric"
              maxLength={4}
              onChange={(event) => setPhoneLast4(event.target.value)}
              placeholder="1234"
              value={phoneLast4}
            />
          </div>

          {error && <p aria-live="polite" className="mt-4 text-sm text-brand-champagne">{error}</p>}

          <button
            className="mt-5 flex min-h-12 w-full items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
            onClick={lookup}
            type="button"
          >
            {loading ? 'กำลังตรวจสอบ…' : 'ตรวจสอบ'}
          </button>
        </div>

        {order && (
          <div className="mt-5">
            <OrderStatusDetail order={order} />
          </div>
        )}

        {/* 🚨 여기에 "LINE 연결" 버튼을 두지 않는다(2026-08-04 코덱스 지적).
            이 화면의 자격은 전화 뒷 4자리 = 1만 가지뿐이라 대입으로 뚫린다. 조회(읽기)에는 감수할 만하지만
            알림 채널 연결(쓰기)에 쓰면 남의 배송 알림을 가로챌 수 있다.
            연결은 결제 성공 URL로만 나가는 1회용 토큰(`lt`) 경로 하나로 유지한다. */}

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <a
            className="flex min-h-12 items-center justify-center border border-brand-gold/40 px-4 py-3 text-sm text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
            href={lineEnquiryUrl()}
            rel="noopener noreferrer"
            target="_blank"
          >
            สอบถามทาง LINE
          </a>
          <a
            className="flex min-h-12 items-center justify-center border border-brand-gold/40 px-4 py-3 text-sm text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
            href={assetPath(`/${locale}/products`)}
          >
            เลือกสินค้า
          </a>
        </div>
      </section>
    </div>
  );
}
