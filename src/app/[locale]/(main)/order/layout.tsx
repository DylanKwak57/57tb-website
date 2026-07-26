import type { Metadata } from 'next';

// 주문 페이지(unlisted): 제품 페이지와 같은 규칙 — 검색 제외, 메뉴/사이트맵 미등록.
// 진입은 제품 상세의 주문 버튼으로만. robots noindex 제거 금지.
export const metadata: Metadata = {
  title: '57TB TRADING — สั่งซื้อ',
  robots: { index: false, follow: false },
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
