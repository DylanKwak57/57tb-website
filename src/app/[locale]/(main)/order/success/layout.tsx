import type { Metadata } from 'next';

// 결제 완료(unlisted): 주문 페이지와 같은 규칙 — 검색 제외, 메뉴/사이트맵 미등록. robots noindex 제거 금지.
export const metadata: Metadata = {
  title: '57TB TRADING — ชำระเงินสำเร็จ',
  robots: { index: false, follow: false },
};

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
