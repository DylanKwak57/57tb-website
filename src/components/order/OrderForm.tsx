'use client';

import { useEffect, useRef, useState } from 'react';
import { lineEnquiryUrl, ORDER_API_BASE } from '@/data/order';
import { formatThaiAddress, ThaiAddressField } from '@/components/order/ThaiAddressField';
import { PRICE_BLOCKED_LABEL, PRICE_LOGIN_LABEL, SOLD_OUT_LABEL, usePrices } from '@/components/prices/PriceProvider';
import type { CartLine } from '@/lib/cart-lines';
import { payFailureMessage, rememberPayToken, startPayment } from '@/lib/checkout';
import { parsePastedThaiAddress } from '@/lib/thai-address-paste';

/**
 * 주문 접수 폼 — 손님 정보를 받아 Edge Function(`trading-order-create`)으로 보내고, 바로 Stripe 결제창으로 넘긴다.
 *
 * 🚨 금액을 보내지 않는다. slug·옵션·수량만 보내고 서버가 다시 계산한다(가격 조작 방지).
 * 🚨 **LIFF ID token을 함께 보낸다 (2026-08-12)** — 서버가 회원·태국 접속자만 받는다.
 *    비회원이면 제출 버튼 대신 LINE 로그인 버튼을, 해외·판매 중단이면 문의 안내를 보여 준다.
 * 🚨 이메일을 받지 않는다 — 영수증 발송용 이메일은 **Stripe 결제 화면이 직접 받는다**(2026-08-03).
 * 🚨 LINE 알림은 여기서 받지 않는다 — 주문 전에 LINE 로그인을 요구하면 이탈한다.
 *    결제 후 화면에서 연결한다(스키마도 line이면 userId 필수).
 * 🚨 접수 성공 후 결제창 열기가 실패해도 주문은 이미 만들어져 있다 → 재시도 화면(`OrderComplete`)으로 넘긴다.
 *    여기서 장바구니를 비우지 않는다(결제가 끝난 뒤 성공 화면에서 비운다).
 */

export type CreatedOrder = { orderNo: string; total: number; paymentToken?: string; payError?: string };

const MAX_NAME = 80;

export function OrderForm({
  lines,
  locale,
  onCreated,
  onProvinceChange,
  soldOut = [],
}: {
  lines: CartLine[];
  locale: string;
  onCreated: (order: CreatedOrder) => void;
  /**
   * 🚨 품절 항목 (2026-08-18). `trading-shipping-quote`가 **주문 직전 최신 재고**로 판정한 값이다.
   * 제품 페이지 배지는 앱 진입 시점 값이라 낡을 수 있어, 접수 바로 앞에서 한 번 더 잡는다.
   * 서버(`trading-order-create`)도 같은 검사를 하므로 이건 화면 안내용이다.
   */
  soldOut?: string[];
  /**
   * 🚚 고른 도(จังหวัด)를 위로 올린다 — 합계 블록이 배송비를 다시 받아야 하기 때문이다(2026-08-12).
   *    🚨 여기서 배송비를 계산하지 않는다. 폼과 합계가 서로 다른 금액을 들면 안 된다.
   */
  onProvinceChange?: (province: string | null) => void;
}) {
  const prices = usePrices();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  // 주소는 상세(번지·도로)와 지역(동·구·주·우편번호)을 따로 받는다 — 지역은 검색으로 고른다.
  // 🚨 상세를 한 칸으로 두지 않는다 (2026-08-29, 체험단 폼에서 이식) —
  //    한 칸이면 번지만 적고 결제한다(실측). 소이·도로가 없으면 기사가 못 찾는다.
  //    같은 구조의 원본 = `partner/TrialForm.tsx` (그쪽이 실기기 e2e 검증본이다. 고칠 땐 둘 다).
  const [houseNo, setHouseNo] = useState('');   // บ้านเลขที่ — 필수
  const [building, setBuilding] = useState(''); // หมู่บ้าน / อาคาร / ชั้น — 선택
  const [soi, setSoi] = useState('');           // ซอย ─┐ 둘 중 하나는 필수
  const [road, setRoad] = useState('');         // ถนน ─┘
  const [region, setRegion] = useState<{ district: string; amphoe: string; province: string; zipcode: number } | null>(null);
  /** 주소 통째로 붙여넣기 — 성공하면 위 칸들을 채운다. 실패는 조용히 넘기고 손입력으로 둔다. */
  const [pasted, setPasted] = useState('');
  const [pasteState, setPasteState] = useState<'idle' | 'working' | 'filled' | 'failed'>('idle');
  /** 마지막으로 분해한 원문 — 같은 문장을 재분해해 손수정을 덮어쓰지 않게 한다. */
  const parsedRef = useRef('');

  /** 태국 표기 순서로 조합: บ้านเลขที่ → หมู่บ้าน/อาคาร → ซอย → ถนน */
  const addressDetail = [
    houseNo.trim(),
    building.trim(),
    soi.trim() ? `ซอย${soi.trim().replace(/^ซอย\s*/, '')}` : '',
    road.trim() ? `ถนน${road.trim().replace(/^ถนน\s*/, '')}` : '',
  ].filter(Boolean).join(' ');

  // 붙여넣기 → 분해 → 칸 채움. 제출하지 않는다 — 손님이 눈으로 확인하는 게 마지막 관문이다.
  // 영어 주소는 분해되지 않는다(조용한 오답 방지, `thai-address-paste.ts` 참조).
  useEffect(() => {
    const text = pasted.trim();
    if (text.length < 10) { setPasteState('idle'); return; }
    if (parsedRef.current === text) return;
    let alive = true;
    setPasteState('working');
    const timer = setTimeout(async () => {
      const hit = await parsePastedThaiAddress(text);
      if (!alive) return;
      parsedRef.current = text;
      if (!hit) { setPasteState('failed'); return; }
      setHouseNo(hit.houseNo);
      setBuilding(hit.building);
      setSoi(hit.soi);
      setRoad(hit.road);
      setRegion(hit.region);
      onProvinceChange?.(hit.region.province);
      setPasteState('filled');
    }, 500);
    return () => { alive = false; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasted]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 제출 1회당 키 하나. 실패해 다시 누르면 같은 키가 가서 주문이 두 건 생기지 않는다.
  // 성공하면 다음 주문을 위해 새로 만든다.
  const idempotencyKey = useRef<string>('');
  if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();

  const ready = ORDER_API_BASE !== null;
  // 가격을 받은 상태에서만 접수한다 — 비회원·해외 접속은 서버가 어차피 403으로 막는다.
  const authed = prices.phase === 'ok';
  const showLogin = prices.phase === 'no_auth' && prices.canSignIn;
  const showEnquiry = prices.phase === 'blocked' || (prices.phase === 'no_auth' && !prices.canSignIn);
  const phoneDigits = phone.replace(/\D/g, '');
  const hasSoldOut = soldOut.length > 0;
  const canSubmit =
    ready && authed && !submitting && !hasSoldOut &&
    name.trim().length > 0 &&
    phoneDigits.length >= 9 &&
    houseNo.trim().length > 0 &&
    (soi.trim().length > 0 || road.trim().length > 0) &&
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
          idempotencyKey: idempotencyKey.current,
          // 회원·국가 확인용. 서버가 LINE에 검증을 맡긴다(브라우저가 userId를 직접 보내지 않는다).
          idToken: prices.idToken,
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
        // 결제 준비 전(503) · 같은 제출이 아직 처리 중(409) · 그 외 실패를 구분해 안내한다.
        setError(
          body.error === 'checkout_closed'
            ? 'ขณะนี้ยังไม่เปิดให้สั่งซื้อ กรุณาสอบถามทาง LINE'
            : body.error === 'order_in_progress'
              ? 'กำลังดำเนินการคำสั่งซื้อของคุณ กรุณารอสักครู่แล้วลองอีกครั้ง'
              // 회원 자격·접속 국가 문제(403)는 손님이 할 수 있는 게 로그인 또는 문의뿐이다.
              : body.error === 'auth_required'
                ? PRICE_LOGIN_LABEL
                : body.error === 'geo_blocked'
                  ? PRICE_BLOCKED_LABEL
                  : 'ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาลองใหม่หรือสอบถามทาง LINE',
        );
        return;
      }
      // 결제 토큰을 브라우저에 보관한다 — Stripe에서 취소하고 돌아오면 state가 사라져 있다.
      const paymentToken: string = body.paymentToken ?? '';
      if (paymentToken) rememberPayToken(body.orderNo, paymentToken);
      // 주문이 생겼다 → 곧바로 Stripe 결제창으로. 성공하면 이 페이지를 떠난다.
      const failure = await startPayment(body.orderNo, locale, paymentToken, prices.idToken);
      onCreated({
        orderNo: body.orderNo,
        total: body.total,
        paymentToken,
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

      <div className="mt-4">
        <label className="text-xs text-brand-gray">ที่อยู่จัดส่ง</label>

        {/* 붙여넣기 한 방 — 주소를 이미 폰에 갖고 있는 손님이 대부분이다. 칸마다 옮겨 적게 하지 않는다. */}
        <div className="mt-2 border border-dashed border-brand-gold/30 bg-brand-black/25 p-3">
          <p className="text-xs leading-relaxed text-brand-gray-light">
            มีที่อยู่อยู่แล้วใช่ไหมคะ วางทั้งก้อนตรงนี้ ระบบจะแยกช่องให้เองค่ะ
          </p>
          <textarea
            className={`${field} resize-none`}
            maxLength={400}
            onChange={(event) => setPasted(event.target.value)}
            placeholder="217/2-3 ถนนสุขุมวิท 21 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพมหานคร 10110"
            rows={3}
            value={pasted}
          />
          {pasteState === 'working' && (
            <p className="mt-2 text-xs text-brand-gray-light">กำลังแยกที่อยู่…</p>
          )}
          {pasteState === 'filled' && (
            <p className="mt-2 text-xs leading-relaxed text-brand-gold">
              แยกให้แล้วค่ะ รบกวนตรวจด้านล่างอีกครั้งนะคะ
            </p>
          )}
          {pasteState === 'failed' && (
            <p className="mt-2 text-xs leading-relaxed text-brand-gray-light">
              อ่านไม่ออกค่ะ กรอกทีละช่องด้านล่างได้เลยนะคะ (รองรับที่อยู่ภาษาไทยที่มีรหัสไปรษณีย์)
            </p>
          )}
        </div>

        {/* 🚨 가로 2칸 금지·고정 라벨 필수 — 자동으로 채워지는 칸은 "확인이 성립하는가"가 기준이다. */}
        <input
          className={field} value={houseNo} maxLength={40}
          onChange={(event) => setHouseNo(event.target.value)}
          placeholder="บ้านเลขที่ (เช่น 217/2-3)"
        />
        <input
          className={field} value={building} maxLength={80}
          onChange={(event) => setBuilding(event.target.value)}
          placeholder="หมู่บ้าน / อาคาร / ชั้น (ถ้ามี)"
        />
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 z-10 mt-1 -translate-y-1/2 text-sm text-brand-gray">ซอย</span>
          <input
            className={`${field} pl-[58px]`} value={soi} maxLength={60}
            onChange={(event) => setSoi(event.target.value)}
            placeholder="สุขุมวิท 21"
          />
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 z-10 mt-1 -translate-y-1/2 text-sm text-brand-gray">ถนน</span>
          <input
            className={`${field} pl-[58px]`} value={road} maxLength={60}
            onChange={(event) => setRoad(event.target.value)}
            placeholder="สุขุมวิท"
          />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-brand-gray-light">
          กรอก ซอย หรือ ถนน อย่างน้อยหนึ่งช่อง เพื่อให้ขนส่งหาที่อยู่เจอค่ะ
        </p>

        <div className="mt-3">
          <ThaiAddressField
            detail={addressDetail}
            fieldClass={field}
            hideDetail
            onDetailChange={() => {}}
            onSelect={(picked) => {
              setRegion(picked);
              onProvinceChange?.(picked?.province ?? null);
            }}
            selected={region}
          />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-brand-gray-light">
          พิมพ์ชื่อตำบล/แขวง หรือรหัสไปรษณีย์ 5 หลัก แล้วเลือกจากรายการค่ะ
        </p>
      </div>

      {/* 알림·영수증 안내. 이메일은 Stripe 화면이 받으므로 여기서 묻지 않는다. */}
      <div className="mt-6 border-t border-brand-gold/20 pt-5">
        <p className="text-xs leading-relaxed text-brand-gray-light">
          กดยืนยันแล้วระบบจะพาไปยังหน้าชำระเงิน
          <br />
          ใบเสร็จรับเงินจะส่งไปยังอีเมลที่กรอกในหน้าชำระเงิน
        </p>
      </div>

      {error && <p aria-live="polite" className="mt-5 text-sm text-brand-champagne">{error}</p>}

      {/* 🚨 로그인하지 않았거나 가격을 못 받은 상태에서는 제출 버튼을 두지 않는다 —
          눌러도 서버가 403으로 막고, 손님은 왜 막혔는지 알 수 없다. 할 수 있는 행동만 보여 준다. */}
      {showLogin ? (
        <button
          className="mt-6 flex min-h-12 w-full items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black"
          onClick={prices.signIn}
          type="button"
        >
          {PRICE_LOGIN_LABEL}
        </button>
      ) : showEnquiry ? (
        <a
          className="mt-6 flex min-h-12 w-full items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black"
          href={lineEnquiryUrl()}
          rel="noopener noreferrer"
          target="_blank"
        >
          {PRICE_BLOCKED_LABEL}
        </a>
      ) : (
        <button
          className="mt-6 flex min-h-12 w-full items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canSubmit}
          onClick={submit}
          type="button"
        >
          {submitting
            ? 'กำลังดำเนินการ…'
            : hasSoldOut
              ? SOLD_OUT_LABEL
              : ready
                ? 'ยืนยันและชำระเงิน'
                : 'ยังไม่เปิดให้สั่งซื้อ'}
        </button>
      )}
      {!ready && (
        <p className="mt-3 text-xs leading-relaxed text-brand-gray-light">
          ขณะนี้อยู่ระหว่างเตรียมระบบชำระเงิน หากต้องการสั่งซื้อ กรุณาสอบถามทาง LINE
        </p>
      )}
    </div>
  );
}
