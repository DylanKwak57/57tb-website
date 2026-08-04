'use client';

import { useState } from 'react';
import { ORDER_API_BASE } from '@/data/order';
import { formatThaiAddress, ThaiAddressField } from '@/components/order/ThaiAddressField';
import type { CartLine } from '@/lib/cart-lines';
import { payFailureMessage, startPayment } from '@/lib/checkout';

/**
 * 주문 접수 폼 — 손님 정보를 받아 Edge Function(`trading-order-create`)으로 보내고, 바로 Stripe 결제창으로 넘긴다.
 *
 * 🚨 금액을 보내지 않는다. slug·옵션·수량만 보내고 서버가 다시 계산한다(가격 조작 방지).
 * 🚨 이메일을 받지 않는다 — 영수증 발송용 이메일은 **Stripe 결제 화면이 직접 받는다**(2026-08-03).
 * 🚨 LINE 알림은 여기서 받지 않는다 — 주문 전에 LINE 로그인을 요구하면 이탈한다.
 *    결제 후 화면에서 연결한다(스키마도 line이면 userId 필수).
 * 🚨 접수 성공 후 결제창 열기가 실패해도 주문은 이미 만들어져 있다 → 재시도 화면(`OrderComplete`)으로 넘긴다.
 *    여기서 장바구니를 비우지 않는다(결제가 끝난 뒤 성공 화면에서 비운다).
 */

export type CreatedOrder = { orderNo: string; total: number; payError?: string };

const MAX_NAME = 80;

export function OrderForm({
  lines,
  locale,
  onCreated,
}: {
  lines: CartLine[];
  locale: string;
  onCreated: (order: CreatedOrder) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  // 주소는 상세(번지·도로)와 지역(동·구·주·우편번호)을 따로 받는다 — 지역은 검색으로 고른다.
  const [addressDetail, setAddressDetail] = useState('');
  const [region, setRegion] = useState<{ district: string; amphoe: string; province: string; zipcode: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = ORDER_API_BASE !== null;
  const phoneDigits = phone.replace(/\D/g, '');
  const canSubmit =
    ready && !submitting &&
    name.trim().length > 0 &&
    phoneDigits.length >= 9 &&
    addressDetail.trim().length > 0 &&
    region !== null;

  async function submit() {
    if (!canSubmit || !ORDER_API_BASE) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${ORDER_API_BASE}/trading-order-create`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          // 태국 표준 표기로 조합해 보낸다(방콕 แขวง/เขต, 지방 ต./อ./จ.). 택배가 이 표기를 읽는다.
          shipAddress: region ? formatThaiAddress(addressDetail, region) : '',
          // 🆕 2026-08-04: 조합 문자열과 **별도로** 조각을 그대로 보낸다.
          //    조합본은 사람이 읽고 택배 라벨에 쓰는 용도이고, 조각은 기계가 쓴다 —
          //    ① 배송비 지역 판정(방콕·수도권 vs 지방) ② 택배사 시스템·API 입력(도·구·동·우편번호를 각각 요구)
          //    ③ 지역별 판매 분석. 조합 문자열을 나중에 다시 쪼개는 것은 태국 주소 특성상 깨지기 쉽다.
          //    필드명은 태국 행정구역 기준이다 — 라이브러리의 district=แขวง/ตำบล(동), amphoe=เขต/อำเภอ(구).
          shipAddressLine: addressDetail.trim(),
          shipSubdistrict: region?.district ?? '',
          shipDistrict: region?.amphoe ?? '',
          shipProvince: region?.province ?? '',
          shipPostcode: region ? String(region.zipcode) : '',
          notifyChannel: 'none',
          items: lines.map((line) => ({
            slug: line.slug,
            variantId: line.variantId,
            quantity: line.quantity,
            nameEn: line.nameEn,
            nameTh: line.nameTh,
          })),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        // 결제 준비 전(503)과 그 외 실패를 구분해 안내한다.
        setError(body.error === 'checkout_closed'
          ? 'ขณะนี้ยังไม่เปิดให้สั่งซื้อ กรุณาสอบถามทาง LINE'
          : 'ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาลองใหม่หรือสอบถามทาง LINE');
        return;
      }
      // 주문이 생겼다 → 곧바로 Stripe 결제창으로. 성공하면 이 페이지를 떠난다.
      const failure = await startPayment(body.orderNo, locale);
      onCreated({
        orderNo: body.orderNo,
        total: body.total,
        payError: failure ? payFailureMessage(failure) : undefined,
      });
    } catch {
      setError('การเชื่อมต่อขัดข้อง กรุณาลองใหม่');
    } finally {
      setSubmitting(false);
    }
  }

  const field = 'mt-2 w-full border border-brand-gold/30 bg-brand-black/40 px-4 py-3 text-sm text-brand-white placeholder:text-brand-gray focus:border-brand-gold focus:outline-none';

  return (
    <div className="border border-brand-gold/25 bg-brand-card p-5 md:p-7" lang="th">
      <h2 className="text-sm font-medium text-brand-white">ข้อมูลผู้สั่งซื้อ</h2>

      <div className="mt-5">
        <label className="text-xs text-brand-gray" htmlFor="order-name">ชื่อ-นามสกุล</label>
        <input
          autoComplete="name"
          className={field}
          id="order-name"
          maxLength={MAX_NAME}
          onChange={(event) => setName(event.target.value)}
          placeholder="ชื่อผู้รับสินค้า"
          value={name}
        />
      </div>

      <div className="mt-4">
        <label className="text-xs text-brand-gray" htmlFor="order-phone">เบอร์โทรศัพท์</label>
        <input
          autoComplete="tel"
          className={field}
          id="order-phone"
          inputMode="tel"
          maxLength={20}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="08X-XXX-XXXX"
          value={phone}
        />
      </div>

      <ThaiAddressField
        detail={addressDetail}
        fieldClass={field}
        onDetailChange={setAddressDetail}
        onSelect={setRegion}
        selected={region}
      />

      {/* 알림·영수증 안내. 이메일은 Stripe 화면이 받으므로 여기서 묻지 않는다. */}
      <div className="mt-6 border-t border-brand-gold/20 pt-5">
        <p className="text-xs leading-relaxed text-brand-gray-light">
          กดยืนยันแล้วระบบจะพาไปยังหน้าชำระเงิน
          <br />
          ใบเสร็จรับเงินจะส่งไปยังอีเมลที่กรอกในหน้าชำระเงิน
        </p>
      </div>

      {error && <p aria-live="polite" className="mt-5 text-sm text-brand-champagne">{error}</p>}

      <button
        className="mt-6 flex min-h-12 w-full items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canSubmit}
        onClick={submit}
        type="button"
      >
        {submitting ? 'กำลังดำเนินการ…' : ready ? 'ยืนยันและชำระเงิน' : 'ยังไม่เปิดให้สั่งซื้อ'}
      </button>
      {!ready && (
        <p className="mt-3 text-xs leading-relaxed text-brand-gray-light">
          ขณะนี้อยู่ระหว่างเตรียมระบบชำระเงิน หากต้องการสั่งซื้อ กรุณาสอบถามทาง LINE
        </p>
      )}
    </div>
  );
}
