import { OrderSuccess } from '@/components/order/OrderSuccess';

// Stripe `success_url`이 돌아오는 곳. 주문번호·세션 id는 쿼리로 오고 브라우저에서 읽는다(정적 export).
export default async function OrderSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <OrderSuccess locale={locale} />;
}
