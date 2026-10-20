/**
 * 인스타그램 프로필 링크(link in bio) 페이지 — unlisted, 헤더/푸터 없음
 *
 * 🚨 인스타그램 앱 안 브라우저는 처음에 화면 아래 절반만 덮고 올라온다.
 *    ⇒ 390×844 기준 위쪽 약 420px 안에 로고 · 이름 · 한 줄 소개 + 주요 버튼 3개가 다 보여야 한다.
 *    머리 부분을 키우면(큰 히어로 등) 버튼이 첫 화면 밖으로 밀리니 늘리지 말 것.
 * 🚨 값(지점·전화·지도·SNS·예약 주소)은 `src/lib/constants.ts`에서만 가져온다 — 여기 복사하지 않는다.
 * 🚨 컬러 이모지 금지 — 아이콘은 단색 선 SVG(currentColor, stroke 1.5)만.
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BRANCHES, SNS_LINKS } from '@/lib/constants';
import { assetPath } from '@/lib/utils';
import type { Locale } from '@/types';

const LINE_BOOKING_URL = 'https://line.me/R/ti/p/@361lxvmy'; // 57TB Booking & More (회사 예약 채널)
const LINE_CHAT_URL = 'https://line.me/R/ti/p/@57totalbeauty'; // 상담 채널

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'th', label: 'TH' },
  { code: 'en', label: 'EN' },
  { code: 'ko', label: 'KO' },
];

const EXTERNAL = { target: '_blank', rel: 'noopener' } as const;

// 헤더 로고와 같은 필터(라이트 = 웜 브라운 / 다크 = 골드). 서버 렌더라 테마 분기는 CSS로 한다.
const PAGE_CSS = `
.lb-text{word-break:keep-all;overflow-wrap:break-word}
.lb-logo{filter:brightness(0) invert(22%) sepia(10%) saturate(600%) hue-rotate(350deg) brightness(95%) contrast(90%)}
[data-theme="dark"] .lb-logo{filter:brightness(0) invert(72%) sepia(29%) saturate(619%) hue-rotate(359deg) brightness(90%) contrast(87%)}
`;

/* ── 단색 선 아이콘 ───────────────────────────────────────── */
type IconProps = { className?: string };
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function IconChat({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M12 4C7 4 3 7.1 3 11c0 2.3 1.4 4.3 3.6 5.6L6 20l3.9-2.2c.7.1 1.4.2 2.1.2 5 0 9-3.1 9-7s-4-7-9-7Z" />
      <path d="M8 11h.01M12 11h.01M16 11h.01" />
    </svg>
  );
}
function IconPin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}
function IconPhone({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 4.9 4.9l1.3-2 4 1.6V17a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
function IconClock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
function IconTag({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8a1.5 1.5 0 0 1 0 2.1l-6 6a1.5 1.5 0 0 1-2.1 0l-9-9Z" />
      <circle cx="8.5" cy="8.5" r="1.4" />
    </svg>
  );
}
function IconImage({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="9.5" r="1.6" />
      <path d="m4 17 4.5-4.5 3.5 3.5 2.5-2.5L20 18.5" />
    </svg>
  );
}
function IconBag({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}
function IconUsers({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <circle cx="16.5" cy="9.5" r="2.4" />
      <path d="M16 14a4.5 4.5 0 0 1 4.5 5" />
    </svg>
  );
}
function IconChevron({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}
function IconTikTok({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M13.5 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3" />
      <path d="M13.5 3.5c.4 2.6 2.2 4.4 4.8 4.7" />
    </svg>
  );
}
function IconYouTube({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <rect x="2.75" y="5.5" width="18.5" height="13" rx="4" />
      <path d="m10.25 9.5 4.5 2.5-4.5 2.5v-5Z" />
    </svg>
  );
}
function IconFacebook({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M14.5 8H16V4.6c-.5-.1-1.5-.2-2.4-.2-2.4 0-3.9 1.5-3.9 4.1V11H7v3.5h2.7V21h3.4v-6.5H16l.5-3.5h-3.4V9c0-.6.4-1 1.4-1Z" />
    </svg>
  );
}

/* ── 작은 조각 ─────────────────────────────────────────────── */
const ICON = 'h-6 w-6 shrink-0';
const MUTED = 'text-brand-gray';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="lb-text mb-2.5 px-1 text-[13px] font-semibold text-brand-gray">
      {children}
    </h2>
  );
}

function RowLink({
  href,
  label,
  icon: Icon,
  external = false,
}: {
  href: string;
  label: string;
  icon: (p: IconProps) => React.ReactElement;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? EXTERNAL : {})}
      className="flex min-h-[52px] items-center gap-3 rounded-2xl bg-brand-card px-4 py-3 transition active:scale-[0.98]"
    >
      <Icon className={`${ICON} ${MUTED}`} />
      <span className="lb-text flex-1 text-[15px] font-medium">{label}</span>
      <IconChevron className={`h-4 w-4 shrink-0 ${MUTED}`} />
    </a>
  );
}

export default async function LinksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations('links');

  // 🚨 글꼴은 여기서 직접 지정한다. 사이트 공통 `font-sans`(@theme --font-sans)는 :root 에서 풀릴 때
  //    next/font 변수(body 에 붙음)를 못 찾아 시스템 글꼴로 떨어진다(2026-10-20 실측 — 다른 페이지도 같다).
  //    태국어 = Noto Sans Thai 맨 앞(라틴 글자는 Jakarta 로 넘어감) / 영어·한국어 = Jakarta 맨 앞.
  const fontFamily =
    locale === 'th'
      ? 'var(--font-noto-thai), var(--font-jakarta), system-ui, sans-serif'
      : 'var(--font-jakarta), var(--font-noto-kr), var(--font-noto-thai), system-ui, sans-serif';

  return (
    <main
      className="lb-text min-h-screen bg-brand-black text-brand-white"
      style={{ fontFamily, lineHeight: 1.5 }}
    >
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <div className="mx-auto w-full max-w-[440px] px-4 pb-10 pt-3">
        {/* 언어 전환 */}
        <nav aria-label={t('language')} className="flex justify-end gap-1">
          {LOCALES.map((l) => (
            <a
              key={l.code}
              href={`/${l.code}/links`}
              hrefLang={l.code}
              aria-current={l.code === locale ? 'page' : undefined}
              className={
                l.code === locale
                  ? 'flex h-8 min-w-[40px] items-center justify-center rounded-full bg-brand-card px-2.5 text-xs font-bold'
                  : 'flex h-8 min-w-[40px] items-center justify-center rounded-full px-2.5 text-xs font-medium text-brand-gray'
              }
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* 머리 — 작게 유지(버튼 3개가 첫 420px 안에 들어가야 한다) */}
        <header className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath('/images/logo-header.png')}
            alt="57 Total Beauty"
            width={56}
            height={56}
            className="lb-logo h-14 w-14"
          />
          <h1 className="mt-1.5 text-lg font-bold leading-snug">57 Total Beauty</h1>
          <p className="lb-text mt-0.5 text-sm text-brand-gray">{t('tagline')}</p>
        </header>

        {/* 주요 버튼 2개 (예약 채널 · 상담 채널) */}
        <div className="mt-5 flex flex-col gap-2.5" data-primary-buttons>
          <a
            href={LINE_BOOKING_URL}
            {...EXTERNAL}
            data-primary="line-booking"
            className="flex min-h-[64px] items-center gap-3 rounded-2xl px-4 py-3 shadow-sm transition active:scale-[0.98]"
            style={{ backgroundColor: '#3A342E', color: '#F6F3EE' }}
          >
            <IconChat className={ICON} />
            <span className="flex-1">
              <span className="lb-text block text-base font-bold">{t('bookLine')}</span>
              <span className="lb-text block text-[13px] opacity-75">{t('bookLineSub')}</span>
            </span>
            <IconChevron className="h-4 w-4 shrink-0 opacity-70" />
          </a>

          <a
            href={LINE_CHAT_URL}
            {...EXTERNAL}
            data-primary="line-chat"
            className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-brand-white/15 bg-brand-card px-4 py-3 transition active:scale-[0.98]"
          >
            <IconChat className={`${ICON} ${MUTED}`} />
            <span className="flex-1">
              <span className="lb-text block text-base font-bold">{t('chatLine')}</span>
              <span className="lb-text block text-[13px] text-brand-gray">{t('chatLineSub')}</span>
            </span>
            <IconChevron className={`h-4 w-4 shrink-0 ${MUTED}`} />
          </a>
        </div>

        {/* 지점 */}
        <section className="mt-8">
          <SectionTitle>{t('branches')}</SectionTitle>
          <div className="flex flex-col gap-2.5">
            {BRANCHES.map((b) => (
              <div key={b.id} className="rounded-2xl bg-brand-card px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <IconPin className={`${ICON} ${MUTED} mt-0.5`} />
                  <div className="min-w-0 flex-1">
                    <p className="lb-text text-[15px] font-bold">{b.name[locale]}</p>
                    <p className="lb-text mt-0.5 flex items-center gap-1.5 text-[13px] text-brand-gray">
                      <IconClock className="h-3.5 w-3.5 shrink-0" />
                      {t('hours', { hours: b.hours.replace(/\s*-\s*/, '–') })}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-brand-gray">
                      <IconPhone className="h-3.5 w-3.5 shrink-0" />
                      {b.phone}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={b.googleMapsUrl}
                    {...EXTERNAL}
                    className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-brand-white/15 text-sm font-medium transition active:scale-[0.98]"
                  >
                    <IconPin className={`h-4 w-4 ${MUTED}`} />
                    {t('map')}
                  </a>
                  <a
                    href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-brand-white/15 text-sm font-medium transition active:scale-[0.98]"
                  >
                    <IconPhone className={`h-4 w-4 ${MUTED}`} />
                    {t('call')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 둘러보기 */}
        <section className="mt-7">
          <SectionTitle>{t('explore')}</SectionTitle>
          <div className="flex flex-col gap-2">
            <RowLink href={`/${locale}/services`} label={t('services')} icon={IconTag} />
            <RowLink href={`/${locale}/gallery`} label={t('gallery')} icon={IconImage} />
          </div>
        </section>

        {/* 더 보기 */}
        <section className="mt-7">
          <SectionTitle>{t('more')}</SectionTitle>
          <div className="flex flex-col gap-2">
            <RowLink href={`/${locale}/products`} label={t('products')} icon={IconBag} />
            <RowLink href={`/${locale}/join-57`} label={t('join')} icon={IconUsers} />
          </div>
        </section>

        {/* SNS — 인스타그램에서 들어오므로 인스타그램은 뺀다 */}
        <section className="mt-7">
          <SectionTitle>{t('follow')}</SectionTitle>
          <div className="flex gap-2.5">
            {[
              { href: SNS_LINKS.tiktok, label: 'TikTok', Icon: IconTikTok },
              { href: SNS_LINKS.youtube, label: 'YouTube', Icon: IconYouTube },
              { href: SNS_LINKS.facebook, label: 'Facebook', Icon: IconFacebook },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                {...EXTERNAL}
                aria-label={label}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-brand-card transition active:scale-[0.96]"
              >
                <Icon className={`${ICON} ${MUTED}`} />
              </a>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-brand-gray">{t('footer')}</p>
      </div>
    </main>
  );
}
