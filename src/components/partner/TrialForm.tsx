'use client';

import { useEffect, useRef, useState } from 'react';
import { ORDER_API_BASE } from '@/data/order';
import { PARTNER_LIFF_ID, partnerIdTokenSilently, partnerLiffUrl, partnerIsFriend, startPartnerDesktopLogin } from '@/lib/liff-partner';
import { ThaiAddressField, formatThaiAddress } from '@/components/order/ThaiAddressField';
import { parsePastedThaiAddress } from '@/lib/thai-address-paste';

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

/**
 * 🚨 구글맵 링크 입력을 **폐기하고 주소 드롭다운으로 바꿨다** (2026-08-28 대표님).
 *    실측: 에이(CFO)조차 허둥댔다 — 폼 → 구글맵 앱 → 검색 → 공유 → 복사 → 폼 복귀 → 붙여넣기.
 *    원장이 그걸 6단계 해낼 이유가 없다.
 *    ⇒ `ThaiAddressField`(주문 폼에서 손님이 쓰는 것, 무료·API 키 불필요)를 그대로 재사용한다.
 *
 * 🔍 가짜 방어(§4-c 2층)는 유지된다 — 링크 대신 **우리가 상호+주소로 구글맵을 검색해 대조**한다.
 *    찾는 일이 원장에서 우리로 옮겨갈 뿐이고, 심사할 때 어차피 여는 창이다.
 *    결정타는 4층(구글맵 공개 번호로 전화)이고 그건 그대로다.
 * 🎁 덤: 주소를 조각으로 받으니 **Flash Smart Input 3줄이 바로 완성**된다 — 옮겨 적는 단계가 사라졌다.
 */
type AddressHit = { district: string; amphoe: string; province: string; zipcode: number };

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
  // 🚨 한 칸으로 두면 번지만 적고 끝낸다(2026-08-28 실측: 검수자가 번지 하나만 입력 → 배송 불가).
  //    태국 주소는 **소이 또는 도로**가 없으면 기사가 못 찾는다 → 칸을 쪼개 순차로 받는다.
  const [houseNo, setHouseNo] = useState('');   // บ้านเลขที่ — 필수
  const [building, setBuilding] = useState(''); // หมู่บ้าน / อาคาร / ชั้น — 선택
  const [soi, setSoi] = useState('');           // ซอย ─┐ 둘 중 하나는 필수
  const [road, setRoad] = useState('');         // ถนน ─┘
  const [region, setRegion] = useState<AddressHit | null>(null);
  /** 주소 통째로 붙여넣기 — 성공하면 위 칸들을 채운다. 실패는 조용히 넘기고 손입력으로 둔다. */
  const [pasted, setPasted] = useState('');
  const [pasteState, setPasteState] = useState<'idle' | 'working' | 'filled' | 'failed'>('idle');
  const [contact, setContact] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  /** 마지막으로 분해한 붙여넣기 원문 — 같은 문장을 재분해해 손수정을 덮어쓰지 않게 한다. */
  const parsedRef = useRef('');
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /** LINE 연결 — 있으면 저장, 없어도 신청은 받는다(막으면 신청 자체를 잃는다). */
  const [idToken, setIdToken] = useState<string | null>(null);
  /** LIFF 가 고장났거나 LINE 앱 안인데 토큰이 없다 → 잠그지 않는다(막다른 길 방지). */
  const [liffBroken, setLiffBroken] = useState(false);
  /** 친구가 아니면 접수 카드가 도달하지 않는다 → 폼 안에서 해결하게 한다. */
  const [needFriend, setNeedFriend] = useState(false);
  /** LIFF 주소는 현재 경로를 붙여 만든다 — 회차 페이지가 늘어도 그대로 쓰인다. */
  const [liffHref, setLiffHref] = useState<string | null>(null);
  /** 모바일 = LINE 앱 전환 / PC = 웹 로그인. 판별 전(null)에는 기본 링크로 동작한다. */
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

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
      setSalon(d.salon ?? ''); setContact(d.contact ?? '');
      setHouseNo(d.houseNo ?? ''); setBuilding(d.building ?? ''); setSoi(d.soi ?? ''); setRoad(d.road ?? '');
      setPosition(d.position ?? ''); setPhone(d.phone ?? '');
    } catch { /* 없으면 그냥 빈 폼 */ }
  }, []);

  // 로그인하고 돌아왔으면 토큰이 이미 있다 — 버튼을 다시 누르게 하지 않는다.
  useEffect(() => {
    let alive = true;
    partnerIdTokenSilently().then(({ token, broken }) => {
      if (!alive) return;
      if (token) {
        setIdToken(token);
        partnerIsFriend().then((ok: boolean | null) => { if (alive && ok === false) setNeedFriend(true); });
      }
      if (broken) setLiffBroken(true);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    // 🚨 복귀 신호를 **URL 에 싣는다**(아래 자동 스크롤 참조). sessionStorage 로는 못 잡는다.
    setLiffHref(partnerLiffUrl(`${window.location.pathname}?apply=1`));
    // 🖥️ PC 는 앱 전환이 성립하지 않아 웹 로그인으로 갈아탄다(liff-partner.ts 주석 참조).
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  /**
   * LINE 연결에서 돌아오면 **폼까지 자동으로 내려준다.**
   *
   * 🚨 신호를 URL(`?apply=1`)에 싣는다 — sessionStorage 로는 구조적으로 못 잡는다(2026-08-28 재발).
   *    ① LINE 앱은 페이지를 **새 컨텍스트**로 연다 → 버튼 클릭 때 심은 값이 넘어오지 않는다.
   *    ② LINE 이 회차 페이지로 **바로** 열어 주면 `PartnerLiffReturn` 은 이동할 게 없어
   *       `back === pathname` 으로 일찍 빠져나가고, 표시를 심는 줄에 **도달조차 못 한다.**
   *       ⇒ 그래서 "고쳤다는데 여전히 맨 위" 였다.
   *    URL 은 컨텍스트가 바뀌어도, 리다이렉트가 없어도 따라온다.
   *
   * 🚨 폼이 그려진 뒤에 스크롤해야 한다 → `phase`·`idToken` 이 정해질 때마다 다시 시도한다.
   */
  const [wantScroll, setWantScroll] = useState(false);
  useEffect(() => {
    try {
      setWantScroll(new URLSearchParams(window.location.search).get('apply') === '1');
    } catch { /* 못 읽으면 그냥 안 내린다 */ }
  }, []);
  useEffect(() => {
    if (!wantScroll || phase !== 'open') return;
    const timer = setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
    return () => clearTimeout(timer);
  }, [wantScroll, phase, idToken, liffBroken]);

  /** LINE 앱으로 넘어가기 직전에 입력값을 남긴다(같은 브라우저로 돌아오는 경우를 위해). */
  function keepDraft() {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ salon, houseNo, building, soi, road, contact, position, phone }));
    } catch { /* 보존이 안 돼도 연결은 진행한다 */ }
  }

  /**
   * 붙여넣은 주소를 분해해 아래 칸들을 채운다.
   * 🚨 **채워 넣기만 하고 제출하지 않는다** — 원장이 눈으로 확인·수정하는 것이 마지막 관문이다.
   * 🚨 실패해도 막지 않는다. 영어 주소는 애초에 분해되지 않는다(조용한 오답 방지, `thai-address-paste.ts` 참조).
   */
  useEffect(() => {
    const text = pasted.trim();
    if (text.length < 10) { setPasteState('idle'); return; }
    // 같은 문장을 다시 분해하지 않는다 — 원장이 아래 칸을 손으로 고친 걸 덮어쓰면 안 된다.
    if (parsedRef.current === text) return;

    let alive = true;
    setPasteState('working');
    // 타이핑 중에는 조각난 문장이라 계속 실패한다 → 손을 멈춘 뒤에만 시도한다.
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
      setPasteState('filled');
    }, 500);
    return () => { alive = false; clearTimeout(timer); };
  }, [pasted]);

  /** 태국 표기 순서로 조합한다: บ้านเลขที่ → หมู่บ้าน/อาคาร → ซอย → ถนน */
  const addrDetail = [
    houseNo.trim(),
    building.trim(),
    soi.trim() ? `ซอย${soi.trim().replace(/^ซอย\s*/, '')}` : '',
    road.trim() ? `ถนน${road.trim().replace(/^ถนน\s*/, '')}` : '',
  ].filter(Boolean).join(' ');

  const phoneDigits = phone.replace(/\D/g, '');
  const canSubmit =
    !submitting &&
    salon.trim().length > 0 &&
    houseNo.trim().length > 0 &&
    (soi.trim().length > 0 || road.trim().length > 0) &&
    region !== null &&
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
          // 조합본은 사람이 읽고 택배 라벨에 쓰고, 조각은 기계가 쓴다(주문 폼과 같은 규칙).
          address: region ? formatThaiAddress(addrDetail, region) : '',
          addressLine: addrDetail.trim(),
          subdistrict: region?.district ?? '',
          district: region?.amphoe ?? '',
          province: region?.province ?? '',
          postcode: region ? String(region.zipcode) : '',
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
        body.error === 'bad_address'
          ? 'กรุณาเลือกตำบล/แขวง จากรายการค่ะ'
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
              {/* 🚨 모바일은 버튼이 아니라 **링크**다 — LIFF 주소를 열어야 LINE 앱으로 전환된다.
                  🖥️ PC 는 그 주소가 로그인 없이 그냥 되돌아온다(2026-08-29 실측) → 웹 로그인을 연다. */}
              <a
                href={liffHref}
                onClick={(e) => {
                  keepDraft();
                  if (isMobile === false) {
                    e.preventDefault();
                    void startPartnerDesktopLogin(`${window.location.pathname}?apply=1`)
                      .catch(() => { window.location.href = liffHref; }); // 실패 시 원래 링크로
                  }
                }}
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
        <label className={LABEL}>ที่อยู่ร้าน</label>

        {/*
          붙여넣기 한 방 — 원장은 주소를 이미 폰에 갖고 있다. 칸마다 옮겨 적게 하지 않는다.
          🚨 채워 넣기만 하고 제출은 안 한다. 영어 주소는 분해되지 않는다(조용한 오답 방지).
        */}
        <div className="mt-2 rounded-lg border border-dashed border-brand-gold/45 bg-brand-black/25 p-3">
          <p className="text-[12px] leading-relaxed text-brand-gold">
            มีที่อยู่ร้านอยู่แล้วใช่ไหมคะ
            <br />
            วางทั้งก้อนตรงนี้ ระบบจะแยกช่องให้เองค่ะ
          </p>
          <textarea
            className={`${FIELD} mt-2 resize-none`}
            maxLength={400}
            onChange={(e) => setPasted(e.target.value)}
            placeholder="217/2-3 ถนนสุขุมวิท 21 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพมหานคร 10110"
            rows={3}
            value={pasted}
          />
          {pasteState === 'working' && (
            <p className="mt-2 text-[12px] text-brand-gray-light">กำลังแยกที่อยู่…</p>
          )}
          {pasteState === 'filled' && (
            <p className="mt-2 text-[12px] leading-relaxed text-brand-gold">
              แยกให้แล้วค่ะ รบกวนตรวจด้านล่างอีกครั้งนะคะ
            </p>
          )}
          {pasteState === 'failed' && (
            <p className="mt-2 text-[12px] leading-relaxed text-brand-gray-light">
              อ่านไม่ออกค่ะ กรอกทีละช่องด้านล่างได้เลยนะคะ
              <br />
              (รองรับที่อยู่ภาษาไทยที่มีรหัสไปรษณีย์)
            </p>
          )}
        </div>

        {/* 🚨 칸을 쪼갠다 — 한 칸이면 번지만 적고 끝낸다. 소이·도로가 없으면 기사가 못 찾는다. */}
        <input
          className={`${FIELD} mt-2`} value={houseNo} maxLength={40}
          onChange={(e) => setHouseNo(e.target.value)}
          placeholder="บ้านเลขที่ (เช่น 217/2-3)" required
        />
        <input
          className={`${FIELD} mt-2`} value={building} maxLength={80}
          onChange={(e) => setBuilding(e.target.value)}
          placeholder="หมู่บ้าน / อาคาร / ชั้น (ถ้ามี)"
        />
        {/*
          🚨 ซอย·ถนน 을 가로 2칸으로 두지 않는다 (2026-08-28 실렌더에서 잡음).
             방콕 소이명은 길다 — `ซอย… ซอย…` 형태가 절반 폭에서 잘려 안 보인다.
             붙여넣기로 자동 채운 값을 **원장이 눈으로 확인**해야 하는데, 안 보이면 확인이 성립하지 않는다.
        */}
        {/*
          🚨 라벨을 placeholder 로만 두지 않는다 — 값이 채워지는 순간 사라져
             "이 칸이 ซอย 인지 ถนน 인지" 를 알 수 없다. 붙여넣기로 자동으로 채워지는 칸이라 더 그렇다.
             ⇒ 칸 왼쪽에 **항상 보이는 고정 라벨**을 붙인다(태국 폼 관례).
        */}
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-brand-gold">ซอย</span>
          <input
            className={`${FIELD} pl-[58px]`} value={soi} maxLength={60}
            onChange={(e) => setSoi(e.target.value)}
            placeholder="สุขุมวิท 21"
          />
        </div>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-brand-gold">ถนน</span>
          <input
            className={`${FIELD} pl-[58px]`} value={road} maxLength={60}
            onChange={(e) => setRoad(e.target.value)}
            placeholder="สุขุมวิท"
          />
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-brand-gold">
          กรอก ซอย หรือ ถนน อย่างน้อยหนึ่งช่อง เพื่อให้ขนส่งหาร้านเจอค่ะ
        </p>

        <div className="mt-3">
          <ThaiAddressField
            detail={addrDetail}
            onDetailChange={() => {}}
            selected={region}
            onSelect={setRegion}
            fieldClass={FIELD}
            hideDetail
          />
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-brand-gold">
          พิมพ์ชื่อตำบล/แขวง หรือรหัสไปรษณีย์ แล้วเลือกจากรายการค่ะ
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

      {/* 🚨 로그인은 됐는데 친구가 아닌 예외 — 여기서 바로 해결한다. 따로 링크를 보내지 않는다. */}
      {needFriend && (
        <div className="rounded-xl bg-brand-card p-5">
          <p className="text-[13px] leading-relaxed text-brand-white">
            อีกขั้นเดียวค่ะ — เพิ่มเพื่อน 57TB Partner
            <br />
            <span className="text-brand-gold">เพื่อรับแจ้งผลการสมัครและสถานะจัดส่ง</span>
          </p>
          <a
            href="https://line.me/R/ti/p/@347jyzxd"
            className="mt-4 block w-full rounded-full border border-brand-gold/45 px-6 py-3 text-center
                       text-[13px] font-semibold text-brand-white transition hover:opacity-80 active:scale-[0.98]"
          >
            เพิ่มเพื่อน
          </a>
        </div>
      )}

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
