/**
 * 파트너(미용실·딜러) **상시 소개** 페이지 — 태국어 전용 · unlisted
 *
 * 기획 정본: ~/Projects/57TB/57 CEO/57 Shopee 유통/dealer-targets/05-체험단-캠페인-계획.md
 *
 * 🚨 이 페이지의 역할 = **"이 회사와 거래할 만한가"를 판단시키는 것** (2026-08-28 확정)
 *    ├ 여기서 하는 것: 우리가 누구 · 왜 우리 · 뭘 파나 · 조건이 뭔가
 *    └ 여기서 **하지 않는 것**: 체험단 신청·절차 안내 → 회차 페이지(`/partner/mist` 등)
 *
 *    상설 매장(이 페이지)과 기간 한정 행사장(회차 페이지)의 관계다.
 *    체험단이 없는 달에도 이 페이지는 살아 있고, 리셉션 안내·명함·소개로 들어온 원장을 받는다.
 *    🚨 그래서 `STEPS`(등록→확인→체험)를 여기 두지 않는다 — 모집이 없는 기간에
 *       "등록하세요"라고 말하면서 등록할 곳이 없는 상태가 된다(2026-08-28 제거).
 *
 * 진입 경로: 리셉션 LINE 안내 · 명함 · 소개 (검색·메뉴 노출 없음)
 *   ※ 페이스북 체험단 게시글은 이 페이지가 아니라 **회차 페이지**로 보낸다.
 *
 * 🚨 이 페이지에 가격을 쓰지 않는다
 *    - 공급가 = 승인된 파트너에게만 (문서·인쇄물에 남기지 않는다)
 *    - 소비자가 = 브랜드사(세리) 조건상 태국 IP + LINE 회원에게만
 * 🚨 태국어는 에이(CFO) 검수 대기 — 신규 작성 문구다.
 * 🚨 과장 표현 금지("100% 정품" 류) — 사실로만 신뢰를 만든다.
 */

import Image from 'next/image';
import { PRODUCTS } from '@/data/products';

/**
 * 🚨 파트너 노출 목록은 **소비자 카탈로그(ORDERABLE_SLUGS)와 분리한다** (2026-08-25).
 *   전에는 ORDERABLE_SLUGS를 안전 필터로 썼는데, **파트너에게는 팔지만 소비자에게는 안 파는
 *   품목**(스케일링 겔 = 시술 전용)이 생기면서 전제가 깨졌다. 겔을 소비자 카탈로그에서 빼는
 *   순간 파트너 페이지에서도 같이 사라진다.
 * ⇒ 안전 필터라는 목적은 유지하되, 목록을 파트너용으로 따로 둔다.
 * ℹ️ 벨리스타 라인만 노출한다 — ACHOA·발렌타인은 별개 브랜드·별도 조건이다.
 */
const PARTNER_SLUGS = [
  // Protein Care — 손님에게 판매
  'bellista-keratin-mist', 'bellista-silk-mist', 'bellista-collagen-mist',
  'bellista-keratin-nourish-serum', 'bellista-silk-shine-serum', 'bellista-collagen-moist-serum',
  'bellista-keratin-water-pack', 'bellista-silk-curl-cream', 'bellista-collagen-aqua-essence',
  // Scalp Care — 매장 시술 + 판매 (겔은 시술 전용이라 소비자 카탈로그에는 없다)
  'bellista-scaling-gel', 'bellista-caffeine-shampoo', 'bellista-caffeine-treatment', 'bellista-3step-set',
];

const SHOWCASE = PRODUCTS.filter(
  (p) => p.status === 'available' && PARTNER_SLUGS.includes(p.slug),
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
 * `Protein Care Line`(protein) · `Scalp Care Line`(scalp). 같은 제품을 두 화면에서 다르게 묶으면
 * 원장이 홈페이지를 볼 때 혼란스럽다.
 * 미스트는 Protein Care Line 소속이므로 별도 "추천" 섹션을 두지 않는다 (2026-08-25: 제형 3그룹으로 균등 배치)
 * (별도 섹션을 만들면 같은 제품이 두 번 나온다).
 */
const MIST_ITEMS = SHOWCASE.filter((p) => HERO_SLUGS.includes(p.slug));
const SERUM_ITEMS = SHOWCASE.filter((p) => p.slug.endsWith('-serum'));
const LEAVEIN_ITEMS = SHOWCASE.filter(
  (p) => p.line === 'protein' && !HERO_SLUGS.includes(p.slug) && !p.slug.endsWith('-serum'),
);
const SCALP_ITEMS = SHOWCASE.filter((p) => p.line === 'scalp');

/**
 * 🚨 파트너 전용 OA `57TB Partner`(@347jyzxd) — 2026-08-28 교체.
 *   종전엔 손님 상담봇(@57totalbeauty)을 가리켰다. 그 채널은 **Provider 가 달라**
 *   원장의 userId 가 우리 DB(57totalbeauty Auto)와 통하지 않고, 원장이 손님 AI(아리)와 만난다.
 *   채널 상세 = 05 §9-d-1-2. Channel ID 2011281785 · LIFF 2011282070-E7JS0wkt
 */
const LINE_URL = 'https://line.me/R/ti/p/@347jyzxd?openExternalBrowser=1';

/**
 * 🚨 어필 3개 = **원장이 실제로 묻는 순서**로 답한다 (2026-08-28 대표님 방향 + 조사).
 *   ① "이거 팔릴까?" → 우리가 매일 써서 **아는 것**  ② "믿을 만한가?" → 진짜 한국산 + FDA
 *   ③ "가격 지킬 수 있나?" → 오픈마켓 미판매
 *
 * 🔑 ①이 "57석에서 쓴다"가 아니라 **"그래서 무엇을 아는가"** 인 이유 — 히어로가 이미
 *    `เก้าอี้ตัดผม 57 ตัว`로 그 사실을 말한다. 같은 말을 두 번 하면 둘 다 약해진다.
 *    히어로 = 사실(57석에서 쓴다) / ① = 그 사실이 원장에게 주는 것(재구매 데이터·디자이너 가이드).
 * 🔑 "재고 부담 없음"은 여기 넣지 않는다 — 아래 BENEFITS 에 `ไม่มีขั้นต่ำ` 로 이미 있다.
 * 🚨 경쟁사 실명을 쓰지 않는다 — GOSEN 이 광둥성 OEM 인 것은 조사로 확인된 사실이지만
 *    (plan.md §281), 페이지에 실명을 적으면 분쟁 소지가 된다. "그런 제품이 있다"까지만 쓴다.
 * 🚨 제조사 정보(1998년 설립·(주)세리화장품)는 쓰지 않는다 — 노출 여부가 05 §10-a 미결이다.
 */
const REASONS = [
  {
    head: 'เรารู้ว่าตัวไหนลูกค้าซื้อซ้ำ',
    body: 'เพราะเราใช้เองทุกวัน เราจึงรู้ว่าลูกค้าแบบไหนเหมาะกับตัวไหน และช่างควรแนะนำอย่างไร เรามีคู่มือสำหรับช่างที่ใช้จริงในร้านของเรา และส่งให้ร้านค้าพันธมิตรด้วย',
  },
  {
    head: 'ผลิตในเกาหลีจริง นำเข้าอย่างเป็นทางการ',
    body: 'ในตลาดมีสินค้าสไตล์เกาหลีที่ไม่ได้ผลิตในเกาหลี Bellista ผลิตในประเทศเกาหลี และจดแจ้ง อย. ในชื่อบริษัท 57 Total Beauty ตรวจสอบเลขจดแจ้งได้ ไม่ใช่สินค้าหิ้ว',
  },
  {
    head: 'ไม่ขายบนมาร์เก็ตเพลส ราคาจึงไม่พัง',
    body: 'Bellista เป็นผลิตภัณฑ์สำหรับร้านเสริมสวยโดยเฉพาะ เราไม่ขายบน Shopee, Lazada หรือ TikTok และร้านค้าพันธมิตรก็ไม่ขายบนมาร์เก็ตเพลสเช่นกัน',
  },
];

// 🚨 손님 전달용 자료는 **말로만 하지 말고 실물을 보여준다** — 49장을 실제로 보면 즉시 판단이 선다.
//    링크 = bellista-th (화이트라벨: 가격·57TB 로고 없음 → 원장이 자기 손님에게 그대로 전달 가능)
const MATERIAL_URL = 'https://bellista-th.vercel.app';

// 🚨 혜택은 **"무엇을 준다"가 아니라 "원장이 그것으로 무엇을 할 수 있는가"** 로 쓴다 (2026-08-25 대표님).
//    "제품 이미지를 준다" → 원장은 "우리도 찍는다"고 넘긴다. "손님에게 설명할 자료" 라야 값이 보인다.
// 🚨 판매가를 "자유롭게 정한다"고 쓰지 말 것 — 계약에 **최저 판매가**(우리 소비자가) 조항이 있다.
//    쓸 수 있는 말은 "차액이 매장 이익"까지다.
const BENEFITS: { text: string; href?: string; linkLabel?: string }[] = [
  { text: 'ราคาสำหรับร้านค้าพันธมิตร — ส่วนต่างเป็นกำไรของร้าน แจ้งราคาหลังยืนยันร้าน' },
  { text: 'ไม่มีขั้นต่ำ — เริ่มจากไม่กี่ชิ้นได้ ไม่ต้องแบกสต็อก' },
  {
    // 🚨 '제품 사진'이라 부르지 않는다 (2026-08-25 대표님 지적) — 49장에 성분·향 노트·사용법이 들어 있다.
    //    사진이라 쓰면 원장이 '우리도 찍는다'고 넘긴다. 무엇이 들어 있는지 세 단어로 보여준다.
    text: 'สื่อแนะนำสินค้าสำหรับส่งให้ลูกค้า — ส่วนผสม กลิ่น และวิธีใช้ ไม่มีราคาและโลโก้ของเรา ส่งต่อได้ทันที',
    href: MATERIAL_URL,
    linkLabel: 'ดูภาพทั้งหมด',
  },
  // 🚨 시술 가이드는 **링크를 걸지 않는다** (2026-08-25).
  //    이 페이지는 아직 파트너가 아닌 사람도 본다 — 공개 링크로 두면 경쟁 살롱이 받아 가도 막을 수 없다.
  //    실물은 매장 확인 후 개별 전달한다(절차 3단계 "ทดลองใช้"에서 테스트 세트와 함께).
  //    ℹ️ 공개로 바꾸려면 아래 줄에 href/linkLabel만 더하면 된다 — 되돌리기는 안 된다.
  { text: 'คู่มือการบริการ Scalp Scaling — เพิ่มเมนูใหม่ให้ร้าน เริ่มได้ทันทีหลังยืนยันร้าน' },
  { text: 'จัดส่งทั่วประเทศ' },
];


export default function PartnerPage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      {/* 히어로 */}
      <section className="mx-auto max-w-3xl px-6 pb-14 pt-20 text-center">
        {/* 🔑 수입원(우리)과 브랜드의 관계를 첫 줄에서 보여준다 — 원장이 "누가 파는가"를 바로 안다.
            tracking은 0.3em → 0.2em으로 줄였다(문구가 길어져 모바일에서 줄이 깨진다). */}
        <p className="text-[11px] font-medium tracking-[0.2em] text-brand-gold sm:text-xs">
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
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-gold">
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
                <p className="mt-2 text-sm leading-relaxed text-brand-gold">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 제품 라인업 — 가격 없음. 🔗 id="products" = 회차 페이지의 「전 제품 보기」 목적지(§5-d) */}
      <section id="products" className="border-t border-brand-dark px-6 py-11 scroll-mt-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-lg font-semibold sm:text-xl">รายการสินค้า</h2>

          {/* ── Protein Care Line — 제형 3그룹으로 나눈다 (2026-08-25 대표님)
               🚨 종전에는 미스트만 맨 앞에 크게 뒀는데, 초도 물량 77%가 미스트였을 때의 설계다.
                  타깃이 살롱·헤드스파·딜러·학원으로 넓어져 미스트 편중을 풀었다.
               ℹ️ 라인명 = **Protein Care**(세리 공식 표기 · 노션 카탈로그 `โปรตีนแคร์`와 동일).
                  종전 `HAIR PERFUME LINE`은 9종 중 미스트 3종만 설명하는 이름이었다. ── */}
          <p className="mt-8 text-center text-xs tracking-[0.2em] text-brand-gold">PROTEIN CARE LINE</p>
          <p className="mt-2 text-center text-[13px] text-brand-gold">สำหรับจำหน่ายให้ลูกค้าของร้าน</p>

          <p className="mt-6 text-center text-xs tracking-[0.15em] text-brand-gold">MIST</p>
          <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-x-4 gap-y-5">
            {MIST_ITEMS.map((p) => (
              <div key={p.slug} className="w-[calc(33.333%-0.667rem)] text-center sm:w-[150px]">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-card">
                  <Image
                    src={`/products/${p.slug}/thumb.webp`}
                    alt={p.nameTh}
                    fill
                    sizes="(max-width: 640px) 30vw, 150px"
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 flex min-h-[2.6em] items-start justify-center text-center text-[12px] font-medium leading-snug text-brand-white">{p.nameEn}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[13px] text-brand-gold">มี 3 ขนาด (50 / 80 / 200 มล.)</p>

          <p className="mt-7 text-center text-xs tracking-[0.15em] text-brand-gold">SERUM</p>
          <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-x-4 gap-y-5">
            {SERUM_ITEMS.map((p) => (
              <div key={p.slug} className="w-[calc(33.333%-0.667rem)] text-center sm:w-[150px]">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-card">
                  <Image
                    src={`/products/${p.slug}/thumb.webp`}
                    alt={p.nameTh}
                    fill
                    sizes="(max-width: 640px) 30vw, 150px"
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 flex min-h-[2.6em] items-start justify-center text-center text-[12px] font-medium leading-snug text-brand-white">{p.nameEn}</p>
              </div>
            ))}
          </div>

          <p className="mt-7 text-center text-xs tracking-[0.15em] text-brand-gold">LEAVE-IN</p>
          <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-x-4 gap-y-5">
            {LEAVEIN_ITEMS.map((p) => (
              <div key={p.slug} className="w-[calc(33.333%-0.667rem)] text-center sm:w-[150px]">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-card">
                  <Image
                    src={`/products/${p.slug}/thumb.webp`}
                    alt={p.nameTh}
                    fill
                    sizes="(max-width: 640px) 30vw, 150px"
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 flex min-h-[2.6em] items-start justify-center text-center text-[12px] font-medium leading-snug text-brand-white">{p.nameEn}</p>
              </div>
            ))}
          </div>

          {/* ── Scalp Care Line — 매장 시술 + 판매 ── */}
          <p className="mt-11 text-center text-xs tracking-[0.2em] text-brand-gold">SCALP CARE LINE</p>
          <p className="mt-2 text-center text-[13px] text-brand-gold">สำหรับใช้ในร้านและจำหน่าย</p>
          <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-x-4 gap-y-5">
            {SCALP_ITEMS.map((p) => (
              <div key={p.slug} className="w-[calc(50%-0.5rem)] text-center sm:w-[150px]">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-card">
                  <Image
                    src={`/products/${p.slug}/thumb.webp`}
                    alt={p.nameTh}
                    fill
                    sizes="(max-width: 640px) 45vw, 150px"
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 flex min-h-[2.6em] items-start justify-center text-center text-[12px] font-medium leading-snug text-brand-white">{p.nameEn}</p>
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
              <li key={b.text} className="flex gap-3 text-sm leading-relaxed text-brand-gold">
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

      {/* 마무리 CTA */}
      <section className="border-t border-brand-dark px-6 py-16 text-center">
        <h2 className="text-lg font-semibold sm:text-xl">สนใจร่วมเป็นร้านค้าพันธมิตร</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-gold">
          ทักมาทาง LINE เพื่อสอบถามรายละเอียดและราคาสำหรับร้านค้าได้เลย
        </p>
        <a
          href={LINE_URL}
          className="mt-8 inline-block rounded-full bg-brand-gold px-9 py-3.5 text-sm font-semibold text-brand-black transition hover:opacity-90"
        >
          สอบถามทาง LINE
        </a>
        <p className="mt-10 text-[13px] text-brand-gold">
          บริษัท 57 Total Beauty · ผู้นำเข้าและผู้จดแจ้ง อย. ผลิตภัณฑ์ Bellista ในประเทศไทย
        </p>
      </section>
    </main>
  );
}
