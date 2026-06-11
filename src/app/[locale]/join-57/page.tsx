'use client';

/**
 * 57 디자이너 채용 페이지 (unlisted, 태국어 전용)
 * 기획 정본: ~/Projects/57TB/57 CEO/57 디자이너 채용/plan.md
 * 구성: 종합 스토리(영화 예고편 톤) → 인터뷰 카드 3개(클릭 펼침) → AI 알아보기 봇(위젯 이식)
 * 손님 동선 분리: 헤더/푸터 없음 · noindex · 메뉴/사이트맵 미등록
 */

import { Fragment, useState, useRef, useEffect } from 'react';

const BOT_URL = 'https://pnjengzvzamkufiaexac.supabase.co/functions/v1/recruit-chat';
// TUS 친구추가 LINE — 계정 확정 시 입력 (빈 값이면 버튼 미표시)
const LINE_ADD_URL = '';

const C = {
  cream: '#EFEAE3',
  brown: '#3A342E',
  gold: '#B8924F',
  gray: '#8A7F74',
  line: '#E0D8CC',
};

// ── 종합 스토리 (태국어 정본, 에이 검증 통과) ──
const STORY: { text: string; em?: boolean }[] = [
  { text: 'มือเดียวกัน กรรไกรเล่มเดียวกัน\nแต่บางที่กลับถูกกลบ บางที่กลับเปล่งประกาย' },
  { text: 'คนที่ยืนอยู่บนจุดสูงสุด ก็เริ่มต้นจากศูนย์เหมือนกัน' },
  { text: 'ช่างที่ลูกค้าต่อคิวรอที่ 57 ในวันนี้\nจริงๆ แล้วจุดเริ่มต้นของพวกเขาก็เคยธรรมดา' },
  { text: 'บางคนเคยเป็นผู้ช่วยที่คอยสระผม\nกว่าจะได้จับกรรไกร ก็ใช้เวลาหลายปี' },
  { text: 'บางคนเคยเป็นช่างมือใหม่ที่ไม่มีใครเรียกหา\nบางวันทั้งวันไม่มีลูกค้าสักคน' },
  { text: 'ไม่ใช่เพราะพรสวรรค์\nพวกเขามีจุดร่วมกันอยู่อย่างหนึ่ง' },
  { text: 'อยู่ที่เดียว นานพอ และไม่เคยหยุดเดิน', em: true },
  { text: 'ร้านทำผม... บรรยากาศคือสิ่งสำคัญ' },
  { text: 'ที่นี่ คุณเห็นยอดขาย ค่าคอมมิชชั่น และคิวลูกค้าของตัวเอง ได้แบบเรียลไทม์\nไม่ต้องยัดเยียดขายเมมเบอร์ หรือใช้ของปลอมกับลูกค้า' },
  { text: 'เพราะที่ที่กรรไกรจะเปล่งประกาย ...มันมีอยู่จริง', em: true },
  { text: 'อีก 5 ปีของคุณที่กำลังอ่านอยู่นี้\nขึ้นอยู่กับว่าคุณทำงานที่ไหน อยู่ข้างใคร' },
];

// ── 인터뷰 카드 3개 (태국어 정본, 에이 검수 2026-06-10 반영: ระบุ) ──
type QA = { q: string; a: string };
type Interview = {
  id: string;
  label: string;
  teaser: string;
  sub: string;
  /* 카드마다 다른 주인공 지표 + 색깔 (JOY=수입·흰+골드 / ONE=세월·크림 / PRAE=레벨·다크) */
  hero: { big: string; caption: string };
  extra: string;
  theme: 'light' | 'cream' | 'dark';
  qa: QA[];
  proof: string;
};

const INTERVIEWS: Interview[] = [
  {
    id: 'joy',
    label: 'ช่าง Jxx',
    teaser: 'ยอดขึ้น 3 เท่า จากวันที่ไม่มีใครเรียกหา',
    sub: 'สำหรับคนที่อยากเห็นรายได้โตจริง',
    hero: { big: '×3.5', caption: 'ยอด 80,000 → 280,000 บาท/เดือน' },
    extra: 'ลูกค้าระบุ 0 → วันละ 4 คน · ปีที่ 6',
    theme: 'light',
    qa: [
      { q: 'ทำงานที่ 57 มานานแค่ไหนแล้วคะ', a: '6 ปีกว่าๆ แล้วค่ะ พอมานึกดูเวลาผ่านไปไวมากเลยนะคะ' },
      { q: 'ช่วงแรกๆ เป็นยังไงบ้างคะ', a: 'พูดตรงๆ ตอนนั้นแทบไม่มีลูกค้าระบุเลยค่ะ บางวันทั้งวันไม่มีสักคนก็มี แต่ที่ร้านลูกค้าเยอะมากอยู่แล้ว เลยมีโอกาสเข้ามาตลอดค่ะ' },
      { q: 'แล้วตอนนี้เป็นยังไงคะ', a: 'ตอนนี้มีลูกค้ารอระบุวันละสี่ห้าคนเลยค่ะ ยอดก็มากกว่าเมื่อก่อนสามเท่า บางทีตัวเองยังแปลกใจอยู่เลยค่ะ' },
      { q: 'เคยมีช่วงที่อยากเลิกไหมคะ', a: "จะไม่มีได้ยังไงคะ ตอนที่จับลูกค้าไม่ได้ ตอนที่รู้สึกว่ามีแต่เราที่ย่ำอยู่กับที่… แต่พอเห็นคนที่เก่งกว่าเรา ก็กลับมาคิดว่า 'เราก็ทำได้' แล้วตั้งใจขึ้นมาใหม่อีกครั้งค่ะ" },
      { q: 'อะไรที่ทำให้มาถึงทุกวันนี้ได้คะ', a: 'จริงๆ ที่นี่มีคนเก่งกว่าเราเยอะค่ะ คนที่ตัดผมไว คนที่ทำสีออกมาสวยกว่า คนที่รู้ใจลูกค้าทั้งที่ยังไม่ทันพูด… พออยู่กับคนพวกนี้ มันไม่ได้เรียนจากคำพูดนะคะ แต่ค่อยๆ ซึมซับจากบรรยากาศ สะสมมาหกปีก็เลยเป็นแบบนี้ค่ะ' },
      { q: 'ที่นี่ต่างจากร้านอื่นยังไงคะ', a: 'ที่นี่ไม่มีอะไรปิดบังทั้งกับลูกค้าและกับพวกเราเองค่ะ กับลูกค้าก็ใช้ของตามที่บอกจริงๆ — ร้านที่บอกว่าใช้ของแพงแต่หลังร้านแอบใช้ของถูก มีเยอะกว่าที่คิดนะคะ ส่วนกับพวกเราเอง ทั้งยอดขาย ค่าคอม รวมถึงลูกค้าที่จองคิวเรา ก็เช็คได้แบบเรียลไทม์หมดเลยค่ะ การได้มองหน้าลูกค้าและดูรายได้ตัวเองได้อย่างสบายใจ… สำหรับคนทำงาน มันสำคัญกว่าที่คิดมากค่ะ' },
      { q: 'อยากบอกอะไรกับช่างที่กำลังลังเลไหมคะ', a: 'ทำงานที่ไหน อยู่ข้างใคร มันคืออนาคตของเราเลยค่ะ จะปล่อยให้เวลาเสียไปเปล่าๆ หรือจะใช้มันให้คุ้ม อันนี้แหละค่ะที่สำคัญที่สุด' },
    ],
    proof: 'ยอด 80,000 → 280,000 บาท · ลูกค้าระบุ 0 → วันละ 4 คน · ช่างผม 57TB ปีที่ 6',
  },
  {
    id: 'one',
    label: 'ช่าง Oxx',
    teaser: 'ลูกค้าที่เจอตอนเป็นนักเรียน วันนี้ยังตามมาอยู่',
    sub: 'สำหรับคนที่เพิ่งเริ่มต้นเส้นทางช่าง',
    hero: { big: '9 ปี', caption: 'ลูกค้าประจำที่ตามมาตลอดทาง' },
    extra: 'ลูกค้าระบุ 0 → วันละ 5 คน',
    theme: 'cream',
    qa: [
      { q: 'ทำงานที่ 57 มานานแค่ไหนแล้วคะ มีเคล็ดลับอะไรที่อยู่ที่เดียวได้นานขนาดนี้ไหมคะ', a: "หนูว่าไม่ได้มีเคล็ดลับอะไรหรอกค่ะ แค่ไม่อยากปล่อยโอกาสที่ร้านให้มาให้หลุดไป ที่นี่ได้เจอลูกค้าเยอะมาก ถึงจะเหนื่อยแค่ไหน หนูก็คิดว่า 'ขอแค่ทำให้ลูกค้าสักคนประทับใจให้ได้' แล้วก็ตั้งใจทำเต็มที่มาตลอด ทำไปทำมาก็เก้าปีแล้วค่ะ" },
      { q: 'ตอนเริ่มงานใหม่ๆ เป็นยังไงบ้างคะ', a: 'ตอนแรกยังไม่มีลูกค้าระบุหนูเลยค่ะ แต่ที่ร้านลูกค้าเยอะมากอยู่แล้ว เลยมีโอกาสเข้ามาตลอด หนูก็เลยตั้งใจคว้าทุกโอกาสที่เข้ามาให้ดีที่สุด พอมองย้อนกลับไป ความตั้งใจตอนนั้นมันสะสมมาจนถึงทุกวันนี้ค่ะ' },
      { q: 'ตอนนี้มีลูกค้าประจำเยอะเลยใช่ไหมคะ', a: 'ตอนนี้มีลูกค้าที่ตามมาหาหนูคนเดียวมาหลายปีแล้วค่ะ บางคนตอนมาครั้งแรกยังเป็นนักเรียนอยู่เลย ตอนนี้ทำงานแล้วก็ยังมาหา การที่แต่ละคนอยู่กับเรามานานๆ หนูรู้สึกขอบคุณมากค่ะ' },
      { q: 'ตลอดเก้าปีที่ผ่านมา เคยมีช่วงที่เหนื่อยจนอยากเลิกไหมคะ', a: 'ก็มีช่วงที่เหนื่อยเรื่องส่วนตัวเหมือนกันค่ะ แต่ทุกครั้งที่เป็นแบบนั้น การที่ลูกค้ายังเชื่อใจและกลับมาหาหนูอีก มันเป็นกำลังใจที่มีค่ามากเลย หนูก็เลยอยากตอบแทนความรู้สึกนั้น แล้วก็มีแรงสู้ต่อค่ะ' },
      { q: 'คิดว่าทำไมลูกค้าถึงตามมาหาตลอดคะ', a: 'คงไม่ใช่เพราะหนูเก่งอะไรเป็นพิเศษหรอกค่ะ แต่พอได้ดูแลลูกค้าคนเดิมมานานๆ หนูก็กลายเป็นคนที่รู้จักผมของเขาดีที่สุด รู้ว่าเขาชอบสไตล์ไหน ตรงไหนออกมาแล้วสวย สิ่งพวกนี้มันต้องใช้เวลาถึงจะเกิดขึ้นค่ะ' },
      { q: 'การทำงานที่เดียวนานๆ ข้อดีที่สุดคืออะไรคะ', a: 'การได้เติบโตไปพร้อมกับลูกค้าค่ะ หนูจำได้หมดว่าตอนเจอครั้งแรกเขาเป็นยังไง ตอนนี้เป็นยังไง เหมือนได้เป็นส่วนหนึ่งในช่วงชีวิตของเขา อันนี้แหละค่ะที่เป็นความสุขที่สุดของอาชีพนี้' },
      { q: 'อยากฝากอะไรถึงน้องๆ ช่างที่เพิ่งเริ่มต้นไหมคะ', a: 'ตั้งใจทำไปเท่าไหร่ ลูกค้าจะเห็นเองค่ะ พอความภูมิใจมันสะสมขึ้นเรื่อยๆ ใครก็สร้างลูกค้าของตัวเองได้ การได้อยู่ในที่ดีๆ แล้วคว้าโอกาสให้ดี หนูว่าสำคัญที่สุดเลยค่ะ' },
    ],
    proof: 'ลูกค้าระบุ 0 → วันละ 5 คน · ลูกค้าประจำที่ตามมาหลายปี · ช่างผม 57TB ปีที่ 9',
  },
  {
    id: 'prae',
    label: 'ช่าง Pxx',
    teaser: 'จากมือใหม่ที่เคยแอบร้องไห้ สู่ท็อปของร้าน',
    sub: 'สำหรับคนที่อยากไปให้สุดทาง',
    hero: { big: 'Lv.4', caption: 'เลเวล 1 → 4 ระดับท็อปของร้าน' },
    extra: 'ลูกค้าระบุ 0 → วันละ 6 คน',
    theme: 'dark',
    qa: [
      { q: 'ถ้ามองย้อนกลับไปเก้าปีที่ผ่านมา เป็นช่วงเวลาแบบไหนคะ', a: "ถ้าให้พูดสั้นๆ มันคือช่วงเวลาที่ 'สนุกกับการพัฒนาตัวเอง' ค่ะ ทุกครั้งที่เติมส่วนที่ขาดไปได้ทีละนิด หนูรู้สึกได้เลยว่าฝีมือมันดีขึ้น หนูว่าหนูมาถึงตรงนี้ได้ก็เพราะความสนุกตรงนั้นแหละค่ะ" },
      { q: 'ตอนนี้อยู่เลเวลต้นๆ ของร้าน ตอนแรกก็เก่งเลยไหมคะ', a: "ไม่เลยค่ะ ตอนแรกหนูยังไม่เก่งเลย เคยโดนลูกค้าคอมเพลนจนแอบไปร้องไห้คนเดียวในห้องเตรียมของก็มี แต่แทนที่จะอาย หนูกลับคิดว่า 'พอรู้แล้วว่าตัวเองขาดตรงไหน ก็แค่เติมให้เต็ม' ถึงจะเหนื่อย แต่พอค่อยๆ เติมไปทีละอย่าง มันก็เก่งขึ้นจริงๆ ค่ะ" },
      { q: 'มีเคล็ดลับอะไรที่ทำให้ฝีมือพัฒนาเร็วขนาดนี้คะ', a: 'หนูไม่หนีจากสิ่งที่ตัวเองทำไม่ได้ค่ะ ถ้ามีงานไหนทำไม่ได้ ก็ฝึกจนกว่าจะทำได้ แล้วก็ถามรุ่นพี่ที่เก่งๆ ตลอด เพราะการปล่อยให้ตัวเองไม่รู้ทั้งที่ไม่รู้ มันน่ากลัวที่สุด พอทำแบบนั้นไปเรื่อยๆ อยู่ดีๆ ลูกค้าก็เริ่มระบุหนูเองค่ะ' },
      { q: 'ตอนที่เลเวลขยับขึ้น รู้สึกยังไงบ้างคะ', a: "ทุกครั้งที่ขยับขึ้นไปอีกขั้น เหมือนได้รับการยืนยันว่า 'เรามาถูกทางแล้วนะ' รู้สึกดีมากค่ะ ที่บริษัทเรามีระบบเลเวล เลยทำให้เห็นการเติบโตของตัวเองชัดเจน อันนั้นแหละค่ะที่กลายเป็นแรงผลักให้ไปขั้นต่อไป" },
      { q: 'ตอนนี้มีลูกค้าระบุเยอะเลยใช่ไหมคะ', a: 'ค่ะ ตอนนี้โชคดีที่มีลูกค้าระบุหนูวันละหกเจ็ดคน พอนึกถึงตอนที่เคยร้องไห้ช่วงแรกๆ ก็รู้สึกว่าเวลาเหล่านั้นมันหล่อหลอมหนูขึ้นมาค่ะ' },
      { q: 'ทำงานที่ 57 สิ่งที่ชอบที่สุดคืออะไรคะ', a: 'ที่บริษัทเรา ทำไปเท่าไหร่มันก็ตอบแทนกลับมาอย่างตรงไปตรงมาค่ะ เขาวัดจากยอดที่เราทำได้จริงๆ และจากลูกค้าที่ระบุเรา เลยทำให้รู้สึกว่าทำงานแล้วมีคุณค่าชัดเจน อันนี้แหละที่ทำให้หนูยิ่งสนุกกับงานค่ะ' },
      { q: 'อยากฝากอะไรถึงช่างที่กำลังอยากพัฒนาตัวเองไหมคะ', a: 'ตอนแรกที่ยังไม่เก่ง มันเป็นเรื่องธรรมดามากๆ ค่ะ ถ้าเราสนุกกับการค่อยๆ เติมส่วนที่ขาด เดี๋ยวก็จะเห็นตัวเองที่โตขึ้นแบบไม่รู้ตัว แล้วถ้าได้อยู่ในที่ดีๆ ที่ได้พัฒนาไปด้วยกัน ก็จะยิ่งโตเร็วขึ้นค่ะ' },
    ],
    proof: 'เลเวล 1 → 4 (ระดับท็อปของร้าน) · ลูกค้าระบุ 0 → วันละ 6 คน · ช่างผม 57TB ปีที่ 9',
  },
];

const CHIPS = [
  '💰 เงินเดือน/ค่าคอม',
  '📚 สอนงาน/พัฒนาฝีมือ',
  '🕐 เวลาทำงาน/วันหยุด',
  '✅ คุณสมบัติผู้สมัคร',
  '🎁 สวัสดิการ',
];

type Msg = { role: 'user' | 'assistant'; content: string };

/** 메시지 내 URL → 클릭 가능한 링크 (새 탭, 긴 주소는 줄바꿈) */
function renderMsg(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((p, i) =>
    /^https?:\/\//.test(p) ? (
      <a
        key={i}
        href={p}
        target="_blank"
        rel="noreferrer"
        className="underline font-semibold break-all"
        style={{ color: 'inherit' }}
      >
        {p}
      </a>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

/** 회사 로고송 — 브라우저 정책상 소리 자동재생 불가 → 첫 상호작용(터치/클릭/키)에 페이드인 시작 + 🔊/🔇 토글 */
function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);
  const started = useRef(false);
  const userOff = useRef(false);

  useEffect(() => {
    const audio = new Audio('/audio/57-theme.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    const fadeIn = () => {
      audio.volume = 0;
      let v = 0;
      const iv = setInterval(() => {
        v = Math.min(0.55, v + 0.05);
        audio.volume = v;
        if (v >= 0.55) clearInterval(iv);
      }, 120);
    };
    const start = () => {
      if (started.current || userOff.current) return;
      started.current = true;
      audio
        .play()
        .then(() => {
          setOn(true);
          fadeIn();
        })
        .catch(() => {
          started.current = false; // 아직 잠금 상태면 다음 상호작용에서 재시도
        });
    };
    const evs: (keyof WindowEventMap)[] = ['pointerdown', 'touchend', 'keydown', 'click'];
    evs.forEach((e) => window.addEventListener(e, start, { passive: true }));
    return () => {
      evs.forEach((e) => window.removeEventListener(e, start));
      audio.pause();
    };
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (on) {
      a.pause();
      userOff.current = true;
      setOn(false);
    } else {
      userOff.current = false;
      started.current = true;
      a.volume = 0.55;
      a.play().then(() => setOn(true)).catch(() => {});
    }
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      aria-label={on ? 'ปิดเพลง' : 'เปิดเพลง'}
      className="fixed top-4 right-4 z-50 w-11 h-11 rounded-full shadow-md flex items-center justify-center text-[17px] active:scale-95 transition"
      style={{ background: on ? C.gold : '#fff', border: `1px solid ${C.gold}` }}
    >
      {on ? '🔊' : '🔇'}
    </button>
  );
}

function ChatWidget() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: 'สวัสดีค่ะ 😊 สนใจร่วมงานเป็นช่างทำผมกับ 57 ใช่ไหมคะ ถามอะไรก็ได้เลยนะคะ หรือกดปุ่มด้านล่างก็ได้ค่ะ' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [quick, setQuick] = useState<string[]>([]);
  const [upload, setUpload] = useState<'self' | 'work' | null>(null);
  const [done, setDone] = useState(false); // 정식지원 완료 — 지원 칩 숨김
  const convId = useRef<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, quick, upload]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setBusy(true);
    setQuick([]);
    setUpload(null);
    const history = msgs.slice(-12);
    setMsgs((m) => [...m, { role: 'user', content: message }, { role: 'assistant', content: '...' }]);
    setInput('');
    try {
      const r = await fetch(BOT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, conversation_id: convId.current }),
      });
      const d = await r.json();
      if (d.reply) {
        convId.current = d.conversation_id || convId.current;
        setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: d.reply }]);
        setQuick(Array.isArray(d.quick_replies) ? d.quick_replies : []);
        setUpload(d.upload === 'self' || d.upload === 'work' ? d.upload : null);
      } else {
        setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: 'ขออภัยค่ะ ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้งนะคะ' }]);
      }
    } catch {
      setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: 'ขออภัยค่ะ การเชื่อมต่อมีปัญหา ลองใหม่อีกครั้งนะคะ' }]);
    } finally {
      setBusy(false);
    }
  }

  function pickPhoto() {
    fileRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const kind = upload;
    e.target.value = '';
    if (!file || !kind) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setUpload(null);
      setMsgs((m) => [...m, { role: 'user', content: kind === 'self' ? '📷 (รูปตัวเอง)' : '🖼 (รูปผลงาน)' }, { role: 'assistant', content: '...' }]);
      try {
        const r = await fetch(BOT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'upload_photo', kind, dataUrl: reader.result, conversation_id: convId.current }),
        });
        const d = await r.json();
        if (d.ok) {
          convId.current = d.conversation_id || convId.current;
          if (d.application_complete) {
            // 지원 완료 — 서버 고정 멘트 표시 (LLM 재호출 없음 → 마무리 멘트 반복 방지)
            setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: d.closing || '✅ ส่งใบสมัครเรียบร้อยแล้วค่ะ ทีมงานจะติดต่อกลับเพื่อนัดสัมภาษณ์นะคะ' }]);
            setDone(true);
          } else {
            setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: 'อัปโหลดสำเร็จค่ะ ✅' }]);
            await send('ส่งรูปตัวเองแล้วค่ะ');
          }
        } else {
          setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: '⚠️ อัปโหลดไม่สำเร็จ ลองใหม่อีกครั้งนะคะ' }]);
        }
      } catch {
        setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: '⚠️ การเชื่อมต่อมีปัญหา ลองใหม่อีกครั้งนะคะ' }]);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-[28px] border" style={{ borderColor: C.line, background: '#FBF9F6' }}>
      <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: C.line }}>
        <p className="font-semibold text-[17px]" style={{ color: C.brown }}>🤖 คุยกับ AI ของ 57</p>
        <p className="text-[12.5px] mt-1" style={{ color: C.gray }}>
          🔒 ถามได้สบายๆ ไม่ต้องบอกชื่อหรือเบอร์ก็ได้ค่ะ — ทางร้านจะไม่ติดต่อไปก่อน สนใจเมื่อไหร่ค่อยทักมา
        </p>
      </div>

      <div ref={logRef} className="h-[420px] overflow-y-auto px-4 py-4 flex flex-col gap-2.5">
        {msgs.map((m, i) => (
          <div
            key={i}
            className="max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap"
            style={{
              overflowWrap: 'anywhere',
              ...(m.role === 'user'
                ? { alignSelf: 'flex-end', background: C.gold, color: '#fff', borderBottomRightRadius: 6 }
                : { alignSelf: 'flex-start', background: '#fff', color: C.brown, border: `1px solid ${C.line}`, borderBottomLeftRadius: 6 }),
            }}
          >
            {renderMsg(m.content)}
          </div>
        ))}
        {quick.length > 0 && (
          <div className="flex flex-wrap gap-2 self-start max-w-[90%]">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full px-4 py-2 text-[13px] font-semibold text-white active:scale-95 transition"
                style={{ background: C.gold }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
        {upload && (
          <button
            onClick={pickPhoto}
            className="self-start rounded-full px-4 py-2 text-[13px] font-semibold text-white active:scale-95 transition"
            style={{ background: C.gold }}
          >
            {upload === 'self' ? '📷 อัปโหลดรูปตัวเอง' : '🖼 อัปโหลดรูปผลงาน'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 px-4 pb-2">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => send(c.replace(/^\S+\s/, ''))}
            className="rounded-full px-3 py-1.5 text-[12px] active:scale-95 transition bg-white"
            style={{ border: `1px solid ${C.gold}`, color: C.brown }}
          >
            {c}
          </button>
        ))}
        {!done && (
          <button
            onClick={() => send('อยากกรอกใบสมัครเลยค่ะ')}
            className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white active:scale-95 transition"
            style={{ background: C.gold, border: `1px solid ${C.gold}` }}
          >
            ✍️ สมัครงานเลย
          </button>
        )}
        {done && (
          <span className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold" style={{ background: '#EDE7DD', color: C.brown, border: `1px solid ${C.line}` }}>
            ✅ ส่งใบสมัครแล้ว
          </span>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 px-4 pb-4 pt-1"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์คำถามที่นี่..."
          className="flex-1 rounded-full px-4 py-2.5 text-[14px] bg-white outline-none"
          style={{ border: `1px solid ${C.line}`, color: C.brown }}
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full px-5 text-[14px] text-white disabled:opacity-50"
          style={{ background: C.brown }}
        >
          ส่ง
        </button>
      </form>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
    </div>
  );
}

export default function JoinPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ background: C.cream, color: C.brown }}>
      <MusicToggle />
      {/* ── 종합 스토리 ── */}
      <section className="max-w-2xl mx-auto px-6 pt-16 pb-12 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-full.png" alt="57 Total Beauty" className="h-16 mx-auto mb-12 opacity-90" />
        <h1 className="text-[26px] md:text-[34px] leading-snug font-semibold mb-12">
          กรรไกรเล่มเดียวกัน
          <br />
          <span style={{ color: C.gold }}>ต่างกันแค่ &ldquo;ใช้มันที่ไหน&rdquo;</span>
        </h1>
        <div className="space-y-8">
          {STORY.map((s, i) => (
            <p
              key={i}
              className="whitespace-pre-line leading-loose"
              style={s.em ? { color: C.gold, fontSize: 19, fontWeight: 600 } : { color: C.brown, fontSize: 16, opacity: 0.92 }}
            >
              {s.text}
            </p>
          ))}
        </div>
        <div className="mt-14 pt-8" style={{ borderTop: `1px solid ${C.line}` }}>
          <p className="text-[15px]" style={{ color: C.gray }}>องค์กรที่เติบโตไปด้วยกัน อย่างซื่อสัตย์</p>
          <p className="mt-1 tracking-[0.25em] text-[14px] font-semibold" style={{ color: C.gold }}>— 57 TOTAL BEAUTY</p>
        </div>
      </section>

      {/* ── 인터뷰 카드 ── */}
      <section className="max-w-3xl mx-auto px-5 pb-16">
        <p className="text-center text-[13px] tracking-[0.2em] mb-2" style={{ color: C.gold }}>เรื่องจริง · ตัวเลขจริง · ช่างจริงของร้าน</p>
        <h2 className="text-center text-[22px] font-semibold mb-8">พวกเขาเริ่มจากศูนย์เหมือนกัน</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {INTERVIEWS.map((iv) => {
            const t =
              iv.theme === 'dark'
                ? { bg: C.brown, text: C.cream, sub: '#C9BFB2', accent: C.gold, border: open === iv.id ? C.gold : C.brown }
                : iv.theme === 'cream'
                ? { bg: '#E3D9C8', text: C.brown, sub: '#7A6F5F', accent: '#8A6B3F', border: open === iv.id ? C.gold : '#D6C9B2' }
                : { bg: '#FFFFFF', text: C.brown, sub: C.gray, accent: C.gold, border: open === iv.id ? C.gold : C.line };
            return (
              <Fragment key={iv.id}>
              <button
                onClick={() => setOpen(open === iv.id ? null : iv.id)}
                className="text-left rounded-[24px] p-5 transition active:scale-[0.99]"
                style={{ background: t.bg, color: t.text, border: `1px solid ${t.border}` }}
              >
                <p className="text-[12px] tracking-wider mb-3" style={{ color: t.accent }}>{iv.label}</p>

                {/* 카드별 주인공 지표 */}
                {iv.theme === 'dark' ? (
                  <div className="mb-3">
                    <div className="flex items-end gap-1.5 h-[64px] mb-2" aria-hidden>
                      {[1, 2, 3, 4].map((lv) => (
                        <div
                          key={lv}
                          className="w-7 rounded-t-md"
                          style={{
                            height: `${lv * 16}px`,
                            background: lv === 4 ? C.gold : 'rgba(239,234,227,0.22)',
                          }}
                        />
                      ))}
                      <span className="ml-2 text-[30px] font-bold leading-none" style={{ color: C.gold }}>{iv.hero.big}</span>
                    </div>
                    <p className="text-[12.5px]" style={{ color: t.sub }}>{iv.hero.caption}</p>
                  </div>
                ) : (
                  <div className="mb-3">
                    <p className="text-[44px] font-bold leading-none mb-1.5" style={{ color: t.accent }}>{iv.hero.big}</p>
                    <p className="text-[12.5px]" style={{ color: t.sub }}>{iv.hero.caption}</p>
                  </div>
                )}

                <p className="font-semibold text-[15.5px] leading-snug mb-1">{iv.teaser}</p>
                <p className="text-[12px] mb-2" style={{ color: t.sub }}>{iv.sub}</p>
                <p className="text-[12.5px]" style={{ color: t.text, opacity: 0.85 }}>· {iv.extra}</p>
                <p className="mt-3 text-[12px] font-semibold" style={{ color: t.accent }}>
                  {open === iv.id ? 'ปิดบทสัมภาษณ์ ↑' : 'อ่านบทสัมภาษณ์เต็ม ↓'}
                </p>
              </button>
                {/* 인터뷰 전문 — 클릭한 카드 바로 아래에 표시 (모바일: 카드 직하 / 데스크톱: 해당 행 아래 전체 폭) */}
                {open === iv.id && (
                  <div className="md:col-span-3 rounded-[24px] bg-white p-6" style={{ border: `1px solid ${C.line}` }}>
                    <p className="text-[13px] tracking-wider mb-5" style={{ color: C.gold }}>
                      บทสัมภาษณ์ {iv.label} — ช่างจริงของ 57 (ขอสงวนชื่อ)
                    </p>
                    <div className="space-y-5">
                      {iv.qa.map((qa, i) => (
                        <div key={i}>
                          <p className="font-semibold text-[14.5px] mb-1.5" style={{ color: C.gold }}>Q. {qa.q}</p>
                          <p className="text-[14.5px] leading-relaxed">{qa.a}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 pt-4 text-[13px]" style={{ borderTop: `1px dashed ${C.line}`, color: C.gray }}>
                      📊 {iv.proof}
                    </p>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
        <p className="text-center mt-10 text-[15px] italic" style={{ color: C.gold }}>
          &ldquo;จนถึงวันที่ลูกค้าเอ่ยชื่อคุณ&rdquo;
        </p>
      </section>

      {/* ── AI 봇 ── */}
      <section id="chat" className="max-w-2xl mx-auto px-5 pb-16">
        <h2 className="text-center text-[22px] font-semibold mb-2">อยากรู้จัก 57 มากกว่านี้ไหม</h2>
        <p className="text-center text-[13.5px] mb-6" style={{ color: C.gray }}>
          เงินเดือน สวัสดิการ การสอนงาน ถาม AI ได้เลย ตอบทันทีตลอด 24 ชม.
        </p>
        <ChatWidget />
        {LINE_ADD_URL && (
          <a
            href={LINE_ADD_URL}
            target="_blank"
            rel="noreferrer"
            className="block text-center mt-5 rounded-full py-3 font-semibold text-white"
            style={{ background: '#06C755' }}
          >
            คุยกับทีมงานทาง LINE
          </a>
        )}
      </section>

      <footer className="pb-10 text-center text-[12px]" style={{ color: C.gray }}>
        © 57 Total Beauty · Asoke / Sai Mai
      </footer>
    </div>
  );
}
