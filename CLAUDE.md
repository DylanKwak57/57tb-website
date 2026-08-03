# 57tb-website (57tb.art — 회사 홈페이지)

## 기술 스택 · 배포
- Next.js 14 + next-intl (locale: th/en/ko, 기본 th) + Tailwind v4
- **`output: 'export'` 정적 사이트** — 서버 코드(API route) 불가. 동적 기능은 외부(Supabase Edge Function 등)로
- **배포 = `git push origin main` → Vercel 자동배포** (`vercel deploy` CLI 금지 — 글로벌 규칙)
- 빌드 검증: `npm run build` (out/ 생성, out/은 gitignore)

## 라우트 구조 (2026-06-10 재편)
```
src/app/[locale]/
├── layout.tsx          # locale 검증 + NextIntlClientProvider만 (헤더/푸터 없음)
├── (main)/             # 손님용 페이지 그룹 — 헤더/푸터는 여기 layout.tsx에
│   ├── layout.tsx      # Header + Footer + skip link
│   ├── page.tsx        # 홈 / services / gallery / location / error.tsx
│   └── products/       # 🔒 BELLISTA 리테일 (unlisted — 2026-07-08 신설, 아래 규칙)
└── join-57/            # 🔒 채용 페이지 (unlisted, 독립 풀페이지 — 헤더/푸터 없음)
```
- route group `(main)`은 URL에 영향 없음 — 손님 URL 전부 기존 그대로.

## 🔒 /products — BELLISTA 리테일 필드 (unlisted, 2026-07-08)
초도 물량 도착 전까지 **비공개(링크·QR로만 진입)**. join-57과 같은 규칙: Header NAV_ITEMS·sitemap.xml 등록 금지, products/layout.tsx의 `robots noindex` 제거 금지. 공개 전환(메뉴 등록)은 대표님 지시로.
- 데이터 정본 = `src/data/products.ts` — 15종(Scalp Care Line 6 + Hair Perfume Line 9). **slug가 A5 QR에 인쇄되므로 변경 절대 금지.** status `available`/`coming-soon`(토닉·유칼 = 미발주, 발주 시 플래그만 변경)
- 상세 이미지 = `public/products/<slug>/c*.webp` + `thumb.webp`. 원본은 `57 CEO/Scalp Care Business/상세페이지-태국어-작업파일`·`57 CEO/NEW PRODUCT/상세페이지-태국어-프로틴케어`의 검수 확정 풀 PNG(1290w WebP 조각화). 상세 수정 = 원본 pilot 재렌더 → 재조각 → 교체
- 추후 추가(§16 D2C 계획): 가격·미스트 용량 옵션(50/80/200)·오미세 결제·추천 제품. 구매 영역 자리는 `[slug]/page.tsx`의 TODO 주석

### VALENTINE PROFESSIONAL (Professional Hair System, 2026-07-26 검수 반영)
- **태국어 전용이 확정 의도**(대표님 2026-07-26). ko/en 로케일에서도 상세 본문이 태국어인 것은 정상 — 번역 추가하지 말 것. `defaultLocale: 'th'` + `lang="th"` 유지.
- **멀티펌 조합 규칙**: 1제(H1·D1)와 2제(C2·L2)는 무관하며 **1제 1개 + 2제 1개가 한 세트**, 조합 제한 없음. Formula Finder가 4조합을 모두 허용하는 것이 이 규칙과 일치. 정본 = `57 CEO/57 Shopee 유통/shopee-listings/valentine/product-data.md`
- **썸네일 규격**: 800×800, 제품 높이 점유 **80±3%** + 상·하 여백 동일(수직 중앙). 멀티펌은 파우치 4개를 **2×2**로. 생성은 `scripts/generate-valentine-assets.py`(정본)만 사용 — 좌표 하드코딩 수정 후 `magic_assets()`/`lpp_assets()` 재실행.
- 🚨 **파우치 스케일은 "높이" 기준으로 통일 (폭 기준 금지)**: 4종은 실물이 같은 500ml이므로 화면 높이도 같아야 한다. `paste_fit`은 `thumbnail((w,h))`로 원본 비율을 유지하므로 **박스 폭이 먼저 걸리면 누끼 원본의 폭 편차가 높이 편차로 바뀐다**(2026-07-26 히어로 실측: 폭 287 고정 → 높이 537~572, 상단선 36px 어긋남). 셀 폭을 넉넉히 두어 **높이가 제약축이 되게** 할 것. 현재 히어로 = 높이 559px·상단 347·바닥 906 4종 편차 0px.
- **자산 수정 후 검증**: 4종 각각의 bbox를 재서 **높이·상단선·바닥선 편차가 모두 0px**인지 확인한 뒤 커밋(좌표만 보고 통과시키지 말고 기준선 그린 이미지로 눈 확인).
- **갤러리 70장은 쇼피 소재를 그대로 가져온다**(`listing_assets()`). 원본 생성기는 `57 CEO/57 Shopee 유통/shopee-listings/valentine/build.py`이고 규격·이력 정본은 같은 폴더 `impl.md`. **갤러리를 고치려면 build.py 수정 → `python3 build.py` → `checks.py` PASS → 웹에서 `listing_assets()` 재생성** 순서(웹 webp를 직접 손대면 다음 재생성에 덮인다). 갤러리에도 같은 "높이 기준 스케일" 원칙 적용(2026-07-26 6슬롯 교정, 편차 35px→2px).
- **카드 이중 표기**: Valentine만 첫 줄이 로케일 이름, 보조 줄은 태국어명. 두 줄이 같은 문장이면 보조 줄을 숨긴다(`ProductCatalog.tsx`) — 태국어 로케일·태국어명=영문명 제품에서 중복 방지.
- 상세 히어로 STAGE 라벨은 모바일 2줄 / 데스크톱 한 줄. `validate-products.mjs`가 라벨 4조각을 개별 검사하므로 문구 변경 시 함께 갱신.

## 🛒 /cart · /order — 57TB TRADING 소매 주문 (unlisted, 결제=Stripe Checkout)

**판매 주체는 회사가 아니라 개인 판매자 `57TB TRADING`이다** — 화면에 `จำหน่ายโดย 57TB TRADING`을 반드시 표시한다. 운영 정본(SSOT) = `57 CEO/57 Shopee 유통/CLAUDE.md` + `57tb-trading-stripe-plan.md`. **수정 전 정독.**

| 화면 | 파일 | 역할 |
|---|---|---|
| 장바구니 | `cart/CartView.tsx` | 수량·삭제 |
| 주문 | `order/OrderView.tsx` + `OrderPanel`·`OrderForm` | 손님 정보 입력 → 접수 → **Stripe로 이동** |
| 결제 미완료 | `order/OrderComplete.tsx` | 결제창을 못 열었을 때만 뜨는 재시도 화면 |
| 결제 완료 | `order/success` → `OrderSuccess.tsx` | Stripe `success_url`. 상태 조회 + 장바구니 비우기 |
| 상태 조회 | `order/status` → `OrderStatusView.tsx` | 주문번호 + 전화 뒷 4자리 |

- 🚨 **결제수단 선택 UI를 만들지 말 것.** PromptPay·카드·Google Pay는 **Stripe Checkout 화면 안에서** 손님이 고른다(2026-08-03 대표님 확정 — 결제 창이 하나여야 깔끔하다). 코드에서 `payment_method_types`를 지정하지 않는다(지정하면 대시보드 설정을 덮어써 수단이 사라진다).
- 🚨 **우리 PromptPay QR·슬립 업로드는 폐지**(`PromptPayQr.tsx` 삭제, SlipOK 미사용). 되살리지 말 것.
- 🚨 **가격 사본이 두 곳이다**: `src/data/order.ts`(화면) + Edge Function `trading-order-create`의 `PRICES`(청구). **반드시 함께** 고친다 — 어긋나면 화면 금액과 실제 청구액이 갈린다. 배송비도 같다(`SHIPPING_FEE` 30 ↔ 서버 env `SHIPPING_FEE`).
- 🚨 **결제 확정은 웹훅만 한다.** 성공 화면은 서버 상태를 조회해 보여줄 뿐이다(브라우저 리다이렉트는 조작 가능).
- **장바구니는 결제 완료 화면에서만 비운다** — 접수 화면에서 비우면 결제 못 한 손님이 담아둔 걸 잃는다.
- 백엔드 = Supabase Edge Functions (`57 CEO/57 Shopee 유통/trading-backend/`). 정적 사이트라 API 라우트가 없다.
- env `NEXT_PUBLIC_ORDER_API_BASE`(Vercel production·preview 등록 완료) = `https://pnjengzvzamkufiaexac.supabase.co/functions/v1`. 값이 없으면 주문 버튼이 비활성이다.
- **현재 잠금 상태**: 서버 `CHECKOUT_OPEN=false` → 주문 시도 시 503 + 태국어 "아직 주문 불가" 안내. **재고 확인 전까지 풀지 않는다.**

## 🔒 /join-57 — 디자이너 채용 페이지 (절대 규칙)
**손님 노출 0이 핵심 전제.** 디자이너 구직자가 DM·QR로만 진입하는 unlisted 페이지.
1. **`Header.tsx`의 NAV_ITEMS에 등록 금지** (메뉴 노출 금지)
2. **`public/sitemap.xml`에 URL 등록 금지**
3. layout.tsx의 `robots: { index: false, follow: false }` 제거 금지
4. 콘텐츠는 **태국어 전용** (타겟=태국 디자이너). 한국어/영어 노출 금지
- **기획 정본(SSOT)**: `~/Projects/57TB/57 CEO/57 디자이너 채용/plan.md` — 카피·데이터·디자인 결정 전부 여기. 수정 전 정독 필수
- **AI 봇**: 페이지 내 챗 위젯이 Supabase Edge Function `recruit-chat`(dylan-db) 호출. 봇 코드는 이 레포가 아니라 `57 CEO/57 디자이너 채용/bot/`에 있음 (FAQ·프롬프트 수정은 거기서)
- `LINE_ADD_URL` 상수(page.tsx): TUS 친구추가 링크 — 빈 값이면 버튼 미표시. 계정 확정 시 입력
- 인터뷰 카드 3개 디자인 원칙: 카드마다 주인공 지표 1개 거대하게 + 테마 차별화(흰+골드/크림/다크) — 동일 템플릿 3장 금지 (대표님 확정)
- 🎵 배경음악 = 회사 로고송 `public/audio/57-theme.mp3` (30초 루프). 브라우저 정책상 소리 자동재생 불가 → 첫 상호작용에 페이드인 + 🔊/🔇 토글 (MusicToggle 컴포넌트)
- 챗 메시지의 URL은 `renderMsg()`가 클릭 가능한 링크로 렌더 (말풍선 overflowWrap:anywhere — 봇 답변에 구글맵 링크 등 포함되므로 제거 금지)
- ⚠️ 배포가 안 뜨면: `vercel ls 57tb-website --scope dylankwaks-projects`로 빌드 상태 먼저 확인 — Initializing에 끼면 해당 배포 `vercel rm`으로 제거(큐 뚫림). 사이트 폴링만으로 기다리지 말 것 (2026-06-10 사례)

## 기타
- 손님 페이지 디자인 토큰: `src/app/globals.css` `@theme` (light 기본). join-57은 채용 브랜드 톤(크림 #EFEAE3 · 브라운 #3A342E · 골드 #B8924F)을 인라인로 자체 사용
- 문서: `docs/01-plan` `02-design` `03-analysis` (홈페이지 리뉴얼 이력)

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
