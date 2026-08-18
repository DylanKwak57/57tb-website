import { ORDER_API_BASE } from '@/data/order';

/**
 * 재입고 알림 신청 (2026-08-18 신설 · 대표님 발안).
 *
 * 품절 화면에서 손님이 누르면 서버가 LINE userId 로 신청을 저장하고,
 * 재고가 돌아오는 순간 TD `product-stock-sync` 가 LINE push 를 보낸다.
 *
 * 🚨 userId 를 화면이 보내지 않는다 — 서버가 ID token 을 LINE 에 검증시켜 본인을 확인한다.
 */
export type StockAlertResult =
  | { status: 'ok' }
  /** 이미 재고가 있어 신청이 불필요한 경우 */
  | { status: 'in_stock' }
  | { status: 'error' };

export async function requestStockAlert(input: {
  idToken: string;
  slug: string;
  variantId: string | null;
  productName: string;
}): Promise<StockAlertResult> {
  if (!ORDER_API_BASE) return { status: 'error' };
  try {
    const res = await fetch(`${ORDER_API_BASE}/trading-stock-alert`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        idToken: input.idToken,
        slug: input.slug,
        variantId: input.variantId ?? '',
        productName: input.productName,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body?.ok === true) return { status: 'ok' };
    if (body?.reason === 'in_stock') return { status: 'in_stock' };
    return { status: 'error' };
  } catch {
    return { status: 'error' };
  }
}
