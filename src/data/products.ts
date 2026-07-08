export interface Product {
  slug: string;
  nameTh: string;
  nameEn: string;
  nameKo: string;
  line: 'scalp' | 'protein';
  status: 'available' | 'coming-soon';
}

export const PRODUCTS: Product[] = [
  {
    slug: 'bellista-scaling-gel',
    nameTh: 'ยูคาลิปตัส สเกลลิ่งเจล',
    nameEn: 'Eucalyptus Scaling Gel',
    nameKo: '스케일링 겔',
    line: 'scalp',
    status: 'available',
  },
  {
    slug: 'bellista-caffeine-shampoo',
    nameTh: 'แชมพูคาเฟอีน',
    nameEn: 'Caffeine Shampoo',
    nameKo: '카페인 샴푸',
    line: 'scalp',
    status: 'available',
  },
  {
    slug: 'bellista-caffeine-treatment',
    nameTh: 'ทรีตเมนต์คาเฟอีน',
    nameEn: 'Caffeine Treatment',
    nameKo: '카페인 트리트먼트',
    line: 'scalp',
    status: 'available',
  },
  {
    slug: 'bellista-3step-set',
    nameTh: 'คาเฟอีน 3-STEP โซลูชัน',
    nameEn: 'Caffeine 3-Step Set',
    nameKo: '카페인 3종세트',
    line: 'scalp',
    status: 'available',
  },
  {
    slug: 'bellista-caffeine-tonic',
    nameTh: 'โทนิคคาเฟอีน',
    nameEn: 'Caffeine Hair Tonic',
    nameKo: '카페인 헤어 토닉',
    line: 'scalp',
    status: 'coming-soon',
  },
  {
    slug: 'bellista-eucalyptus-shampoo',
    nameTh: 'แชมพูยูคาลิปตัส',
    nameEn: 'Eucalyptus Shampoo',
    nameKo: '유칼립투스 샴푸',
    line: 'scalp',
    status: 'coming-soon',
  },
  {
    slug: 'bellista-silk-mist',
    nameTh: 'ซิลค์ เพอร์ฟูม แฮร์ มิสต์',
    nameEn: 'Silk Perfume Hair Mist',
    nameKo: '실크 퍼퓸 헤어 미스트',
    line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-keratin-mist',
    nameTh: 'เคราติน เพอร์ฟูม แฮร์ มิสต์',
    nameEn: 'Keratin Perfume Hair Mist',
    nameKo: '케라틴 퍼퓸 헤어 미스트',
    line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-collagen-mist',
    nameTh: 'คอลลาเจน เพอร์ฟูม แฮร์ มิสต์',
    nameEn: 'Collagen Perfume Hair Mist',
    nameKo: '콜라겐 퍼퓸 헤어 미스트',
    line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-silk-shine-serum',
    nameTh: 'ซิลค์ ชายน์ แฮร์ เซรั่ม',
    nameEn: 'Silk Shine Hair Serum',
    nameKo: '실크 샤인 세럼',
    line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-keratin-nourish-serum',
    nameTh: 'เคราติน นูริช แฮร์ เซรั่ม',
    nameEn: 'Keratin Nourish Hair Serum',
    nameKo: '케라틴 너리쉬 세럼',
    line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-collagen-moist-serum',
    nameTh: 'คอลลาเจน มอยส์ต แฮร์ เซรั่ม',
    nameEn: 'Collagen Moist Hair Serum',
    nameKo: '콜라겐 모이스트 세럼',
    line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-silk-curl-cream',
    nameTh: 'ซิลค์ เคิร์ลครีม',
    nameEn: 'Silk Curl Cream',
    nameKo: '실크 컬크림',
    line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-keratin-water-pack',
    nameTh: 'เคราติน วอเตอร์แพ็ค',
    nameEn: 'Keratin Water Pack',
    nameKo: '케라틴 워터팩',
    line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-collagen-aqua-essence',
    nameTh: 'คอลลาเจน อควา เอสเซนส์',
    nameEn: 'Collagen Aqua Essence',
    nameKo: '콜라겐 아쿠아 에센스',
    line: 'protein',
    status: 'available',
  },
];

export const SCALP_PRODUCTS = PRODUCTS.filter((p) => p.line === 'scalp');
export const PROTEIN_PRODUCTS = PRODUCTS.filter((p) => p.line === 'protein');

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
