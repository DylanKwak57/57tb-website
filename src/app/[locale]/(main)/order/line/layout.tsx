import type { Metadata } from 'next';

// LINE 연결(unlisted): 주문·상태 화면과 같은 규칙 — 검색 제외, 메뉴/사이트맵 미등록. robots noindex 제거 금지.
export const metadata: Metadata = {
  title: '57TB TRADING — เชื่อมต่อ LINE',
  robots: { index: false, follow: false },
};

export default function OrderLineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
