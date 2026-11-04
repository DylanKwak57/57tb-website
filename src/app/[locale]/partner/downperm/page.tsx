/**
 * 다운펌 체험단 모집 랜딩 — 3회차 · Keratin Down Perm · 태국어 전용 · unlisted (2026-11-04)
 *
 * 기획 정본: ~/Projects/57TB/57 CEO/57 Shopee 유통/dealer-targets/05-체험단-캠페인-계획.md
 * 틀 = `/partner/scalp`(2회차)를 그대로 따랐다.
 *
 * ✅ 확정 (2026-11-04 대표님)
 *    ① 모집 = 화면 "5곳" 표시 · 접수 10곳에서 마감(서버 `_shared/trial.ts` ROUNDS.downperm cap)
 *    ② 키트 = 케라틴 다운펌 500ml **파우치** 1개
 *    ③ 신청서 = 미스트·두피와 같은 틀 + 선택 문항 2개(시술 메뉴 유무 · 월 건수) → 보드 `หมายเหตุ` 칸
 *    ④ 지금은 **닫힌 채로** 둔다 — 주소로 들어와도 "곧 열립니다"만 보이고 신청 폼은 열리지 않는다.
 *
 * 🔓 여는 법 = 아래 STAGE 를 'open' 으로 + 서버 ROUNDS.downperm.open = true + 둘 다 배포.
 *    서버가 닫혀 있으면 화면을 열어도 폼이 "마감" 으로 바뀌고 접수는 403 으로 거부된다.
 *
 * 문구: 제품 설명·사용법·주의사항 = 다운펌 상세페이지 대조표(에이님 검수 통과,
 *       `Scalp Care Business/상세페이지-태국어-작업파일/downperm-pilot/copy-ko-th.md`) 그대로.
 *       절차·폼·회사 줄 = 두피 페이지와 같음. 신규 문구(준비 중 안내·선택 문항 등) → 에이님 검수 묶음.
 * 🚫 가격·공급가·직접 주문 권유를 쓰지 않는다(파트너 레이아웃 규칙).
 */
import Image from 'next/image';
import Link from 'next/link';
import TrialForm, { type TrialQuestion } from '@/components/partner/TrialForm';

/**
 * 모집 단계. 'soon' = 준비 중(지금) · 'open' = 모집 중 · 'ended' = 마감.
 * soon 에서도 제품·키트·사용법은 보여 준다 — 원장이 "무엇이 올지" 미리 보고 기다릴 수 있게.
 */
type Stage = 'soon' | 'open' | 'ended';
// `as Stage` = 값을 바꿔도 아래 비교들이 타입 오류 없이 그대로 돌게 한다.
const STAGE = 'soon' as Stage;
const IS_OPEN = STAGE === 'open';

/** 파트너 전용 OA `57TB Partner`(@347jyzxd) */
const LINE_URL = 'https://line.me/R/ti/p/@347jyzxd?openExternalBrowser=1';

const SLUG = 'bellista-keratin-down-perm';

/** 핵심 3가지 — 상세페이지 01 메인컷 문구 그대로 */
const POINTS = ['แค่ 10 นาที|ก็เสร็จ', 'สารสกัดสมุนไพร| 8 ชนิด', 'ลดความเสียหาย|ของเส้นผม'];

/** 사용법 — 상세페이지 07 STEP 1–4 문구 그대로(`|` = 줄바꿈 자리) */
const HOW_TO = [
  { n: '1', lines: ['สระผมให้สะอาดก่อนใช้', 'แล้วเช็ดด้วยผ้าขนหนู| ให้แห้ง ไม่มีน้ำเหลืออยู่'] },
  { n: '2', lines: ['ขณะผมแห้ง ไม่มีน้ำ', 'ทาในปริมาณพอเหมาะ| ให้ทั่วตามทิศทางของเส้นผม'] },
  { n: '3', lines: ['แปะกระดาษดัดผม|บริเวณที่ทาน้ำยา', 'ทิ้งไว้ประมาณ 10–15 นาที| ตามสภาพเส้นผม'] },
  { n: '4', lines: ['ล้างออกด้วยแชมพูให้สะอาด', 'ไม่ให้ตกค้าง|บนเส้นผมและหนังศีรษะ', 'แล้วเป่าผม|ตามทิศทางของเส้นผม'] },
];

/** 주의사항 요점 — 상세페이지 00·08 문구 그대로(수치·부위 보존) */
const NOTICE = [
  { head: 'Side Down Perm สูตรเข้มข้น', body: ['ใช้เฉพาะผมด้านข้างและด้านหลังค่ะ', 'ห้ามใช้กับผมด้านหน้า (หน้าม้า) และบริเวณอื่น'] },
  { head: 'ก่อนใช้ โปรดทำ Patch Test', body: ['(ทดสอบการแพ้) ทุกครั้งนะคะ'] },
  {
    head: 'โปรดปฏิบัติตามเวลาทิ้งไว้ที่กำหนด 10–15 นาทีอย่างเคร่งครัดค่ะ',
    body: ['* หากทิ้งไว้เกิน 15 นาที ผมอาจอ่อนตัวมากเกินไป', 'จนเกิดความเสี่ยง เช่น ผมขาด เป็นต้นค่ะ'],
  },
];

/** 신청 절차 — 미스트·두피 페이지와 같은 문구 */
const STEPS = [
  { n: '1', head: 'เชื่อมต่อ LINE', body: 'แล้วกรอกชื่อร้าน ลิงก์ Google Maps และผู้ติดต่อ' },
  { n: '2', head: 'ยืนยันร้าน', body: 'ทีมงานตรวจสอบและติดต่อกลับทาง LINE' },
  { n: '3', head: 'ทดลองใช้', body: 'ส่งสินค้าตัวอย่างให้ทดลองที่ร้าน' },
];

/**
 * 다운펌 회차 전용 선택 문항(선별용 · 답하지 않아도 제출된다).
 * 🚨 key·value 는 서버 `_shared/trial.ts` ROUNDS.downperm.questions 와 같아야 한다.
 */
const QUESTIONS: TrialQuestion[] = [
  {
    key: 'menu',
    label: 'ร้านมีเมนูดาวน์เพิร์มอยู่แล้วไหมคะ',
    options: [
      { value: 'yes', label: 'มีแล้ว' },
      { value: 'no', label: 'ยังไม่มี / กำลังเตรียม' },
    ],
  },
  {
    key: 'monthly',
    label: 'ทำดาวน์เพิร์มเดือนละประมาณกี่ครั้งคะ',
    options: [
      { value: '0-5', label: '0–5 ครั้ง' },
      { value: '6-20', label: '6–20 ครั้ง' },
      { value: '20+', label: 'มากกว่า 20 ครั้ง' },
    ],
  },
];

/**
 * `|` 자리에서만 줄바꿈 — 태국어가 낱말 중간에서 끊기지 않게(두피 페이지와 같은 처리).
 * `| ` (뒤에 공백) = 원문에 띄어쓰기가 있던 자리 → 한 줄로 이어질 때 공백을 살린다(넓은 화면에서 "ไพร8" 붙음 방지).
 */
function Chunks({ text }: { text: string }) {
  return (
    <>
      {text.split('|').map((w, j) => (
        <span key={j}>
          {j > 0 && w.startsWith(' ') && ' '}
          <span className="inline-block">{w.trimStart()}</span>
        </span>
      ))}
    </>
  );
}

export default function PartnerDownPermPage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      {/* 히어로 — 헤드라인 = 상세페이지 02 헤드라인(에이님 수정안 9/23) */}
      <section className="mx-auto max-w-3xl px-6 pb-14 pt-20 text-center">
        <p className="text-[11px] font-medium tracking-[0.2em] text-brand-gold sm:text-xs">
          รับสมัครร้านทดลองใช้ · Keratin Down Perm
        </p>
        <h1 className="mt-5 text-3xl font-semibold leading-snug sm:text-4xl">
          ถนอมหนังศีรษะและเส้นผม
          <br />
          <span className="inline-block">DOWN PERM</span> <span className="inline-block">ผมข้างแนบสวย</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-brand-white sm:text-base">
          Keratin Down Perm จาก Bellista
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-gold">
          <span className="inline-block">57 Total Beauty</span>{' '}
          <span className="inline-block">เปิดให้ร้านเสริมสวย</span>
          <span className="inline-block">ทดลองใช้ก่อนตัดสินใจ</span>
        </p>
        {STAGE !== 'ended' && (
          <p className="mx-auto mt-6 max-w-xl rounded-lg bg-brand-card px-5 py-3 text-[13px] leading-relaxed text-brand-white">
            {IS_OPEN ? 'รับ 5 ร้านแรก · หากมีผู้สนใจมาก จะพิจารณาเพิ่มเติม' : 'เปิดรับสมัครเร็ว ๆ นี้ค่ะ'}
          </p>
        )}
      </section>

      {/* 전후 + 핵심 3가지 — 상세페이지 05·01 */}
      <section className="border-t border-brand-dark px-6 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-lg font-semibold sm:text-xl">ผมแบบไหนก็ DOWN ได้ง่าย ๆ!</h2>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-brand-gold sm:text-sm">
            <span className="inline-block">กดผมแนบสนิทเป็นพิเศษ</span>{' '}
            <span className="inline-block">พร้อมถนอมเส้นผม</span>
          </p>
          <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-xl">
            <Image
              src="/partner/downperm/before-after.webp"
              alt="Keratin Down Perm — BEFORE / AFTER"
              width={880}
              height={696}
              className="h-auto w-full"
            />
          </div>
          <p className="mt-3 text-[11px] text-brand-gold">* ภาพจำลองเพื่อประกอบความเข้าใจ</p>

          <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-3">
            {POINTS.map((t) => (
              <div key={t} className="rounded-xl bg-brand-card px-2 py-5 text-[13px] font-semibold leading-snug">
                <Chunks text={t} />
              </div>
            ))}
          </div>

          {/* 제품 — 상세 페이지로(가격은 상세 페이지에서도 원장 승인 후에만 보인다) */}
          <Link
            href={`/th/products/${SLUG}`}
            className="mx-auto mt-8 flex max-w-xl items-center gap-4 rounded-xl bg-brand-card p-4 text-left transition hover:opacity-85"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
              <Image src={`/products/${SLUG}/thumb.webp`} alt="Keratin Down Perm 500ml" fill sizes="80px" className="object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-snug">
                <Chunks text="โปรซีเจอร์ เคราติน| ดาวน์เพิร์ม 500 มล." />
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-brand-gold">
                <Chunks text="ดาวน์เพิร์มสำหรับผมด้านข้าง| และด้านหลังโดยเฉพาะ" />
              </p>
            </div>
          </Link>
          <p className="mt-6 text-[11px] text-brand-gold">ผลิตภัณฑ์นี้สำหรับช่างทำผมมืออาชีพ</p>
        </div>
      </section>

      {/* 체험 세트 + 사용법 + 주의사항 — 준비 중에도 보여 준다(마감 뒤에는 내린다, 두피와 같음) */}
      {STAGE !== 'ended' && (
        <section className="border-t border-brand-dark px-6 pt-14">
          <h2 className="text-center text-lg font-semibold sm:text-xl">ชุดทดลองที่ร้านจะได้รับ</h2>
          <p className="mx-auto mt-4 max-w-md text-center text-[13px] leading-relaxed text-brand-gold">
            ให้ช่างและลูกค้าได้ลองจริงก่อน แล้วค่อยตัดสินใจ
          </p>
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-brand-dark bg-brand-card p-5 sm:p-6">
            <h3 className="text-center text-base font-semibold sm:text-lg">ชุดทดลอง Keratin Down Perm</h3>
            <div className="mt-5 flex items-center gap-3">
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold tracking-wide">KERATIN DOWN PERM</span>
                <span className="block text-[13px] text-brand-gold">เคราติน ดาวน์เพิร์ม 500 มล.</span>
              </span>
              <span className="shrink-0 text-right text-sm font-semibold">× 1 ถุง</span>
            </div>
            <p className="mt-5 border-t border-brand-dark pt-4 text-center text-[13px] leading-relaxed text-brand-gold">
              <span className="inline-block">500ml ใช้ได้ 15 ครั้งขึ้นไป</span>
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <h3 className="text-center text-base font-semibold sm:text-lg">วิธีใช้ง่าย ๆ</h3>
            <ol className="mt-6 space-y-3">
              {HOW_TO.map((s) => (
                <li key={s.n} className="flex gap-4 rounded-xl bg-brand-card p-4">
                  <span className="w-12 shrink-0 text-center">
                    <span className="block text-[10px] tracking-[0.15em] text-brand-gold">STEP</span>
                    <span className="block text-xl font-semibold text-brand-gold">{s.n}</span>
                  </span>
                  <p className="text-[13px] leading-relaxed">
                    {s.lines.map((l) => (
                      <span key={l} className="block">
                        <Chunks text={l} />
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mx-auto mt-12 max-w-xl pb-14">
            <h3 className="text-center text-base font-semibold sm:text-lg">ผลิตภัณฑ์นี้สำหรับช่างทำผมมืออาชีพ</h3>
            <ul className="mt-6 space-y-3">
              {NOTICE.map((n) => (
                <li key={n.head} className="rounded-xl border border-brand-dark p-4 text-[13px] leading-relaxed">
                  <p className="font-semibold">{n.head}</p>
                  {n.body.map((b) => (
                    <p key={b} className="text-brand-gold">
                      {b}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-center text-[13px] leading-relaxed">
              <span className="inline-block">ก่อนใช้ โปรดอ่าน [ข้อควรระวังในการใช้]</span>{' '}
              <span className="inline-block">ให้ครบถ้วนทุกครั้งนะคะ!</span>
            </p>
            <p className="mt-4 text-center">
              <Link href={`/th/products/${SLUG}`} className="text-[13px] text-brand-gold underline underline-offset-4">
                ดูรายละเอียดสินค้า →
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* 신청 절차 — 모집 중일 때만 */}
      {IS_OPEN && (
        <section className="border-t border-brand-dark px-6 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-lg font-semibold sm:text-xl">ขั้นตอน</h2>
            <ol className="mt-9 grid gap-6 sm:grid-cols-3">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4 rounded-xl bg-brand-card p-5">
                  <span className="text-sm font-semibold text-brand-gold">{s.n}</span>
                  <div>
                    <p className="text-sm font-semibold">{s.head}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-brand-gold">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* 신청 폼 — 미스트·두피와 같은 컴포넌트 + 다운펌 전용 선택 문항. 마감 숫자는 서버 ROUNDS.downperm 이 정한다. */}
      <section className="border-t border-brand-dark px-6 py-16 text-center">
        {IS_OPEN ? (
          <>
            <h2 className="text-lg font-semibold sm:text-xl">สนใจทดลองใช้ที่ร้าน</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-gold">
              กรอกข้อมูลร้าน ทีมงานจะตรวจสอบและติดต่อกลับ
            </p>
            <div className="mt-9">
              <TrialForm round="downperm" lineUrl={LINE_URL} questions={QUESTIONS} />
            </div>
          </>
        ) : STAGE === 'soon' ? (
          <>
            <h2 className="text-lg font-semibold sm:text-xl">สนใจทดลองใช้ที่ร้าน</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-white">
              {/* 🚫 "열리면 LINE 으로 알려 드린다" 는 쓰지 않는다 — 전체 발송이 금지라 지킬 수단이 없다. */}
              รอบนี้กำลังเตรียมเปิดรับสมัครค่ะ
            </p>
            <a href={LINE_URL} className="mt-7 inline-block text-[13px] text-brand-gold underline underline-offset-4">
              สอบถามเพิ่มเติมทาง LINE
            </a>
          </>
        ) : (
          <p className="mx-auto max-w-md text-sm leading-relaxed text-brand-white">
            ขณะนี้การรับสมัครทดลองใช้รอบนี้ปิดรับแล้วค่ะ
            <br />
            ขอบคุณทุกร้านที่ให้ความสนใจค่ะ
          </p>
        )}

        <p className="mt-10 text-[13px] text-brand-gold">
          บริษัท 57 Total Beauty · ผู้นำเข้าและผู้จดแจ้ง อย. ผลิตภัณฑ์ Bellista ในประเทศไทย
        </p>
      </section>
    </main>
  );
}
