'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ORDER_API_BASE } from '@/data/order';
import TrialForm, { type TrialInvite } from '@/components/partner/TrialForm';

/**
 * 체험단 직접 초대 화면 본문 — `/th/partner/invite?i=<코드>` (11/26).
 * 설계 정본 = `57 Shopee 유통/dealer-targets/25-체험단-직접초대-화면-전이표-2026-11-26.md` §3-c(우선) · §4
 *
 * 흐름: 코드 읽기(주소 → 없으면 이 탭에 남겨 둔 코드) → 서버 `trading-partner-status?round=mist&i=<코드>` →
 *   무효 = 안내 + 공개 화면 · 파트너 LINE / 이미 쓴 코드 = "확인 완료" / 유효 = 초대 문구 + 폼(LINE 먼저).
 * 🚨 선착순 · 심사 · 선정 문구를 쓰지 않는다(초대받은 매장이다).
 * 🚨 가격 · 공급가를 쓰지 않는다.
 */

/** 파트너 전용 OA `57TB Partner`(@347jyzxd). */
const PARTNER_LINE = 'https://line.me/R/ti/p/@347jyzxd';
/** LINE 왕복 뒤 주소에서 코드가 빠졌을 때 복구용(같은 탭에서만). */
const INVITE_KEY = 'trial:invite';
const CODE_RE = /^[A-Za-z0-9]{8,32}$/;
/** 초대 상태 조회 시간 제한 — 넘으면 일시 오류 화면(다시 시도 · LINE 문의 · 결함 5). */
const STATUS_TIMEOUT_MS = 10_000;

type View =
  | { kind: 'loading' }
  | { kind: 'invalid' }
  | { kind: 'used' }
  | { kind: 'closed' }
  | { kind: 'error' }
  | { kind: 'open'; invite: TrialInvite };

function readCode(): string {
  let code = '';
  try {
    code = (new URLSearchParams(window.location.search).get('i') ?? '').trim();
    if (CODE_RE.test(code)) sessionStorage.setItem(INVITE_KEY, code);
    else if (!code) code = (sessionStorage.getItem(INVITE_KEY) ?? '').trim();
  } catch { /* 못 읽으면 빈 코드 → 무효 안내 */ }
  return CODE_RE.test(code) ? code : '';
}

export default function InviteView() {
  const [view, setView] = useState<View>({ kind: 'loading' });
  /** 폼이 완료 화면으로 바뀌었는가 — 완료 화면에는 표지를 두지 않는다. */
  const [finished, setFinished] = useState(false);
  const onFinished = useCallback(() => setFinished(true), []);

  /** 다시 시도 단추가 올리는 값 — 바뀌면 조회를 처음부터 다시 한다(코드는 그대로). */
  const [attempt, setAttempt] = useState(0);

  // 🚨 11/26 결함 4 · 5: "무효 링크"는 서버가 `ok:true` + `inviteInvalid:true` 로 답한 때만.
  //    HTTP 오류 · JSON 실패 · 응답 모양 이상 · 네트워크 실패 · 10초 초과 = 일시 오류(코드 유지 · 다시 시도 + LINE 문의).
  //    공개 모집 화면으로 보내지 않는다.
  useEffect(() => {
    let alive = true;
    const code = readCode();
    if (!code) { setView({ kind: 'invalid' }); return; }
    if (!ORDER_API_BASE) { setView({ kind: 'error' }); return; }
    setView({ kind: 'loading' });
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), STATUS_TIMEOUT_MS);
    fetch(`${ORDER_API_BASE}/trading-partner-status?round=mist&i=${encodeURIComponent(code)}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`status ${r.status}`);
        return r.json();
      })
      .then((b) => {
        if (!alive) return;
        if (b?.ok === true && b.inviteInvalid === true) { setView({ kind: 'invalid' }); return; }
        if (b?.ok !== true || !b.invite || typeof b.invite !== 'object') { setView({ kind: 'error' }); return; }
        if (b.inviteUsed) { setView({ kind: 'used' }); return; }
        if (b.open === false) { setView({ kind: 'closed' }); return; }
        const s = (v: unknown) => (typeof v === 'string' ? v : '');
        setView({
          kind: 'open',
          invite: {
            code,
            salon: s(b.invite.salon),
            addressLine: s(b.invite.addressLine),
            subdistrict: s(b.invite.subdistrict),
            district: s(b.invite.district),
            province: s(b.invite.province),
            postcode: s(b.invite.postcode),
          },
        });
      })
      .catch(() => { if (alive) setView({ kind: 'error' }); })
      .finally(() => clearTimeout(timer));
    return () => { alive = false; clearTimeout(timer); ctrl.abort(); };
  }, [attempt]);

  if (view.kind === 'loading') {
    return <p className="pt-24 text-center text-sm text-brand-gold">กำลังตรวจสอบ…</p>;
  }

  if (view.kind === 'invalid') {
    return (
      <div className="mx-auto max-w-md px-6 pt-24 text-center">
        <p className="text-base font-semibold text-brand-white">ลิงก์ไม่ถูกต้องค่ะ</p>
        <div className="mt-8 flex flex-col items-center gap-4 text-[13px]">
          {/* 링크 이름 = 공개 화면 CTA 제목을 그대로 씀(새 문장 아님) */}
          <Link href="/th/partner/mist" className="text-brand-gold underline underline-offset-4">
            สนใจทดลองใช้ที่ร้าน
          </Link>
          <a href={PARTNER_LINE} className="text-brand-gold underline underline-offset-4">
            สอบถามเพิ่มเติมทาง LINE
          </a>
        </div>
      </div>
    );
  }

  if (view.kind === 'used') {
    return (
      <div className="mx-auto max-w-md px-6 pt-24 text-center">
        <p className="text-base font-semibold text-brand-white">ยืนยันที่อยู่เรียบร้อยแล้วค่ะ</p>
        <p className="mt-4 text-sm leading-relaxed text-brand-gold">จะแจ้งเลขพัสดุทาง LINE ค่ะ</p>
      </div>
    );
  }

  if (view.kind === 'error') {
    // 일시 오류 — 코드는 주소 · 이 탭에 그대로 · 다시 시도 = 같은 코드로 재조회.
    // 문구는 저장소에 이미 있는 것 그대로: 안내 = join-57 상담 화면 · 단추 = 주문 LINE 연결 · 링크 = 파트너 화면.
    return (
      <div className="mx-auto max-w-md px-6 pt-24 text-center">
        <p className="text-sm leading-relaxed text-brand-white">ขออภัยค่ะ ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้งนะคะ</p>
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          className="mt-7 inline-block rounded-full border border-brand-gold/45 px-8 py-3 text-[13px] font-semibold
                     text-brand-white transition hover:opacity-80 active:scale-[0.98]"
        >
          ลองอีกครั้ง
        </button>
        <div>
          <a href={PARTNER_LINE} className="mt-6 inline-block text-[13px] text-brand-gold underline underline-offset-4">
            สอบถามเพิ่มเติมทาง LINE
          </a>
        </div>
      </div>
    );
  }

  if (view.kind === 'closed') {
    return (
      <div className="mx-auto max-w-md px-6 pt-24 text-center">
        <p className="text-sm leading-relaxed text-brand-white">
          ขณะนี้การรับสมัครทดลองใช้รอบนี้ปิดรับแล้วค่ะ
        </p>
        <a href={PARTNER_LINE} className="mt-7 inline-block text-[13px] text-brand-gold underline underline-offset-4">
          สอบถามเพิ่มเติมทาง LINE
        </a>
      </div>
    );
  }

  const { invite } = view;
  return (
    <>
      {/* 표지(대표님 11/26 A안 · 모델 + 50ml 미스트 3병) — 유효한 초대 화면(연결 전 · 연결 뒤)에만 · 완료 화면 제외.
          첫 화면 그림이라 우선 로딩 · 비율 고정. */}
      {!finished && (
        <div className="mx-auto w-full max-w-[540px]">
          <Image
            src="/partner/invite/cover.webp"
            alt="Bellista Perfume Hair Mist 50 ml 3 กลิ่น"
            width={1080}
            height={1200}
            priority
            sizes="(max-width: 540px) 100vw, 540px"
            className="block h-auto w-full"
          />
        </div>
      )}
      <section className={`mx-auto max-w-md px-6 pb-8 text-center ${finished ? 'pt-14' : 'pt-7'}`}>
        <p className="text-[11px] font-medium tracking-[0.2em] text-brand-gold sm:text-xs">
          คำเชิญจาก 57 Total Beauty
        </p>
        <h1 className="mt-5 text-2xl font-semibold leading-snug">ถึงร้าน {invite.salon}</h1>
        <p className="mx-auto mt-5 text-sm leading-relaxed text-brand-white">
          ชุดทดลอง Perfume Hair Mist 50 ml ครบ 3 กลิ่น เตรียมไว้ให้ร้านคุณแล้วค่ะ
        </p>
        {/* 같은 탭으로 연다 — 뒤로 가기로 이 화면에 돌아온다(코드는 주소에 남아 있다). */}
        <Link
          href="/th/partner/brochure/mist"
          className="mt-5 inline-block text-[13px] text-brand-gold underline underline-offset-4"
        >
          ดูรายละเอียดสินค้า
        </Link>
      </section>

      <section className="border-t border-brand-dark px-6 pb-16 pt-10">
        <TrialForm round="mist" lineUrl={`${PARTNER_LINE}?openExternalBrowser=1`} invite={invite} onFinished={onFinished} />
      </section>
    </>
  );
}
