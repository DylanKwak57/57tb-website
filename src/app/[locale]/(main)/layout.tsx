import { CartProvider } from '@/components/cart/CartProvider';
import { PriceProvider } from '@/components/prices/PriceProvider';
import { LiffReturn } from '@/components/prices/LiffReturn';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    // 장바구니 상태는 헤더(개수 배지)와 제품·장바구니 페이지가 함께 쓰므로 그룹 전체를 감싼다.
    // 가격은 빌드 산출물에 없다(브랜드사 조건) → 서버에서 한 번 받아 제품·장바구니·주문 화면이 함께 쓴다.
    <PriceProvider>
      {/* LINE 로그인 복귀 — `/th?liff.state=…`로 도착한 손님을 원래 페이지로 되돌린다. */}
      <LiffReturn />
      <CartProvider>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-gold focus:text-brand-black focus:rounded-full focus:font-semibold"
        >
          Skip to main content
        </a>
        <Header locale={locale} />
        <main id="main-content">{children}</main>
        <Footer />
      </CartProvider>
    </PriceProvider>
  );
}
