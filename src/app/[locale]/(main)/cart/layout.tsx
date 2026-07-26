import type { Metadata } from 'next';

// 장바구니(unlisted): 제품·주문 페이지와 같은 규칙 — 검색 제외, 메뉴/사이트맵 미등록.
// robots noindex 제거 금지.
export const metadata: Metadata = {
  title: '57TB TRADING — ตะกร้าสินค้า',
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
