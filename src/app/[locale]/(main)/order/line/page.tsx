import { OrderLineLink } from '@/components/order/OrderLineLink';

// LIFF 앱의 엔드포인트 URL(`https://57tb.art/th/order/line`). 결제 완료 화면의 LINE 연결 버튼이 여기로 온다.
export default async function OrderLinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <OrderLineLink locale={locale} />;
}
