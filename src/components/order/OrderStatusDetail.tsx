import { money } from '@/lib/cart-lines';
import type { OrderStatus } from '@/lib/order-status';

/** 방콕 기준 날짜·시각 표기. 손님이 태국에서 본다. */
function bangkok(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok', dateStyle: 'medium', timeStyle: 'short',
  }).format(new Date(value));
}

/** 주문 상태 카드 — 결제 완료 화면과 상태 조회 화면이 같은 모양을 쓴다. */
export function OrderStatusDetail({ order }: { order: OrderStatus }) {
  const row = 'flex items-baseline justify-between gap-4 border-b border-brand-gold/15 py-3';
  const orderedAt = bangkok(order.orderedAt);
  const shippedAt = bangkok(order.shippedAt);

  return (
    <div className="border border-brand-gold/25 bg-brand-card p-5 md:p-7" lang="th">
      <div className={row}>
        <span className="text-xs text-brand-gray">เลขที่คำสั่งซื้อ</span>
        <span className="font-serif text-lg text-brand-white">{order.orderNo}</span>
      </div>
      <div className={row}>
        <span className="text-xs text-brand-gray">สถานะ</span>
        <span className="text-sm font-medium text-brand-gold">{order.statusTh}</span>
      </div>
      {orderedAt && (
        <div className={row}>
          <span className="text-xs text-brand-gray">วันที่สั่งซื้อ</span>
          <span className="text-sm text-brand-white">{orderedAt}</span>
        </div>
      )}
      {order.trackingNo && (
        <>
          <div className={row}>
            <span className="text-xs text-brand-gray">ขนส่ง</span>
            <span className="text-sm text-brand-white">{order.courier ?? '-'}</span>
          </div>
          <div className={row}>
            <span className="text-xs text-brand-gray">เลขพัสดุ</span>
            <span className="text-sm text-brand-white">{order.trackingNo}</span>
          </div>
        </>
      )}
      {shippedAt && (
        <div className={row}>
          <span className="text-xs text-brand-gray">วันที่จัดส่ง</span>
          <span className="text-sm text-brand-white">{shippedAt}</span>
        </div>
      )}

      <ul className="mt-4 divide-y divide-brand-gold/15 border-t border-brand-gold/15">
        {order.items.map((item, index) => (
          <li className="flex items-baseline justify-between gap-4 py-3" key={`${item.nameEn}:${item.variantId ?? index}`}>
            <span className="min-w-0 text-sm text-brand-white">
              {item.nameTh || item.nameEn}
              {item.variantId && <span className="text-brand-champagne"> {item.variantId} มล.</span>}
              <span className="ml-2 text-xs text-brand-gray">× {item.quantity}</span>
            </span>
            <span className="shrink-0 text-sm text-brand-gray-light">{money(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-baseline justify-between gap-4 border-t border-brand-gold/20 pt-4">
        <span className="text-sm font-medium text-brand-white">ยอดรวมทั้งหมด</span>
        <span className="font-serif text-2xl text-brand-gold">{money(order.total)}</span>
      </div>
    </div>
  );
}
