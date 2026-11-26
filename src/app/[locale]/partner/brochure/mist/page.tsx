/**
 * 원장님용 브로셔 3번(Perfume Hair Mist) 앞면 — 휴대폰 세로판 한 장 · unlisted (2026-11-26)
 *
 * 진입: 초대 화면(`/th/partner/invite`)의 `ดูรายละเอียดสินค้า` (같은 탭 · 뒤로 가기로 복귀).
 * 그림 원본: ~/Projects/57TB/57 CEO/57 Shopee 유통/dealer-targets/brochure/모바일/Bellista-Mist-모바일.png
 *   (1080×4589 · 약 490KB — 1.5MB 아래라 줄이지 않고 그대로 복사) → `public/partner/brochure/mist.png`
 *   다시 뽑기 = 그 폴더의 `_작업파일` (`build_mobile.py` → `render_mobile.mjs`) 후 다시 복사.
 * 🚨 가격 · 공급가를 넣지 않는다(그림에도 없다 — LINE QR · 주문 문의 줄을 뺀 판).
 * 🆕 11/26 초대 메일에서 바로 온 경우(`?i=<코드>&m=img|info`)만 기록을 한 번 쏜다(`InviteTrack` · 28번 설계 §10-1).
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import BackLink from '@/components/partner/BackLink';
import InviteTrack from '@/components/partner/InviteTrack';

export const metadata: Metadata = {
  title: 'Perfume Hair Mist | Bellista',
  robots: { index: false, follow: false },
};

export default function PartnerBrochureMistPage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      <InviteTrack allowed={['img', 'info']} />
      <div className="mx-auto max-w-[540px] px-4 pb-12 pt-4">
        <BackLink />
        <Image
          src="/partner/brochure/mist.png"
          alt="Bellista Perfume Hair Mist — brochure"
          width={1080}
          height={4589}
          priority
          className="mt-2 h-auto w-full"
        />
      </div>
    </main>
  );
}
