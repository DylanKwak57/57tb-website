import Image from 'next/image';

/**
 * 프로틴 케어 진열대 실물 사진 — 매장 거울 앞 (2026-11-02 대표님 "진열대에 실제 제품 거치한 사진을 자료 속에")
 *
 * 사진 = 2026-10-06 Ideahead 샘플 도착 때 에이님이 노션에 올린 실물 중 거울 앞 원목 받침 컷(대표님 지정 11/2) — 원본 5712×4284 에서 진열대 부분만 잘라 1080 폭.
 * 쓰는 곳 = 파트너 소개(`/th/partner`) · 미스트 체험단(`/partner/mist`) · 프로틴 가이드(`/guide/protein`).
 * 🚫 진열대를 원장에게 준다는 약속은 쓰지 않는다 — 살롱 킷 증정은 08 문서 단계라 화면 문구에 넣지 않는다.
 * 설명 문구는 신규 태국어 → 에이님 검수 묶음.
 */
export default function CounterDisplay({ className = '' }: { className?: string }) {
  return (
    <figure className={`mx-auto max-w-md ${className}`}>
      <div className="overflow-hidden rounded-xl">
        <Image
          src="/partner/display/protein-counter.webp"
          alt="Bellista Protein Care Line ที่ร้าน 57 Total Beauty"
          width={1080}
          height={974}
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-center text-[12px] leading-relaxed text-brand-gold">
        <span className="inline-block">ตัวอย่างการจัดวางที่ร้าน</span>{' '}
        <span className="inline-block">57 Total Beauty</span>
      </figcaption>
    </figure>
  );
}
