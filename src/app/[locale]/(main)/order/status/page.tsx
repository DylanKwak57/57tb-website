import { OrderStatusView } from '@/components/order/OrderStatusView';

// LINE 배송 알림 카드의 `ตรวจสอบสถานะ` 버튼이 오는 곳(`STATUS_PAGE_BASE`).
export default async function OrderStatusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <OrderStatusView locale={locale} />;
}
