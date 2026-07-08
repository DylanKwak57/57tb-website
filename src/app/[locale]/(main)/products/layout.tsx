import type { Metadata } from 'next';

// 제품 페이지(unlisted): 검색 제외 + 메뉴/사이트맵 미등록. 링크·QR로만 진입.
export const metadata: Metadata = {
  title: 'BELLISTA Products — 57 Total Beauty',
  robots: { index: false, follow: false },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
