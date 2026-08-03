import { getProduct, type LocalizedText } from './products';

/**
 * 57TB TRADING 개인 판매 파일럿 — 주문 화면 데이터.
 *
 * 구조 근거: `57 CEO/57 Shopee 유통/57tb-trading-stripe-plan.md`
 * - 회사 제품 페이지(/products)는 정보·연결 역할만 한다.
 * - 결제 직전 화면(/order/<slug>)에 판매자명·문의처·배송·환불 정책을 57TB TRADING 기준으로 표시한다.
 * - 회사 제품 페이지에서 결제 링크로 직접 점프하지 않는다.
 *
 * 판매가 정본: `57 CEO/Scalp Care Business/물류비-착지원가-락타이-260713.md` §8-c
 *   🚨 2026-08-03 기준 전면 개정 — **세리 가격표 국내 소비자가(VAT 포함) ÷ 46.26 × 93%**.
 *   기준은 **세리가 보내온 가격표**이지 벨리스타 온라인몰 판매가가 아니다(둘이 다른 건 한국 소비자
 *   보호법 때문이며, 온라인가가 가격표의 110~120%다). 7/26의 "홈페이지 실판가 80%" 기준은 폐기.
 *   예외 2건: 세럼 470฿(7/26 대표님 확정값 유지, 84%) · 미스트 50ml 140฿(108% — 이 품목만
 *   우리 매입가가 한국 대리점가의 91%로 불리해 93%로는 판매가 성립하지 않음).
 * 배송·환불 정책 확정 2026-07-26 (배송비 건당 30฿ · 2-3일 발송 · 3일 내 미사용품 교환/환불).
 * 🚨 태국어 문구는 초안이며 에이(CFO) 검수 대기.
 *   대기 항목 정본: `57 CEO/57 Shopee 유통/shopee-listings/valentine/review.md`
 */

export const SELLER = {
  /** 카드 명세서·Stripe 표기와 동일해야 한다. */
  name: '57TB TRADING',
  disclosure: {
    th: '57TB TRADING เป็นผู้จำหน่ายรายบุคคล แยกจากบริษัท 57 Total Beauty (ผู้นำเข้า)',
  } satisfies LocalizedText,
  contact: {
    /**
     * 상담 채널(displayName 57TOTALBEAUTY / basicId @igo8936q / premiumId @57totalbeauty).
     * 🚨 `oaMessage` 프리필 형식은 브라우저에서 LINE 홈으로 튕기므로 쓰지 말 것(2026-07-26 실측).
     *    검증된 형식은 `ti/p` 채널 링크뿐이다.
     */
    lineUrl: 'https://line.me/R/ti/p/@57totalbeauty',
    label: { th: 'สอบถามทาง LINE' } satisfies LocalizedText,
  },
} as const;

/** 상담 채널 링크. 외부 브라우저로 열어 LINE 앱이 잡도록 한다. */
export function lineEnquiryUrl() {
  return `${SELLER.contact.lineUrl}?openExternalBrowser=1`;
}

/**
 * 주문 접수 API(Supabase Edge Functions) 기본 URL.
 * 정적 사이트라 API 라우트가 없어 외부 함수로 접수한다 → `trading-backend/`.
 * 값이 없으면 폼에서 주문을 보내지 않고 "준비 중"으로 안내한다(임의 엔드포인트를 만들지 말 것).
 */
export const ORDER_API_BASE: string | null = process.env.NEXT_PUBLIC_ORDER_API_BASE?.trim() || null;

/**
 * 배송비 (2026-07-26 대표님 확정: 건당 30฿ — 상품 개수와 무관하게 주문 1건당).
 * 🚨 서버도 같은 값을 쓴다: Edge Function `trading-order-create`의 `SHIPPING_FEE` env.
 *    한쪽만 바꾸면 화면 금액과 QR 금액이 갈리고 SlipOK 금액 검증에 걸린다 — **반드시 양쪽 함께** 수정.
 */
export const SHIPPING_FEE = 30;

export type Variant = { id: string; label: LocalizedText; price: number };

/** 퍼퓸 미스트 3종 공통 용량·가격 (정본 §8-c, 2026-08-03 개정). */
const MIST_VARIANTS: Variant[] = [
  { id: '50', label: { th: '50 มล.' }, price: 140 },
  { id: '80', label: { th: '80 มล.' }, price: 200 },
  { id: '200', label: { th: '200 มล.' }, price: 400 },
];

type CatalogEntry = { slug: string; price?: number; variants?: Variant[] };

/** 소매 주문 대상. 여기 없는 제품은 주문 버튼이 뜨지 않는다. */
const CATALOG: CatalogEntry[] = [
  { slug: 'bellista-caffeine-shampoo', price: 1040 },
  { slug: 'bellista-caffeine-treatment', price: 1040 },
  { slug: 'bellista-3step-set', price: 1380 },
  // 스케일링 겔: 2026-07-26 업소용 → 소매 전환. 판매 단위 = 48입 박스 그대로(소분 미도입).
  { slug: 'bellista-scaling-gel', price: 1720 },
  { slug: 'bellista-silk-mist', variants: MIST_VARIANTS },
  { slug: 'bellista-keratin-mist', variants: MIST_VARIANTS },
  { slug: 'bellista-collagen-mist', variants: MIST_VARIANTS },
  { slug: 'bellista-silk-shine-serum', price: 390 },
  { slug: 'bellista-keratin-nourish-serum', price: 390 },
  { slug: 'bellista-collagen-moist-serum', price: 390 },
  { slug: 'bellista-silk-curl-cream', price: 300 },
  { slug: 'bellista-keratin-water-pack', price: 300 },
  { slug: 'bellista-collagen-aqua-essence', price: 300 },
];

export const ORDERABLE_SLUGS = CATALOG.map((entry) => entry.slug);

export function orderEntry(slug: string) {
  return CATALOG.find((entry) => entry.slug === slug) ?? null;
}

export function isOrderable(slug: string) {
  const entry = orderEntry(slug);
  if (!entry) return false;
  const product = getProduct(slug);
  return Boolean(product) && product?.status === 'available';
}

/** 옵션이 있는 제품은 가장 낮은 용량 가격을 대표가로 보여준다. */
export function basePrice(slug: string) {
  const entry = orderEntry(slug);
  if (!entry) return null;
  if (entry.variants?.length) return Math.min(...entry.variants.map((variant) => variant.price));
  return entry.price ?? null;
}

/**
 * 결제 안내 문구.
 * 🚨 화면에 결제수단 **선택 UI를 두지 않는다** — 손님은 Stripe Checkout 한 화면 안에서 고른다
 *    (2026-08-03 대표님 확정: 결제 창이 하나여야 깔끔하다). 여기 있는 건 안내 텍스트일 뿐이다.
 * 🚨 실제로 어떤 수단이 뜨는지는 **Stripe 대시보드 설정**이 정한다. 코드에서 지정하지 않는다.
 */
export const PAYMENT_NOTE: LocalizedText = {
  th: 'ชำระเงินผ่าน Stripe — รองรับ PromptPay (สแกน QR) และบัตรเครดิต/เดบิต',
};

/**
 * 배송·환불 정책. 태국 쇼피·라자다 판매자 표준 구성을 따랐다.
 *
 * 🚨 `body: null`이면 화면에 `กำลังอัปเดต`로 표시된다 — **확정되지 않은 값을 문구로 발명하지 않는다.**
 * 🚨 아래 문구는 초안이며 **에이(CFO) 검수 대기**다. 손님에게 처음 나가는 태국어라 네이티브 확인 후 오픈.
 * 확정값(2026-07-26 대표님): 배송비 건당 30฿ · 입금 확인 후 2-3영업일 발송 · 수령 후 3일 내 미사용품 교환/환불.
 */
export const POLICY: { key: string; label: LocalizedText; body: LocalizedText | null }[] = [
  {
    key: 'shipping',
    label: { th: 'การจัดส่ง' },
    body: {
      th: [
        'ค่าจัดส่ง 30 บาท ต่อคำสั่งซื้อ',
        'จัดส่งภายใน 2-3 วันทำการหลังยืนยันการชำระเงิน',
        'จัดส่งโดย Kerry Express / Flash Express / EMS',
        'แจ้งเลขพัสดุให้ทราบเมื่อจัดส่งแล้ว',
      ].join('\n'),
    },
  },
  {
    key: 'refund',
    label: { th: 'การคืนสินค้าและคืนเงิน' },
    body: {
      th: [
        'เปลี่ยนหรือคืนสินค้าได้ภายใน 3 วันหลังได้รับสินค้า เฉพาะสินค้าที่ยังไม่ได้ใช้งาน',
        'กรณีสินค้าชำรุดหรือส่งผิดรายการ: เปลี่ยนสินค้าใหม่หรือคืนเงินเต็มจำนวน และทางร้านรับผิดชอบค่าจัดส่ง',
        'สินค้าที่แกะซีลหรือใช้งานแล้วไม่สามารถคืนได้ (เหตุผลด้านสุขอนามัย)',
        'กรุณาแจ้งพร้อมรูปถ่ายสินค้าและกล่องพัสดุทาง LINE',
      ].join('\n'),
    },
  },
  {
    key: 'payment',
    label: { th: 'การชำระเงิน' },
    // Stripe 단일 결제창(2026-08-03). 슬립 업로드·수동 확인 절차는 없앴다.
    body: {
      th: [
        'ชำระเงินผ่านระบบชำระเงินออนไลน์ Stripe',
        'รองรับ PromptPay (สแกน QR ด้วยแอปธนาคาร) และบัตรเครดิต/เดบิต',
        'ระบบยืนยันคำสั่งซื้ออัตโนมัติทันทีหลังชำระเงินสำเร็จ',
        'ใบเสร็จรับเงินจะส่งไปยังอีเมลที่กรอกในหน้าชำระเงิน',
      ].join('\n'),
    },
  },
  { key: 'contact', label: { th: 'ช่องทางติดต่อ' }, body: { th: 'LINE @57totalbeauty' } },
];
