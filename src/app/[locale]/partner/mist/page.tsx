/**
 * 1회차 체험단 모집 랜딩 — 퍼퓸 헤어 미스트 3종 · 태국어 전용 · unlisted
 *
 * 기획 정본: ~/Projects/57TB/57 CEO/57 Shopee 유통/dealer-targets/05-체험단-캠페인-계획.md §5-d
 *
 * 🚨 이 페이지의 역할 = **"이 체험단에 신청할까"를 결정시키는 것**
 *    ├ 여기서 하는 것: 이번 회차 제품 상세 · 신청 절차 · 신청 폼
 *    └ 상시 소개(우리가 누구·전 라인업·거래 조건)는 `/th/partner` 가 맡는다.
 *
 * 🔑 회차가 바뀌면 이 파일을 복제한다 — `/partner/serum`(2회차) 등.
 *    이전 회차 페이지는 **지우지 않는다**(페이스북·LINE 에 링크가 남는다).
 *    모집이 끝나면 폼을 내리고 `CLOSED` 안내로 바꾼다 → 아래 `IS_OPEN` 스위치.
 *
 * ✅ 확정 (2026-08-28 대표님)
 *    ① 체험 세트 = **50ml 각 1병 × 3향 = 3병**
 *    ② 모집 = **선착 10곳 표시** · 신청이 많으면 20곳까지 · 30곳 넘으면 마감
 *       🚨 자동 카운트를 만들지 않는다 — 마감은 **대표님 판단**이고 `IS_OPEN` 한 줄로 전환한다.
 *          기계가 30을 세면 "20곳인데 다 좋으면 더 받는다" 같은 판단이 끼어들 자리가 없다.
 *    ③ 신청 폼 = **웹 폼**(LINE 문의 아님). Supabase Edge Function -> Notion 보드
 *
 * 🚨 남은 것
 *    · 신청 폼 구현 (아래 CTA 자리)
 *    · 태국어 전량 에이 미검수
 */
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import TrialForm from '@/components/partner/TrialForm';

/** 모집 중 여부. 마감되면 false 로 바꾼다 — 페이지는 살리고 폼만 내린다(§5-d). */
const IS_OPEN = true;

/** 파트너 전용 OA `57TB Partner`(@347jyzxd) — 손님 상담봇과 다르다(Provider 분리). */
const LINE_URL = 'https://line.me/R/ti/p/@347jyzxd?openExternalBrowser=1';

const MIST_SLUGS = ['bellista-silk-mist', 'bellista-keratin-mist', 'bellista-collagen-mist'];
const MISTS = MIST_SLUGS
  .map((slug) => PRODUCTS.find((p) => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

/**
 * 제품별 한 줄 — 한국어 원문 헤드라인(어필논리 §4)을 태국어로 옮긴 것.
 * 🚨 `ไลน์` 금지(LINE 메신저로 읽힌다) · 의료 효능 단언 금지 · 과장 수치 금지.
 */
/* 향 노트 — 3종이 실제로 다르다는 걸 눈으로 보여주는 자료.
   출처 = 쇼피 상세 이미지(에이 검수 통과 태국어). silk desc-09 / keratin desc-10 / collagen desc-09 */
const SCENTS = [
  { file: 'scent-silk', name: 'Fresh Floral' },
  { file: 'scent-keratin', name: 'Fruity Floral' },
  { file: 'scent-collagen', name: 'Citrus Wave' },
];

const MIST_COPY: Record<string, string> = {
  'bellista-silk-mist': 'เงางามและกลิ่นที่น่าจดจำ',
  'bellista-keratin-mist': 'กลิ่นหอมติดทน ผมนุ่มสลวย',
  'bellista-collagen-mist': 'ประกายเงางาม เหมือนแสงบนผิวน้ำ',
};

/** 신청 절차 — `/th/partner` 에서 이관(2026-08-28 §5-d). ④ 주문 단계를 두지 않는다. */
/* 🚨 1단계가 LINE 연결이다 — 폼이 연결 뒤에 열리므로 여기 순서도 그래야 한다(2026-08-28). */
const STEPS = [
  { n: '1', head: 'เชื่อมต่อ LINE', body: 'แล้วกรอกชื่อร้าน ลิงก์ Google Maps และผู้ติดต่อ' },
  { n: '2', head: 'ยืนยันร้าน', body: 'ทีมงานตรวจสอบและติดต่อกลับทาง LINE' },
  { n: '3', head: 'ทดลองใช้', body: 'ส่งสินค้าตัวอย่างให้ทดลองที่ร้าน' },
];

export default function PartnerMistPage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      {/* 히어로 — 🥇 슬로건은 에이(원어민 CFO) 발안. `ร้าน`이 들어가 B2B 전용이다. */}
      <section className="mx-auto max-w-3xl px-6 pb-14 pt-20 text-center">
        <p className="text-[11px] font-medium tracking-[0.2em] text-brand-gold sm:text-xs">
          รับสมัครร้านทดลองใช้ · รอบที่ 1
        </p>
        <h1 className="mt-5 text-3xl font-semibold leading-snug sm:text-4xl">
          หอมติดร้าน
          <br />
          หอมติดผม
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-brand-white sm:text-base">
          Perfume Hair Mist 3 กลิ่น จาก Bellista
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-gold">
          57 Total Beauty เปิดให้ร้านเสริมสวยทดลองใช้ก่อนตัดสินใจ
        </p>
        {/* 🔑 숫자를 스크롤 전에 보여준다 (2026-08-28 대표님) — 원장은 성분 설명보다 "얼마나 팔렸나"를 본다.
            🔑 `/partner` 어필①("우리가 매일 써서 뭐가 재구매되는지 안다")과 짝이 된다 —
               "우리 매장에서만 잘 되는 게 아니다"가 성립한다.
            ℹ️ 출처 = 대표님(공급사 경로). 근거 요구 시 세리 확인. */}
        <p className="mx-auto mt-7 max-w-xl text-base font-semibold text-brand-gold sm:text-lg">
          จำหน่ายแล้วกว่า 50,000 ชิ้นในเกาหลี
        </p>

        {/* 🔑 "10곳"의 희소성은 유지하되 뒤 문장으로 늦게 본 사람의 주저를 없앤다(2026-08-28 대표님).
            실제로는 20곳까지 발송하고 30곳 넘으면 마감한다 — 그 숫자는 화면에 쓰지 않는다. */}
        {IS_OPEN && (
          <p className="mx-auto mt-6 max-w-xl rounded-lg bg-brand-card px-5 py-3 text-[13px] leading-relaxed text-brand-white">
            รับ 10 ร้านแรก · หากมีผู้สนใจมาก จะพิจารณาเพิ่มเติม
          </p>
        )}
      </section>

      {/* 왜 미스트인가 — 향수냐 헤어케어냐의 이분법을 깬다(어필논리 §4) */}
      <section className="border-t border-brand-dark px-6 py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-lg font-semibold sm:text-xl">น้ำหอม หรือ ทรีตเมนต์?</h2>
          <p className="mt-5 text-sm leading-relaxed text-brand-gold">
            ลูกค้าอยากได้กลิ่นหอมที่ติดทน แต่ก็ไม่อยากให้ผมหนักหรือเหนียว
            <br />
            และผลิตภัณฑ์ที่หอมส่วนใหญ่ก็ไม่ได้ดูแลเส้นผม
          </p>
          <p className="mt-5 text-sm leading-relaxed text-brand-white">
            Perfume Hair Mist ให้ทั้งกลิ่นและการดูแลเส้นผมในขวดเดียว
          </p>

          {/* 손님이 실제로 하는 말 — 원장이 매일 듣는 문장이라 설명보다 빠르다.
              내용은 3종 공통이라 1장으로 전부 커버된다(silk desc-03). */}
          <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-xl">
            <Image
              src="/partner/mist/concerns.webp"
              alt="ปัญหาที่ลูกค้าพูดถึงบ่อย"
              width={1080}
              height={1515}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* 미스트 3종 */}
      <section className="border-t border-brand-dark px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-lg font-semibold sm:text-xl">3 กลิ่น 3 โปรตีน</h2>
          <div className="mt-9 flex flex-wrap justify-center gap-x-4 gap-y-7">
            {MISTS.map((p) => (
              <div key={p.slug} className="w-[calc(33.333%-0.667rem)] text-center sm:w-[180px]">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-card">
                  <Image
                    src={`/products/${p.slug}/thumb.webp`}
                    alt={p.nameTh}
                    fill
                    sizes="(max-width: 640px) 30vw, 180px"
                    className="object-contain"
                  />
                </div>
                <p className="mt-3 text-[13px] font-medium leading-snug text-brand-white">{p.nameEn}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-brand-gold">{MIST_COPY[p.slug]}</p>
              </div>
            ))}
          </div>
          <p className="mt-7 text-center text-[13px] text-brand-gold">มี 3 ขนาด (50 / 80 / 200 มล.)</p>

          {/* 향 노트 — 3종이 정말 다르다는 유일한 증거. 세로로 쌓으면 3화면이 되므로 가로 스와이프.
              폰에서 한 장씩 넘겨 보게 하고 세로 길이는 1장분만 쓴다. */}
          <div className="-mx-6 mt-10 overflow-x-auto px-6 pb-2">
            <div className="flex w-max gap-3">
              {SCENTS.map((sc) => (
                <div key={sc.file} className="w-[78vw] max-w-[320px] shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={`/partner/mist/${sc.file}.webp`}
                    alt={sc.name}
                    width={1080}
                    height={1450}
                    className="h-auto w-full"
                  />
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-[12px] text-brand-gold">← เลื่อนเพื่อดูทั้ง 3 กลิ่น →</p>

          {/* 전 제품 보기 — 제품을 본 직후가 "다른 것도 있나" 하는 자리다(2026-08-28 대표님).
              목적지는 `/th/partner` 라인업이다(§5-d). bellista-th 로 보내지 않는다. */}
          <p className="mt-6 text-center">
            <Link href="/th/partner#products" className="text-[13px] text-brand-gold underline underline-offset-4">
              ดูสินค้าทั้งหมด
            </Link>
          </p>
        </div>
      </section>

      {/* 체험 세트 — 확정 2026-08-28 대표님: 50ml 각 1병 × 3향 */}
      {IS_OPEN && (
        <section className="border-t border-brand-dark px-6 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-lg font-semibold sm:text-xl">ชุดทดลองที่ร้านจะได้รับ</h2>
            <p className="mt-6 text-sm leading-relaxed text-brand-white">
              Perfume Hair Mist ขนาด 50 มล. ครบทั้ง 3 กลิ่น
              <br />
              กลิ่นละ 1 ขวด
            </p>
            <p className="mt-5 text-[13px] leading-relaxed text-brand-gold">
              ให้ช่างและลูกค้าได้ลองจริงก่อน แล้วค่อยตัดสินใจ
            </p>

            {/* 원장의 진짜 질문은 "내가 이걸 팔 수 있나"다. 사용법·판매법 상세는 수령 후 LINE 으로 주고
                여기서는 **도구를 준다는 사실 한 줄**만 둔다 (2026-08-28 대표님과 정리). */}
            <p className="mt-8 border-t border-brand-dark pt-7 text-[13px] leading-relaxed text-brand-white">
              พร้อมการ์ดแนะนำสินค้าที่ส่งให้ลูกค้าทาง LINE ได้ทันที
              <br />
              <span className="text-brand-gold">วิธีใช้และวิธีแนะนำลูกค้า จะส่งให้ทาง LINE หลังได้รับสินค้าค่ะ</span>
            </p>
          </div>
        </section>
      )}


      {/* 신청 절차 */}
      {IS_OPEN && (
        <section className="border-t border-brand-dark px-6 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-lg font-semibold sm:text-xl">ขั้นตอน</h2>
            <ol className="mt-9 grid gap-6 sm:grid-cols-3">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4 rounded-xl bg-brand-card p-5">
                  <span className="text-sm font-semibold text-brand-gold">{s.n}</span>
                  <div>
                    <p className="text-sm font-semibold">{s.head}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-brand-gold">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* CTA — 🚨 폼 자리. 9월에 LINE 로그인 + 5칸 폼으로 교체한다(§4-b). */}
      <section className="border-t border-brand-dark px-6 py-16 text-center">
        {IS_OPEN ? (
          <>
            <h2 className="text-lg font-semibold sm:text-xl">สนใจทดลองใช้ที่ร้าน</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-gold">
              กรอกข้อมูลร้าน ทีมงานจะตรวจสอบและติดต่อกลับ
            </p>

            {/* 🚨 폼 컴포넌트는 회차 페이지들이 공유한다. 마감 숫자는 넘기지 않는다 —
                서버 표(ROUNDS)가 정하고 접수 시점에 다시 센다. */}
            <div className="mt-9">
              <TrialForm round="mist" lineUrl={LINE_URL} />
            </div>
          </>
        ) : (
          /* 모집 종료 — 페이지는 살리고 안내로 바꾼다(§5-d) */
          <>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-brand-white">
              ขณะนี้การรับสมัครทดลองใช้รอบนี้ปิดรับแล้วค่ะ
              <br />
              ขอบคุณทุกร้านที่ให้ความสนใจค่ะ
            </p>
          </>
        )}

        <p className="mt-10 text-[13px] text-brand-gold">
          บริษัท 57 Total Beauty · ผู้นำเข้าและผู้จดแจ้ง อย. ผลิตภัณฑ์ Bellista ในประเทศไทย
        </p>
      </section>
    </main>
  );
}
