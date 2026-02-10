import type { Service, GalleryItem, Review, Branch, Promotion } from '@/types';

export const SERVICES: Service[] = [
  // ── CUT ──
  { id: 'dry', category: 'CUT', name: { th: 'Dry', en: 'Dry', ko: 'Dry' }, description: { th: 'Blow dry styling', en: 'Blow dry styling', ko: '드라이 스타일링' }, prices: { junior: 150, stylist1: 150, stylist2: 300, stylist3: 400 }, duration: '30 min' },
  { id: 'cut', category: 'CUT', name: { th: 'Cut', en: 'Cut', ko: 'Cut' }, description: { th: 'Korean-style haircut', en: 'Korean-style haircut', ko: '한국식 커트' }, prices: { junior: 200, stylist1: 300, stylist2: 400, stylist3: 500 }, duration: '1 hour', popular: true },

  // ── PERM ──
  { id: 'texture-perm', category: 'PERM', name: { th: 'Texture Perm', en: 'Texture Perm', ko: 'Texture Perm' }, description: { th: 'Natural texture perm', en: 'Natural texture perm', ko: '내추럴 텍스쳐 펌' }, prices: { junior: 400, stylist1: 600, stylist2: 900, stylist3: 1200 }, duration: '2 hours' },
  { id: 'digital-perm', category: 'PERM', name: { th: 'Digital Perm', en: 'Digital Perm', ko: 'Digital Perm' }, description: { th: 'Korean digital perm', en: 'Korean digital perm', ko: '디지털 펌' }, prices: { junior: 700, stylist1: 900, stylist2: 1200, stylist3: 1500 }, duration: '2-3 hours', popular: true },
  { id: 's-perm', category: 'PERM', name: { th: 'S Perm', en: 'S Perm', ko: 'S Perm' }, description: { th: 'S-curl perm', en: 'S-curl perm', ko: 'S컬 펌' }, prices: { junior: 900, stylist1: 1200, stylist2: 1500, stylist3: 1800 }, duration: '2-3 hours' },
  { id: 'rebonding', category: 'PERM', name: { th: 'Rebonding', en: 'Rebonding', ko: 'Rebonding' }, description: { th: 'Hair straightening', en: 'Hair straightening', ko: '매직 스트레이트' }, prices: { junior: 900, stylist1: 1200, stylist2: 1500, stylist3: 1800 }, duration: '2-3 hours' },
  { id: 'root-rebonding', category: 'PERM', name: { th: 'Root Rebonding', en: 'Root Rebonding', ko: 'Root Rebonding' }, description: { th: 'Root area rebonding', en: 'Root area rebonding', ko: '뿌리 매직' }, prices: { junior: 600, stylist1: 900, stylist2: 1200, stylist3: 1500 }, duration: '1.5-2 hours' },
  { id: 'volume-magic', category: 'PERM', name: { th: 'Volume Magic', en: 'Volume Magic', ko: 'Volume Magic' }, description: { th: 'Volume magic straight perm', en: 'Volume magic straight perm', ko: '볼륨 매직' }, prices: { junior: 1200, stylist1: 1500, stylist2: 1800, stylist3: 2100 }, duration: '2-3 hours', popular: true },
  { id: 'mix-perm', category: 'PERM', name: { th: 'Mix Perm', en: 'Mix Perm', ko: 'Mix Perm' }, description: { th: 'Mixed perm technique', en: 'Mixed perm technique', ko: '믹스 펌' }, prices: { junior: 1800, stylist1: 2100, stylist2: 2400, stylist3: 2700 }, duration: '3-4 hours' },
  { id: 'root-perm', category: 'PERM', name: { th: 'Root Perm', en: 'Root Perm', ko: 'Root Perm' }, description: { th: 'Root volume perm', en: 'Root volume perm', ko: '뿌리 펌' }, prices: { junior: 400, stylist1: 500, stylist2: 700, stylist3: 900 }, duration: '1-1.5 hours' },
  { id: 'down-perm', category: 'PERM', name: { th: 'Down Perm', en: 'Down Perm', ko: 'Down Perm' }, description: { th: 'Down perm for volume control', en: 'Down perm for volume control', ko: '다운 펌' }, prices: { junior: 200, stylist1: 300, stylist2: 400, stylist3: 500 }, duration: '1-1.5 hours' },

  // ── COLOR ──
  { id: 'root-color-gosen', category: 'COLOR', name: { th: 'Root Color (Gosen)', en: 'Root Color (Gosen)', ko: 'Root Color (Gosen)' }, description: { th: 'Root touch-up with Gosen', en: 'Root touch-up with Gosen', ko: '뿌리 염색 (고센)' }, prices: { junior: 500, stylist1: 600, stylist2: 900, stylist3: 1100 }, duration: '1.5-2 hours' },
  { id: 'color-gosen', category: 'COLOR', name: { th: 'Color (Gosen)', en: 'Color (Gosen)', ko: 'Color (Gosen)' }, description: { th: 'Full color with Gosen', en: 'Full color with Gosen', ko: '풀 염색 (고센)' }, prices: { junior: 700, stylist1: 900, stylist2: 1200, stylist3: 1500 }, duration: '2-3 hours' },
  { id: 'root-color-nigao', category: 'COLOR', name: { th: 'Root Color (Nigao)', en: 'Root Color (Nigao)', ko: 'Root Color (Nigao)' }, description: { th: 'Root touch-up with Nigao', en: 'Root touch-up with Nigao', ko: '뿌리 염색 (니가오)' }, prices: { junior: 800, stylist1: 1000, stylist2: 1500, stylist3: 1700 }, duration: '1.5-2 hours' },
  { id: 'color-nigao', category: 'COLOR', name: { th: 'Color (Nigao)', en: 'Color (Nigao)', ko: 'Color (Nigao)' }, description: { th: 'Full color with Nigao', en: 'Full color with Nigao', ko: '풀 염색 (니가오)' }, prices: { junior: 1500, stylist1: 1800, stylist2: 2100, stylist3: 2400 }, duration: '2-3 hours', popular: true },
  { id: 'root-color-shiseido', category: 'COLOR', name: { th: 'Root Color (Shiseido)', en: 'Root Color (Shiseido)', ko: 'Root Color (Shiseido)' }, description: { th: 'Root touch-up with Shiseido Primience', en: 'Root touch-up with Shiseido Primience', ko: '뿌리 염색 (시세이도)' }, prices: { junior: 1400, stylist1: 1700, stylist2: 2100, stylist3: 2300 }, duration: '1.5-2 hours' },
  { id: 'color-shiseido', category: 'COLOR', name: { th: 'Color (Shiseido)', en: 'Color (Shiseido)', ko: 'Color (Shiseido)' }, description: { th: 'Full color with Shiseido Primience', en: 'Full color with Shiseido Primience', ko: '풀 염색 (시세이도)' }, prices: { junior: 2100, stylist1: 2500, stylist2: 2900, stylist3: 3200 }, duration: '2-3 hours' },
  { id: 'bleach-highlight', category: 'COLOR', name: { th: 'Bleach / Highlight', en: 'Bleach / Highlight', ko: 'Bleach / Highlight' }, description: { th: 'Bleach or highlight (S/M/L)', en: 'Bleach or highlight (S/M/L)', ko: '블리치 / 하이라이트 (S/M/L)' }, prices: { junior: 700, stylist1: 900, stylist2: 1200, stylist3: 1500 }, duration: '2-4 hours' },

  // ── TREATMENT (same price all levels) ──
  { id: 'lpp', category: 'TREATMENT', name: { th: 'LPP', en: 'LPP', ko: 'LPP' }, description: { th: 'LPP hair treatment', en: 'LPP hair treatment', ko: 'LPP 트리트먼트' }, prices: { junior: 400, stylist1: 400, stylist2: 400, stylist3: 400 }, duration: '30 min' },
  { id: 'damage-control', category: 'TREATMENT', name: { th: 'Damage Control', en: 'Damage Control', ko: 'Damage Control' }, description: { th: 'Damage control treatment', en: 'Damage control treatment', ko: '데미지 컨트롤 트리트먼트' }, prices: { junior: 500 }, duration: '30 min' },
  { id: 'one-shot', category: 'TREATMENT', name: { th: 'One Shot', en: 'One Shot', ko: 'One Shot' }, description: { th: 'One-shot treatment (S/M/L)', en: 'One-shot treatment (S/M/L)', ko: '원샷 트리트먼트 (S/M/L)' }, prices: { junior: 600, stylist1: 600, stylist2: 600, stylist3: 600 }, priceRange: { s: 600, m: 900, l: 1200 }, duration: '1-1.5 hours' },
  { id: 'premium-3-step', category: 'TREATMENT', name: { th: 'Premium 3 Step', en: 'Premium 3 Step', ko: 'Premium 3 Step' }, description: { th: 'Premium 3-step treatment (S/M/L)', en: 'Premium 3-step treatment (S/M/L)', ko: '프리미엄 3스텝 (S/M/L)' }, prices: { junior: 1990, stylist1: 1990, stylist2: 1990, stylist3: 1990 }, priceRange: { s: 1990, m: 2490, l: 2990 }, duration: '1.5-2 hours' },
  { id: 'special-5-step', category: 'TREATMENT', name: { th: 'Special 5 Step', en: 'Special 5 Step', ko: 'Special 5 Step' }, description: { th: 'Special 5-step treatment (S/M/L)', en: 'Special 5-step treatment (S/M/L)', ko: '스페셜 5스텝 (S/M/L)' }, prices: { junior: 4000, stylist1: 4000, stylist2: 4000, stylist3: 4000 }, priceRange: { s: 4000, m: 5000, l: 6000 }, duration: '2-2.5 hours' },
  { id: 'one-shot-service', category: 'TREATMENT', name: { th: 'One Shot Service', en: 'One Shot Service', ko: 'One Shot Service' }, description: { th: 'Add-on (excl. shampoo & dry)', en: 'Add-on (excl. shampoo & dry)', ko: '원샷 서비스 (샴푸&드라이 불포함)' }, prices: { junior: 200, stylist1: 200, stylist2: 200, stylist3: 200 }, duration: '20 min' },
  { id: 'ann-treatment', category: 'TREATMENT', name: { th: 'Ann Treatment Service', en: 'Ann Treatment Service', ko: 'Ann Treatment Service' }, description: { th: 'Add-on (excl. shampoo & dry)', en: 'Add-on (excl. shampoo & dry)', ko: '앤 트리트먼트 서비스 (샴푸&드라이 불포함)' }, prices: { junior: 500, stylist1: 500, stylist2: 500, stylist3: 500 }, duration: '20 min' },
  { id: 'exshai-treatment', category: 'TREATMENT', name: { th: 'Exshai Treatment Service', en: 'Exshai Treatment Service', ko: 'Exshai Treatment Service' }, description: { th: 'Exshai premium treatment', en: 'Exshai premium treatment', ko: '엑샤이 트리트먼트 서비스' }, prices: { junior: 1500, stylist1: 1500, stylist2: 1500, stylist3: 1500 }, duration: '1-1.5 hours' },
];


export const GALLERY_ITEMS: GalleryItem[] = [
  // ── PERM ──
  { id: 'g1', category: 'PERM', afterImage: '/images/gallery/perm-digital-01.jpg', description: { th: 'ดัดดิจิตอล by HS KARN', en: 'Digital Perm by HS KARN', ko: '디지털 펌 by HS KARN' } },
  { id: 'g2', category: 'PERM', afterImage: '/images/gallery/perm-digital-02.jpg', description: { th: 'ดัดดิจิตอล by HS AMMA', en: 'Digital Perm by HS AMMA', ko: '디지털 펌 by HS AMMA' } },
  { id: 'g3', category: 'PERM', afterImage: '/images/gallery/perm-digital-03.jpg', description: { th: 'ดัดดิจิตอล by HS ALEX', en: 'Digital Perm by HS ALEX', ko: '디지털 펌 by HS ALEX' } },
  { id: 'g4', category: 'PERM', afterImage: '/images/gallery/perm-digital-04.jpg', description: { th: 'ดัดดิจิตอล by HS JIEUN', en: 'Digital Perm by HS JIEUN', ko: '디지털 펌 by HS JIEUN' } },
  { id: 'g5', category: 'PERM', afterImage: '/images/gallery/perm-digital-05.jpg', description: { th: 'ดัดดิจิตอล by HS BOW', en: 'Digital Perm by HS BOW', ko: '디지털 펌 by HS BOW' } },
  { id: 'g6', category: 'PERM', afterImage: '/images/gallery/perm-volume-magic-01.jpg', description: { th: 'ยืดวอลลุ่ม by HS KARN', en: 'Volume Magic by HS KARN', ko: '볼륨 매직 by HS KARN' } },
  { id: 'g7', category: 'PERM', afterImage: '/images/gallery/perm-volume-magic-02.jpg', description: { th: 'ยืดวอลลุ่ม by HS ANN', en: 'Volume Magic by HS ANN', ko: '볼륨 매직 by HS ANN' } },
  { id: 'g8', category: 'PERM', afterImage: '/images/gallery/perm-rebonding-01.jpg', description: { th: 'ยืดโคนดัดปลาย by HS KARN', en: 'Root Rebonding + Perm by HS KARN', ko: '뿌리 매직 + 펌 by HS KARN' } },
  // ── COLOR ──
  { id: 'g9', category: 'COLOR', afterImage: '/images/gallery/color-ash-01.jpg', description: { th: 'สีแอชเงิน by HS MAM', en: 'Ash Silver Color by HS MAM', ko: '애쉬 실버 컬러 by HS MAM' } },
  { id: 'g10', category: 'COLOR', afterImage: '/images/gallery/color-rose-01.jpg', description: { th: 'สีโรสพิงค์ by HS BANK', en: 'Rose Pink Color by HS BANK', ko: '로즈 핑크 컬러 by HS BANK' } },
  { id: 'g11', category: 'COLOR', afterImage: '/images/gallery/color-ash-02.jpg', description: { th: 'สีแอชกรีน by HS FERN', en: 'Ash Green Color by HS FERN', ko: '애쉬 그린 컬러 by HS FERN' } },
  { id: 'g12', category: 'COLOR', afterImage: '/images/gallery/color-balayage-01.jpg', description: { th: 'บาลายาจ by HS BOW', en: 'Balayage by HS BOW', ko: '발레아쥬 by HS BOW' } },
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: { th: 'คุณปุ๊กปัง', en: 'Emily R.', ko: '김민지' },
    rating: 5,
    text: {
      th: 'ร้านทำผมใกล้รถไฟฟ้าที่จริงใจ ช่างเก่งมาก ตัดผมสวยเข้ารูปหน้า ราคาเริ่มต้นแค่ 300 บาท คุ้มสุดๆ ค่ะ',
      en: 'Best Korean salon in Bangkok! The stylists really understand Asian hair texture. My digital perm turned out exactly like the style I wanted.',
      ko: '방콕에서 한국식 미용실 찾기 힘든데 여기는 진짜 한국 미용실 느낌이에요. 디지털 펌 완전 자연스럽게 잘 나왔어요!',
    },
    service: 'Cut',
    date: '2025-12-20',
  },
  {
    id: 'r2',
    name: { th: 'คุณแอน', en: 'Sarah L.', ko: '박수진' },
    rating: 5,
    text: {
      th: 'ประทับใจมากค่ะ พี่ๆน่ารัก บริการดีสุดๆ ตัดดีทำดีทุกอย่าง แนะนำเลยค่ะ',
      en: 'Great value for money near BTS Asoke. Staff are super friendly and professional. Love my new hair color!',
      ko: '한국에서 하는 것보다 저렴하고 실력도 좋아요. 매직 스트레이트 했는데 머리가 너무 부드러워졌어요!',
    },
    service: 'Perm',
    date: '2025-12-28',
  },
  {
    id: 'r3',
    name: { th: 'คุณวาลินี', en: 'Jessica M.', ko: '이하늘' },
    rating: 5,
    text: {
      th: 'บริการดี ไม่มีผิดหวัง! ดัดผมออกมาสวยเป๊ะ สไตล์เกาหลีสุดๆ ผมนุ่มเงาด้วยค่ะ',
      en: 'Amazing digital perm - exactly like the Korean style I wanted! The salon atmosphere is clean, bright, and welcoming.',
      ko: '아속역 근처라 접근성 좋고 한국어 소통이 되니까 편해요. 염색 색감이 정말 예뻐요!',
    },
    service: 'Perm',
    date: '2026-01-05',
  },
  {
    id: 'r4',
    name: { th: 'คุณเดซี่', en: 'Rachel K.', ko: '최유진' },
    rating: 5,
    text: {
      th: 'ตัดผมดีค่ะ สวยมาก เซ็ตง่ายดี บรรยากาศร้านดี สะอาด สว่าง ช่างใส่ใจทุกรายละเอียด',
      en: 'Professional service with high-quality Korean products. The stylist took time to understand what I wanted. Highly recommend!',
      ko: '볼륨 매직 했는데 완전 자연스럽고 볼륨감이 살아있어요. 한국 제품 사용해서 머릿결도 안 상했어요!',
    },
    service: 'Color',
    date: '2026-01-12',
  },
  {
    id: 'r5',
    name: { th: 'คุณโชเบล', en: 'Amanda T.', ko: '정서연' },
    rating: 5,
    text: {
      th: 'ทำผมใจกลางอโศก ราคาดีมาก พี่ๆน่ารัก ผมสวยเหมือนในซีรีส์เกาหลีเลยค่ะ',
      en: 'I was looking for a salon that does Korean-style perms and this place exceeded my expectations. Will definitely come back!',
      ko: '트리트먼트 받았는데 머리가 완전 살아났어요! 가격도 한국보다 훨씬 저렴하고 실력은 똑같아요. 강추!',
    },
    service: 'Treatment',
    date: '2026-01-22',
  },
  {
    id: 'r6',
    name: { th: 'คุณจูปาเจ๊บ', en: 'Mike S.', ko: '한도윤' },
    rating: 5,
    text: {
      th: 'ตัด Wolf Cut ออกมาเป๊ะมาก บริการและราคาน่ารัก เดินทางสะดวกใกล้ MRT เพชรบุรี',
      en: 'Got a great haircut for only 300 baht. The quality is on par with expensive salons. Convenient location near MRT Petchaburi.',
      ko: '남자 커트도 정말 잘해요. 한국 스타일로 깔끔하게 잘라주셔서 만족합니다. 다음에 또 올게요!',
    },
    service: 'Cut',
    date: '2026-02-01',
  },
];

export const BRANCHES: Branch[] = [
  {
    id: 'asoke',
    name: { th: 'สาขาอโศก', en: 'Asoke Branch', ko: '아속 지점' },
    address: {
      th: 'ซอยสุขุมวิท 19 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพ',
      en: 'Soi Sukhumvit 19, Klongtoey Nua, Watthana, Bangkok',
      ko: '수쿰빗 소이 19, 클롱또이 누아, 왓타나, 방콕',
    },
    phone: '02-016-0257',
    lineId: '@57totalbeauty',
    googleMapsUrl: 'https://maps.app.goo.gl/MVStKHKTwZoidBo47',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.56!3d13.74!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ0JzI0LjAiTiAxMDDCsDMzJzM2LjAiRQ!5e0!3m2!1sen!2sth!4v1!5m2!1sen!2sth',
    nearestTransport: {
      th: 'MRT เพชรบุรี / BTS อโศก',
      en: 'MRT Petchaburi / BTS Asoke',
      ko: 'MRT 펫차부리 / BTS 아속',
    },
    hours: '10:00 - 20:00',
    images: ['/images/branches/asoke-1.webp'],
  },
  {
    id: 'saimai',
    name: { th: 'สาขาสายไหม', en: 'Saimai Branch', ko: '싸이마이 지점' },
    address: {
      th: 'สายไหม กรุงเทพ',
      en: 'Saimai, Bangkok',
      ko: '싸이마이, 방콕',
    },
    phone: '02-045-0957',
    lineId: '@57totalbeauty',
    googleMapsUrl: 'https://maps.app.goo.gl/Q55ZpSJBs5UeAFgH7',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.5!2d100.65!3d13.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDU1JzEyLjAiTiAxMDDCsDM5JzAwLjAiRQ!5e0!3m2!1sen!2sth!4v1!5m2!1sen!2sth',
    nearestTransport: {
      th: 'BTS คูคต',
      en: 'BTS Khu Khot',
      ko: 'BTS 쿠콧',
    },
    hours: '10:00 - 20:00',
    images: ['/images/branches/saimai-1.webp'],
  },
];

export const PROMOTIONS: Promotion[] = [
  {
    id: 'p1',
    title: {
      th: '57 Balayage Festival',
      en: '57 Balayage Festival',
      ko: '57 발레아쥬 페스티벌',
    },
    description: {
      th: 'บาลายาจรวมทุกอย่าง จ่ายเพียง ฿3,900 + ฟรีตัดผม & LPP',
      en: 'All-inclusive Balayage only ฿3,900 + Free Cut & LPP',
      ko: '올인클루시브 발레아쥬 ฿3,900 + 무료 커트 & LPP',
    },
    image: '/images/promotions/balayage-festival.webp',
    badge: 'HOT',
  },
  {
    id: 'p2',
    title: {
      th: 'โปรแพ็กเกจสุดพิเศษ',
      en: 'Special Package Deal',
      ko: '스페셜 패키지',
    },
    description: {
      th: 'Gosen+Cut+LPP เริ่มต้น ฿1,290 / Nigao+Cut+LPP เริ่มต้น ฿1,790',
      en: 'Gosen+Cut+LPP from ฿1,290 / Nigao+Cut+LPP from ฿1,790',
      ko: 'Gosen+Cut+LPP ฿1,290~ / Nigao+Cut+LPP ฿1,790~',
    },
    image: '/images/promotions/package-special.webp',
    validUntil: '2026-02-28',
    badge: 'NEW',
  },
];

export const SNS_LINKS = {
  instagram: 'https://www.instagram.com/57totalbeauty',
  tiktok: 'https://www.tiktok.com/@57totalbeauty',
  youtube: 'https://www.youtube.com/channel/UCrrTonDUxVMkBHo25Xp40bA',
  facebook: 'https://www.facebook.com/57totalbeauty',
};

export const LINE_URL = process.env.NEXT_PUBLIC_LINE_URL || 'https://line.me/R/ti/p/@57totalbeauty';
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || 'https://57totalbeauty.net/booking/home-8D50D7DB-1BF7-4403-A0F6-CA32095E5E64';
