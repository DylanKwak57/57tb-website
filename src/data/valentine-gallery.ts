export type ValentineGalleryCode = 'h1' | 'd1' | 'c2' | 'l2' | 'lpp';

export type ValentineGallerySet = { code: ValentineGalleryCode; label: string; description: string; directory: string };

export const VALENTINE_GALLERY_SETS: Record<ValentineGalleryCode, ValentineGallerySet> = {
  h1: { code: 'h1', label: 'H1 · สำหรับผมสุขภาพดี', description: 'Step 1', directory: 'h1' },
  d1: { code: 'd1', label: 'D1 · สำหรับผมเสีย', description: 'Step 1', directory: 'd1' },
  c2: { code: 'c2', label: 'C2 · นิวทรัลไลเซอร์เนื้อครีม', description: 'Step 2', directory: 'c2' },
  l2: { code: 'l2', label: 'L2 · นิวทรัลไลเซอร์เนื้อเหลว', description: 'Step 2', directory: 'l2' },
  lpp: { code: 'lpp', label: 'L.P.P Treatment', description: 'Professional use', directory: 'gallery' },
};

export function galleryImages(slug: string, set: ValentineGallerySet) {
  const base = `/products/${slug}/${set.directory}`;
  return {
    main: Array.from({ length: 8 }, (_, index) => `${base}/main-${String(index + 1).padStart(2, '0')}.webp`),
    detail: Array.from({ length: 6 }, (_, index) => `${base}/desc-${String(index + 1).padStart(2, '0')}.webp`),
  };
}

const MAIN_ALT_TOPICS = [
  'ผลิตภัณฑ์ด้านหน้า ขนาด 500 ml',
  'บทบาทและประเภทผลิตภัณฑ์ตามฉลาก',
  'ลำดับและขอบเขตการใช้งาน',
  'ส่วนผสมสำคัญที่ระบุบนฉลาก',
  'ระยะเวลาการใช้ตามฉลาก',
  'ข้อมูลสำคัญ 4 ข้อ',
  'ขนาด แหล่งผลิต และรูปแบบบรรจุภัณฑ์',
  'แนวทางการใช้ตามฉลาก',
];

const DETAIL_ALT_TOPICS = [
  'บทบาทและประเภทผลิตภัณฑ์แบบละเอียด',
  'ลำดับและขอบเขตการใช้งานแบบละเอียด',
  'ส่วนผสมที่ระบุบนฉลากแบบละเอียด',
  'วิธีใช้และระยะเวลาตามฉลาก',
  'ข้อมูลสำคัญ 4 ข้อแบบละเอียด',
  'รายละเอียดผลิตภัณฑ์ ขนาด 500 ml และผลิตในเกาหลี',
];

export function galleryAltText(set: ValentineGallerySet, kind: 'main' | 'detail', index: number) {
  const topics = kind === 'main' ? MAIN_ALT_TOPICS : DETAIL_ALT_TOPICS;
  const topic = topics[index];
  if (!topic) throw new Error(`Missing gallery alt topic: ${kind}-${index + 1}`);
  const isWorkflow = (kind === 'main' && index === 2) || (kind === 'detail' && index === 1);
  if (set.code === 'lpp' && isWorkflow) return `${set.label} การดูแลที่บ้าน ทรีตเมนต์ซาลอน และพรีทรีตเมนต์`;
  if (set.code !== 'lpp' && isWorkflow) return `${set.label} ระบบ Multi Perm 2 ขั้นตอน สำหรับดัดดิจิตอล ยืดวอลลุ่ม และรีบอนดิ้ง`;
  return `${set.label} ${topic}`;
}
