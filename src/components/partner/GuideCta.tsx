import Link from 'next/link';

/**
 * 파트너 가이드 하단 공통 CTA — `/th/partner/guide` · `/th/partner/guide/scalp` 공용 (2026-11-02)
 * 파트너 전용 OA `57TB Partner`(@347jyzxd)로 문구가 미리 채워진 대화창을 연다.
 * 🚨 가격·공급가를 쓰지 않는다 — 가이드는 키트를 받은 원장 누구나 본다.
 */
const OA_MESSAGE = 'https://line.me/R/oaMessage/@347jyzxd/?';
const ORDER_URL = OA_MESSAGE + encodeURIComponent('สนใจสั่งซื้อ Bellista Scalp Care');
const REGISTER_URL = OA_MESSAGE + encodeURIComponent('สนใจสมัครเป็นร้านค้าพันธมิตร');

export default function GuideCta() {
  return (
    <section className="border-t border-brand-dark px-6 py-16 text-center">
      <h2 className="text-lg font-semibold sm:text-xl">สั่งซื้อ · สอบถาม</h2>
      <div className="mx-auto mt-8 flex max-w-xs flex-col gap-3">
        <a
          href={ORDER_URL}
          className="inline-block rounded-full bg-brand-gold px-9 py-3.5 text-sm font-semibold text-brand-black transition hover:opacity-90"
        >
          สั่งซื้อ · สอบถามทาง LINE
        </a>
        <a
          href={REGISTER_URL}
          className="inline-block rounded-full border border-brand-gold px-9 py-3.5 text-sm font-semibold text-brand-gold transition hover:opacity-90"
        >
          สมัครเป็นร้านค้าพันธมิตร
        </a>
      </div>
      <p className="mt-6">
        <Link href="/th/partner#products" className="text-[13px] text-brand-gold underline underline-offset-4">
          ดูสินค้าทั้งหมด
        </Link>
      </p>
      <p className="mt-10 text-[13px] text-brand-gold">
        บริษัท 57 Total Beauty · ผู้นำเข้าและผู้จดแจ้ง อย. ผลิตภัณฑ์ Bellista ในประเทศไทย
      </p>
    </section>
  );
}
