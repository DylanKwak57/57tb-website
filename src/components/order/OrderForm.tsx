'use client';

import { useState } from 'react';
import { ORDER_API_BASE } from '@/data/order';
import { formatThaiAddress, ThaiAddressField } from '@/components/order/ThaiAddressField';
import type { CartLine } from '@/lib/cart-lines';

/**
 * 주문 접수 폼 — 손님 정보를 받아 Edge Function(`trading-order-create`)으로 보낸다.
 *
 * 🚨 금액을 보내지 않는다. slug·옵션·수량만 보내고 서버가 다시 계산한다(가격 조작 방지).
 * 🚨 LINE 알림은 여기서 받지 않는다 — 주문 전에 LINE 로그인을 요구하면 이탈한다.
 *    주문 완료 화면에서 "LINE으로 알림 받기"로 연결한다(스키마도 line이면 userId 필수).
 */

export type CreatedOrder = { orderNo: string; total: number };

const MAX_NAME = 80;

export function OrderForm({
  lines,
  onCreated,
}: {
  lines: CartLine[];
  onCreated: (order: CreatedOrder) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  // 주소는 상세(번지·도로)와 지역(동·구·주·우편번호)을 따로 받는다 — 지역은 검색으로 고른다.
  const [addressDetail, setAddressDetail] = useState('');
  const [region, setRegion] = useState<{ district: string; amphoe: string; province: string; zipcode: number } | null>(null);
  const [wantsEmail, setWantsEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = ORDER_API_BASE !== null;
  const phoneDigits = phone.replace(/\D/g, '');
  const canSubmit =
    ready && !submitting &&
    name.trim().length > 0 &&
    phoneDigits.length >= 9 &&
    addressDetail.trim().length > 0 &&
    region !== null &&
    (!wantsEmail || /.+@.+\..+/.test(email.trim()));

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
          notifyChannel: wantsEmail ? 'email' : 'none',
          email: wantsEmail ? email.trim() : null,
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
      onCreated({ orderNo: body.orderNo, total: body.total });
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

      {/* 알림은 선택이다. 아무것도 고르지 않아도 주문번호로 상태를 볼 수 있다. */}
      <div className="mt-6 border-t border-brand-gold/20 pt-5">
        <p className="text-xs text-brand-gray">แจ้งสถานะการจัดส่ง (ไม่บังคับ)</p>
        <label className="mt-3 flex min-h-11 cursor-pointer items-start gap-3">
          <input
            checked={wantsEmail}
            className="mt-1 h-5 w-5 shrink-0 accent-[#5C5248]"
            onChange={(event) => setWantsEmail(event.target.checked)}
            type="checkbox"
          />
          <span className="text-sm text-brand-white">
            รับแจ้งทางอีเมล
            <span className="mt-1 block text-xs text-brand-gray-light">
              แจ้งครั้งเดียวเมื่อจัดส่ง พร้อมลิงก์ตรวจสอบสถานะ
            </span>
          </span>
        </label>
        {wantsEmail && (
          <input
            autoComplete="email"
            className={field}
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            type="email"
            value={email}
          />
        )}
        <p className="mt-3 text-xs leading-relaxed text-brand-gray-light">
          หลังสั่งซื้อสำเร็จ สามารถกดรับแจ้งทาง LINE ได้ในหน้าถัดไป
        </p>
      </div>

      {error && <p aria-live="polite" className="mt-5 text-sm text-brand-champagne">{error}</p>}

      <button
        className="mt-6 flex min-h-12 w-full items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canSubmit}
        onClick={submit}
        type="button"
      >
        {submitting ? 'กำลังดำเนินการ…' : ready ? 'ยืนยันคำสั่งซื้อ' : 'ยังไม่เปิดให้สั่งซื้อ'}
      </button>
      {!ready && (
        <p className="mt-3 text-xs leading-relaxed text-brand-gray-light">
          ขณะนี้อยู่ระหว่างเตรียมระบบชำระเงิน หากต้องการสั่งซื้อ กรุณาสอบถามทาง LINE
        </p>
      )}
    </div>
  );
}
