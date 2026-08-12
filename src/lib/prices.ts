import { ORDER_API_BASE } from '@/data/order';

/**
 * 가격 조회 — Edge Function `trading-prices` (2026-08-12 신설).
 *
 * 🚨 **빌드 산출물에 가격이 없다.** 브랜드사(세리) 조건이 비회원·해외 접속자 가격 비노출이라,
 *    정적 사이트에 값을 적어 두면 그대로 공개된다. 가격은 이 요청으로만 들어온다.
 * 🚨 서버는 ① 접속 국가(태국) ② LINE 회원(LIFF ID token) 두 가지를 보고 판단한다.
 *    실패 응답에는 가격이 한 건도 들어 있지 않다(이유만 온다).
 * 🚨 `enquiryOnly` 품목은 성공 응답에도 가격이 없다 — 화면은 "LINE으로 문의"만 안내하고 주문을 받지 않는다.
 */

/**
 * 화면 문구 — 지정된 것만 쓴다(임의 변형 금지).
 * 서버 컴포넌트에서도 쓸 수 있도록 클라이언트 전용 파일이 아니라 여기에 둔다.
 */
export const PRICE_LOGIN_LABEL = 'เข้าสู่ระบบด้วย LINE เพื่อดูราคา';
export const PRICE_BLOCKED_LABEL = 'กรุณาสอบถามราคาทาง LINE';
export const PRICE_ENQUIRY_LABEL = 'สอบถามราคาทาง LINE';
/** 가격은 보이지만 아직 주문을 받지 않는 구간. 서버 `trading-order-create`의 안내와 같은 문장을 쓴다. */
export const CHECKOUT_CLOSED_LABEL = 'ขณะนี้ยังไม่เปิดให้สั่งซื้อ';
/** 값을 모르는 동안 금액 자리에 두는 표시. 새 문구를 만들지 않으려고 기호만 쓴다. */
export const PRICE_UNKNOWN = '—';

/**
 * 금액 표기. 값이 없으면 금액 자리를 `—`로 둔다.
 * 🚨 여기서 기본값·근사값을 만들지 않는다 — 화면이 서버보다 앞서 금액을 말하면 안 된다.
 */
export function priceText(value: number | null): string {
  return value === null ? PRICE_UNKNOWN : `฿${value.toLocaleString('en-US')}`;
}

export type PriceEntry = { price?: number; variants?: Record<string, number> };
export type PriceTable = Record<string, PriceEntry>;

/** 화면이 구분해야 하는 상태. `blocked` = 해외 접속·판매 중단·조회 불가를 한데 묶은 것. */
export type PricePhase = 'loading' | 'ok' | 'no_auth' | 'blocked';

export type PricesResult =
  // checkoutOpen = 결제 오픈 여부. 가격은 보이지만 주문은 아직 못 받는 구간이 있어 따로 온다.
  | { phase: 'ok'; table: PriceTable; shippingFee: number; enquiryOnly: string[]; checkoutOpen: boolean }
  | { phase: 'no_auth'; enquiryOnly: string[] }
  | { phase: 'blocked'; enquiryOnly: string[] };

function enquiryList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((slug): slug is string => typeof slug === 'string') : [];
}

/** 응답이 우리가 아는 모양인지 확인하고 통과시킨다. 모르는 모양이면 가격 없음으로 다룬다. */
function readTable(value: unknown): PriceTable {
  if (typeof value !== 'object' || value === null) return {};
  const out: PriceTable = {};
  for (const [slug, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw !== 'object' || raw === null) continue;
    const entry = raw as { price?: unknown; variants?: unknown };
    const parsed: PriceEntry = {};
    if (typeof entry.price === 'number') parsed.price = entry.price;
    if (typeof entry.variants === 'object' && entry.variants !== null) {
      const variants: Record<string, number> = {};
      for (const [id, price] of Object.entries(entry.variants as Record<string, unknown>)) {
        if (typeof price === 'number') variants[id] = price;
      }
      if (Object.keys(variants).length > 0) parsed.variants = variants;
    }
    if (parsed.price !== undefined || parsed.variants) out[slug] = parsed;
  }
  return out;
}

/**
 * 가격표를 받아 온다. idToken이 없으면 빈 문자열로 보내고 서버가 `no_auth`를 돌려준다.
 * 🚨 실패(네트워크·API 미설정)는 `blocked`로 다룬다 — 모르면 여는 쪽이 아니라 닫는 쪽이 맞다.
 */
export async function fetchPrices(idToken: string): Promise<PricesResult> {
  if (!ORDER_API_BASE) return { phase: 'blocked', enquiryOnly: [] };
  try {
    const res = await fetch(`${ORDER_API_BASE}/trading-prices`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body?.ok === true) {
      return {
        phase: 'ok',
        table: readTable(body.prices),
        shippingFee: typeof body.shippingFee === 'number' ? body.shippingFee : 0,
        enquiryOnly: enquiryList(body.enquiryOnly),
        // 모르면 닫힌 것으로 본다 — 못 받는 주문을 받은 것처럼 보이게 하지 않는다.
        checkoutOpen: body.checkoutOpen === true,
      };
    }
    const enquiryOnly = enquiryList(body?.enquiryOnly);
    // 로그인하면 풀리는 상태만 `no_auth`다. geo_blocked·closed·그 외는 손님이 할 수 있는 게 문의뿐이다.
    if (body?.reason === 'no_auth') return { phase: 'no_auth', enquiryOnly };
    return { phase: 'blocked', enquiryOnly };
  } catch {
    return { phase: 'blocked', enquiryOnly: [] };
  }
}

/** 옵션 제품은 고른 옵션의 값, 단일 제품은 그 값. 모르면 null(화면은 금액을 만들어 내지 않는다). */
export function lookupUnitPrice(table: PriceTable, slug: string, variantId: string | null): number | null {
  const entry = table[slug];
  if (!entry) return null;
  if (entry.variants) {
    if (!variantId) return null;
    return entry.variants[variantId] ?? null;
  }
  return entry.price ?? null;
}
