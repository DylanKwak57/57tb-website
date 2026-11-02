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

type StepData = { n: string; title: string; lines: string[]; img: string; w: number; h: number };

/** B-2 프로그램 3개 */
const PROGRAMS = [
  { code: 'T1', title: 'สเกลลิ่งหนังศีรษะ', lines: ['เจลสเกลลิ่งยูคาลิปตัส', 'ตามด้วยแชมพูสูตรเย็น'] },
  {
    code: 'T3',
    title: 'สเกลลิ่ง + บำรุงเข้มข้น',
    lines: ['เจลสเกลลิ่งยูคาลิปตัส', 'แชมพูคาเฟอีน', '+ ทรีทเมนต์คาเฟอีน'],
  },
  { code: 'T4', title: 'เพิ่ม Hair Tonic', lines: ['ครบทุกขั้นตอนของ T3', '+ คาเฟอีน แฮร์ โทนิค', 'หลังไดร์ผม'] },
];

/** B-3 공통 단계 (T1·T3·T4) */
const COMMON_STEPS: StepData[] = [
  {
    n: '1',
    title: 'ตรวจหนังศีรษะด้วยกล้อง',
    lines: ['ดูความมัน ขุย และคราบสะสม', 'บนจอไปพร้อมกับลูกค้า'],
    img: 'diag', w: 900, h: 600,
  },
  {
    n: '2',
    title: 'ทาเจลสเกลลิ่ง',
    lines: ['แบ่งผม ทาให้ทั่วหนังศีรษะ', '1 คน ใช้ 1 แอมพูล', 'ไม่ขึ้นกับความยาวหรือความหนาผม'],
    img: 'apply', w: 900, h: 600,
  },
  {
    n: '3',
    title: 'นวด แล้วล้างให้สะอาด',
    lines: ['นวดหนังศีรษะเบา ๆ ให้ทั่ว', 'ล้างเจลออกให้หมดก่อนสระ'],
    img: 'massage', w: 900, h: 675,
  },
];

/** B-4 프로그램별 갈래 */
const BRANCHES: { code: string; head: string; steps: StepData[]; end?: string }[] = [
  {
    code: 'T1',
    head: 'สระสูตรเย็น',
    steps: [
      {
        n: '4',
        title: 'แชมพูสูตรเย็น',
        lines: ['ใช้แชมพูของร้าน', 'สระผม แล้วล้างออกให้สะอาด'],
        img: 'rinse', w: 900, h: 675,
      },
    ],
    end: 'จบขั้นตอนของ T1',
  },
  {
    code: 'T3 · T4',
    head: 'แชมพู + ทรีทเมนต์คาเฟอีน',
    steps: [
      {
        n: '4',
        title: 'แชมพูคาเฟอีน',
        lines: ['นวดให้เกิดฟอง', 'ทิ้งไว้ 1–3 นาที', 'แล้วล้างออกให้สะอาด'],
        img: 'scene_shampoo', w: 900, h: 600,
      },
      {
        n: '5',
        title: 'ทรีทเมนต์คาเฟอีน',
        lines: ['ทาบนเส้นผมที่เปียกหลังสระเป็นหลัก|โดนหนังศีรษะได้', 'ทิ้งไว้ 2–3 นาที', 'แล้วล้างออกให้สะอาด'],
        img: 'scene_treatment', w: 900, h: 600,
      },
    ],
  },
  {
    code: 'T4',
    head: 'เพิ่มขั้นตอนนี้',
    steps: [
      {
        n: '6',
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
  'ต้องล้างเจลออกให้สะอาดทุกครั้ง',
  'ข้อควรระวังสำหรับเจล: ห้ามใช้บริเวณที่มีแผล|หากเข้าตาให้ล้างทันที|หากมีอาการผิดปกติให้หยุดใช้',
  'รอบที่เหมาะสม: สัปดาห์ละ 1–2 ครั้ง',
  'สามารถตรวจหนังศีรษะด้วยกล้องอีกครั้ง|เพื่อเปรียบเทียบก่อนและหลังบริการ',
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
            </div>
          ))}
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

      {/* B-5 참고 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <ul className="mx-auto max-w-xl space-y-2.5">
          {NOTES.map((n) => (
            <li key={n} className="flex gap-2.5 text-[13px] leading-relaxed text-brand-gold">
              <span aria-hidden>·</span>
              <span><Phrase text={n} /></span>
            </li>
          ))}
        </ul>
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
