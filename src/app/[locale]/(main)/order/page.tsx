import { OrderView } from '@/components/order/OrderView';

// 주문은 장바구니 전체 기준이다 — 제품별 라우트(`/order/<제품>`)는 2026-07-26에 폐지했다.
// 여러 종을 담으면 결제로 갈 화면이 없어 LINE 문의로 빠지던 문제 때문(대표님 지적).
export default async function OrderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <OrderView locale={locale} />;
}
