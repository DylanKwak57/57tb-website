import type { Product } from '@/data/products';
import { assetPath } from '@/lib/utils';
import { ValentineFormulaFinder } from './ValentineFormulaFinder';
import { ValentineShopeeGallery } from './ValentineShopeeGallery';

const MAGIC_DETAILS = [
  ['Step 1 · H1', 'น้ำยา Multi Perm ขั้นตอนที่ 1 สูตรสำหรับผมสุขภาพดี · 500 ml', 'ใช้เวลา 15–20 นาที แล้วล้างออก', 'ไฮโดรไลซ์คอลลาเจน · ไฮโดรไลซ์เคราติน · ไฮโดรไลซ์ซิลค์'],
  ['Step 1 · D1', 'น้ำยา Multi Perm ขั้นตอนที่ 1 สูตรสำหรับผมเสีย · 500 ml', 'ใช้เวลา 10–15 นาที แล้วล้างออก', 'ไฮโดรไลซ์คอลลาเจน · ไฮโดรไลซ์เคราติน · ไฮโดรไลซ์ซิลค์'],
  ['Step 2 · C2', 'นิวทรัลไลเซอร์ขั้นตอนที่ 2 ชนิดครีม · 500 ml', 'หลังล้างขั้นตอนที่ 1 ใช้เวลา 5–7 นาที แล้วล้างออก', 'ไฮโดรไลซ์คอลลาเจน · ไฮโดรไลซ์เคราติน'],
  ['Step 2 · L2', 'นิวทรัลไลเซอร์ขั้นตอนที่ 2 ชนิดน้ำ · 500 ml', 'หลังล้างขั้นตอนที่ 1 ใช้เวลา 5–7 นาที แล้วล้างออก', 'ไฮโดรไลซ์คอลลาเจน · ไฮโดรไลซ์เคราติน'],
];
const VALENTINE_THAI_FONT = 'var(--font-jakarta), var(--font-noto-thai), sans-serif';

function DetailRows({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return <dl className="divide-y divide-brand-gold/25">{rows.map(([title, value]) => <div className="grid gap-2 py-5 md:grid-cols-[190px_1fr] md:gap-8" key={title}><dt className="font-medium text-brand-gold">{title}</dt><dd className="leading-relaxed text-brand-white">{value}</dd></div>)}</dl>;
}

function MagicDetail({ product }: { product: Extract<Product, { detailMode: 'guided-system' }> }) {
  return <>
    <section className="mx-auto grid max-w-[1180px] border-y border-brand-gold/30 bg-brand-card md:grid-cols-[.88fr_1.12fr]" lang="th">
      <div className="flex flex-col justify-center px-6 py-10 md:px-14 md:py-16">
        <p className="font-serif text-xl text-brand-gold">Valentine Professional</p>
        <p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">Multi Perm System</p>
        <h1 className="mt-4 font-bold tracking-tight text-brand-white" data-testid="multi-perm-heading" style={{ fontFamily: VALENTINE_THAI_FONT }}>
          <span className="block whitespace-nowrap text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.16]">น้ำยา Multi Perm</span>
          <span className="mt-2 block whitespace-nowrap text-[clamp(1.125rem,5.3vw,2rem)] font-semibold leading-[1.3] tracking-normal">2 ขั้นตอน สำหรับช่างมืออาชีพ</span>
        </h1>
        <p className="mt-5 max-w-md leading-relaxed text-brand-gray-light">น้ำยายืดผมและน้ำยาดัดผมอเนกประสงค์สำหรับงานซาลอน</p>
        <p className="mt-3 max-w-md leading-relaxed text-brand-gray-light">ใช้ได้ทั้งดัดดิจิตอล ยืดวอลลุ่ม (วอลลุ่มเมจิก) และรีบอนดิ้ง</p>
        <p className="mt-3 max-w-md leading-relaxed text-brand-gray-light">เลือก Step 1 ตามสภาพเส้นผม และทำงานต่อด้วย Step 2 หลังล้างขั้นตอนแรก</p>
      </div>
      <div className="border-t border-brand-gold/30 p-3 md:border-l md:border-t-0 md:p-7">
        <div className="grid grid-cols-2 gap-4 px-4 pt-3 text-center text-[10px] font-bold tracking-[.13em] text-brand-champagne"><span>STAGE 1 · MULTI PERM CREAM</span><span>STAGE 2 · NEUTRALIZER</span></div>
        <img alt="Valentine Professional น้ำยา Multi Perm: H1, D1, C2 และ L2 ใช้ได้ทั้งดัดดิจิตอล ยืดวอลลุ่ม (วอลลุ่มเมจิก) และรีบอนดิ้ง" className="h-auto w-full object-contain" fetchPriority="high" height="1050" src={assetPath(`/products/${product.slug}/hero.webp`)} width="1500" />
      </div>
    </section>
    <ValentineFormulaFinder {...product.guidedSystem} />
    <section className="mx-auto max-w-[1180px] px-4 py-10 md:px-6 md:py-16" id="product-details" lang="th">
      <div className="border-t border-brand-gold/30 pt-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">Product details</p><h2 className="mt-3 text-3xl font-bold text-brand-white" style={{ fontFamily: VALENTINE_THAI_FONT }}>รายละเอียดระบบ Valentine Professional</h2><p className="mt-3 max-w-2xl leading-relaxed text-brand-gray-light">เวลาการใช้และส่วนประกอบด้านล่างเป็นข้อมูลตามฉลากผลิตภัณฑ์</p></div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">{MAGIC_DETAILS.map(([code, purpose, timing, ingredients]) => <article className="border border-brand-gold/25 bg-brand-card p-6" key={code}><p className="font-serif text-xl text-brand-gold">{code}</p><p className="mt-3 font-medium text-brand-white">{purpose}</p><p className="mt-4 text-sm leading-relaxed text-brand-gray-light">{timing}</p><p className="mt-4 border-t border-brand-gold/20 pt-4 text-xs leading-relaxed text-brand-gray-light">ส่วนประกอบที่ยืนยันบนฉลาก: {ingredients}</p></article>)}</div>
      <div className="mt-8 border-y border-brand-gold/30 bg-brand-card px-6 py-7"><DetailRows rows={[["ข้อมูลผลิตภัณฑ์", "H1, D1, C2 และ L2 ขนาด 500 ml"], ["ลำดับ", "เลือก Step 1 จากนั้นล้างออก แล้วจึงใช้ Step 2"], ["ข้อควรทราบ", "โปรดตรวจสอบฉลากและขั้นตอนก่อนใช้"]]} /></div>
    </section>
    <ValentineShopeeGallery magic slug={product.slug} />
    <noscript><section className="mx-auto max-w-[1180px] px-4 pb-10" lang="th"><h2 className="font-heading text-xl font-bold">ชุดตัวเลือกที่เป็นไปได้</h2><table className="mt-4 w-full border-collapse text-left"><tbody>{[['H1', 'C2'], ['H1', 'L2'], ['D1', 'C2'], ['D1', 'L2']].map(([one, two]) => <tr className="border-b border-brand-gold/25" key={`${one}-${two}`}><td className="p-3">{one}</td><td className="p-3">{two}</td></tr>)}</tbody></table></section></noscript>
  </>;
}

function LppDetail({ product }: { product: Product }) {
  return <>
    <section className="mx-auto grid max-w-[1180px] border-y border-brand-gold/30 bg-brand-card md:grid-cols-[1fr_.82fr]" lang="th">
      <div className="flex flex-col justify-center px-6 py-10 md:px-14 md:py-20"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">Valentine Professional</p><h1 className="mt-4 font-heading text-4xl font-bold leading-[1.14] tracking-tight text-brand-white md:text-6xl">L.P.P Treatment<br /><span className="text-2xl font-medium md:text-3xl">500 ml</span></h1><p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-gray-light">ทรีตเมนต์โปรตีนแบบล้างออกสำหรับเส้นผมเสีย</p></div>
      <div className="flex items-center justify-center border-t border-brand-gold/30 p-6 md:border-l md:border-t-0 md:p-10"><img alt="Valentine Professional L.P.P Treatment 500 ml" className="h-auto max-h-[560px] w-full object-contain" fetchPriority="high" height="1100" src={assetPath(`/products/${product.slug}/hero.webp`)} width="1100" /></div>
    </section>
    <section className="mx-auto max-w-[1180px] px-4 py-4 md:px-6 md:py-8" lang="th"><div className="bg-brand-card px-6 py-9 md:px-14 md:py-12"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">Professional use</p><h2 className="mt-3 text-3xl font-bold text-brand-white" style={{ fontFamily: VALENTINE_THAI_FONT }}>สรุปการใช้</h2><div className="mt-7"><DetailRows rows={[["ดูแลที่บ้าน", "หลังสระ ใช้และทิ้งไว้อย่างน้อย 5 นาที"], ["ซาลอนแบบเดี่ยว", "ใช้เวลาประมาณ 20 นาที"], ["ก่อนดัดหรือทำสี", "ใช้เตรียมบริเวณผมเสียก่อนดัดหรือทำสี โดยฉลากไม่ได้ระบุเวลาให้ทิ้งไว้"], ["ความปลอดภัย", "ใช้ภายนอกเท่านั้น หลีกเลี่ยงการสัมผัสดวงตา เก็บให้พ้นมือเด็ก และเก็บในที่เย็นและมืด"]]} /></div></div></section>
    <section className="mx-auto max-w-[1180px] px-4 py-8 md:px-6 md:py-14" lang="th"><div className="border-t border-brand-gold/30 pt-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">Product details</p><h2 className="mt-3 text-3xl font-bold text-brand-white" style={{ fontFamily: VALENTINE_THAI_FONT }}>รายละเอียดผลิตภัณฑ์</h2></div><div className="mt-8 grid gap-4 md:grid-cols-2"><article className="border border-brand-gold/25 bg-brand-card p-6"><h3 className="text-xl font-bold" style={{ fontFamily: VALENTINE_THAI_FONT }}>วัตถุประสงค์</h3><p className="mt-3 leading-relaxed text-brand-gray-light">ทรีตเมนต์โปรตีนแบบล้างออกสำหรับเส้นผมเสีย ขนาด 500 ml</p></article><article className="border border-brand-gold/25 bg-brand-card p-6"><h3 className="text-xl font-bold" style={{ fontFamily: VALENTINE_THAI_FONT }}>ส่วนประกอบที่ยืนยัน</h3><p className="mt-3 leading-relaxed text-brand-gray-light">น้ำมันมะกอก อาร์แกน อะโวคาโด · ไฮโดรไลซ์เคราติน คอลลาเจน ซิลค์ · Sodium PCA · Panthenol</p></article></div></section>
    <ValentineShopeeGallery slug={product.slug} />
  </>;
}

export function ValentineProductDetail({ product }: { product: Product }) {
  return (
    <div className="min-h-screen bg-brand-black pb-16 pt-20">
      {product.detailMode === 'guided-system'
        ? <MagicDetail product={product} />
        : <LppDetail product={product} />}
    </div>
  );
}
