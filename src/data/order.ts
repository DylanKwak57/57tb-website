import { getProduct, type LocalizedText } from './products';

/**
 * 57TB TRADING 개인 판매 파일럿 — 주문 화면 데이터.
 *
 * 구조 근거: `57 CEO/57 Shopee 유통/57tb-trading-stripe-plan.md`
 * - 회사 제품 페이지(/products)는 정보·연결 역할만 한다.
 * - 결제 직전 화면(/order/<slug>)에 판매자명·문의처·배송·환불 정책을 57TB TRADING 기준으로 표시한다.
 * - 회사 제품 페이지에서 결제 링크로 직접 점프하지 않는다.
 *
 * 🚨 **가격은 이 파일에 없다 (2026-08-12).** 브랜드사(세리) 조건이 **비회원·해외 접속자 가격 비노출**이라,
 *    가격이 빌드 산출물(HTML·JS 청크)에 남으면 안 된다. 정적 사이트라 여기 적는 순간 누구나 볼 수 있다.
 *    - 가격 정본 = Edge Function `_shared/pricing.ts` (서버). 화면은 `trading-prices`로 받아 쓴다.
 *    - 이 파일에는 **구조만** 남긴다 — 어떤 제품에 어떤 용량 옵션이 있는지(id·라벨).
 *    - 값을 다시 넣지 말 것. 기본값·폴백·주석·테스트 픽스처 어느 형태로도 금지.
 *    - 받아온 가격을 쓰는 곳 = `src/components/prices/PriceProvider.tsx`(fetch·상태) + `src/lib/prices.ts`(계약).
 * 배송·환불 정책 확정 2026-07-26 (배송비는 주문 1건당 정액 · 2-3일 발송 · 3일 내 미사용품 교환/환불).
 * 🚨 태국어 문구는 초안이며 에이(CFO) 검수 대기.
 *   검수 페이지(Notion, 태국어 전용): `3a9a2fb1-c15d-81a8-821c-e6d467032a2c`
 *   — 주문·결제·상태조회 전 화면의 손님용 태국어가 모여 있다. 문구를 고치면 그 페이지도 함께 갱신할 것.
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
 * 용량 옵션. 🚨 가격 필드는 두지 않는다 — 값은 `trading-prices`가 준다(`src/lib/prices.ts`).
 * id는 서버 가격표의 variant 키와 같아야 한다(미스트 = 50 / 80 / 200).
 */
export type Variant = { id: string; label: LocalizedText };

/** 퍼퓸 미스트 3종 공통 용량 옵션. */
const MIST_VARIANTS: Variant[] = [
  { id: '50', label: { th: '50 มล.' } },
  { id: '80', label: { th: '80 มล.' } },
  { id: '200', label: { th: '200 มล.' } },
];

type CatalogEntry = { slug: string; variants?: Variant[] };

/** 소매 주문 대상. 여기 없는 제품은 주문 버튼이 뜨지 않는다. */
const CATALOG: CatalogEntry[] = [
  { slug: 'bellista-caffeine-shampoo' },
  { slug: 'bellista-caffeine-treatment' },
  // 🚫 2026-09-04 온라인 오픈 시 제외 — `bellista-3step-set`(세트 폐기 2026-08-31, 낱개 3종은 2차 물량 후 신설)
  //    · `bellista-scaling-gel`(시술 전용 2026-08-18, 서버도 ENQUIRY_ONLY). 상세 페이지는 남기고 주문 버튼만 뺀다.
  { slug: 'bellista-silk-mist', variants: MIST_VARIANTS },
  { slug: 'bellista-keratin-mist', variants: MIST_VARIANTS },
  { slug: 'bellista-collagen-mist', variants: MIST_VARIANTS },
  { slug: 'bellista-silk-shine-serum' },
  { slug: 'bellista-keratin-nourish-serum' },
  { slug: 'bellista-collagen-moist-serum' },
  { slug: 'bellista-silk-curl-cream' },
  { slug: 'bellista-keratin-water-pack' },
  { slug: 'bellista-collagen-aqua-essence' },
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

/**
 * 배송비 자리표시자 — 정책 문구 안에 금액을 적어 두면 그것도 빌드 산출물에 남는 가격이다.
 * 서버에서 받은 배송비로 렌더 시점에 채운다. 못 받았으면 그 줄 자체를 빼서 잘못된 금액을 보이지 않는다.
 */
export const SHIPPING_FEE_TOKEN = '{{shippingFee}}';

export function applyShippingFee(text: string, feeText: string | null): string {
  return text
    .split('\n')
    .flatMap((line) => {
      if (!line.includes(SHIPPING_FEE_TOKEN)) return [line];
      return feeText ? [line.split(SHIPPING_FEE_TOKEN).join(feeText)] : [];
    })
    .join('\n');
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
 * 확정값(2026-07-26 대표님): 배송비는 주문 1건당 정액 · 입금 확인 후 2-3영업일 발송 · 수령 후 3일 내 미사용품 교환/환불.
 * 🚨 배송비 금액은 문구에 적지 않는다 — `SHIPPING_FEE_TOKEN` 자리표시자를 두고 서버 값으로 채운다.
 */
export const POLICY: { key: string; label: LocalizedText; body: LocalizedText | null }[] = [
  {
    key: 'shipping',
    label: { th: 'การจัดส่ง' },
    body: {
      th: [
        // 🚚 2026-08-12: 정액 → 무게·지역 기반으로 바뀌었다. 여기 값은 **최소 금액**이므로
        //    "부터"임을 반드시 밝힌다. 정확한 금액은 주소를 넣으면 주문 화면에서 확정된다.
        `ค่าจัดส่งเริ่มต้น ${SHIPPING_FEE_TOKEN} คิดตามน้ำหนักและจังหวัดปลายทาง`,
        'ดูค่าจัดส่งที่แน่นอนได้ในหน้าสั่งซื้อหลังกรอกที่อยู่',
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
