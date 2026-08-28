'use client';

import { useEffect, useRef, useState } from 'react';
import { ORDER_API_BASE } from '@/data/order';
import { PARTNER_LIFF_ID, partnerIdTokenSilently, startPartnerLogin } from '@/lib/liff-partner';

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

  /** LINE 연결 — 있으면 저장, 없어도 신청은 받는다(막으면 신청 자체를 잃는다). */
  const [idToken, setIdToken] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);

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
    partnerIdTokenSilently().then((t) => { if (alive && t) setIdToken(t); });
    return () => { alive = false; };
  }, []);

  async function connectLine() {
    setLinking(true);
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ salon, maps, contact, position, phone }));
    } catch { /* 보존이 안 돼도 로그인은 진행한다 */ }
    try { await startPartnerLogin(); } catch { setLinking(false); }
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
        <p className="mt-4 text-sm leading-relaxed text-brand-gold">
          ทีมงานจะตรวจสอบและติดต่อกลับภายใน 2-3 วันทำการ
          <br />
          ตามเบอร์ที่แจ้งไว้ค่ะ
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-5 text-left">
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
      {PARTNER_LIFF_ID && (
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
              <button
                type="button"
                onClick={connectLine}
                disabled={linking}
                className="mt-4 w-full rounded-full border border-brand-gold/45 px-6 py-3 text-[13px]
                           font-semibold text-brand-white transition hover:opacity-80 active:scale-[0.98]
                           disabled:opacity-50"
              >
                {linking ? 'กำลังเปิด LINE…' : 'เชื่อมต่อ LINE'}
              </button>
              <p className="mt-3 text-[12px] leading-relaxed text-brand-gold">
                ไม่เชื่อมต่อก็สมัครได้ แต่เราจะติดต่อกลับทางโทรศัพท์แทนค่ะ
              </p>
            </>
          )}
        </div>
      )}

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
          id="tf-maps" className={`${FIELD} mt-2`} value={maps} type="url" inputMode="url" maxLength={500}
          onChange={(e) => setMaps(e.target.value)}
          placeholder="https://maps.app.goo.gl/…" required
        />
        <p className="mt-2 text-[12px] leading-relaxed text-brand-gold">
          เปิด Google Maps → ค้นหาร้านของคุณ → กด แชร์ → คัดลอกลิงก์
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
    </form>
  );
}
