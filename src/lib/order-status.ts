import { ORDER_API_BASE } from '@/data/order';

/**
 * 주문 상태 조회 — Edge Function `trading-order-status`.
 *
 * 🚨 이 응답에는 개인정보(이름·전화·주소)가 없다. 서버가 빼고 돌려준다(주문번호만으로 열리는 공개 조회).
 * 🚨 자격 확인은 둘 중 하나: 전화번호 뒷 4자리 또는 결제 세션 id(결제 직후 돌아온 손님).
 */

export type OrderStatusItem = {
  nameEn: string;
  nameTh: string;
  variantId: string | null;
  unitPrice: number;
  quantity: number;
};

export type OrderStatus = {
  orderNo: string;
  status: 'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | string;
  statusTh: string;
  courier: string | null;
  trackingNo: string | null;
  total: number;
  orderedAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  items: OrderStatusItem[];
};

export type StatusLookup =
  | { ok: true; order: OrderStatus }
  | { ok: false; reason: 'not_found' | 'unavailable' | 'failed' };

export async function fetchOrderStatus(input: {
  orderNo: string;
  phoneLast4?: string;
  sessionId?: string;
}): Promise<StatusLookup> {
  if (!ORDER_API_BASE) return { ok: false, reason: 'unavailable' };
  const query = new URLSearchParams({ no: input.orderNo });
  if (input.phoneLast4) query.set('p', input.phoneLast4);
  if (input.sessionId) query.set('s', input.sessionId);
  try {
    const res = await fetch(`${ORDER_API_BASE}/trading-order-status?${query.toString()}`);
    const body = await res.json().catch(() => ({}));
    if (res.status === 404) return { ok: false, reason: 'not_found' };
    if (!res.ok || !body.ok) return { ok: false, reason: 'failed' };
    return { ok: true, order: body as OrderStatus };
  } catch {
    return { ok: false, reason: 'failed' };
  }
}

/** 조회 실패 안내(태국어). 없는 주문과 대조 실패는 같은 문구로 — 주문 존재 여부를 흘리지 않는다. */
export function statusErrorMessage(reason: 'not_found' | 'unavailable' | 'failed'): string {
  if (reason === 'not_found') return 'ไม่พบคำสั่งซื้อ กรุณาตรวจสอบเลขที่คำสั่งซื้อและเบอร์โทรศัพท์อีกครั้ง';
  if (reason === 'unavailable') return 'ขณะนี้ยังไม่เปิดให้ตรวจสอบสถานะ กรุณาสอบถามทาง LINE';
  return 'การเชื่อมต่อขัดข้อง กรุณาลองใหม่';
}
