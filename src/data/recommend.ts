import { isOrderable, ORDERABLE_SLUGS } from './order';

/**
 * 제품 상세 "Recommended"(추천 제품) 영역 데이터 (2026-09-23 신설).
 *
 * 정본 기획 = `57 CEO/57 Shopee 유통/홈페이지-추천제품-기획-2026-09-23.md`
 * 서버 = Edge Function `trading-recommend` (재고 있는 slug 목록 + 인기 slug 목록만 준다. 수량·가격 없음)
 *
 * 🚨 가격·판매 수량을 이 영역에 넣지 않는다(대표님 확정 — `ขายแล้ว N ชิ้น` 표시 금지).
 * 🚨 태국어 문구는 승인본·대표님 확정본 그대로다. 글자를 바꾸지 말 것.
 * 검수: 에이님 검수 생략(대표님 2026-09-23 — 표준 표기·기존 게시 문구·대표님 확정 짧은 권유 문구뿐). 나머지 문구는 기존 승인본 그대로.
 */

/** 영역 제목 — 3개 로케일 공통 영어 고정(헤더 메뉴 영어 고정과 같은 방식). */
export const RECOMMEND_TITLE = 'Recommended';
/** 인기 배지 — 최근 30일 매장 판매 10개 이상 · 상위 5개 제품. */
export const BESTSELLER_LABEL = 'BEST SELLER';
/** 짝 제품 표시 — 짝 표에서 온 카드에만. 빈자리 채움 카드에는 붙이지 않는다. */
export const PAIR_LABEL = 'PERFECT PAIR';

const P = 'bellista-';
const PROTEIN_PAIR_FOR_TREATMENT = [
  `${P}keratin-water-pack`, `${P}silk-curl-cream`, `${P}collagen-aqua-essence`,
  `${P}keratin-nourish-serum`, `${P}silk-shine-serum`, `${P}collagen-moist-serum`,
  `${P}keratin-mist`, `${P}silk-mist`, `${P}collagen-mist`,
];

/**
 * 짝 표 (순서 있는 slug 목록) — 근거 = 직원 가이드 마무리 3단계(Leave-in·Serum·Mist) + 같은 향 계열.
 * ACHOA·L.P.P → 리브인 → 세럼 → 미스트(각 케라틴·실크·콜라겐 순, 대표님 결정 2026-09-23 13:35).
 * 판매 종료 3스텝 → 카페인 샴푸 → 트리트먼트 → 토닉(낱개 전환 방침).
 */
export const PAIRS: Record<string, readonly string[]> = {
  [`${P}silk-mist`]: [`${P}silk-shine-serum`, `${P}silk-curl-cream`],
  [`${P}keratin-mist`]: [`${P}keratin-nourish-serum`, `${P}keratin-water-pack`],
  [`${P}collagen-mist`]: [`${P}collagen-moist-serum`, `${P}collagen-aqua-essence`],
  [`${P}silk-shine-serum`]: [`${P}silk-curl-cream`, `${P}silk-mist`],
  [`${P}keratin-nourish-serum`]: [`${P}keratin-water-pack`, `${P}keratin-mist`],
  [`${P}collagen-moist-serum`]: [`${P}collagen-aqua-essence`, `${P}collagen-mist`],
  [`${P}silk-curl-cream`]: [`${P}silk-shine-serum`, `${P}silk-mist`],
  [`${P}keratin-water-pack`]: [`${P}keratin-nourish-serum`, `${P}keratin-mist`],
  [`${P}collagen-aqua-essence`]: [`${P}collagen-moist-serum`, `${P}collagen-mist`],
  [`${P}caffeine-shampoo`]: [`${P}caffeine-treatment`, `${P}caffeine-tonic`],
  [`${P}caffeine-treatment`]: [`${P}caffeine-shampoo`, `${P}caffeine-tonic`],
  [`${P}caffeine-tonic`]: [`${P}caffeine-shampoo`, `${P}caffeine-treatment`],
  'achoa-oneshot-treatment': PROTEIN_PAIR_FOR_TREATMENT,
  'valentine-lpp-treatment': PROTEIN_PAIR_FOR_TREATMENT,
  [`${P}3step-set`]: [`${P}caffeine-shampoo`, `${P}caffeine-treatment`, `${P}caffeine-tonic`],
};

/** 카드 문구(1–2줄, 태국어). 출처는 기획 문서 "카드 추천 이유 문구" 표. */
export const CARD_LINES: Record<string, readonly string[]> = {
  [`${P}keratin-mist`]: ['แฮร์มิสต์ที่เติมโปรตีนเคราตินบำรุงผม พร้อมทิ้งกลิ่นหอมไว้ให้ยาวนาน'],
  [`${P}silk-mist`]: ['แฮร์มิสต์ที่เติมโปรตีนซิลค์บำรุงผม พร้อมทิ้งกลิ่นหอมไว้ให้ยาวนาน'],
  [`${P}collagen-mist`]: ['แฮร์มิสต์ที่เติมโปรตีนคอลลาเจนบำรุงผม พร้อมทิ้งกลิ่นหอมไว้ให้ยาวนาน', 'ซื้อเป็นของขวัญให้คุณแฟนก็เหมาะมากเลยนะคะ'],
  [`${P}silk-shine-serum`]: ['เพิ่มประกายเงางามดั่งไหม'],
  [`${P}keratin-nourish-serum`]: ['เติมสารอาหารถึงปลายผม'],
  [`${P}collagen-moist-serum`]: ['เติมความชุ่มชื้น เติมน้ำ & เสริมความยืดหยุ่น'],
  [`${P}silk-curl-cream`]: ['ลอนธรรมชาติที่คงอยู่ตลอดวัน'],
  [`${P}keratin-water-pack`]: ['บำรุงผมเสียให้ฟื้นกลับมาสวย'],
  [`${P}collagen-aqua-essence`]: ['เพื่อผมสลวยเงางามมีชีวิตชีวา'],
  [`${P}caffeine-shampoo`]: ['โซลูชันบำรุงรากผมแข็งแรง'],
  [`${P}caffeine-treatment`]: ['โซลูชันมัลติแคร์ในขั้นตอนเดียว'],
  [`${P}caffeine-tonic`]: ['เติมพลังให้รากผม เติมชีวิตชีวาให้หนังศีรษะ'],
  'achoa-oneshot-treatment': ['ทรีตเมนต์ฟื้นฟูระดับซาลอน ในขั้นตอนเดียว'],
  'valentine-lpp-treatment': ['ทรีตเมนต์โปรตีนแบบล้างออกสำหรับเส้นผมเสีย', 'คุ้มค่าสุด ๆ ขนาด 500ml ใช้ได้นานค่ะ'],
};

export type Recommendation = { slug: string; pair: boolean; bestseller: boolean };

/**
 * 추천 카드 고르기 (순수 함수).
 *  - inStock 이 null(재고를 모름) → [] (영역을 그리지 않는다 — 계획 검수 차단 1)
 *  - 후보 = 주문 가능 제품(카탈로그 순서) 중 현재 제품 제외
 *  1) 짝 순서대로 재고 있는 것 → pair:true
 *  2) 남은 칸 = 재고 있는 후보를 인기 순서 먼저, 그다음 카탈로그 순서로 → pair:false
 *  중복 없이 최대 max 개.
 */
export function pickRecommendations(
  current: string,
  inStock: readonly string[] | null,
  bestsellers: readonly string[],
  max = 4,
): Recommendation[] {
  if (inStock === null) return [];
  const stockSet = new Set(inStock);
  const bestSet = new Set(bestsellers);
  const candidates = ORDERABLE_SLUGS.filter(isOrderable).filter((slug) => slug !== current && stockSet.has(slug));
  const candidateSet = new Set(candidates);

  const out: Recommendation[] = [];
  const taken = new Set<string>();
  const push = (slug: string, pair: boolean) => {
    if (out.length >= max || taken.has(slug) || !candidateSet.has(slug)) return;
    taken.add(slug);
    out.push({ slug, pair, bestseller: bestSet.has(slug) });
  };

  for (const slug of PAIRS[current] ?? []) push(slug, true);
  for (const slug of bestsellers) push(slug, false);
  for (const slug of candidates) push(slug, false);
  return out;
}
