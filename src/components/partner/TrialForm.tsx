'use client';

import { useEffect, useRef, useState } from 'react';
import { ORDER_API_BASE } from '@/data/order';
import { PARTNER_LIFF_ID, partnerIdTokenSilently, partnerLiffUrl } from '@/lib/liff-partner';

/**
 * 체험단 신청 폼 — 회차 페이지들이 공유한다. **회차마다 새로 만들지 않는다.**
 *
 * 🚨 마감 숫자(cap)를 여기서 넘기지 않는다. 서버 표(`_shared/trial.ts` ROUNDS)가 정한다 —
 *    클라이언트가 보낼 수 있으면 실링이 아니다. 여기는 회차 키만 보낸다.
 * 🚨 열림 여부를 화면에서 먼저 확인하지만 진짜 관문은 접수 시점의 서버 재확인이다.
 *    페이지를 열어둔 채 나중에 제출하면 화면 검사는 지나간다.
 *
 * 설계 정본 → `57 Shopee 유통/dealer-targets/05-체험단-캠페인-계획.md` §4-b·§9-a-1
 */

type Props = {
  /** 회차 키. 서버 ROUNDS 의 키와 같아야 한다(예: 'mist'). */
  round: string;
  /** 마감·오류 때 안내할 LINE 주소. */
  lineUrl: string;
};

type Phase = 'checking' | 'open' | 'closed' | 'sent' | 'already';

/**
 * 🚨 토큰 이름에 속지 말 것 — 이 사이트의 `brand-black` 은 **배경색**(#DFD9D1 라이트 / #0A0A0A 다크)이고
 *    글자색은 `brand-white`(#3A342E / #FFFFFF)다. `text-brand-black` 을 쓰면 두 테마 모두에서 글자가 사라진다.
 *    `bg-white` 도 쓰지 않는다 — 다크 테마에서 혼자 하얗게 뜬다. 카드 면은 `bg-brand-card`.
 */
const FIELD =
  'w-full rounded-lg border border-brand-dark bg-brand-card px-4 py-3 text-[15px] text-brand-white ' +
  'placeholder:text-brand-gold/55 focus:border-brand-gold focus:outline-none';
const LABEL = 'block text-[13px] font-medium text-brand-white';

/** LINE 로그인 왕복 중 입력값을 잠깐 보관한다(탭을 닫으면 지워진다). */
const DRAFT_KEY = 'trial:draft';
/** LINE 로그인에서 막 돌아왔다는 표시 — 폼까지 자동으로 내려준다. */
const RETURN_KEY = 'trial:returning';

/**
 * 🚨 구글맵 「공유」는 **링크만 주지 않는다** — 상호·설명이 같이 딸려온다.
 *    (`ร้าน XXX\nhttps://maps.app.goo.gl/...`) 그대로 `type="url"` 에 넣으면 거부돼
 *    원장 눈에는 "안 된다"로 보인다. 붙여넣은 덩어리에서 **첫 URL 만 골라낸다.**
 *    2026-08-28 실측: 에이(CFO)조차 복사·붙여넣기를 제대로 못 했다.
 */
export function extractUrl(raw: string): string {
  const m = raw.replace(/[\u200B-\u200D\uFEFF]/g, '').match(/https?:\/\/[^\s<>"']+/);
  return (m ? m[0] : raw).trim().replace(/[.,)]+$/, '');
}

/**
 * 🚨 LINE 을 연결해야 폼이 보인다 (2026-08-28 대표님 확정).
 *
 * 우리는 회차당 10~30곳만 받는다 — 지원자를 최대화할 이유가 없다.
 * 연결을 앞에 두면 ① userId 100% 확보(승인·배송·사용법·피드백이 전부 LINE 기반)
 * ② LINE 계정이 필요하니 장난·봇 신청이 사실상 사라진다 ③ 심사 부담이 준다.
 *
 * ⚠️ 대신 **PC 로 보는 원장**은 QR 로그인을 해야 해서 마찰이 크다 →
 *    아래에 `ติดต่อทาง LINE โดยตรง` 탈출구를 두고 그 사람은 수동 접수한다.
 *
 * 되돌리려면 이 값만 false 로 바꾼다(연결은 권장, 폼은 항상 노출).
 */
const REQUIRE_LINE = true;

export default function TrialForm({ round, lineUrl }: Props) {
  const [phase, setPhase] = useState<Phase>('checking');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [salon, setSalon] = useState('');
  const [maps, setMaps] = useState('');
  const [contact, setContact] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /** LINE 연결 — 있으면 저장, 없어도 신청은 받는다(막으면 신청 자체를 잃는다). */
  const [idToken, setIdToken] = useState<string | null>(null);
  /** LIFF 가 고장났거나 LINE 앱 안인데 토큰이 없다 → 잠그지 않는다(막다른 길 방지). */
  const [liffBroken, setLiffBroken] = useState(false);
  /** LIFF 주소는 현재 경로를 붙여 만든다 — 회차 페이지가 늘어도 그대로 쓰인다. */
  const [liffHref, setLiffHref] = useState<string | null>(null);

  // 열림 여부를 매번 실시간으로 본다 — 캐시하면 마감인데 열려 보이는 구간이 생긴다.
  // 조회가 실패하면 열어 둔다(fail-open). 접수 시점에 서버가 다시 막는다.
  useEffect(() => {
    let alive = true;
    if (!ORDER_API_BASE) { setPhase('open'); return; }
    fetch(`${ORDER_API_BASE}/trading-partner-status?round=${encodeURIComponent(round)}`)
      .then((r) => r.json())
      .then((b) => { if (alive) setPhase(b?.ok && b.open === false ? 'closed' : 'open'); })
      .catch(() => { if (alive) setPhase('open'); });
    return () => { alive = false; };
  }, [round]);

  /**
   * 🚨 LINE 로그인은 **페이지를 통째로 떠난다**(페이스북 인앱 브라우저에서 특히).
   *    연결 버튼을 맨 위에 둬서 보통은 잃을 게 없지만, 중간에 누르는 사람도 있다 → 입력값을 보존한다.
   */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Record<string, string>;
      setSalon(d.salon ?? ''); setMaps(d.maps ?? ''); setContact(d.contact ?? '');
      setPosition(d.position ?? ''); setPhone(d.phone ?? '');
    } catch { /* 없으면 그냥 빈 폼 */ }
  }, []);

  // 로그인하고 돌아왔으면 토큰이 이미 있다 — 버튼을 다시 누르게 하지 않는다.
  useEffect(() => {
    let alive = true;
    partnerIdTokenSilently().then(({ token, broken }) => {
      if (!alive) return;
      if (token) setIdToken(token);
      if (broken) setLiffBroken(true);
      // 🚨 LINE 로그인은 페이지를 새로 연다 → 맨 위로 돌아온다.
      //    원장이 폼까지 다시 스크롤해야 했다(2026-08-28 실측). 돌아온 경우에만 내려준다.
      let returning = false;
      try {
        returning = sessionStorage.getItem(RETURN_KEY) === '1';
        if (returning) sessionStorage.removeItem(RETURN_KEY);
      } catch { /* 없으면 안 내린다 */ }
      if (returning && (token || broken)) {
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      }
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    setLiffHref(partnerLiffUrl(window.location.pathname));
  }, []);

  /** LINE 앱으로 넘어가기 직전에 입력값을 남긴다(같은 브라우저로 돌아오는 경우를 위해). */
  function keepDraft() {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ salon, maps, contact, position, phone }));
      sessionStorage.setItem(RETURN_KEY, '1');
    } catch { /* 보존이 안 돼도 연결은 진행한다 */ }
  }

  const phoneDigits = phone.replace(/\D/g, '');
  const canSubmit =
    !submitting &&
    salon.trim().length > 0 &&
    maps.trim().length > 0 &&
    contact.trim().length > 0 &&
    position.trim().length > 0 &&
    phoneDigits.length >= 9 &&
    consent;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !ORDER_API_BASE) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${ORDER_API_BASE}/trading-partner-apply`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          round,
          salon: salon.trim(),
          maps: maps.trim(),
          contact: contact.trim(),
          position: position.trim(),
          phone: phone.trim(),
          consent,
          // 있으면 서버가 LINE 에 검증시켜 userId 를 얻는다. 없어도 접수는 된다.
          idToken,
          website: honeypot.current?.value ?? '',
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* 무시 */ }
        setPhase(body.alreadyApplied ? 'already' : 'sent');
        return;
      }
      if (body.error === 'full' || body.error === 'closed') { setPhase('closed'); return; }
      setError(
        body.error === 'bad_maps_url'
          ? 'กรุณาใส่ลิงก์ Google Maps ของร้านค่ะ'
          : body.error === 'bad_phone'
            ? 'กรุณาตรวจสอบเบอร์โทรอีกครั้งค่ะ'
            : body.error === 'missing_fields'
              ? 'กรุณากรอกข้อมูลให้ครบค่ะ'
              : 'ส่งไม่สำเร็จ กรุณาลองอีกครั้ง หรือทักมาทาง LINE ค่ะ',
      );
    } catch {
      setError('ส่งไม่สำเร็จ กรุณาลองอีกครั้ง หรือทักมาทาง LINE ค่ะ');
    } finally {
      // 실패했으면 다시 누를 수 있어야 한다.
      setSubmitting(false);
    }
  }

  if (phase === 'checking') {
    return <p className="text-center text-sm text-brand-gold">กำลังตรวจสอบ…</p>;
  }

  if (phase === 'closed') {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm leading-relaxed text-brand-white">
          ขณะนี้การรับสมัครทดลองใช้รอบนี้ปิดรับแล้วค่ะ
          <br />
          ขอบคุณทุกร้านที่ให้ความสนใจค่ะ
        </p>
        <a href={lineUrl} className="mt-7 inline-block text-[13px] text-brand-gold underline underline-offset-4">
          สอบถามเพิ่มเติมทาง LINE
        </a>
      </div>
    );
  }

  if (phase === 'sent' || phase === 'already') {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-base font-semibold text-brand-white">
          {phase === 'already' ? 'ร้านของคุณสมัครไว้แล้วค่ะ' : 'ได้รับใบสมัครแล้วค่ะ'}
        </p>
        {/* 🚨 기간·전화를 약속하지 않는다 — 10곳 선발이라 못 받는 매장이 생기고,
            LINE 이 연결돼 있으면 결과는 LINE 으로 간다(2026-08-28 대표님 지적). */}
        <p className="mt-4 text-sm leading-relaxed text-brand-gold">
          ทีมงานจะตรวจสอบข้อมูลร้าน
          <br />
          แล้วแจ้งผลทาง LINE ค่ะ
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className="mx-auto max-w-md space-y-5 text-left">
      {/* 봇 덫 — 사람에게는 보이지 않는다. 채워져 오면 서버가 조용히 버린다. */}
      <input
        ref={honeypot}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {/* 🚨 LINE 연결은 **폼 맨 위**에 둔다. 로그인은 페이지를 통째로 떠나므로,
          아직 아무것도 입력하지 않은 이 자리에서 눌러야 잃을 게 없다.
          🚫 필수로 막지 않는다 — 막으면 LINE 에 문제가 있는 원장의 신청 자체를 잃는다. */}
      {/* 연결 전이면 여기서 끝난다 — 아래 입력칸은 렌더하지 않는다. */}
      {liffHref && (
        <div className="rounded-xl bg-brand-card p-5">
          {idToken ? (
            <p className="text-[13px] font-medium text-brand-white">
              ✓ เชื่อมต่อ LINE เรียบร้อยแล้ว
            </p>
          ) : (
            <>
              <p className="text-[13px] leading-relaxed text-brand-white">
                เชื่อมต่อ LINE เพื่อรับแจ้งผลการสมัคร สถานะจัดส่ง
                <br />
                และวิธีใช้สำหรับช่าง
              </p>
              {/* 🚨 버튼이 아니라 **링크**다 — LIFF 주소를 열어야 LINE 앱으로 전환된다.
                  `liff.login()` 은 웹 로그인 화면으로 보내서 모바일에서 최악이다. */}
              <a
                href={liffHref}
                onClick={keepDraft}
                className="mt-4 block w-full rounded-full border border-brand-gold/45 px-6 py-3 text-center
                           text-[13px] font-semibold text-brand-white transition hover:opacity-80
                           active:scale-[0.98]"
              >
                เชื่อมต่อ LINE
              </a>
              <p className="mt-3 text-[12px] leading-relaxed text-brand-gold">
                {REQUIRE_LINE
                  ? 'เชื่อมต่อแล้วจะเห็นแบบฟอร์มสมัครค่ะ'
                  : 'ไม่เชื่อมต่อก็สมัครได้ แต่เราจะติดต่อกลับทางโทรศัพท์แทนค่ะ'}
              </p>

              {/* 연결이 안 되는 드문 경우(사내망 차단·구형 브라우저)의 탈출구.
                  🚫 "PC 는 불편하다"는 이유가 아니다 — PC 도 LINE 로그인은 정상이다. */}
              {REQUIRE_LINE && (
                <p className="mt-4 border-t border-brand-dark pt-4 text-[12px] leading-relaxed text-brand-gold">
                  เชื่อมต่อไม่ได้ใช่ไหมคะ{' '}
                  <a href={lineUrl} className="text-brand-white underline underline-offset-4">
                    ติดต่อทาง LINE โดยตรง
                  </a>{' '}
                  ได้เลยค่ะ
                </p>
              )}
            </>
          )}
        </div>
      )}

      {REQUIRE_LINE && liffHref && !idToken && !liffBroken ? null : (
      <>
      <div>
        <label className={LABEL} htmlFor="tf-salon">ชื่อร้าน</label>
        <input
          id="tf-salon" className={`${FIELD} mt-2`} value={salon} maxLength={100}
          onChange={(e) => setSalon(e.target.value)}
          placeholder="ชื่อตามหน้าร้าน" required
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="tf-maps">ลิงก์ Google Maps ของร้าน</label>
        <input
          id="tf-maps" className={`${FIELD} mt-2`} value={maps} type="text" inputMode="url" maxLength={500}
          // 🚫 type="url" 로 두면 상호가 딸려온 붙여넣기를 브라우저가 거부한다.
          onChange={(e) => setMaps(extractUrl(e.target.value))}
          placeholder="https://maps.app.goo.gl/…" required
        />
        <p className="mt-2 text-[12px] leading-relaxed text-brand-gold">
          เปิด Google Maps → ค้นหาร้านของคุณ → กด แชร์ → คัดลอกลิงก์
          <br />
          วางได้เลยค่ะ ถ้ามีชื่อร้านติดมาด้วย ระบบจะตัดให้เอง
          <br />
          เราใช้ที่อยู่จากลิงก์นี้ในการจัดส่ง จึงไม่ต้องพิมพ์ที่อยู่ค่ะ
        </p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={LABEL} htmlFor="tf-contact">ชื่อผู้ติดต่อ</label>
          <input
            id="tf-contact" className={`${FIELD} mt-2`} value={contact} maxLength={60}
            onChange={(e) => setContact(e.target.value)} required
          />
        </div>
        <div className="w-[38%]">
          <label className={LABEL} htmlFor="tf-position">ตำแหน่ง</label>
          <input
            id="tf-position" className={`${FIELD} mt-2`} value={position} maxLength={60}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="เจ้าของร้าน" required
          />
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="tf-phone">เบอร์โทรติดต่อ</label>
        <input
          id="tf-phone" className={`${FIELD} mt-2`} value={phone} type="tel" inputMode="tel" maxLength={30}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08X-XXX-XXXX" required
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-brand-gold"
        />
        <span className="text-[12px] leading-relaxed text-brand-gold">
          ยินยอมให้ 57 Total Beauty ใช้ข้อมูลนี้เพื่อติดต่อกลับและจัดส่งสินค้าตัวอย่างเท่านั้น
        </span>
      </label>

      {error && <p className="text-[13px] leading-relaxed text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-full bg-brand-gold px-9 py-3.5 text-sm font-semibold text-brand-black transition
                   hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? 'กำลังส่ง…' : 'ส่งใบสมัคร'}
      </button>
      </>
      )}
    </form>
  );
}
