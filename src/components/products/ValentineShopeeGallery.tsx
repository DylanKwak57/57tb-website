'use client';

import { useState } from 'react';
import { VALENTINE_GALLERY_SETS, galleryAltText, galleryImages, type ValentineGalleryCode } from '@/data/valentine-gallery';
import { assetPath } from '@/lib/utils';

const MAGIC_CODES: ValentineGalleryCode[] = ['h1', 'd1', 'c2', 'l2'];
const VALENTINE_THAI_FONT = 'var(--font-jakarta), var(--font-noto-thai), sans-serif';

function GalleryImages({ slug, code }: { slug: string; code: ValentineGalleryCode }) {
  const set = VALENTINE_GALLERY_SETS[code];
  const images = galleryImages(slug, set);
  return <>
    <div className="grid gap-3 sm:grid-cols-2 md:gap-5" data-testid="valentine-main-gallery">
      {images.main.map((src, index) => <img alt={galleryAltText(set, 'main', index)} className="aspect-square w-full border border-brand-gold/15 bg-brand-card object-cover" decoding="async" height="1080" key={src} loading="lazy" src={assetPath(src)} width="1080" />)}
    </div>
    <div className="mx-auto mt-10 max-w-[860px] space-y-4 md:mt-14 md:space-y-6" data-testid="valentine-detail-gallery">
      {images.detail.map((src, index) => <img alt={galleryAltText(set, 'detail', index)} className="block h-auto w-full border border-brand-gold/15 bg-brand-card" decoding="async" height="1350" key={src} loading="lazy" src={assetPath(src)} width="1080" />)}
    </div>
  </>;
}

export function ValentineShopeeGallery({ slug, magic = false }: { slug: string; magic?: boolean }) {
  const [selectedCode, setSelectedCode] = useState<ValentineGalleryCode>('h1');
  const code = magic ? selectedCode : 'lpp';
  const set = VALENTINE_GALLERY_SETS[code];
  return <section className="mx-auto max-w-[1180px] px-4 py-10 md:px-6 md:py-16" lang="th" aria-labelledby="professional-product-guide-title">
    <div className="border-t border-brand-gold/30 pt-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-white">PROFESSIONAL PRODUCT GUIDE</p><h2 className="mt-3 text-3xl font-bold text-brand-white" id="professional-product-guide-title" style={{ fontFamily: VALENTINE_THAI_FONT }}>ภาพรายละเอียดผลิตภัณฑ์</h2><p className="mt-3 max-w-2xl leading-relaxed text-brand-white">รวมภาพผลิตภัณฑ์ Valentine Professional เพื่อให้ช่างมืออาชีพตรวจสอบฉลาก วิธีใช้ และรายละเอียดสำคัญได้อย่างชัดเจน</p></div>
    {magic && <div className="mt-7" role="group" aria-label="เลือกผลิตภัณฑ์ Valentine Professional น้ำยา Multi Perm"><p className="mb-3 text-sm font-medium text-brand-white">เลือกผลิตภัณฑ์เพื่อดูภาพรายละเอียด</p><div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">{MAGIC_CODES.map((item) => { const option = VALENTINE_GALLERY_SETS[item]; const selected = item === code; return <button aria-pressed={selected} className={`min-h-12 border px-3 py-2 text-left text-sm font-medium transition-colors ${selected ? 'border-brand-gold bg-brand-gold text-brand-black' : 'border-brand-gold/35 bg-brand-card text-brand-white hover:border-brand-gold'}`} key={item} onClick={() => setSelectedCode(item)} type="button"><span className="block font-serif text-base">{item.toUpperCase()}</span><span className="block text-xs leading-snug">{option.label.split(' · ')[1]}</span></button>; })}</div></div>}
    <div className="mt-8" data-selected-gallery={code}><p className="mb-4 font-serif text-xl text-brand-gold">{set.label}</p><GalleryImages code={code} slug={slug} /></div>
  </section>;
}
