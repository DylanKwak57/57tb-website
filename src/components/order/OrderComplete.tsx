'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { PromptPayQr } from '@/components/order/PromptPayQr';
import { BANK_TRANSFER, lineEnquiryUrl, PROMPTPAY_ID } from '@/data/order';
import { money } from '@/lib/cart-lines';
import { assetPath } from '@/lib/utils';
import type { CreatedOrder } from './OrderForm';

/**
 * 주문 완료 화면 — 주문번호 발급 후 결제 안내.
 *
 * 🚨 LINE 알림 연결은 여기서 한다(주문 전에 로그인을 요구하면 이탈한다).
 * 🚨 슬립 업로드는 아직 미구현 — SlipOK 연동 후 붙인다. 지금은 LINE으로 보내도록 안내한다.
 */
export function OrderComplete({ locale, order }: { locale: string; order: CreatedOrder }) {
  const { clear } = useCart();
  const [copied, setCopied] = useState<string | null>(null);

  // 주문이 접수된 뒤 장바구니를 비운다(같은 주문을 다시 보내지 않게).
  // 🚨 렌더 중에 부르면 다른 컴포넌트(CartProvider) 상태를 바꾸는 셈이라 effect에서 한 번만 실행한다.
  useEffect(() => {
    clear();
  }, [clear]);

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // 클립보드 권한이 없으면 손님이 직접 선택해 복사한다 — 조용히 넘어간다.
    }
  }

  const row = 'flex items-center justify-between gap-3 border-b border-brand-gold/15 py-3';
  const bank = BANK_TRANSFER;

  return (
    <div className="mx-auto max-w-[720px] px-4 md:px-6" lang="th">
      <div className="border border-brand-gold/30 bg-brand-card p-5 md:p-7">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">รับคำสั่งซื้อแล้ว</p>
        <p className="mt-2 font-serif text-3xl text-brand-white">{order.orderNo}</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-gray-light">
          กรุณาชำระเงินภายใน 24 ชั่วโมง แล้วส่งสลิปเพื่อยืนยัน
        </p>
        <p className="mt-4 font-serif text-2xl text-brand-gold">{money(order.total)}</p>
      </div>

      {PROMPTPAY_ID && <PromptPayQr amount={order.total} promptPayId={PROMPTPAY_ID} />}

      {/* 계좌이체 안내 — env가 채워진 경우에만. 폰 손님은 QR보다 이쪽이 편하다.
          `bank` 지역 상수로 좁혀 렌더한다(BANK_TRANSFER는 모듈 상수라 콜백 안에서 null 좁힘이 풀린다). */}
      {bank && (
        <div className="mt-5 border border-brand-gold/25 bg-brand-card p-5">
          <p className="text-sm font-medium text-brand-white">โอนเงินผ่านเลขบัญชี</p>
          <div className="mt-3">
            <div className={row}>
              <span className="text-xs text-brand-gray">ธนาคาร</span>
              <span className="text-sm text-brand-white">{bank.bank}</span>
            </div>
            {/* 표시는 하이픈 포함(읽기 쉽게), 복사는 숫자만 — 은행 앱이 하이픈을 거부한다. */}
            <div className={row}>
              <span className="text-xs text-brand-gray">เลขบัญชี</span>
              <button
                className="text-sm text-brand-gold underline underline-offset-4"
                onClick={() => copy('account', bank.accountNo.replace(/\D/g, ''))}
                type="button"
              >
                {bank.accountNo}
                <span className="ml-2 text-xs">{copied === 'account' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
            <div className={row}>
              <span className="text-xs text-brand-gray">ชื่อบัญชี</span>
              <span className="text-sm text-brand-white">{bank.accountName}</span>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-xs text-brand-gray">ยอดโอน</span>
              <button
                className="font-serif text-lg text-brand-gold underline underline-offset-4"
                onClick={() => copy('amount', String(order.total))}
                type="button"
              >
                {money(order.total)}
                <span className="ml-2 font-sans text-xs">{copied === 'amount' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-brand-gray-light">
            กรุณาโอนยอดให้ตรงตามจำนวน ระบบตรวจสอบสลิปด้วยยอดเงิน
          </p>
        </div>
      )}

      <div className="mt-5 border border-brand-gold/25 bg-brand-card p-5">
        <p className="text-sm font-medium text-brand-white">ส่งสลิปยืนยันการชำระเงิน</p>
        <p className="mt-2 text-xs leading-relaxed text-brand-gray-light">
          ส่งสลิปพร้อมเลขที่คำสั่งซื้อ {order.orderNo} ทาง LINE
          <br />
          กรุณาใช้สลิปต้นฉบับจากแอปธนาคาร (ต้องมี QR Code บนสลิป)
        </p>
        <a
          className="mt-4 flex min-h-12 items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black"
          href={lineEnquiryUrl()}
          rel="noopener noreferrer"
          target="_blank"
        >
          ส่งสลิปทาง LINE
        </a>
      </div>

      {/* TODO: LINE 로그인 연결 후 userId를 주문에 저장한다(trading-order-create 이후 별도 함수). */}
      <div className="mt-5 border border-brand-gold/25 bg-brand-card p-5">
        <p className="text-sm font-medium text-brand-white">รับแจ้งสถานะการจัดส่ง</p>
        <p className="mt-2 text-xs leading-relaxed text-brand-gray-light">
          กดรับแจ้งทาง LINE เพื่อรับข้อความเมื่อจัดส่ง พร้อมปุ่มตรวจสอบสถานะ
        </p>
        <button
          className="mt-4 flex min-h-12 w-full cursor-not-allowed items-center justify-center border border-brand-gold/40 px-4 py-3 text-sm font-bold text-brand-gold/50"
          disabled
          type="button"
        >
          เตรียมเปิดใช้งาน
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          className="flex min-h-12 flex-1 items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
          href={assetPath(`/${locale}/products`)}
        >
          เลือกสินค้าต่อ
        </a>
      </div>
    </div>
  );
}
