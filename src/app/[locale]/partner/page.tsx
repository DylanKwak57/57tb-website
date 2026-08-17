/**
 * 파트너(미용실·딜러) 모집 페이지 — 태국어 전용 · unlisted
 *
 * 기획 정본: ~/Projects/57TB/57 CEO/57 Shopee 유통/dealer-targets/05-체험단-캠페인-계획.md
 * 진입 경로: 페이스북 미용업계 그룹 게시글 · 리셉션 LINE 안내 (검색·메뉴 노출 없음)
 *
 * 🚨 이 페이지에 가격을 쓰지 않는다
 *    - 공급가 = 승인된 파트너에게만 (문서·인쇄물에 남기지 않는다)
 *    - 소비자가 = 브랜드사(세리) 조건상 태국 IP + LINE 회원에게만
 * 🚨 태국어는 에이(CFO) 검수 대기 — 신규 작성 문구다.
 * 🚨 과장 표현 금지("100% 정품" 류) — 사실로만 신뢰를 만든다.
 */

import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import { ORDERABLE_SLUGS } from '@/data/order';

/**
 * 노출 품목 = **소매 주문 대상(ORDERABLE_SLUGS)과 동기화**한다.
 * 이유: `status === 'available'`만으로 거르면 **판매 대상이 아닌 품목이 새어나갈 수 있다.**
 *   ORDERABLE_SLUGS는 실제로 주문을 받는 목록이라, 품목이 늘거나 빠져도 자동으로 따라간다.
 *   (카페인 토닉 150ml은 초도물량에 없는데 — 착지원가 문서 실물 목록 — status 기준으로도
 *    이미 걸러지고 있었다. 이 필터는 그 안전장치를 명시적으로 만든 것이다.)
 * ℹ️ 벨리스타 라인만 노출한다 — ACHOA·발렌타인은 별개 브랜드·별도 조건이다.
 */
const SHOWCASE = PRODUCTS.filter(
  (p) => p.slug.startsWith('bellista-') && p.status === 'available' && ORDERABLE_SLUGS.includes(p.slug),
);

/**
 * 🚨 **미스트를 주력으로 크게, 나머지는 작게**(2026-08-15 대표님 확정 — B안).
 * 근거 3가지가 한 방향이다:
 *   ① 재고 — 초도 438개 중 **미스트가 336개(77%)**. 3스텝 10 · 카페인 10 · 겔 7개라
 *      13종을 대등하게 보여주면 "주문했더니 품절"이 반복되고 첫 거래에서 신뢰를 잃는다.
 *   ② 체험단 샘플이 미스트 3향이다.
 *   ③ 2차 발주 방향이 "미스트 위주, 초도의 2배 이상"(대표님).
 * ℹ️ 나머지를 숨기지는 않는다 — 라인업 폭은 보여주되 비중으로 주력을 알린다.
 */
const HERO_SLUGS = ['bellista-silk-mist', 'bellista-keratin-mist', 'bellista-collagen-mist'];

/**
 * 라인 구분은 **홈페이지 `/products`와 같게** 쓴다(2026-08-15 대표님) —
 * `Hair Perfume Line`(protein) · `Scalp Care Line`(scalp). 같은 제품을 두 화면에서 다르게 묶으면
 * 원장이 홈페이지를 볼 때 혼란스럽다.
 * 미스트는 Hair Perfume Line 소속이므로 **별도 "추천" 섹션을 두지 않고 그 라인 맨 앞에 크게** 배치한다
 * (별도 섹션을 만들면 같은 제품이 두 번 나온다).
 */
const PERFUME_MAIN = SHOWCASE.filter((p) => HERO_SLUGS.includes(p.slug));
const PERFUME_REST = SHOWCASE.filter((p) => p.line === 'protein' && !HERO_SLUGS.includes(p.slug));
const SCALP_ITEMS = SHOWCASE.filter((p) => p.line === 'scalp');

const LINE_URL = 'https://line.me/R/ti/p/@57totalbeauty?openExternalBrowser=1';

const REASONS = [
  {
    head: 'นำเข้าอย่างเป็นทางการ มีเลขจดแจ้ง อย.',
    body: 'สินค้าทุกชิ้นผ่านการจดแจ้งกับ อย. ในชื่อบริษัท 57 Total Beauty ตรวจสอบได้ ไม่ใช่สินค้าหิ้ว',
  },
  {
    // 🔑 프레임 = "우리가 어떤 회사인가"가 아니라 **"이 제품이 왜 믿을 만한가"**(2026-08-15 대표님).
    //    원장이 궁금한 건 "이거 팔릴까"다. 재고만 있는 수입상은 이 말을 할 수 없다.
    // 🚨 자사 숫자는 정본 확인 후 쓴다 — 매장 2곳(Asoke·Sai Mai) · **아속점 커트 의자 57석, 태국 최대 규모**.
    //    ℹ️ 매장에서 벨리스타를 실제로 쓰는 것은 사실이다 — 디자이너용 사용·응대 가이드를 만들어 배포했다
    //       (staff.57tb.art/products, 2026-08-10 에이 검수 완료).
    head: 'ผ่านการใช้งานจริงในร้านเสริมสวยที่ใหญ่ที่สุดในประเทศไทย',
    body: 'สาขาอโศกของเรามีเก้าอี้ตัดผม 57 ตัว และเราใช้ผลิตภัณฑ์ Bellista กับลูกค้าจริงทุกวัน เราจึงรู้ว่าตัวไหนลูกค้าซื้อซ้ำ และช่างควรแนะนำอย่างไร',
  },
  {
    head: 'ไม่ขายผ่านออนไลน์ ราคาจึงไม่พัง',
    body: 'Bellista เป็นไลน์สำหรับร้านเสริมสวยโดยเฉพาะ เราไม่ขายบน Shopee, Lazada หรือ TikTok และร้านค้าพันธมิตรก็ไม่ขายออนไลน์เช่นกัน',
  },
];

// 🚨 손님 전달용 자료는 **말로만 하지 말고 실물을 보여준다** — 49장을 실제로 보면 즉시 판단이 선다.
//    링크 = bellista-th (화이트라벨: 가격·57TB 로고 없음 → 원장이 자기 손님에게 그대로 전달 가능)
const MATERIAL_URL = 'https://bellista-th.vercel.app';

const BENEFITS: { text: string; href?: string; linkLabel?: string }[] = [
  { text: 'ราคาสำหรับร้านค้าพันธมิตร (แจ้งหลังยืนยันร้าน)' },
  { text: 'ไม่มีขั้นต่ำในการสั่งซื้อ สั่งจำนวนน้อยได้' },
  {
    text: 'มีภาพสินค้าพร้อมส่งให้ลูกค้าได้ทันที ไม่มีราคาและโลโก้ของเรา ร้านนำไปใช้ได้เลย',
    href: MATERIAL_URL,
    linkLabel: 'ดูภาพทั้งหมด',
  },
  { text: 'จัดส่งทั่วประเทศ' },
];

const STEPS = [
  { n: '1', head: 'ลงทะเบียน', body: 'กรอกชื่อร้าน ลิงก์ Google Maps และผู้ติดต่อ' },
  { n: '2', head: 'ยืนยันร้าน', body: 'ทีมงานตรวจสอบและติดต่อกลับ' },
  { n: '3', head: 'ทดลองใช้', body: 'ส่งสินค้าตัวอย่างให้ทดลองที่ร้าน' },
  { n: '4', head: 'สั่งซื้อ', body: 'สั่งซื้อในราคาสำหรับร้านค้าพันธมิตร' },
];

export default function PartnerPage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      {/* 히어로 */}
      <section className="mx-auto max-w-3xl px-6 pb-14 pt-20 text-center">
        {/* 🔑 수입원(우리)과 브랜드의 관계를 첫 줄에서 보여준다 — 원장이 "누가 파는가"를 바로 안다.
            tracking은 0.3em → 0.2em으로 줄였다(문구가 길어져 모바일에서 줄이 깨진다). */}
        <p className="text-[11px] font-medium tracking-[0.2em] text-brand-champagne sm:text-xs">
          57 TOTAL BEAUTY <span className="text-brand-gold">×</span> BELLISTA KOREA
        </p>
        <h1 className="mt-5 text-3xl font-semibold leading-snug sm:text-4xl">
          ผลิตภัณฑ์ดูแลเส้นผมเกาหลี
          <br />
          สำหรับร้านเสริมสวยโดยเฉพาะ
        </h1>
        {/* 🔑 첫 화면은 **숫자**로 시선을 잡는다 — 아래 §이유2와 각도를 달리한다
            (히어로 = 57석에서 매일 쓴다 / 이유2 = 그래서 무엇을 아는가).
            🚨 두 문장을 한 단락에 넣지 말 것 — 모바일에서 `57 ตัว` 뒤에 `57 Total Beauty`가 붙어
               "57 ตัว 57"로 읽힌다(실측). 반드시 단락을 나눈다. */}
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-brand-white sm:text-base">
          ใช้จริงทุกวันกับลูกค้า ที่สาขาอโศก เก้าอี้ตัดผม 57 ตัว
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-gray-light">
          57 Total Beauty เปิดรับร้านเสริมสวยที่สนใจจำหน่ายผลิตภัณฑ์ Bellista ให้กับลูกค้าของร้าน
        </p>
        <a
          href={LINE_URL}
          className="mt-9 inline-block rounded-full bg-brand-gold px-9 py-3.5 text-sm font-semibold text-brand-black transition hover:opacity-90"
        >
          สอบถามทาง LINE
        </a>
      </section>

      {/* 왜 우리인가 */}
      <section className="border-t border-brand-dark px-6 py-14">
        <div className="mx-auto max-w-3xl space-y-8">
          {REASONS.map((r) => (
            <div key={r.head} className="flex gap-4">
              <span aria-hidden className="mt-2 h-px w-6 shrink-0 bg-brand-gold" />
              <div>
                <h2 className="text-base font-semibold sm:text-lg">{r.head}</h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray-light">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 제품 라인업 — 가격 없음 */}
      <section className="border-t border-brand-dark px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-lg font-semibold sm:text-xl">รายการสินค้า</h2>

          {/* ── Hair Perfume Line — 미스트를 맨 앞에 크게(주력) ── */}
          <p className="mt-10 text-center text-xs tracking-[0.2em] text-brand-gold">HAIR PERFUME LINE</p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {PERFUME_MAIN.map((p) => (
              <div key={p.slug} className="text-center">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-card">
                  <Image
                    src={`/products/${p.slug}/thumb.webp`}
                    alt={p.nameTh}
                    fill
                    sizes="(max-width: 640px) 30vw, 22vw"
                    className="object-contain"
                  />
                </div>
                <p className="mt-3 text-xs leading-snug text-brand-white">{p.nameTh}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-brand-gray-light">มี 3 ขนาด (50 / 80 / 200 มล.)</p>

          <div className="mt-8 grid grid-cols-4 gap-x-3 gap-y-6 sm:grid-cols-6">
            {PERFUME_REST.map((p) => (
              <div key={p.slug} className="text-center">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-card">
                  <Image
                    src={`/products/${p.slug}/thumb.webp`}
                    alt={p.nameTh}
                    fill
                    sizes="(max-width: 640px) 22vw, 15vw"
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 text-[10px] leading-snug text-brand-gray">{p.nameTh}</p>
              </div>
            ))}
          </div>

          {/* ── Scalp Care Line ── */}
          <p className="mt-14 text-center text-xs tracking-[0.2em] text-brand-gold">SCALP CARE LINE</p>
          <div className="mt-6 grid grid-cols-4 gap-x-3 gap-y-6 sm:grid-cols-6">
            {SCALP_ITEMS.map((p) => (
              <div key={p.slug} className="text-center">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-card">
                  <Image
                    src={`/products/${p.slug}/thumb.webp`}
                    alt={p.nameTh}
                    fill
                    sizes="(max-width: 640px) 22vw, 15vw"
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 text-[10px] leading-snug text-brand-gray">{p.nameTh}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 파트너 혜택 */}
      <section className="border-t border-brand-dark px-6 py-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-lg font-semibold sm:text-xl">สิทธิของร้านค้าพันธมิตร</h2>
          <ul className="mt-8 space-y-4">
            {BENEFITS.map((b) => (
              <li key={b.text} className="flex gap-3 text-sm leading-relaxed text-brand-gray-light">
                <span aria-hidden className="text-brand-gold">
                  ✓
                </span>
                <span>
                  {b.text}
                  {b.href && (
                    <a
                      href={b.href}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 whitespace-nowrap font-semibold text-brand-gold underline underline-offset-4"
                    >
                      {b.linkLabel}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 거래 흐름 */}
      <section className="border-t border-brand-dark px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-lg font-semibold sm:text-xl">ขั้นตอน</h2>
          <ol className="mt-9 grid gap-6 sm:grid-cols-2">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-4 rounded-xl bg-brand-card p-5">
                <span className="text-sm font-semibold text-brand-gold">{s.n}</span>
                <div>
                  <p className="text-sm font-semibold">{s.head}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-brand-gray-light">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 마무리 CTA */}
      <section className="border-t border-brand-dark px-6 py-16 text-center">
        <h2 className="text-lg font-semibold sm:text-xl">สนใจร่วมเป็นร้านค้าพันธมิตร</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-gray-light">
          ทักมาทาง LINE เพื่อสอบถามรายละเอียดและราคาสำหรับร้านค้าได้เลย
        </p>
        <a
          href={LINE_URL}
          className="mt-8 inline-block rounded-full bg-brand-gold px-9 py-3.5 text-sm font-semibold text-brand-black transition hover:opacity-90"
        >
          สอบถามทาง LINE
        </a>
        <p className="mt-10 text-xs text-brand-gray">
          บริษัท 57 Total Beauty · ผู้นำเข้าและผู้จดแจ้ง อย. ผลิตภัณฑ์ Bellista ในประเทศไทย
        </p>
      </section>
    </main>
  );
}
