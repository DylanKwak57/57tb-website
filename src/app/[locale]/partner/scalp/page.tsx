/**
 * 두피케어 체험단 모집 랜딩 — Scalp Care 샘플 키트 · 태국어 전용 · unlisted (2026-11-02)
 *
 * 기획 정본: ~/Projects/57TB/57 CEO/57 Shopee 유통/dealer-targets/05-체험단-캠페인-계획.md §두피케어 샘플 키트 상자
 * 틀 = `/partner/mist` 를 그대로 복제했다(대표님 11/2 "미스트처럼 신청 페이지").
 *
 * 🚨 이 페이지의 역할 = "이 체험단에 신청할까"를 결정시키는 것
 *    └ 받은 뒤 사용법은 `/th/partner/guide/scalp`(상자 QR 도착지)가 맡는다 — 여기서는 링크만.
 *
 * ✅ 확정 (2026-11-02 대표님)
 *    ① 모집 = 미스트와 같게 — 선착 10곳 표시 · 30곳 마감(서버 `_shared/trial.ts` ROUNDS.scalp cap)
 *    ② 키트 = 겔 · 카페인 샴푸 · 카페인 트리트먼트 앰플 각 4개 = 4회 체험(05 §샘플 키트 상자)
 *    ③ 키트 배포 = 이 신청 + 우리가 골라 직접 보내기(10/29) — 둘 다 같은 노션 보드
 *
 * 문구: 대부분 기존 승인·라이브 문구 재사용(헤드라인 = 에이님 발안 05 §10 · 프로그램·가격 = 두피 가이드 ·
 *       절차·폼·회사 줄 = 미스트 페이지). 신규 = 머리 작은 글자·섹션 제목 2개·가이드 링크 문구 → 에이님 검수 묶음.
 */
import Image from 'next/image';
import Link from 'next/link';
import KitBox from '@/components/partner/KitBox';
import TrialForm from '@/components/partner/TrialForm';

/** 모집 중 여부. 마감되면 false — 페이지는 살리고 폼만 내린다(미스트와 같음). */
const IS_OPEN = true;

/** 파트너 전용 OA `57TB Partner`(@347jyzxd) */
const LINE_URL = 'https://line.me/R/ti/p/@347jyzxd?openExternalBrowser=1';

/** 프로그램 — 두피 가이드 PROGRAMS 와 같은 문구(T4 토닉은 키트에 없어 뺐다). */
const PROGRAMS = [
  { code: 'T1', title: 'สเกลลิ่งหนังศีรษะ', lines: ['เจลสเกลลิ่งยูคาลิปตัส', 'ตามด้วยแชมพูสูตรเย็น'], time: 'ประมาณ 18–20 นาที' },
  {
    code: 'T3',
    title: 'สเกลลิ่ง + บำรุงเข้มข้น',
    lines: ['เจลสเกลลิ่งยูคาลิปตัส', 'แชมพูคาเฟอีน', '+ ทรีทเมนต์คาเฟอีน'],
    time: 'ประมาณ 25–30 นาที',
  },
];

/** 매장 시술 제품 — 두피 가이드 PRODUCTS_USED 와 같은 문구. 링크 = 상품 페이지(원장 승인 후 원장 가격, 05 §7) */
const SALON_PRODUCTS = [
  { slug: 'bellista-scaling-gel', name: 'เจลสเกลลิ่ง ยูคาลิปตัส', size: '8ml × 48' },
  { slug: 'bellista-caffeine-shampoo', name: 'แชมพู คาเฟอีน', size: '750ml' },
  { slug: 'bellista-caffeine-treatment', name: 'ทรีทเมนต์ คาเฟอีน', size: '750ml' },
];

/** 홈케어 — 두피 가이드 HOMECARE 와 같은 문구·사진(200ml 은 2차 입고 후 판매라 링크 없음) */
const HOMECARE = [
  { step: 'STEP 1', name: 'แชมพูคาเฟอีน', size: '200ml', img: 'home-shp200', w: 227 },
  { step: 'STEP 2', name: 'ทรีทเมนต์คาเฟอีน', size: '200ml', img: 'home-trt200', w: 226 },
  { step: 'STEP 3', name: 'คาเฟอีน แฮร์ โทนิค', size: '150ml', img: 'home-tonic', w: 250 },
];

/** 사용법 — 두피 가이드(`/guide/scalp`) 단계 3–6 의 제목·문구·그림 그대로(T3 기준 · 키트 = 겔·샴푸·트리트 각 4) */
const HOW_TO = [
  { n: '1', title: 'ทาเจลสเกลลิ่ง', lines: ['แบ่งผม ทาให้ทั่วหนังศีรษะ', '1 คน ใช้ 1 แอมพูล'], img: 'apply', h: 600 },
  { n: '2', title: 'นวด แล้วล้างให้สะอาด', lines: ['นวดหนังศีรษะเบา ๆ ให้ทั่ว', 'ล้างเจลออกให้หมดก่อนสระ'], img: 'massage', h: 675 },
  { n: '3', title: 'แชมพูคาเฟอีน', lines: ['นวดให้เกิดฟอง', 'ทิ้งไว้ 1–3 นาที', 'แล้วล้างออกให้สะอาด'], img: 'scene_shampoo', h: 600 },
  { n: '4', title: 'ทรีทเมนต์คาเฟอีน', lines: ['ทาบนเส้นผมที่เปียก|หลังสระเป็นหลัก', 'ทิ้งไว้ 2–3 นาที', 'แล้วล้างออกให้สะอาด'], img: 'scene_treatment', h: 600 },
];

/** 신청 절차 — 미스트 페이지와 같은 문구 */
const STEPS = [
  { n: '1', head: 'เชื่อมต่อ LINE', body: 'แล้วกรอกชื่อร้าน ลิงก์ Google Maps และผู้ติดต่อ' },
  { n: '2', head: 'ยืนยันร้าน', body: 'ทีมงานตรวจสอบและติดต่อกลับทาง LINE' },
  { n: '3', head: 'ทดลองใช้', body: 'ส่งสินค้าตัวอย่างให้ทดลองที่ร้าน' },
];

export default function PartnerScalpPage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      {/* 히어로 — 헤드라인 = 에이님 발안(05 §10, 스칼프 라인용으로 보관해 둔 문구) */}
      <section className="mx-auto max-w-3xl px-6 pb-14 pt-20 text-center">
        <p className="text-[11px] font-medium tracking-[0.2em] text-brand-gold sm:text-xs">
          รับสมัครร้านทดลองใช้ · Scalp Care
        </p>
        <h1 className="mt-5 text-3xl font-semibold leading-snug sm:text-4xl">
          ผมสวย
          <br />
          เริ่มต้นที่หนังศีรษะ
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-brand-white sm:text-base">
          Scalp Care Line จาก Bellista
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-gold">
          {/* 의미 덩어리로만 줄바꿈 — "ตัดสิน/ใจ" 끊김 방지(11/2 휴대폰 폭 실측) */}
          <span className="inline-block">57 Total Beauty</span>{' '}
          <span className="inline-block">เปิดให้ร้านเสริมสวย</span>
          <span className="inline-block">ทดลองใช้ก่อนตัดสินใจ</span>
        </p>
        {IS_OPEN && (
          <p className="mx-auto mt-6 max-w-xl rounded-lg bg-brand-card px-5 py-3 text-[13px] leading-relaxed text-brand-white">
            รับ 10 ร้านแรก · หากมีผู้สนใจมาก จะพิจารณาเพิ่มเติม
          </p>
        )}
      </section>

      {/* 새 메뉴 — 원장의 질문 "우리 가게에서 무엇을 팔 수 있나"에 프로그램으로 답한다 */}
      <section className="border-t border-brand-dark px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-lg font-semibold sm:text-xl">เพิ่มเมนูใหม่ให้ร้าน</h2>
          <div className="mx-auto mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
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
                <p className="mt-3 text-[12px] font-semibold">{p.time}</p>
              </div>
            ))}
          </div>
          {/* 시장 범위만 — 우리 시술가는 쓰지 않는다(두피 가이드와 같은 출처) */}
          <div className="mx-auto mt-6 max-w-xl rounded-xl bg-brand-card p-5 text-center">
            <p className="text-[13px] font-semibold">ช่วงราคาบริการดูแลหนังศีรษะในกรุงเทพฯ</p>
            <p className="mt-2 text-2xl font-semibold text-brand-gold">฿490 – ฿2,500</p>
            <p className="mt-2 text-[11px] text-brand-gold">สำรวจจากร้านเฮดสปาในกรุงเทพฯ · สิงหาคม 2026</p>
          </div>
        </div>
      </section>

      {/* 제품 실물 — 매장 시술용(750ml) + 손님에게 파는 홈케어(200ml·토닉). 문구·사진 = 두피 가이드 */}
      <section className="border-t border-brand-dark px-6 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-lg font-semibold sm:text-xl">ผลิตภัณฑ์ที่ใช้ในโปรแกรม</h2>
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-4">
            {SALON_PRODUCTS.map((p) => (
              <Link key={p.slug} href={`/th/products/${p.slug}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-card transition group-hover:opacity-85">
                  <Image
                    src={`/products/${p.slug}/thumb.webp`}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 30vw, 180px"
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 text-[12px] font-medium leading-snug">
                  {/* 띄어쓰기 자리에서만 줄바꿈 — ยูคาลิ/ปตัส 끊김 방지(11/2 휴대폰 폭 실측) */}
                  {p.name.split(' ').map((w, j) => (
                    <span key={j}>
                      {j > 0 && ' '}
                      <span className="inline-block">{w}</span>
                    </span>
                  ))}
                </p>
                <p className="mt-0.5 text-[12px] text-brand-gold">{p.size}</p>
              </Link>
            ))}
          </div>

          <h2 className="mt-14 text-lg font-semibold sm:text-xl">ที่ร้านดูแลล้ำลึก ที่บ้านดูแลทุกวัน</h2>
          <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-brand-gold sm:text-sm">
            <span className="block">แนะนำให้ลูกค้าดูแลต่อเนื่องด้วยผลิตภัณฑ์โฮมแคร์</span>
            <span className="block">เพื่อเสริมการดูแลระหว่างครั้งที่มารับบริการ</span>
          </p>
          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-4">
            {HOMECARE.map((h) => (
              <div key={h.step}>
                <div className="flex h-36 items-center justify-center rounded-lg bg-brand-card py-3 sm:h-44">
                  <Image
                    src={`/partner/guide/${h.img}.webp`}
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

      {/* 체험 세트 — 두피 가이드의 키트 상자 블록을 그대로 쓴다 */}
      {IS_OPEN && (
        <section className="border-t border-brand-dark pt-14">
          <h2 className="px-6 text-center text-lg font-semibold sm:text-xl">ชุดทดลองที่ร้านจะได้รับ</h2>
          <p className="mx-auto mt-4 max-w-md px-6 text-center text-[13px] leading-relaxed text-brand-gold">
            ให้ช่างและลูกค้าได้ลองจริงก่อน แล้วค่อยตัดสินใจ
          </p>
          {/* 실물 앰플 사진(세리 누끼 원본)으로 만든 구성 그림 — 노션 상자 시안(AI 그림)은 태국어가 깨져 쓰지 않는다(11/2) */}
          <div className="mx-auto mt-8 max-w-xl px-6">
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/partner/scalp/kit-ampoules.webp"
                alt="Scaling Gel · Caffeine Shampoo · Caffeine Treatment × 4"
                width={1200}
                height={570}
                className="h-auto w-full"
              />
            </div>
          </div>
          <div className="mt-6">
            <KitBox />
          </div>

          {/* 사용법 — 두피 가이드 단계 그림·문구 재사용 */}
          <div className="mx-auto max-w-xl px-6 pb-4">
            <h3 className="text-center text-base font-semibold sm:text-lg">วิธีใช้ผลิตภัณฑ์</h3>
            <ol className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6">
              {HOW_TO.map((s) => (
                <li key={s.n}>
                  {/* 그림 비율을 3:2 로 맞춰 두 칸의 글자 줄을 가지런히 */}
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-brand-card">
                    <Image
                      src={`/partner/guide/${s.img}.webp`}
                      alt={s.title}
                      fill
                      sizes="(max-width: 640px) 45vw, 280px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-2 text-[13px] font-semibold">
                    <span className="text-brand-gold">{s.n}</span> {s.title}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-brand-gold">
                    {s.lines.map((l) => (
                      <span key={l} className="block">
                        {/* `|` = 의미 덩어리 경계 — 그 자리에서만 줄바꿈 */}
                        {l.split('|').map((w, j) => (
                          <span key={j} className="inline-block">
                            {w}
                          </span>
                        ))}
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-4 pb-14 text-center">
            <Link href="/th/partner/guide/scalp" className="text-[13px] text-brand-gold underline underline-offset-4">
              ดูคู่มือฉบับเต็ม →
            </Link>
          </p>
        </section>
      )}

      {/* 신청 절차 */}
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

      {/* 신청 폼 — 미스트와 같은 컴포넌트. 마감 숫자는 서버 ROUNDS.scalp 가 정한다. */}
      <section className="border-t border-brand-dark px-6 py-16 text-center">
        {IS_OPEN ? (
          <>
            <h2 className="text-lg font-semibold sm:text-xl">สนใจทดลองใช้ที่ร้าน</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-gold">
              กรอกข้อมูลร้าน ทีมงานจะตรวจสอบและติดต่อกลับ
            </p>
            <div className="mt-9">
              <TrialForm round="scalp" lineUrl={LINE_URL} />
            </div>
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
