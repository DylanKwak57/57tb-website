/**
 * 두피케어(Scalp Care) 시술 가이드 — 샘플 키트 QR 도착지 · 태국어 전용 · unlisted (2026-11-02 대표님 승인 구성)
 *
 * 진입: 키트 상자 QR → `/th/partner` → `PartnerLiffReturn` 이 `?from=kit` 를 붙여 이리 보낸다.
 *       `?from=kit` 이면 키트 상자 블록(KitBox)의 테두리가 강조된다.
 *
 * 구성: 키트 상자 → 프로그램 3개(T1·T3·T4) → 공통 단계(진단·겔·마사지) → 프로그램별 단계 → 참고
 *       → 사용 제품 → 홈케어 → 공통 CTA
 *
 * 🚨 가격·공급가·우리 시술가를 쓰지 않는다.
 * 🚨 태국어 문구는 승인 명세 그대로다 — 바꾸거나 새 문장을 더하지 말 것.
 *    트리트먼트 표기 = `ทรีทเมนต์` (2026-09-29 대표님 확정. 브로셔의 `ทรีตเมนต์` 과 다르다).
 * ℹ️ 일러스트 = 57tb-staff/scaling/images 원본을 webp(폭 900)로 옮긴 것. 사람은 일러스트, 57TB 표시 없음.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import GuideCta from '@/components/partner/GuideCta';
import KitBox from '@/components/partner/KitBox';

export const metadata: Metadata = {
  title: 'Scalp Care · วิธีใช้ | Bellista',
};

const IMG = '/partner/guide';

type StepData = { n: string; title: string; lines: string[]; img: string; w: number; h: number; tips?: string[] };

/**
 * 🔀 2026-11-02 통합 — 8/25 영업용 시술 가이드(`/th/partner/scaling`, public 정적 HTML)에만 있던
 *    시술 시간 · 가격 정하는 법 · 현장 팁 · 케미컬 손님 · 주의사항 전문을 이 페이지로 옮겼다(대표님 "새 가이드로 합쳐").
 *    문장은 8/25 페이지 원문 그대로이고, 바뀐 것은 ① 트리트먼트 표기 ทรีตเมนต์ → ทรีทเมนต์
 *    ② 단계 번호(11/2 적시기 단계 복원 뒤 원문과 같음) ③ T1 스팀 팁의 "T3 는 7단계 참고" 꼬리 삭제(T3 스팀 팁을 5단계에 따로 둠).
 *    옛 주소는 지우지 않는다(이미 전달됐을 수 있다) — 링크 대장에 '구주소 유지'.
 */

/** B-2 프로그램 3개 (시간 = 8/25 가이드 원문 · T4 는 원문에 없어 비움) */
const PROGRAMS = [
  { code: 'T1', title: 'สเกลลิ่งหนังศีรษะ', lines: ['เจลสเกลลิ่งยูคาลิปตัส', 'ตามด้วยแชมพูสูตรเย็น'], time: 'ประมาณ 18–20 นาที' },
  {
    code: 'T3',
    title: 'สเกลลิ่ง + บำรุงเข้มข้น',
    lines: ['เจลสเกลลิ่งยูคาลิปตัส', 'แชมพูคาเฟอีน', '+ ทรีทเมนต์คาเฟอีน'],
    time: 'ประมาณ 25–30 นาที',
  },
  { code: 'T4', title: 'เพิ่ม Hair Tonic', lines: ['ครบทุกขั้นตอนของ T3', '+ คาเฟอีน แฮร์ โทนิค', 'หลังไดร์ผม'], time: '' },
];

/** 가격 정하는 법 — 8/25 가이드 원문. 우리 시술가는 쓰지 않는다(시장 범위만). */
const PRICING_FACTORS = [
  'ต้นทุนผลิตภัณฑ์ต่อครั้ง|(T1 ใช้เจล 1 แอมพูล · T3 เพิ่มแชมพูและทรีทเมนต์)',
  'เวลาที่ใช้ต่อคิว|และค่าแรงช่างของร้าน',
  'ราคาตลาดในย่านที่ร้านตั้งอยู่',
];

/** B-3 공통 단계 (T1·T3·T4) */
const COMMON_STEPS: StepData[] = [
  {
    n: '1',
    title: 'ตรวจหนังศีรษะด้วยกล้อง',
    lines: ['ดูความมัน ขุย และคราบสะสม', 'บนจอไปพร้อมกับลูกค้า'],
    img: 'diag', w: 900, h: 600,
    // 🆕 2026-11-02 대표님: 샘플 받는 원장님은 현미경이 없을 수 있다 → 구할 곳·대략 가격 안내 (신규 태국어 · 에이님 검수 대기)
    tips: ['ยังไม่มีกล้อง? ค้นหา "กล้องส่องหนังศีรษะ" ทาง Shopee หรือ Lazada ราคาประมาณ 500 บาท'],
  },
  // 🚨 2026-11-02 대표님 지적 "현미경 진단 → 물로 적시기 → 앰플" — 브로셔 1번 뒷면에서 빠져 있던 단계.
  //    문구 = 직원 매뉴얼·8/25 가이드 원문(`เตรียมหนังศีรษะ`).
  {
    n: '2',
    title: 'เตรียมหนังศีรษะ',
    lines: ['ใช้น้ำอุ่นชโลมผมและหนังศีรษะ|ให้ชุ่มทั่วทั้งศีรษะ'],
    img: 'wet', w: 900, h: 600,
  },
  {
    n: '3',
    title: 'ทาเจลสเกลลิ่ง',
    lines: ['แบ่งผม ทาให้ทั่วหนังศีรษะ', '1 คน ใช้ 1 แอมพูล', 'ไม่ขึ้นกับความยาวหรือความหนาผม'],
    img: 'apply', w: 900, h: 600,
    tips: [
      'เทคนิคลงเจลให้สม่ำเสมอ — ใช้หวีแสกผมเป็นเส้นตรงกลางกระหม่อมก่อน แล้วบีบเจลตามแนวนั้นเพื่อจับกึ่งกลาง จากนั้นแสกเพิ่มทีละแนวไปทางซ้าย–ขวา แล้วลงเจลให้ทั่ว จะลงได้สม่ำเสมอทั้งศีรษะ',
      'ลูกค้าหนังศีรษะมันมาก — สระด้วยแชมพูธรรมดาหรือแชมพูสูตรเย็น 1 รอบก่อน เพื่อขจัดชั้นความมันออก แล้วค่อยลงแอมพูล จะช่วยให้เจลซึมเข้าหนังศีรษะได้ง่ายขึ้น',
    ],
  },
  {
    n: '4',
    title: 'นวด แล้วล้างให้สะอาด',
    lines: ['นวดหนังศีรษะเบา ๆ ให้ทั่ว', 'ล้างเจลออกให้หมดก่อนสระ'],
    img: 'massage', w: 900, h: 675,
    tips: [
      'ถ้าคิวแน่น ต้องซื้อเวลา (T1) — หลังลงแอมพูลและนวดเสร็จ ใช้เครื่องอบไอน้ำอบทิ้งไว้ประมาณ 5–10 นาที แล้วค่อยสระ',
    ],
  },
];

/** B-4 프로그램별 갈래 */
const BRANCHES: { code: string; head: string; steps: StepData[]; end?: string }[] = [
  {
    code: 'T1',
    head: 'สระสูตรเย็น',
    steps: [
      {
        n: '5',
        title: 'แชมพูสูตรเย็น',
        lines: ['ใช้แชมพูของร้าน', 'สระผม แล้วล้างออกให้สะอาด'],
        img: 'rinse', w: 900, h: 675,
        tips: ['ถ้าลูกค้าบอกว่า แชมพูสูตรเย็นเย็นเกินไป ไม่ชอบ — เปลี่ยนไปใช้แชมพูธรรมดาแทนได้'],
      },
    ],
    end: 'จบขั้นตอนของ T1',
  },
  {
    code: 'T3 · T4',
    head: 'แชมพู + ทรีทเมนต์คาเฟอีน',
    steps: [
      {
        n: '5',
        title: 'แชมพูคาเฟอีน',
        lines: ['นวดให้เกิดฟอง', 'ทิ้งไว้ 1–3 นาที', 'แล้วล้างออกให้สะอาด'],
        img: 'scene_shampoo', w: 900, h: 600,
        tips: ['บำรุงรากผมให้แข็งแรง ลดผมขาดหลุดร่วง · คาเฟอีนธรรมชาติ + ค่า pH 6.0 อ่อนโยน'],
      },
      {
        n: '6',
        title: 'ทรีทเมนต์คาเฟอีน',
        lines: ['ทาบนเส้นผมที่เปียกหลังสระเป็นหลัก|โดนหนังศีรษะได้', 'ทิ้งไว้ 2–3 นาที', 'แล้วล้างออกให้สะอาด'],
        img: 'scene_treatment', w: 900, h: 600,
        tips: [
          'ลงทรีทเมนต์แล้วใช้ เครื่องอบไอน้ำ อบทิ้งไว้ 5–10 นาที ก่อนล้าง → บำรุงซึมซาบดียิ่งขึ้น และยังใช้ซื้อเวลาได้เมื่อคิวแน่น',
          'คอลลาเจน · เซราไมด์ · อาร์แกนออยล์ — บำรุงเส้นผม ดูแลทั้งผมและหนังศีรษะ',
        ],
      },
    ],
  },
  {
    code: 'T4',
    head: 'เพิ่มขั้นตอนนี้',
    steps: [
      {
        n: '7',
        title: 'หลังไดร์ผม →|ปิดท้ายด้วยคาเฟอีน แฮร์ โทนิค',
        lines: ['ฉีดลงบนหนังศีรษะ แล้วนวดเบา ๆ', 'ไม่ต้องล้างออก ·|ทำหลังครบทุกขั้นตอนของ T3'],
        img: 'step_tonic', w: 900, h: 600,
      },
    ],
  },
];

/** B-5 참고 */
const NOTES = [
  'ชุดทดลอง: ใช้แชมพูและทรีทเมนต์อย่างละ 1 แอมพูลต่อ 1 คน',
  'ปริมาณแชมพูและทรีทเมนต์: ใช้จากขวด 750ml|ตามความยาวและความหนาของผม',
  'สามารถตรวจหนังศีรษะด้วยกล้องอีกครั้ง|เพื่อเปรียบเทียบก่อนและหลังบริการ',
];

/** 케미컬 손님 — 8/25 가이드 원문 그대로(2–5 = 적시기·겔·마사지·샴푸, 11/2 적시기 단계 복원으로 원문 번호와 같아짐) */
const CHEMICAL = [
  'ทำสเกลลิ่งได้ — เฉพาะตอนสระปิดท้าย|หลังงานเคมีทั้งหมดเสร็จแล้วเท่านั้น',
  'ลำดับ: งานเคมีเสร็จ → ตอนสระปิดท้าย|ทำตามขั้นตอน 2–5',
];

/** 주의사항 — 8/25 가이드 원문 전문 (브로셔 요약본보다 자세해 이쪽을 쓴다) */
const CAUTIONS = [
  'ต้องล้างเจลออกให้สะอาดทุกครั้ง —|ถ้าล้างไม่หมดอาจเป็นสาเหตุให้ผมร่วงหรือสีผมเปลี่ยนได้',
  'ห้ามใช้กับหนังศีรษะที่มีแผล อักเสบ หรือผื่นแดง',
  'ระวังอย่าให้เข้าตา|หากเข้าตาให้ล้างน้ำสะอาดทันที',
  'รอบที่เหมาะสม: สัปดาห์ละ 1–2 ครั้ง',
];

/**
 * 손님에게 권하는 법 — 상위 디자이너 5명 설문 원문(2026-09-24 Tally kdLrEd ·
 * 정본 `57 CEO/Scalp Care Business/보고서/팁설문-결과-0926.md`) · 2026-11-02 대표님 "이름 빼고 진행".
 * 🚨 디자이너 실명을 쓰지 않는다 — 다른 살롱이 보는 페이지라 스카우트 위험(대표님 11/2).
 * 🚨 외부본 기준(9/26 메모): 프로모션·오픈 특가(BOW 4·JOY 3) · 우리 예약 채널(PIM 3) 문장은 뺐다.
 * 인용은 원문 그대로이고 손댄 것은 철자뿐: ทรีตเมนต์→ทรีทเมนต์ · ศรีษะ→ศีรษะ · `หัว`(구어) 삭제.
 * 주제 제목·섹션 머리는 신규 태국어 — 에이님 검수 대기.
 */
const SALES_TIPS: { head: string; quotes: string[] }[] = [
  {
    head: 'เริ่มจากส่องกล้อง',
    quotes: [
      'เริ่มพูดตอนลูกค้านั่งรอค่ะ สวัสดีค่ะ คุณสนใจส่องกล้องตรวจเช็กหนังศีรษะไหมคะ',
      'ส่องกล้องตรวจเช็กหนังศีรษะลูกค้าก่อน ค่อยอธิบายให้ลูกค้าตรงจุด และให้ลูกค้าตัดสินใจเองด้วยค่ะ',
    ],
  },
  {
    head: 'ประโยคแรก',
    quotes: [
      'ลองถามลูกค้าว่า "เคยทำดีท็อกซ์หนังศีรษะไหมคะ" เพราะลูกค้าหลายคนยังไม่เคยดูแลหนังศีรษะโดยตรง พออธิบายว่าช่วยทำความสะอาดสิ่งตกค้าง ลูกค้าจะเข้าใจและสนใจง่ายขึ้นค่ะ',
    ],
  },
  {
    head: 'ให้ลูกค้าเห็นภาพจริง',
    quotes: [
      'จากกล้องจะเห็นว่ามีรังแคอุดตันรูขุมขนอยู่ค่ะ ถ้าปล่อยไว้อาจทำให้เส้นผมเริ่มบางและเล็กลง ถ้ามีเวลา แนะนำให้ลองทำความสะอาดหนังศีรษะดูนะคะ',
    ],
  },
  {
    head: 'เลือก T1 หรือ T3',
    quotes: [
      'ถ้าอยากทดลองหรือทำควบคู่กับเคมีจะแนะนำ T1 แต่ถ้าอยากดูแลแบบครบเซ็ต ทั้งแชมพูและทรีทเมนต์และดีท็อกซ์หนังศีรษะ จะแนะนำ T3',
      'ถ้าไม่มันเกิน ไม่ได้มีปัญหาอะไรมาก ก็บอกลูกค้าว่าลอง T1 ดูก่อน แล้วรอบหน้าค่อยมาลองทำ T3 ก็ได้ค่ะ',
    ],
  },
  {
    head: 'ไม่กดดันลูกค้า',
    quotes: [
      'ไม่เป็นไรค่ะ โอกาสหน้าลองดูได้นะคะ',
      'ถ้ากรณีเป็นลูกค้าตัดผมก็จะไม่เซ้าซี้มากค่ะ เพราะว่าเราก็ต้องจับความรู้สึกของลูกค้าด้วย',
      'อย่าฝืนหรือกดดันมากเกินไปนะคะ',
    ],
  },
  {
    head: 'ลูกค้ารู้สึกอย่างไร',
    quotes: [
      'รู้สึกเย็นสบายหนังศีรษะและผ่อนคลายจนหลับค่ะ',
      'ลูกค้าเกือบทุกคนบอกว่า สะอาดขึ้นตั้งแต่ครั้งแรกที่ทำ ไม่ว่า T1 หรือ T3 ค่ะ รู้สึกโล่ง เบาสบายค่ะ',
      'หลังเช็กกล้องอีกครั้ง ลูกค้าเห็นความเปลี่ยนแปลง',
    ],
  },
  {
    head: 'ให้ผู้ช่วยช่วยอธิบาย',
    quotes: [
      'ให้ข้อมูลผู้ช่วยเพิ่มเติม กรณีอธิบายลูกค้าระหว่างรอช่าง หรือลูกค้ามีคำถามเพิ่มเติม',
    ],
  },
];

/** B-6 사용 제품 — 각 카드 → 제품 상세(가격은 상세에서도 회원 전용) */
const PRODUCTS_USED = [
  { slug: 'bellista-scaling-gel', name: 'เจลสเกลลิ่ง ยูคาลิปตัส', size: '8ml × 48', prog: 'T1 · T3 · T4' },
  { slug: 'bellista-caffeine-shampoo', name: 'แชมพู คาเฟอีน', size: '750ml', prog: 'T3 · T4' },
  { slug: 'bellista-caffeine-treatment', name: 'ทรีทเมนต์ คาเฟอีน', size: '750ml', prog: 'T3 · T4' },
  { slug: 'bellista-caffeine-tonic', name: 'คาเฟอีน แฮร์ โทนิค', size: '150ml', prog: 'T4' },
];

/** B-7 홈케어 — 링크 없음(200ml 은 2차 입고 후 판매) */
const HOMECARE = [
  { step: 'STEP 1', name: 'แชมพูคาเฟอีน', size: '200ml', img: 'home-shp200', w: 227 },
  { step: 'STEP 2', name: 'ทรีทเมนต์คาเฟอีน', size: '200ml', img: 'home-trt200', w: 226 },
  { step: 'STEP 3', name: 'คาเฟอีน แฮร์ โทนิค', size: '150ml', img: 'home-tonic', w: 250 },
];

/**
 * 의미 덩어리 줄바꿈 — 문자열 안의 `|` 는 화면에서 **공백 하나**가 되고, 그 사이에서만 줄이 바뀐다.
 * 🚨 `|` 는 명세 원문의 공백 자리에만 넣는다(화면 글자는 명세와 한 글자도 다르지 않다).
 *    휴대폰 폭에서 `โดน / หนังศีรษะได้` 처럼 구절 중간이 끊기던 것을 막는다.
 */
function Phrase({ text }: { text: string }) {
  return (
    <>
      {text.split('|').map((c, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="inline-block">{c}</span>
        </Fragment>
      ))}
    </>
  );
}

/** 단계 하나 — 번호 + 제목 + 설명(의미 단위 줄) + 일러스트 */
function Step({ s }: { s: StepData }) {
  return (
    <div className="overflow-hidden rounded-xl bg-brand-card">
      <Image src={`${IMG}/${s.img}.webp`} alt={s.title.replaceAll('|', ' ')} width={s.w} height={s.h} className="h-auto w-full" />
      <div className="flex gap-4 p-5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-gold text-sm font-semibold text-brand-gold">
          {s.n}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold sm:text-base"><Phrase text={s.title} /></p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-brand-gold">
            {s.lines.map((l) => (
              <span key={l} className="block">
                <Phrase text={l} />
              </span>
            ))}
          </p>
          {s.tips && (
            <ul className="mt-3 space-y-2">
              {s.tips.map((t) => (
                <li key={t} className="rounded-lg bg-brand-black px-3 py-2 text-[12px] leading-relaxed text-brand-gold">
                  <span aria-hidden className="mr-1.5">✦</span>
                  {/* 🚨 팁 원문은 길다 — 띄어쓰기 자리에서만 줄을 바꾼다(แอม/พูล 처럼 외래어 중간 끊김 실측 11/2) */}
                  <Phrase text={t.replaceAll(' ', '|')} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PartnerScalpGuidePage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      {/* 머리 */}
      <section className="mx-auto max-w-3xl px-6 pb-10 pt-8">
        <Link href="/th/partner/guide" className="text-[13px] text-brand-gold">
          ← วิธีใช้ผลิตภัณฑ์
        </Link>
        <div className="mt-10 text-center">
          <p className="text-[11px] font-medium tracking-[0.2em] text-brand-gold sm:text-xs">
            BELLISTA · SCALP CARE · HOW TO USE
          </p>
          <h1 className="mt-5 text-3xl font-semibold leading-snug sm:text-4xl">Scalp Care Steps</h1>
          {/* 🚨 의미 덩어리(inline-block)로만 줄이 바뀌게 한다 — 휴대폰에서 낱말 중간 끊김 방지. 글자는 명세 그대로. */}
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-gold sm:text-base">
            <span className="inline-block">ขั้นตอนดูแลหนังศีรษะ ·</span>{' '}
            <span className="inline-block">เริ่มเหมือนกัน แล้วเลือกตามโปรแกรม</span>
          </p>
        </div>
      </section>

      {/* B-1 샘플 키트 상자 */}
      <KitBox />

      {/* B-2 프로그램 3개 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {PROGRAMS.map((p) => (
            <div key={p.code} className="rounded-xl bg-brand-card p-5">
              <p className="text-2xl font-semibold text-brand-gold">{p.code}</p>
              <p className="mt-2 text-sm font-semibold">{p.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-brand-gold">
                {p.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
              {p.time && <p className="mt-3 text-[12px] font-semibold">{p.time}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* 가격 정하는 법 — 8/25 가이드에서 통합. 시장 범위만 · 우리 시술가 없음 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center text-lg font-semibold sm:text-xl">การตั้งราคาบริการ</h2>
          <p className="mt-3 text-center text-[13px] leading-relaxed text-brand-gold">
            <span className="inline-block">ราคาขึ้นอยู่กับร้านของคุณค่ะ —</span>{' '}
            <span className="inline-block">เราไม่ได้กำหนดราคาขายให้</span>
          </p>
          <p className="mt-6 text-[13px] font-semibold">แนะนำให้พิจารณาจาก 3 อย่างนี้</p>
          <ul className="mt-3 space-y-2">
            {PRICING_FACTORS.map((f, i) => (
              <li key={f} className="flex gap-3 text-[13px] leading-relaxed text-brand-gold">
                <span className="font-semibold">{i + 1}</span>
                <span><Phrase text={f} /></span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl bg-brand-card p-5 text-center">
            <p className="text-[13px] font-semibold">ช่วงราคาบริการดูแลหนังศีรษะในกรุงเทพฯ</p>
            <p className="mt-2 text-2xl font-semibold text-brand-gold">฿490 – ฿2,500</p>
            <p className="mt-2 text-[11px] text-brand-gold">สำรวจจากร้านเฮดสปาในกรุงเทพฯ · สิงหาคม 2026</p>
          </div>
        </div>
      </section>

      {/* B-3 공통 단계 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto max-w-xl">
          <p className="text-center text-xs tracking-[0.2em] text-brand-gold">T1 · T3 · T4</p>
          <h2 className="mt-2 text-center text-lg font-semibold sm:text-xl">เริ่มด้วยการตรวจและสเกลลิ่งหนังศีรษะ</h2>
          <div className="mt-8 space-y-5">
            {COMMON_STEPS.map((s) => (
              <Step key={s.n} s={s} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm font-semibold text-brand-gold">จากนั้น เลือกขั้นตอนตามโปรแกรม ↓</p>
        </div>
      </section>

      {/* B-4 프로그램별 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto max-w-xl space-y-8">
          {BRANCHES.map((b) => (
            <div key={`${b.code}-${b.head}`} className="rounded-2xl border border-brand-gold p-4 sm:p-5">
              <div className="mb-4 flex items-baseline gap-3 px-1">
                <span className="text-lg font-semibold text-brand-gold">{b.code}</span>
                <span className="text-sm font-semibold">{b.head}</span>
              </div>
              <div className="space-y-4">
                {b.steps.map((s) => (
                  <Step key={s.n} s={s} />
                ))}
              </div>
              {b.end && <p className="mt-4 text-center text-[13px] font-semibold text-brand-gold">{b.end}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* B-5 참고 · 케미컬 손님 · 주의사항 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto max-w-xl space-y-8">
          <ul className="space-y-2.5">
            {NOTES.map((n) => (
              <li key={n} className="flex gap-2.5 text-[13px] leading-relaxed text-brand-gold">
                <span aria-hidden>·</span>
                <span><Phrase text={n} /></span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-brand-card p-5">
            <p className="text-sm font-semibold">ลูกค้าที่ทำเคมี</p>
            <ul className="mt-2 space-y-1.5">
              {CHEMICAL.map((c) => (
                <li key={c} className="text-[13px] leading-relaxed text-brand-gold"><Phrase text={c} /></li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-brand-gold p-5">
            <p className="text-sm font-semibold">ข้อควรระวัง</p>
            <ul className="mt-2 space-y-1.5">
              {CAUTIONS.map((c) => (
                <li key={c} className="flex gap-2.5 text-[13px] leading-relaxed text-brand-gold">
                  <span aria-hidden>·</span>
                  <span><Phrase text={c} /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 손님에게 권하는 법 — 현장 디자이너 실제 문장(실명 없음) */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto max-w-xl">
          <p className="text-center text-xs tracking-[0.2em] text-brand-gold">FROM OUR DESIGNERS</p>
          <h2 className="mt-2 text-center text-lg font-semibold sm:text-xl">วิธีแนะนำลูกค้า</h2>
          <p className="mt-3 text-center text-[13px] leading-relaxed text-brand-gold">
            <Phrase text="เทคนิคจริงจากช่าง|57 Total Beauty" />
          </p>
          <div className="mt-8 space-y-4">
            {SALES_TIPS.map((t, i) => (
              <div key={t.head} className="rounded-xl bg-brand-card p-5">
                <p className="flex items-baseline gap-3">
                  <span className="text-sm font-semibold text-brand-gold">{i + 1}</span>
                  <span className="text-sm font-semibold">{t.head}</span>
                </p>
                <ul className="mt-3 space-y-2.5">
                  {t.quotes.map((q) => (
                    <li key={q} className="border-l-2 border-brand-gold pl-3 text-[13px] leading-relaxed text-brand-gold">
                      <Phrase text={q.replaceAll(' ', '|')} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B-6 사용 제품 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-lg font-semibold sm:text-xl">ผลิตภัณฑ์ที่ใช้ในโปรแกรม</h2>
          <p className="mt-3 text-center text-[13px] text-brand-gold">แตะที่สินค้าเพื่อดูรายละเอียด</p>
          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
            {PRODUCTS_USED.map((p) => (
              <Link key={p.slug} href={`/th/products/${p.slug}`} className="group text-center">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-card transition group-hover:opacity-85">
                  <Image
                    src={`/products/${p.slug}/thumb.webp`}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 45vw, 170px"
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 text-[13px] font-medium leading-snug">{p.name}</p>
                <p className="mt-1 text-[12px] text-brand-gold">{p.size}</p>
                <p className="mt-0.5 text-[12px] text-brand-gold">{p.prog}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* B-7 홈케어 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-lg font-semibold sm:text-xl">ที่ร้านดูแลล้ำลึก ที่บ้านดูแลทุกวัน</h2>
          <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-brand-gold sm:text-sm">
            <span className="block">แนะนำให้ลูกค้าดูแลต่อเนื่องด้วยผลิตภัณฑ์โฮมแคร์</span>
            <span className="block">เพื่อเสริมการดูแลระหว่างครั้งที่มารับบริการ</span>
          </p>
          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-4">
            {HOMECARE.map((h) => (
              <div key={h.step}>
                <div className="flex h-36 items-center justify-center rounded-lg bg-brand-card py-3 sm:h-44">
                  <Image
                    src={`${IMG}/${h.img}.webp`}
                    alt={h.name}
                    width={h.w}
                    height={700}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <p className="mt-2 text-[11px] tracking-[0.15em] text-brand-gold">{h.step}</p>
                <p className="mt-1 text-[12px] font-medium leading-snug">{h.name}</p>
                <p className="mt-0.5 text-[12px] text-brand-gold">{h.size}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[11px] text-brand-gold">ผลิตภัณฑ์นี้ไม่ใช่ยาเพื่อการป้องกันหรือรักษาโรค</p>
        </div>
      </section>

      <GuideCta />
    </main>
  );
}
