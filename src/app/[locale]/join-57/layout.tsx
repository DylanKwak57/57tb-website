import type { Metadata } from 'next';

// 채용 페이지(unlisted): 검색 제외 + 메뉴/사이트맵 미등록. DM·QR로만 진입.
// 기획 정본: ~/Projects/57TB/57 CEO/57 디자이너 채용/plan.md
export const metadata: Metadata = {
  title: 'ร่วมงานกับ 57 Total Beauty',
  description: 'ที่ที่กรรไกรของคุณจะเปล่งประกาย — เรื่องจริงของช่าง 57',
  robots: { index: false, follow: false },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
