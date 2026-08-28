import type { Metadata } from 'next';
import { PartnerLiffReturn } from '@/components/partner/PartnerLiffReturn';

// 파트너(미용실·딜러) 모집 페이지 — unlisted. 검색 제외 + 메뉴/사이트맵 미등록.
// 페이스북 그룹 게시글·리셉션 LINE 안내에서 링크로만 진입한다.
// 기획 정본: ~/Projects/57TB/57 CEO/57 Shopee 유통/dealer-targets/05-체험단-캠페인-계획.md
// 🚨 이 페이지에 가격을 쓰지 않는다 — 공급가는 승인된 파트너에게만, 소비자가도 회원 전용이다.
export const metadata: Metadata = {
  title: 'ตัวแทนจำหน่าย Bellista | 57 Total Beauty',
  description: 'ผลิตภัณฑ์ดูแลเส้นผมเกาหลีสำหรับร้านเสริมสวย นำเข้าอย่างเป็นทางการ',
  robots: { index: false, follow: false },
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 🚨 파트너 LIFF 복귀는 여기서 받는다. `(main)` 의 LiffReturn 은 **손님용 LIFF** 를 init 해
          파트너 LIFF 안에서 돌면 무한 인증 반복이 된다(2026-08-28 실장애). */}
      <PartnerLiffReturn />
      {children}
    </>
  );
}
