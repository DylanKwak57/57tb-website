/**
 * 프로틴 케어(Protein Care) 사용 가이드 — 파트너 가이드 입구에서 진입 · 태국어 전용 · unlisted (2026-11-02 대표님 "프로틴부터")
 *
 * 구성: 머리 → 3단계(Leave-in → Serum → Mist) → 스타일 고르기 → 제품별 상세(MIST · SERUM · LEAVE-IN)
 *       → 손님에게 권하는 법 → 홈케어 한 줄 → 공통 CTA
 * 틀·클래스는 같은 날 만든 두피케어 가이드(`../scalp/page.tsx`)를 그대로 따른다.
 *
 * 🚨 가격·공급가·우리 시술가를 쓰지 않는다.
 * 🚨 태국어 문구는 승인 명세 그대로다 — 바꾸거나 새 문장을 더하지 말 것.
 *    트리트먼트 표기 = `ทรีทเมนต์` (브로셔의 `ทรีตเมนต์` 과 다르다).
 * 🚨 `ไลน์` 금지(LINE 메신저로 읽힌다).
 * ℹ️ 권하는 법(E)은 에이님 검수 완료된 디자이너 가이드(staff.57tb.art/products) 원문.
 * ℹ️ 일러스트 없음 — 단계마다 그 제품군 썸네일 3개를 작게 둔다.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import GuideCta from '@/components/partner/GuideCta';

export const metadata: Metadata = {
  title: 'Protein Care · วิธีใช้ | Bellista',
};

/**
 * 의미 덩어리 줄바꿈 — 두피 페이지의 Phrase 와 같은 방식.
 * 문자열 안의 공백 자리에서만 줄이 바뀐다(화면 글자는 명세와 한 글자도 다르지 않다).
 * 단 `·` `—` `→` `+` `ๆ` `ซม.` 처럼 혼자 줄 머리에 오면 어색한 조각은 앞 덩어리에 붙인다.
 */
const GLUE_PREV = /^(·|—|→|\+|ๆ|ซม\.)$/;

function Phrase({ text }: { text: string }) {
  const chunks: string[] = [];
  for (const w of text.split(' ')) {
    if (chunks.length > 0 && GLUE_PREV.test(w)) chunks[chunks.length - 1] += ` ${w}`;
    else chunks.push(w);
  }
  return (
    <>
      {chunks.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="inline-block">{c}</span>
        </Fragment>
      ))}
    </>
  );
}

/** 명세의 ` / ` = 줄바꿈 자리. 줄마다 block, 줄 안은 Phrase. */
function Lines({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split(' / ').map((l) => (
        <span key={l} className={`block ${className}`}>
          <Phrase text={l} />
        </span>
      ))}
    </>
  );
}

/* ───────── B. 3단계 ───────── */

type StepData = {
  n: string;
  when: string;
  name: string;
  size: string;
  desc: string;
  sub: string;
  tip?: string;
  thumbs: string[];
};

const STEPS: StepData[] = [
  {
    n: '1',
    when: 'หลังล้างผมครั้งสุดท้าย · นั่งที่เก้าอี้แล้ว',
    name: 'Leave-in',
    size: '180ml',
    desc: 'เช็ดผมด้วยผ้าให้หมาด แล้วทาให้ทั่วผมในปริมาณพอเหมาะ',
    sub: 'ทรีทเมนต์แบบไม่ต้องล้างออก — เลือกสูตรตามสภาพผมของลูกค้า',
    tip: 'Keratin Water Pack · สูตรเข้มข้น — ใช้น้อยก็พอ แบ่งทา 2-3 ครั้งเพื่อไม่ให้จับตัวเป็นก้อน',
    thumbs: ['bellista-keratin-water-pack', 'bellista-silk-curl-cream', 'bellista-collagen-aqua-essence'],
  },
  {
    n: '2',
    when: 'ผมหมาด หรือหลังไดร์จัดแต่งทรงเสร็จ — ได้ทั้งสองแบบ',
    name: 'Serum',
    size: '100ml',
    desc: 'เทปริมาณพอเหมาะลงบนมือ ลูบให้ทั่วแล้วทาให้ทั่วเส้นผม',
    sub: 'เคลือบผมให้เงางามและนุ่มลื่น',
    thumbs: ['bellista-keratin-nourish-serum', 'bellista-silk-shine-serum', 'bellista-collagen-moist-serum'],
  },
  {
    n: '3',
    when: 'เมื่อบริการทั้งหมดเสร็จสิ้น',
    name: 'Mist',
    size: '50 · 80 · 200ml',
    desc: 'ฉีดพ่นให้ทั่วผม ห่างจากผมประมาณ 10-20 ซม.',
    sub: 'กลิ่นหอมติดทนนาน พร้อมบำรุงผม — ปิดท้ายบริการ',
    tip: 'เขย่าขวดให้เข้ากันก่อนใช้ทุกครั้ง',
    thumbs: ['bellista-keratin-mist', 'bellista-silk-mist', 'bellista-collagen-mist'],
  },
];

/* ───────── C. 스타일 고르기 ───────── */

const STYLES = ['เหลือง Keratin', 'ชมพู Silk', 'ฟ้า Collagen'];

/* ───────── D. 제품별 상세 ───────── */

type Card = {
  slug: string;
  en: string;
  en2?: string;
  th: string;
  fit: string;
  feelLabel: 'กลิ่น' | 'เนื้อสัมผัส';
  feel: string;
  rec: string;
};

const GROUPS: { head: string; intro: string; cards: Card[] }[] = [
  {
    head: 'MIST',
    intro: 'มิสต์น้ำหอมผสมโปรตีน กลิ่นระดับน้ำหอมแบรนด์เนม / ใช้ได้ทุกวัน · มี 3 ขนาด — 50ml · 80ml · 200ml',
    cards: [
      {
        slug: 'bellista-keratin-mist',
        en: 'Keratin',
        th: 'เคราติน 500ppm',
        fit: 'ดูแลผมเสีย + เพิ่มกลิ่นหอม / ฟื้นฟูผมเสีย จัดระเบียบเกล็ดผม',
        feelLabel: 'กลิ่น',
        feel: 'Fruity Floral / ผลไม้ผสมดอกไม้ อบอุ่น',
        rec: 'ผมเสียชี้ฟู และอยากให้ / ผมมีกลิ่นหอมอ่อน ๆ',
      },
      {
        slug: 'bellista-silk-mist',
        en: 'Silk',
        th: 'ซิลค์ 500ppm',
        fit: 'เพิ่มเงางาม จัดผมง่าย + กลิ่นหอม / ผมเรียบลื่นเงาสวย',
        feelLabel: 'กลิ่น',
        feel: 'Fresh Floral / ดอกไม้หรูหรา',
        rec: 'มีปัญหาไฟฟ้าสถิต ผมชี้ฟู / อยากได้ผมนุ่มลื่นแบบซิลค์',
      },
      {
        slug: 'bellista-collagen-mist',
        en: 'Collagen',
        th: 'คอลลาเจน 500ppm',
        fit: 'เติมความชุ่มชื้น ยืดหยุ่น + กลิ่นหอม / คืนความเด้งและเงางามให้เส้นผม',
        feelLabel: 'กลิ่น',
        feel: 'Citrus Wave / ซิตรัสสดชื่น',
        rec: 'ผมแห้งต้องการความชุ่มชื้น / ชอบกลิ่นเบาสบายสดชื่น',
      },
    ],
  },
  {
    head: 'SERUM',
    intro: 'ออยล์เซรั่มโปรตีนชนิดซึมเข้าเส้นผม / ขนาด 100ml · ใช้บนผมหมาดหลังสระ ไม่ต้องล้างออก',
    cards: [
      {
        slug: 'bellista-keratin-nourish-serum',
        en: 'Keratin',
        en2: 'Nourish Hair Serum · 100ml',
        th: 'โปรตีนเคราติน · บำรุงเข้มข้น',
        fit: 'บำรุงเข้มข้น / ฟื้นฟูผมเสีย + จัดระเบียบเกล็ดผม',
        feelLabel: 'กลิ่น',
        feel: 'Sweet Fruity / น้ำหอมโทนผลไม้หวาน',
        rec: 'ผมเสีย ชี้ฟู ไม่มีน้ำหนัก / ผมขาดสารอาหาร',
      },
      {
        slug: 'bellista-silk-shine-serum',
        en: 'Silk',
        en2: 'Shine Hair Serum · 100ml',
        th: 'โปรตีนซิลค์ · เงางาม',
        fit: 'เพิ่มความเงางาม / จัดระเบียบเส้นผม + เงาแบบซิลค์',
        feelLabel: 'กลิ่น',
        feel: 'Fresh Floral / น้ำหอมโทนดอกไม้หรูหรา',
        rec: 'อยากได้ผมเรียบสวย ไม่ชี้ฟู / อยู่ทรงเรียบร้อยทั้งวัน',
      },
      {
        slug: 'bellista-collagen-moist-serum',
        en: 'Collagen',
        en2: 'Moist Hair Serum · 100ml',
        th: 'โปรตีนคอลลาเจน · ความชุ่มชื้น',
        fit: 'เติมความชุ่มชื้น / ผมแห้งกลับมาชุ่มชื้น + ยืดหยุ่น',
        feelLabel: 'กลิ่น',
        feel: 'Citrus Wave / น้ำหอมโทนซิตรัสสดชื่น',
        rec: 'ผมแห้งชี้ฟู ผมเส้นเล็ก / (เนื้อบางเบา ไม่หนักผม)',
      },
    ],
  },
  {
    head: 'LEAVE-IN',
    intro: 'ทรีทเมนต์แบบไม่ต้องล้างออก แยกตามชนิดโปรตีน / ขนาด 180ml · โฮมแคร์หลังสระผม',
    cards: [
      {
        slug: 'bellista-keratin-water-pack',
        en: 'Keratin',
        en2: 'Water Pack · 180ml',
        th: 'เคราติน 1,000ppm',
        fit: 'ฟื้นฟูผมเสียเข้มข้น / เติมโปรตีนให้ผมยืดหยุ่น เงางาม',
        feelLabel: 'เนื้อสัมผัส',
        feel: 'วอเตอร์แพ็คแนบติดผม / (ไม่ไหลเยิ้ม)',
        rec: 'ผมเสียมากจากการยืด/ดัดร้อน / และทำสีบ่อย ผมขาด ปลายแตก',
      },
      {
        slug: 'bellista-silk-curl-cream',
        en: 'Silk',
        en2: 'Curl Cream · 180ml',
        th: 'ซิลค์ 500ppm',
        fit: 'คงลอนดัด + เพิ่มวอลลุ่ม / คืนความเด้งให้ลอนที่ตก / ไม่แข็งกระด้าง',
        feelLabel: 'เนื้อสัมผัส',
        feel: 'ครีมบางเบา / (ไม่เหนียวเหนอะหนะ)',
        rec: 'ลูกค้าหลังทำดัด / ที่ลอนคลายเร็ว และผมชี้ฟู',
      },
      {
        slug: 'bellista-collagen-aqua-essence',
        en: 'Collagen',
        en2: 'Aqua Essence · 180ml',
        th: 'คอลลาเจน 500ppm',
        fit: 'เติมความชุ่มชื้น + จัดผมง่าย / ผมเงาสุขภาพดีแบบไม่มัน',
        feelLabel: 'เนื้อสัมผัส',
        feel: 'เอสเซนส์วอเตอร์ดรอป / (ไม่หนักผม)',
        rec: 'ผมเส้นเล็ก ลีบแบนง่าย / มีปัญหาไฟฟ้าสถิต ผมชี้ฟู',
      },
    ],
  },
];

/* ───────── E. 손님에게 권하는 법 (에이님 검수 완료 원문) ───────── */

type RecItem = { kind: 'line'; text: string } | { kind: 'quote'; text: string; label?: string };

const RECOMMEND: { head: string; items: RecItem[] }[] = [
  {
    head: 'ตอนให้ลูกค้าเลือกกลิ่น',
    items: [
      { kind: 'line', text: 'ให้ลูกค้าลองดมกลิ่น Mist ทั้ง 3 กลิ่นก่อน' },
      { kind: 'quote', text: 'ลองดมกลิ่น Mist ดูก่อนนะคะ มี 3 กลิ่นให้เลือก' },
      { kind: 'line', text: 'วิธีให้ดมกลิ่น — ฉีดลงบนหลังมือลูกค้า หรือให้ดมกลิ่นที่ติดอยู่ที่ฝาขวด' },
      { kind: 'line', text: 'ยังไม่ต้องฉีดลงบนผม ให้ลูกค้าเลือกกลิ่นที่ชอบก่อน' },
    ],
  },
  {
    head: 'ตอนเสนอขายโฮมแคร์',
    items: [
      { kind: 'line', text: 'แนะนำโฮมแคร์ให้ลูกค้าใช้ต่อที่บ้าน' },
      { kind: 'quote', text: 'สินค้าที่ใช้กับผมของลูกค้าวันนี้ มีจำหน่ายที่ร้านค่ะ' },
      { kind: 'quote', label: 'Leave-in', text: 'ทรีทเมนต์แนวใหม่ ทาแล้วไม่ต้องล้างออก สะดวกและบำรุงต่อเนื่องทั้งวันค่ะ' },
      { kind: 'quote', label: 'Serum', text: 'เนื้อออยล์ซึมเร็ว ไม่เหนียวเหนอะหนะ แถมหอมติดผมด้วยค่ะ' },
      { kind: 'quote', label: 'Mist', text: 'เช้าไม่มีเวลาสระผม ฉีด Mist ก็ช่วยได้ค่ะ ผมหอมสดชื่นทันที ประหยัดเวลา' },
      { kind: 'quote', label: 'Mist', text: 'ถ้าผมติดกลิ่นอาหาร ฉีด Mist กลบกลิ่นได้เลยค่ะ' },
      { kind: 'quote', text: 'สนใจให้แนะนำเพิ่มเติมไหมคะ' },
    ],
  },
];

/** 단계 하나 — 번호 + 시점 + 제품명·용량 + 설명 + 보조 줄 + 팁 + 썸네일 3개 */
function Step({ s }: { s: StepData }) {
  return (
    <div className="rounded-xl bg-brand-card p-5">
      <div className="flex gap-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-gold text-sm font-semibold text-brand-gold">
          {s.n}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] leading-relaxed text-brand-gold">
            <Phrase text={s.when} />
          </p>
          <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5">
            <span className="text-base font-semibold sm:text-lg">{s.name}</span>
            <span className="text-[12px] text-brand-gold">{s.size}</span>
          </p>
          <p className="mt-2 text-[13px] leading-relaxed sm:text-sm">
            <Phrase text={s.desc} />
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-brand-gold">
            <Phrase text={s.sub} />
          </p>
          {s.tip && (
            <p className="mt-3 rounded-lg bg-brand-black px-3 py-2 text-[12px] leading-relaxed text-brand-gold">
              <span aria-hidden className="mr-1.5">✦</span>
              <Phrase text={s.tip} />
            </p>
          )}
          <div className="mt-4 flex gap-2.5">
            {s.thumbs.map((slug) => (
              <Link
                key={slug}
                href={`/th/products/${slug}`}
                className="relative block h-16 w-16 overflow-hidden rounded-lg bg-brand-black transition hover:opacity-85 sm:h-20 sm:w-20"
              >
                {/* 🔀 11/2: 첫 화면 단계 사진은 바로 불러온다 — 늦게 불러오면 처음에 빈 회색 칸으로 보인다(대표님 지적) */}
                <Image src={`/products/${slug}/thumb.webp`} alt={slug} fill sizes="80px" loading="eager" className="object-contain" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 제품 카드 — 썸네일(링크) + 이름 + 세 칸 */
function ProductCard({ c }: { c: Card }) {
  const rows: [string, string][] = [
    ['เหมาะสำหรับ', c.fit],
    [c.feelLabel, c.feel],
    ['แนะนำให้ลูกค้าแบบไหน', c.rec],
  ];
  return (
    // 🔀 11/2: 휴대폰은 사진을 왼쪽 작게(가로 카드) — 9장이 화면 폭 사진이면 너무 길다. sm 이상은 위 사진·아래 글.
    <div className="flex overflow-hidden rounded-xl bg-brand-card sm:block">
      <Link href={`/th/products/${c.slug}`} className="block w-28 shrink-0 transition hover:opacity-85 sm:w-auto">
        <div className="relative aspect-square bg-brand-card">
          <Image
            src={`/products/${c.slug}/thumb.webp`}
            alt={`${c.en} ${c.en2 ?? ''}`.trim()}
            fill
            sizes="(max-width: 640px) 112px, 230px"
            className="object-contain"
          />
        </div>
      </Link>
      <div className="min-w-0 flex-1 p-4">
        <p className="text-base font-semibold">{c.en}</p>
        {c.en2 && <p className="mt-0.5 text-[12px] text-brand-gold">{c.en2}</p>}
        <p className="mt-1 text-[13px] text-brand-gold">
          <Phrase text={c.th} />
        </p>
        <dl className="mt-4 space-y-3">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[11px] font-semibold tracking-wide text-brand-gold">{label}</dt>
              <dd className="mt-0.5 text-[13px] leading-relaxed">
                <Lines text={value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function PartnerProteinGuidePage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      {/* A. 머리 */}
      <section className="mx-auto max-w-3xl px-6 pb-10 pt-8">
        <Link href="/th/partner/guide" className="text-[13px] text-brand-gold">
          ← วิธีใช้ผลิตภัณฑ์
        </Link>
        <div className="mt-10 text-center">
          <p className="text-[11px] font-medium tracking-[0.2em] text-brand-gold sm:text-xs">
            BELLISTA · PROTEIN CARE · HOW TO USE
          </p>
          <h1 className="mt-5 text-3xl font-semibold leading-snug sm:text-4xl">Protein Care Steps</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-gold sm:text-base">
            <span className="inline-block">ขั้นตอนจบบริการ 3 สเต็ป ·</span>{' '}
            <span className="inline-block">Leave-in → Serum → Mist</span>
          </p>
        </div>
      </section>

      {/* B. 3단계 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto max-w-xl">
          {STEPS.map((s, i) => (
            <Fragment key={s.n}>
              {i > 0 && (
                <p aria-hidden className="py-3 text-center text-lg text-brand-gold">
                  ↓
                </p>
              )}
              <Step s={s} />
            </Fragment>
          ))}
        </div>
      </section>

      {/* C. 스타일 고르기 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold sm:text-xl">
            <Phrase text="เลือกสูตรตามสภาพผมของลูกค้า" />
          </h2>
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {STYLES.map((s) => (
              <span key={s} className="rounded-full border border-brand-gold px-2 py-2 text-[12px] text-brand-gold">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* D. 제품별 상세 */}
      {GROUPS.map((g) => (
        <section key={g.head} className="border-t border-brand-dark px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-lg font-semibold tracking-[0.2em] text-brand-gold sm:text-xl">{g.head}</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-[13px] leading-relaxed sm:text-sm">
              <Lines text={g.intro} />
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {g.cards.map((c) => (
                <ProductCard key={c.slug} c={c} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* E. 손님에게 권하는 법 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto max-w-xl">
          <p className="text-center text-xs tracking-[0.2em] text-brand-gold">RECOMMEND</p>
          <h2 className="mt-2 text-center text-lg font-semibold sm:text-xl">แนะนำลูกค้า</h2>
          <p className="mt-3 text-center text-[13px] leading-relaxed text-brand-gold">
            <Phrase text="เลือกใช้ตามสถานการณ์และสไตล์ของช่าง ไม่จำเป็นต้องเรียงตามลำดับ" />
          </p>
          <div className="mt-8 space-y-4">
            {RECOMMEND.map((r, i) => (
              <div key={r.head} className="rounded-xl bg-brand-card p-5">
                <p className="flex items-baseline gap-3">
                  <span className="text-sm font-semibold text-brand-gold">{i + 1}</span>
                  <span className="text-sm font-semibold">{r.head}</span>
                </p>
                <ul className="mt-3 space-y-2.5">
                  {r.items.map((it, j) =>
                    it.kind === 'line' ? (
                      <li key={j} className="text-[13px] leading-relaxed">
                        <Phrase text={it.text} />
                      </li>
                    ) : (
                      <li key={j} className="border-l-2 border-brand-gold pl-3 text-[13px] leading-relaxed text-brand-gold">
                        {it.label && (
                          <span className="mb-0.5 block text-[11px] font-semibold tracking-[0.15em] text-brand-white">
                            {it.label}
                          </span>
                        )}
                        <Phrase text={it.text} />
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* F. 홈케어 한 줄 */}
      <section className="border-t border-brand-dark px-6 py-12">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold sm:text-xl">
            <Phrase text="ที่ร้านดูแลล้ำลึก ที่บ้านดูแลทุกวัน" />
          </h2>
          <p className="mt-4 text-[13px] leading-relaxed text-brand-gold sm:text-sm">
            <Phrase text="สินค้าที่ใช้กับผมของลูกค้าวันนี้ มีจำหน่ายที่ร้านค่ะ" />
          </p>
        </div>
      </section>

      {/* G. 공통 CTA */}
      <GuideCta orderText="สนใจสั่งซื้อ Bellista Protein Care" />
    </main>
  );
}
