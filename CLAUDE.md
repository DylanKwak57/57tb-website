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
└── join-57/            # 🔒 채용 페이지 (unlisted, 독립 풀페이지 — 헤더/푸터 없음)
```
- route group `(main)`은 URL에 영향 없음 — 손님 URL 전부 기존 그대로.

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
