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
  // ── First 6: one from each style (shown in landing preview) ──
  { id: 'g1', category: 'PERM', style: 'Digital Perm', afterImage: '/images/gallery/digital-perm/78682.jpg', description: { th: 'Digital Perm', en: 'Digital Perm', ko: 'Digital Perm' } },
  { id: 'g2', category: 'COLOR', style: 'Hair Color', afterImage: '/images/gallery/color/78659.jpg', description: { th: 'Hair Color', en: 'Hair Color', ko: 'Hair Color' } },
  { id: 'g3', category: 'PERM', style: 'S Perm', afterImage: '/images/gallery/s-perm/78626.jpg', description: { th: 'S Perm', en: 'S Perm', ko: 'S Perm' } },
  { id: 'g4', category: 'PERM', style: 'Volume Magic', afterImage: '/images/gallery/volume-magic/78571.jpg', description: { th: 'Volume Magic', en: 'Volume Magic', ko: 'Volume Magic' } },
  { id: 'g5', category: 'COLOR', style: 'Balayage', afterImage: '/images/gallery/balayage/IMG_1889.jpg', description: { th: 'Balayage', en: 'Balayage', ko: 'Balayage' } },
  { id: 'g6', category: 'PERM', style: 'Mix Perm', afterImage: '/images/gallery/mix-perm/78637.jpg', description: { th: 'Mix Perm', en: 'Mix Perm', ko: 'Mix Perm' } },

  // ── Digital Perm ──
  { id: 'g7', category: 'PERM', style: 'Digital Perm', afterImage: '/images/gallery/digital-perm/240595303_4269811953055102_1644266022021613173_n.jpg', description: { th: 'Digital Perm', en: 'Digital Perm', ko: 'Digital Perm' } },
  { id: 'g8', category: 'PERM', style: 'Digital Perm', afterImage: '/images/gallery/digital-perm/241470769_4269812089721755_7965339137590808627_n.jpg', description: { th: 'Digital Perm', en: 'Digital Perm', ko: 'Digital Perm' } },
  { id: 'g9', category: 'PERM', style: 'Digital Perm', afterImage: '/images/gallery/digital-perm/254256807_4426104924092470_1289439371650097886_n.jpg', description: { th: 'Digital Perm', en: 'Digital Perm', ko: 'Digital Perm' } },
  { id: 'g10', category: 'PERM', style: 'Digital Perm', afterImage: '/images/gallery/digital-perm/78681.jpg', description: { th: 'Digital Perm', en: 'Digital Perm', ko: 'Digital Perm' } },

  // ── Color ──
  { id: 'g11', category: 'COLOR', style: 'Hair Color', afterImage: '/images/gallery/color/78658.jpg', description: { th: 'Hair Color', en: 'Hair Color', ko: 'Hair Color' } },
  { id: 'g12', category: 'COLOR', style: 'Hair Color', afterImage: '/images/gallery/color/78661.jpg', description: { th: 'Hair Color', en: 'Hair Color', ko: 'Hair Color' } },
  { id: 'g13', category: 'COLOR', style: 'Hair Color', afterImage: '/images/gallery/color/78662.jpg', description: { th: 'Hair Color', en: 'Hair Color', ko: 'Hair Color' } },
  { id: 'g14', category: 'COLOR', style: 'Hair Color', afterImage: '/images/gallery/color/78666.jpg', description: { th: 'Hair Color', en: 'Hair Color', ko: 'Hair Color' } },

  // ── S Perm ──
  { id: 'g15', category: 'PERM', style: 'S Perm', afterImage: '/images/gallery/s-perm/78614.jpg', description: { th: 'S Perm', en: 'S Perm', ko: 'S Perm' } },
  { id: 'g16', category: 'PERM', style: 'S Perm', afterImage: '/images/gallery/s-perm/78623.jpg', description: { th: 'S Perm', en: 'S Perm', ko: 'S Perm' } },
  { id: 'g17', category: 'PERM', style: 'S Perm', afterImage: '/images/gallery/s-perm/78625.jpg', description: { th: 'S Perm', en: 'S Perm', ko: 'S Perm' } },
  { id: 'g18', category: 'PERM', style: 'S Perm', afterImage: '/images/gallery/s-perm/78617.jpg', description: { th: 'S Perm', en: 'S Perm', ko: 'S Perm' } },

  // ── Volume Magic ──
  { id: 'g19', category: 'PERM', style: 'Volume Magic', afterImage: '/images/gallery/volume-magic/78562.jpg', description: { th: 'Volume Magic', en: 'Volume Magic', ko: 'Volume Magic' } },
  { id: 'g20', category: 'PERM', style: 'Volume Magic', afterImage: '/images/gallery/volume-magic/78572.jpg', description: { th: 'Volume Magic', en: 'Volume Magic', ko: 'Volume Magic' } },
  { id: 'g21', category: 'PERM', style: 'Volume Magic', afterImage: '/images/gallery/volume-magic/78563.jpg', description: { th: 'Volume Magic', en: 'Volume Magic', ko: 'Volume Magic' } },
  { id: 'g22', category: 'PERM', style: 'Volume Magic', afterImage: '/images/gallery/volume-magic/78573.jpg', description: { th: 'Volume Magic', en: 'Volume Magic', ko: 'Volume Magic' } },

  // ── Mix Perm ──
  { id: 'g23', category: 'PERM', style: 'Mix Perm', afterImage: '/images/gallery/mix-perm/78631.jpg', description: { th: 'Mix Perm', en: 'Mix Perm', ko: 'Mix Perm' } },
  { id: 'g24', category: 'PERM', style: 'Mix Perm', afterImage: '/images/gallery/mix-perm/78638.jpg', description: { th: 'Mix Perm', en: 'Mix Perm', ko: 'Mix Perm' } },
  { id: 'g25', category: 'PERM', style: 'Mix Perm', afterImage: '/images/gallery/mix-perm/78640.jpg', description: { th: 'Mix Perm', en: 'Mix Perm', ko: 'Mix Perm' } },
  { id: 'g26', category: 'PERM', style: 'Mix Perm', afterImage: '/images/gallery/mix-perm/78641.jpg', description: { th: 'Mix Perm', en: 'Mix Perm', ko: 'Mix Perm' } },

  // ── Balayage ──
  { id: 'g27', category: 'COLOR', style: 'Balayage', afterImage: '/images/gallery/balayage/IMG_0632.jpg', description: { th: 'Balayage', en: 'Balayage', ko: 'Balayage' } },
  { id: 'g28', category: 'COLOR', style: 'Balayage', afterImage: '/images/gallery/balayage/IMG_0672.jpg', description: { th: 'Balayage', en: 'Balayage', ko: 'Balayage' } },
  { id: 'g29', category: 'COLOR', style: 'Balayage', afterImage: '/images/gallery/balayage/IMG_0636.jpg', description: { th: 'Balayage', en: 'Balayage', ko: 'Balayage' } },
  { id: 'g30', category: 'COLOR', style: 'Balayage', afterImage: '/images/gallery/balayage/IMG_2110.jpg', description: { th: 'Balayage', en: 'Balayage', ko: 'Balayage' } },
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: { th: 'Katekate JS', en: 'Katekate JS', ko: 'Katekate JS' },
    rating: 5,
    text: {
      th: 'พนักงานทุกคนเป็นมืออาชีพ รักษาความสะอาดตลอดเวลา ตัดผมได้ตรงตามที่ต้องการ บรรยากาศในร้านดีมาก',
      en: 'The staff are all professional. They keep clean every single minute. Hair cut was exactly what I wanted. The atmosphere inside the salon is very good.',
      ko: '직원 모두 프로페셔널해요. 항상 청결하게 유지하고 커트가 정확히 원하는 대로 나왔어요. 매장 분위기도 정말 좋아요.',
    },
    service: 'Cut',
    date: '2021-04-19',
  },
  {
    id: 'r2',
    name: { th: 'Lovenote 888', en: 'Lovenote 888', ko: 'Lovenote 888' },
    rating: 5,
    text: {
      th: 'ร้านสะอาด ช่างบริการดี พนักงานบริการดี ได้ทรงผมถูกใจมากๆค่ะ',
      en: 'The shop is clean, the stylists provide great service, the staff are helpful, and I got a hairstyle I really love.',
      ko: '매장이 깨끗하고 미용사 서비스가 좋고 직원도 친절해요. 원하는 스타일이 나와서 너무 만족해요.',
    },
    service: 'Cut',
    date: '2021-03-11',
  },
  {
    id: 'r3',
    name: { th: 'Lewis O\'Donnell', en: 'Lewis O\'Donnell', ko: 'Lewis O\'Donnell' },
    rating: 5,
    text: {
      th: 'กำลังหาร้านทำผมใหม่สำหรับยืดผม ประทับใจกับพนักงานและความสะอาดของร้าน จะกลับมาใช้บริการทรีทเม้นท์เป็นประจำ',
      en: 'I was looking for a new place to get my hair rebonded. I was impressed by the staff and salon cleanliness. I will continue to come here for regular hair treatments.',
      ko: '리본딩할 새 곳을 찾고 있었는데 직원과 매장 청결도에 감명받았어요. 정기적으로 헤어 트리트먼트 받으러 계속 올 거예요.',
    },
    service: 'Treatment',
    date: '2025-06-13',
  },
  {
    id: 'r4',
    name: { th: 'Samaschaya M.', en: 'Samaschaya M.', ko: 'Samaschaya M.' },
    rating: 5,
    text: {
      th: 'ทำผมชอบและถูกใจตรงโจทย์ที่อยากได้ และพนักงานทุกคนมืออาชีพมากๆ',
      en: 'Loved the hair result, exactly what I wanted. All the staff are very professional.',
      ko: '원하는 대로 머리가 나와서 정말 마음에 들어요. 직원 모두가 매우 전문적이에요.',
    },
    service: 'Perm',
    date: '2021-10-10',
  },
  {
    id: 'r5',
    name: { th: 'Angela I.', en: 'Angela I.', ko: 'Angela I.' },
    rating: 5,
    text: {
      th: 'ช่างเก่งมาก บริการดี และคุณภาพผลิตภัณฑ์ดีเยี่ยม',
      en: 'Very good hair stylist, service, and quality of product.',
      ko: '미용사 실력이 좋고 서비스도 훌륭하며 제품 품질도 우수해요.',
    },
    service: 'Treatment',
    date: '2021-12-28',
  },
  {
    id: 'r6',
    name: { th: 'Panadda J.', en: 'Panadda J.', ko: 'Panadda J.' },
    rating: 5,
    text: {
      th: 'บริการดี สระผมนวดหัวสบายมากค่ะ',
      en: 'Good service. Hair washing and head massage are very comfortable.',
      ko: '서비스가 좋아요. 샴푸와 두피 마사지가 정말 편안해요.',
    },
    service: 'Treatment',
    date: '2025-06-01',
  },
  {
    id: 'r7',
    name: { th: 'Khun Khunshine', en: 'Khun Khunshine', ko: 'Khun Khunshine' },
    rating: 5,
    text: {
      th: 'ชอบมากๆ ประทับใจ บริการดีมากๆ น้องผู้ชายสระผมเก่ง ช่างก็แนะนำการทำผมได้ดีมากๆ สถานที่สะอาดสุดๆ แนะนำร้านนี้เลยค่ะ',
      en: 'Love it so much, very impressed. Excellent service. The male staff is great at shampooing. The stylist gives amazing hair advice. The place is extremely clean. Highly recommend!',
      ko: '너무 좋고 감동이에요. 서비스 최고예요. 남자 직원 샴푸 실력이 뛰어나고 미용사 상담도 정말 잘 해줘요. 매장이 매우 깨끗해요. 강력 추천!',
    },
    service: 'Cut',
    date: '2020-08-10',
  },
  {
    id: 'r8',
    name: { th: 'Marissa', en: 'Marissa', ko: 'Marissa' },
    rating: 5,
    text: {
      th: 'แนะนำร้านนี้มากๆ ตัดผมดีที่สุดในชีวิตเลย ช่างเก่งมากๆ ขอบคุณมากค่ะ',
      en: 'I cannot recommend this place more, it\'s honestly the best haircut I\'ve gotten in my life. The stylist was absolutely amazing. Thank you so much!',
      ko: '이곳을 정말 강력 추천해요. 솔직히 인생 최고의 커트였어요. 미용사가 정말 대단했어요. 감사합니다!',
    },
    service: 'Cut',
    date: '2025-11-12',
  },
  {
    id: 'r9',
    name: { th: 'Monmon On Tour', en: 'Monmon On Tour', ko: 'Monmon On Tour' },
    rating: 5,
    text: {
      th: 'ชอบมากค่ะ ผมสวยอย่างที่ต้องการเลย',
      en: 'Love it so much! My hair turned out beautifully, exactly as I wanted.',
      ko: '정말 마음에 들어요! 원하는 대로 머리가 예쁘게 나왔어요.',
    },
    service: 'Perm',
    date: '2018-10-01',
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
