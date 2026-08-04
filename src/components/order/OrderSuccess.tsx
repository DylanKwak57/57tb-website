'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { OrderStatusDetail } from '@/components/order/OrderStatusDetail';
import { lineEnquiryUrl, SELLER } from '@/data/order';
import { lineLinkUrl } from '@/lib/liff';
import { fetchOrderStatus, type OrderStatus } from '@/lib/order-status';
import { assetPath } from '@/lib/utils';

/**
 * 결제 완료 화면 — Stripe가 결제를 마친 손님을 여기로 돌려보낸다(`success_url`).
 *
 * 🚨 이 화면이 결제를 확정하지 않는다. 확정은 **웹훅**이 한다(브라우저는 조작될 수 있다).
 *    여기서는 서버에 저장된 상태를 조회해 보여주기만 한다.
 * 🚨 웹훅이 몇 초 늦을 수 있다 → `รอชำระเงิน`으로 보이면 몇 차례 다시 조회한다("결제했는데 왜 안 됐지" 방지).
 * 🚨 장바구니는 여기서 비운다(결제가 끝난 시점). 접수 화면에서 비우면 결제 못 한 손님이 담아둔 걸 잃는다.
 */

const RETRY_LIMIT = 5;
const RETRY_DELAY_MS = 3000;

export function OrderSuccess({ locale }: { locale: string }) {
  const { clear } = useCart();
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  // LINE 연결 전용 토큰. 결제 성공 URL로만 온다(세션 id를 LINE 쪽으로 넘기지 않기 위해서다).
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const attempts = useRef(0);

  // 정적 export라 서버에서 쿼리를 읽을 수 없다 → 브라우저에서 한 번 읽는다.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const no = params.get('no');
    setOrderNo(no);
    setSessionId(params.get('s'));
    setLinkToken(params.get('lt'));
    if (!no) setLoading(false);
    else clear();
  }, [clear]);

  useEffect(() => {
    if (!orderNo) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function load() {
      const result = await fetchOrderStatus({ orderNo: orderNo!, sessionId: sessionId ?? undefined });
      if (cancelled) return;
      setLoading(false);
      if (!result.ok) return;
      setOrder(result.order);
      // 웹훅이 아직 안 왔으면 잠시 뒤 다시 본다.
      if (result.order.status === 'pending_payment' && attempts.current < RETRY_LIMIT) {
        attempts.current += 1;
        timer = setTimeout(load, RETRY_DELAY_MS);
      }
    }

    load();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderNo, sessionId]);

  const confirmed = order !== null && order.status !== 'pending_payment' && order.status !== 'cancelled';
  // LINE 배송 알림 연결. 손님은 LINE 로그인만 하면 되고, 소유 확인은 `lt`(연결 토큰)가 한다.
  // LIFF ID나 토큰이 없으면 버튼 자체를 감춘다 — 깨진 링크를 손님에게 보이지 않는다.
  const lineLink = orderNo && linkToken ? lineLinkUrl({ orderNo, linkToken }) : null;

  return (
    <div className="min-h-screen bg-brand-black pb-16 pt-20">
      <section className="mx-auto max-w-[720px] px-4 md:px-6" lang="th">
        <div className="border border-brand-gold/30 bg-brand-card p-5 md:p-7">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">
            {!orderNo ? 'คำสั่งซื้อ' : confirmed ? 'ชำระเงินสำเร็จ' : 'ขอบคุณสำหรับการสั่งซื้อ'}
          </p>
          <p className="mt-2 font-serif text-3xl text-brand-white">{orderNo ?? '—'}</p>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray-light">
            {/* 주문번호 없이 이 주소로 직접 들어온 경우 — 결제 결과를 단정하지 않는다. */}
            {!orderNo ? (
              'กรุณาตรวจสอบสถานะจากหน้าตรวจสอบสถานะ โดยใช้เลขที่คำสั่งซื้อและเบอร์โทรศัพท์ 4 ตัวท้าย'
            ) : confirmed ? (
              <>
                เราได้รับการชำระเงินเรียบร้อยแล้ว
                <br />
                จัดส่งภายใน 2-3 วันทำการ และจะแจ้งเลขพัสดุให้ทราบ
              </>
            ) : (
              <>
                กำลังตรวจสอบการชำระเงิน อาจใช้เวลาสักครู่
                <br />
                หากสถานะยังไม่เปลี่ยน สามารถตรวจสอบอีกครั้งได้จากหน้าตรวจสอบสถานะ
              </>
            )}
          </p>
          {orderNo && (
            <p className="mt-4 text-xs text-brand-gray">
              ใบเสร็จรับเงินส่งไปยังอีเมลที่กรอกในหน้าชำระเงิน · จำหน่ายโดย {SELLER.name}
            </p>
          )}
        </div>

        {lineLink && (
          <div className="mt-5 border border-brand-gold/30 bg-brand-card p-5 md:p-7">
            <p className="text-sm font-medium text-brand-white">รับแจ้งเลขพัสดุทาง LINE</p>
            <p className="mt-2 text-sm leading-relaxed text-brand-gray-light">
              เชื่อมต่อบัญชี LINE ไว้ เมื่อจัดส่งแล้วเราจะแจ้งเลขพัสดุให้ทันที
            </p>
            <a
              className="mt-4 flex min-h-12 items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black transition-opacity hover:opacity-90"
              href={lineLink}
            >
              เชื่อมต่อ LINE
            </a>
          </div>
        )}

        {loading && <p className="mt-5 text-sm text-brand-gray" lang="th">กำลังโหลด…</p>}
        {order && (
          <div className="mt-5">
            <OrderStatusDetail order={order} />
          </div>
        )}

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <a
            className="flex min-h-12 items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
            href={assetPath(`/${locale}/order/status${orderNo ? `?no=${encodeURIComponent(orderNo)}` : ''}`)}
          >
            ตรวจสอบสถานะการจัดส่ง
          </a>
          <a
            className="flex min-h-12 items-center justify-center border border-brand-gold/40 px-4 py-3 text-sm text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
            href={lineEnquiryUrl()}
            rel="noopener noreferrer"
            target="_blank"
          >
            สอบถามทาง LINE
          </a>
        </div>

        <a
          className="mt-4 flex min-h-12 items-center justify-center text-sm text-brand-gray underline underline-offset-4 transition-colors hover:text-brand-gold"
          href={assetPath(`/${locale}/products`)}
        >
          เลือกสินค้าต่อ
        </a>
      </section>
    </div>
  );
}
