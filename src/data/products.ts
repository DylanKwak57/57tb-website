export type ProductLocale = 'th' | 'en' | 'ko';
export type LocalizedText = { th: string; en?: string; ko?: string };

type BaseProduct = {
  slug: string;
  nameTh: string;
  nameEn: string;
  nameKo?: string;
  brand: 'bellista' | 'achoa' | 'valentine';
  line: 'scalp' | 'protein' | 'achoa' | 'valentine';
  status: 'available' | 'coming-soon';
  description?: LocalizedText;
  accessibleSummary?: { use: LocalizedText; timing: LocalizedText; safety: LocalizedText };
  detailFooter?: 'legacy-status' | 'none';
};

export type FormulaOption = {
  id: 'h1' | 'd1' | 'c2' | 'l2'; step: 1 | 2; code: 'H1' | 'D1' | 'C2' | 'L2';
  title: LocalizedText; description: LocalizedText; evidenceSource: string;
};
export type PairingRule = {
  step1Id: 'h1' | 'd1'; step2Id: 'c2' | 'l2'; allowed: true;
  reason: LocalizedText; workPoint: LocalizedText; evidenceSource: string;
};
export type Product = BaseProduct & ({ detailMode?: 'image'; defaultLocale?: ProductLocale } | {
  detailMode: 'guided-system'; defaultLocale: ProductLocale; description: LocalizedText;
  guidedSystem: { step1Options: FormulaOption[]; step2Options: FormulaOption[]; pairingRules: PairingRule[] };
});

export const PRODUCTS: Product[] = [
  {
    slug: 'bellista-scaling-gel',
    nameTh: 'ยูคาลิปตัส สเกลลิ่งเจล',
    nameEn: 'Eucalyptus Scaling Gel',
    nameKo: '스케일링 겔',
    brand: 'bellista', line: 'scalp',
    status: 'available',
  },
  {
    slug: 'bellista-caffeine-shampoo',
    nameTh: 'แชมพูคาเฟอีน',
    nameEn: 'Caffeine Shampoo',
    nameKo: '카페인 샴푸',
    brand: 'bellista', line: 'scalp',
    status: 'available',
  },
  {
    slug: 'bellista-caffeine-treatment',
    nameTh: 'ทรีตเมนต์คาเฟอีน',
    nameEn: 'Caffeine Treatment',
    nameKo: '카페인 트리트먼트',
    brand: 'bellista', line: 'scalp',
    status: 'available',
  },
  {
    slug: 'bellista-3step-set',
    nameTh: 'คาเฟอีน 3-STEP โซลูชัน',
    nameEn: 'Caffeine 3-Step Set',
    nameKo: '카페인 3종세트',
    brand: 'bellista', line: 'scalp',
    status: 'available',
  },
  {
    slug: 'bellista-caffeine-tonic',
    nameTh: 'โทนิคคาเฟอีน',
    nameEn: 'Caffeine Hair Tonic',
    nameKo: '카페인 헤어 토닉',
    brand: 'bellista', line: 'scalp',
    status: 'coming-soon',
  },
  {
    slug: 'bellista-eucalyptus-shampoo',
    nameTh: 'แชมพูยูคาลิปตัส',
    nameEn: 'Eucalyptus Shampoo',
    nameKo: '유칼립투스 샴푸',
    brand: 'bellista', line: 'scalp',
    status: 'coming-soon',
  },
  {
    slug: 'bellista-silk-mist',
    nameTh: 'ซิลค์ เพอร์ฟูม แฮร์ มิสต์',
    nameEn: 'Silk Perfume Hair Mist',
    nameKo: '실크 퍼퓸 헤어 미스트',
    brand: 'bellista', line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-keratin-mist',
    nameTh: 'เคราติน เพอร์ฟูม แฮร์ มิสต์',
    nameEn: 'Keratin Perfume Hair Mist',
    nameKo: '케라틴 퍼퓸 헤어 미스트',
    brand: 'bellista', line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-collagen-mist',
    nameTh: 'คอลลาเจน เพอร์ฟูม แฮร์ มิสต์',
    nameEn: 'Collagen Perfume Hair Mist',
    nameKo: '콜라겐 퍼퓸 헤어 미스트',
    brand: 'bellista', line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-silk-shine-serum',
    nameTh: 'ซิลค์ ชายน์ แฮร์ เซรั่ม',
    nameEn: 'Silk Shine Hair Serum',
    nameKo: '실크 샤인 세럼',
    brand: 'bellista', line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-keratin-nourish-serum',
    nameTh: 'เคราติน นูริช แฮร์ เซรั่ม',
    nameEn: 'Keratin Nourish Hair Serum',
    nameKo: '케라틴 너리쉬 세럼',
    brand: 'bellista', line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-collagen-moist-serum',
    nameTh: 'คอลลาเจน มอยส์ต แฮร์ เซรั่ม',
    nameEn: 'Collagen Moist Hair Serum',
    nameKo: '콜라겐 모이스트 세럼',
    brand: 'bellista', line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-silk-curl-cream',
    nameTh: 'ซิลค์ เคิร์ลครีม',
    nameEn: 'Silk Curl Cream',
    nameKo: '실크 컬크림',
    brand: 'bellista', line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-keratin-water-pack',
    nameTh: 'เคราติน วอเตอร์แพ็ค',
    nameEn: 'Keratin Water Pack',
    nameKo: '케라틴 워터팩',
    brand: 'bellista', line: 'protein',
    status: 'available',
  },
  {
    slug: 'bellista-collagen-aqua-essence',
    nameTh: 'คอลลาเจน อควา เอสเซนส์',
    nameEn: 'Collagen Aqua Essence',
    nameKo: '콜라겐 아쿠아 에센스',
    brand: 'bellista', line: 'protein',
    status: 'available',
  },
  {
    slug: 'achoa-oneshot-treatment',
    nameTh: 'วันช็อต ทรีตเมนต์ รีแพร์',
    nameEn: 'ACHOA One Shot Treatment Repair',
    nameKo: '아초아 원샷 트리트먼트 리페어',
    brand: 'achoa', line: 'achoa',
    status: 'available',
  },
  {
    slug: 'valentine-magic-straight-system', nameTh: 'Valentine Professional Magic Straight System', nameEn: 'Valentine Professional Magic Straight System', nameKo: 'Valentine Professional 매직 스트레이트 시스템', brand: 'valentine', line: 'valentine', status: 'available', detailMode: 'guided-system', defaultLocale: 'th', detailFooter: 'none',
    description: { th: 'ระบบยืดผม 2 ขั้นตอน: เลือกขั้นตอนที่ 1 ตามสภาพเส้นผม และเลือกนิวทรัลไลเซอร์ตามเนื้อสัมผัส' },
    accessibleSummary: { use: { th: 'ขั้นตอนที่ 1: H1 สำหรับผมสุขภาพดี หรือ D1 สำหรับผมเสีย จากนั้นล้างออกและทำงานต่อด้วยขั้นตอนที่ 2' }, timing: { th: 'H1 15–20 นาที · D1 10–15 นาที · C2 และ L2 5–7 นาทีหลังล้างขั้นตอนที่ 1' }, safety: { th: 'หากไม่แน่ใจเกี่ยวกับสภาพเส้นผม โปรดตรวจสอบฉลากและขั้นตอนก่อนใช้' } },
    guidedSystem: {
      step1Options: [
        { id: 'h1', step: 1, code: 'H1', title: { th: 'สำหรับผมสุขภาพดี' }, description: { th: 'ครีมยืดผมขั้นตอนที่ 1 · 500 ml · 15–20 นาที' }, evidenceSource: 'ฉลาก H1: healthy hair, Step 1, 15–20 min, 500 ml' },
        { id: 'd1', step: 1, code: 'D1', title: { th: 'สำหรับผมเสีย' }, description: { th: 'ครีมยืดผมขั้นตอนที่ 1 · 500 ml · 10–15 นาที' }, evidenceSource: 'ฉลาก D1: damaged hair, Step 1, 10–15 min, 500 ml' },
      ],
      step2Options: [
        { id: 'c2', step: 2, code: 'C2', title: { th: 'นิวทรัลไลเซอร์เนื้อครีม' }, description: { th: 'ขั้นตอนที่ 2 · 500 ml · 5–7 นาที' }, evidenceSource: 'ฉลาก C2: cream neutralizer, Step 2, 5–7 min, 500 ml' },
        { id: 'l2', step: 2, code: 'L2', title: { th: 'นิวทรัลไลเซอร์เนื้อเหลว' }, description: { th: 'ขั้นตอนที่ 2 · 500 ml · 5–7 นาที' }, evidenceSource: 'ฉลาก L2: liquid neutralizer, Step 2, 5–7 min, 500 ml' },
      ],
      pairingRules: ['h1', 'd1'].flatMap((step1Id) => ['c2', 'l2'].map((step2Id) => ({ step1Id: step1Id as 'h1' | 'd1', step2Id: step2Id as 'c2' | 'l2', allowed: true as const, reason: { th: 'แสดงตัวเลือกที่คุณเลือกตามข้อมูลบนฉลากของขั้นตอนที่ 1 และขั้นตอนที่ 2' }, workPoint: { th: 'เลือกขั้นตอนที่ 1 ตามสภาพเส้นผม และเลือกขั้นตอนที่ 2 ตามเนื้อสัมผัสของนิวทรัลไลเซอร์' }, evidenceSource: 'ฉลากระบุลำดับ Step 1 ตามด้วย Step 2; ไม่มีตารางแนะนำจากผู้ผลิต' }))),
    },
  },
  {
    slug: 'valentine-lpp-treatment', nameTh: 'Valentine Professional L.P.P Treatment', nameEn: 'Valentine Professional L.P.P Treatment', nameKo: 'Valentine Professional L.P.P 트리트먼트', brand: 'valentine', line: 'valentine', status: 'available', defaultLocale: 'th', detailFooter: 'none',
    description: { th: 'ทรีตเมนต์โปรตีนแบบล้างออกสำหรับเส้นผมเสีย ขนาด 500 ml' },
    accessibleSummary: { use: { th: 'ใช้หลังสระเป็นทรีตเมนต์ดูแลที่บ้าน ใช้เป็นคลินิกเดี่ยวในซาลอน หรือใช้เตรียมบริเวณผมเสียก่อนดัดหรือทำสี' }, timing: { th: 'ดูแลที่บ้าน: ทิ้งไว้อย่างน้อย 5 นาที · คลินิกเดี่ยวในซาลอน: ประมาณ 20 นาที' }, safety: { th: 'สำหรับการเตรียมผมก่อนดัดหรือทำสี ฉลากไม่ได้ระบุเวลาให้ทิ้งไว้เพิ่มเติม โปรดปฏิบัติตามฉลาก' } },
  },
];

export const SCALP_PRODUCTS = PRODUCTS.filter((p) => p.line === 'scalp');
export const PROTEIN_PRODUCTS = PRODUCTS.filter((p) => p.line === 'protein');
export const ACHOA_PRODUCTS = PRODUCTS.filter((p) => p.line === 'achoa');
export const VALENTINE_PRODUCTS = PRODUCTS.filter((p) => p.line === 'valentine');

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function localize(text: LocalizedText | undefined, locale: string, fallback: ProductLocale = 'th') {
  return text?.[locale as ProductLocale] ?? text?.[fallback] ?? '';
}

export function productName(product: Product, locale: string) {
  if (locale === 'th') return product.nameTh;
  if (locale === 'ko') return product.nameKo ?? product.nameTh;
  return product.nameEn || product.nameTh;
}
