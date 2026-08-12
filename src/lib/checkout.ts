import { ORDER_API_BASE } from '@/data/order';

/**
 * Stripe Checkout으로 보내기 — 주문번호를 주면 서버가 세션을 만들고 그 URL로 이동한다.
 *
 * 🚨 금액을 보내지 않는다. 서버가 DB에 저장된 합계로 세션을 만든다(가격 조작 방지).
 * 🚨 결제수단은 여기서 고르지 않는다 — Stripe 화면 안에서 손님이 고른다(PromptPay·카드·Google Pay).
 * 🚨 **LIFF ID token을 함께 보낸다 (2026-08-12)** — Stripe 결제 화면에는 금액이 반드시 뜨므로,
 *    서버가 회원·태국 접속자에게만 세션을 발급한다. 없으면 403(`auth_required`/`geo_blocked`).
 * 성공하면 페이지를 떠나므로 반환값은 실패했을 때만 의미가 있다.
 */

export type PayFailure = 'closed' | 'not_payable' | 'unavailable' | 'forbidden' | 'failed';

/**
 * 결제 토큰 보관 — Stripe에서 취소하고 돌아오면 페이지가 새로 뜨므로 React state가 사라진다.
 * 그때도 같은 주문으로 재결제할 수 있어야 해서 브라우저에 잠깐 둔다.
 *
 * 🚨 sessionStorage를 쓴다(탭을 닫으면 지워진다). localStorage는 공용 PC에 남고,
 *    URL에 실으면 브라우저 기록·Referer로 새어 나간다.
 */
const TOKEN_PREFIX = 'trading:payToken:';

export function rememberPayToken(orderNo: string, token: string): void {
  try { sessionStorage.setItem(TOKEN_PREFIX + orderNo, token); } catch { /* 저장 불가여도 결제는 계속된다 */ }
}

export function recallPayToken(orderNo: string): string {
  try { return sessionStorage.getItem(TOKEN_PREFIX + orderNo) ?? ''; } catch { return ''; }
}

export function forgetPayToken(orderNo: string): void {
  try { sessionStorage.removeItem(TOKEN_PREFIX + orderNo); } catch { /* 무시 */ }
}

export async function startPayment(
  orderNo: string,
  locale: string,
  paymentToken: string,
  idToken: string,
): Promise<PayFailure | null> {
  if (!ORDER_API_BASE) return 'unavailable';
  try {
    const res = await fetch(`${ORDER_API_BASE}/trading-checkout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // 🚨 주문번호만으로는 결제창을 열 수 없다(순번이라 추측 가능) — 접수 응답으로 받은 토큰을 함께 보낸다.
      // 🚨 회원 확인용 ID token도 함께 보낸다(서버가 국가·회원을 다시 본다).
      body: JSON.stringify({ orderNo, locale, paymentToken, idToken }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.status === 503) return 'closed';
    if (res.status === 409) return 'not_payable';
    // 403 = 결제 토큰 불일치 · 비회원 · 해외 접속. 손님이 할 일은 같으므로 한 문구로 안내한다.
    if (res.status === 403) return 'forbidden';
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
  // 토큰이 없거나 만료된 브라우저 세션 — 손님은 원인을 알 수 없으니 다음 행동만 알려 준다.
  if (reason === 'forbidden') return 'ไม่สามารถเปิดหน้าชำระเงินของคำสั่งซื้อนี้ได้ กรุณาสอบถามทาง LINE';
  return 'ไม่สามารถเปิดหน้าชำระเงินได้ กรุณาลองใหม่อีกครั้ง';
}
