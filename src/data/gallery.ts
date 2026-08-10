/**
 * BELLISTA 상세페이지 갤러리 이미지 목록.
 *
 * 자산 생성은 `scripts/generate-bellista-gallery.py`(정본)가 담당한다.
 * `output: 'export'` 정적 사이트라 런타임에 파일 존재를 확인할 수 없으므로,
 * 어떤 번호가 있는지를 여기에 명시한다. 스크립트를 다시 돌려 장수가 바뀌면 이 표도 함께 갱신할 것.
 *
 * 🚨 파일명은 쇼피 소스의 번호를 그대로 보존한다(빠진 번호는 건너뜀).
 *    그래서 "개수"가 아니라 "번호 목록"으로 둔다 — collagen-aqua-essence는 소스에 main-04가 없어
 *    01,02,03,05,06,07,08 7장이다. 개수(7)로 순번을 만들면 없는 main-04를 요청하게 된다.
 */

const MAIN_01_TO_08 = [1, 2, 3, 4, 5, 6, 7, 8];

const GALLERY_MAIN_INDEXES: Record<string, number[]> = {
  'bellista-silk-mist': MAIN_01_TO_08,
  'bellista-keratin-mist': MAIN_01_TO_08,
  'bellista-collagen-mist': MAIN_01_TO_08,
  'bellista-silk-shine-serum': MAIN_01_TO_08,
  'bellista-keratin-nourish-serum': MAIN_01_TO_08,
  'bellista-collagen-moist-serum': MAIN_01_TO_08,
  'bellista-silk-curl-cream': MAIN_01_TO_08,
  'bellista-keratin-water-pack': MAIN_01_TO_08,
  // 소스에 main-04 없음 (쇼피 리스팅 기준) → 7장
  'bellista-collagen-aqua-essence': [1, 2, 3, 5, 6, 7, 8],
  // 두피케어(스칼프케어) 5종 — 2026-07-26 쇼피 대표컷 제작 완료
  'bellista-caffeine-shampoo': MAIN_01_TO_08,
  'bellista-caffeine-treatment': MAIN_01_TO_08,
  'bellista-caffeine-tonic': MAIN_01_TO_08,
  'bellista-3step-set': MAIN_01_TO_08,
  'bellista-scaling-gel': MAIN_01_TO_08,
};

/** 정사각 갤러리 자산이 있는 제품인지. 없으면 썸네일 1장만 쓴다. */
export function hasGallery(slug: string) {
  return (GALLERY_MAIN_INDEXES[slug]?.length ?? 0) > 0;
}

/**
 * 상세페이지 구매 블록에서 쓸 이미지 경로 목록.
 * 갤러리가 없는 제품은 `thumb.webp` 1장만 반환한다.
 */
export function productGallery(slug: string): string[] {
  const indexes = GALLERY_MAIN_INDEXES[slug];
  if (!indexes?.length) return [`/products/${slug}/thumb.webp`];
  return indexes.map((index) => `/products/${slug}/gallery/main-${String(index).padStart(2, '0')}.webp`);
}
