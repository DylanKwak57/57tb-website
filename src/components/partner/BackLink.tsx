'use client';

/**
 * `← ย้อนกลับ` — 브라우저 뒤로 가기(초대 화면에서 같은 탭으로 들어온 경우 그 화면으로 돌아간다).
 * 이전 화면이 없으면(주소로 바로 연 경우) 파트너 소개 화면으로.
 */
export default function BackLink({ fallback = '/th/partner' }: { fallback?: string }) {
  return (
    <a
      href={fallback}
      onClick={(e) => {
        if (window.history.length > 1) {
          e.preventDefault();
          window.history.back();
        }
      }}
      className="inline-block py-2 text-[13px] text-brand-gold underline-offset-4 hover:underline"
    >
      ← ย้อนกลับ
    </a>
  );
}
