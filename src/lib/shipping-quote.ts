import { ORDER_API_BASE } from '@/data/order';

/**
 * 배송비 견적 (2026-08-12 신설).
 *
 * 🚨 **계산식을 웹에 두지 않는다.** 서버 `trading-shipping-quote` 하나만 계산한다 —
 *    여기서 따로 계산하면 화면에 보여준 금액과 `trading-order-create`가 청구하는 금액이 갈린다.
 *    가격표를 서버로 모은 것과 같은 이유다.
 *
 * 🚨 실패하면 금액을 **지어내지 않고** null을 돌려준다. 화면은 `—`로 두고 결제로 넘기지 않는다.
 */
export type ShippingQuote = {
  fee: number;
  zone: 'metro' | 'upcountry';
  chargeableKg: number;
  /** 주소가 실제로 반영된 값인지. false면 "방콕 기준 최소 금액"으로 안내해야 한다. */
  provinceApplied: boolean;
  metroFee: number | null;
};

export type QuoteInput = { slug: string; variantId: string | null; quantity: number };

export type QuoteResult =
  | { status: 'ok'; quote: ShippingQuote }
  /** 5kg 초과 등 자동 청구 불가 — LINE 문의로 안내한다. */
  | { status: 'too_heavy'; chargeableKg: number | null }
  | { status: 'error' };

export async function fetchShippingQuote(
  items: QuoteInput[],
  province: string | null,
  signal?: AbortSignal,
): Promise<QuoteResult> {
  if (!ORDER_API_BASE || items.length === 0) return { status: 'error' };
  try {
    const res = await fetch(`${ORDER_API_BASE}/trading-shipping-quote`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items, province }),
      signal,
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body?.ok === true && typeof body.fee === 'number') {
      return {
        status: 'ok',
        quote: {
          fee: body.fee,
          zone: body.zone === 'metro' ? 'metro' : 'upcountry',
          chargeableKg: typeof body.chargeableKg === 'number' ? body.chargeableKg : 0,
          provinceApplied: body.provinceApplied === true,
          metroFee: typeof body.metroFee === 'number' ? body.metroFee : null,
        },
      };
    }
    if (body?.reason === 'too_heavy') {
      return { status: 'too_heavy', chargeableKg: typeof body.chargeableKg === 'number' ? body.chargeableKg : null };
    }
    return { status: 'error' };
  } catch {
    return { status: 'error' };
  }
}
