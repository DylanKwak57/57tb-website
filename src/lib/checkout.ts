import { ORDER_API_BASE } from '@/data/order';

/**
 * Stripe Checkout으로 보내기 — 주문번호를 주면 서버가 세션을 만들고 그 URL로 이동한다.
 *
 * 🚨 금액을 보내지 않는다. 서버가 DB에 저장된 합계로 세션을 만든다(가격 조작 방지).
 * 🚨 결제수단은 여기서 고르지 않는다 — Stripe 화면 안에서 손님이 고른다(PromptPay·카드·Google Pay).
 * 성공하면 페이지를 떠나므로 반환값은 실패했을 때만 의미가 있다.
 */

export type PayFailure = 'closed' | 'not_payable' | 'unavailable' | 'failed';

export async function startPayment(orderNo: string, locale: string): Promise<PayFailure | null> {
  if (!ORDER_API_BASE) return 'unavailable';
  try {
    const res = await fetch(`${ORDER_API_BASE}/trading-checkout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderNo, locale }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.status === 503) return 'closed';
    if (res.status === 409) return 'not_payable';
    if (!res.ok || !body.ok || !body.url) return 'failed';
    window.location.href = body.url;
    return null;
  } catch {
    return 'failed';
  }
}

/** 결제 실패 안내(태국어). 손님에게는 원인을 짧게, 다음 행동을 분명히. */
export function payFailureMessage(reason: PayFailure): string {
  if (reason === 'closed') return 'ขณะนี้ยังไม่เปิดให้ชำระเงิน กรุณาสอบถามทาง LINE';
  if (reason === 'not_payable') return 'คำสั่งซื้อนี้ชำระเงินแล้วหรือถูกยกเลิก กรุณาสอบถามทาง LINE';
  if (reason === 'unavailable') return 'ขณะนี้อยู่ระหว่างเตรียมระบบชำระเงิน กรุณาสอบถามทาง LINE';
  return 'ไม่สามารถเปิดหน้าชำระเงินได้ กรุณาลองใหม่อีกครั้ง';
}
