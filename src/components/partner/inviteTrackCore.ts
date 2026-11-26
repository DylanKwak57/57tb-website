/**
 * 초대 메일 열어 봄 · 누름 기록 — 도착 화면이 쏘는 쪽(11/26).
 * 설계 정본 = `57 Shopee 유통/dealer-targets/28-초대메일-추적-설계-2026-11-26.md` §10-1
 *
 * 🚨 메일 링크는 목적지로 **직접** 온다. 이 모듈은 도착한 뒤 기록을 한 번 쏠 뿐이다 —
 *    기록이 실패하거나 느려도 화면 · LINE 넘김에 아무 영향이 없어야 한다(기다리지 않음 · 예외 삼킴).
 * 🚨 주소에 형식이 맞는 `i`(초대 코드)와 그 화면이 받는 `m` 이 **둘 다** 있을 때만 쏜다.
 *    없으면 아무것도 하지 않는다(공개 신청 화면 · 옛 시험 메일 링크는 지금 그대로).
 * 🚨 `go` 화면은 `to=line` 만 받는다 — 다른 값 · 임의 주소는 파트너 첫 화면으로(열린 넘기기 금지).
 * ℹ️ 순수 함수만 이 파일에(시험 `tests/invite-track.test.mjs` · 이름을 `InviteTrack.tsx` 와 다르게 둔 까닭 = 대소문자 무시 파일 시스템에서 import 가 섞이지 않게). 화면 부품 = `InviteTrack.tsx` · `GoView.tsx`.
 */
import { CODE_RE } from './inviteCode';

/** 파트너 전용 OA `57TB Partner`(@347jyzxd) — LINE 상담 단추의 유일한 목적지. */
export const PARTNER_LINE = 'https://line.me/R/ti/p/@347jyzxd';

/** 도착 화면이 쏘는 누름 종류(서버 `_shared/invite-track.ts` CLICK_TARGETS 와 같아야 한다). */
export const TRACK_KINDS = ['cta', 'img', 'info', 'guide', 'line'] as const;
export type TrackKind = (typeof TRACK_KINDS)[number];

/** 메일 링크로 들어왔다는 표시(같은 탭) — 브로셔 → 뒤로 → 초대 화면처럼 `m` 이 빠진 경로에서도 `src=email` 을 싣게. */
export const EMAIL_MARK_KEY = 'trial:invmail';

export type TrackHit = { code: string; kind: TrackKind };

/**
 * 주소 끝 값 → 쏠 기록(없으면 null). `allowed` = 그 화면이 받는 `m` 값.
 * LINE 연결 왕복(`apply=1`)으로 돌아온 경우는 쏘지 않는다(같은 누름을 두 번 세지 않게).
 */
export function readTrack(search: string, allowed: readonly TrackKind[]): TrackHit | null {
  const q = new URLSearchParams(search);
  if (q.get('apply') === '1') return null;
  const code = (q.get('i') ?? '').trim();
  const m = (q.get('m') ?? '').trim();
  if (!CODE_RE.test(code)) return null;
  if (!(allowed as readonly string[]).includes(m)) return null;
  return { code, kind: m as TrackKind };
}

/**
 * `go` 화면의 행선지. `to=line` 이면 LINE 파트너 계정(코드가 맞으면 `line` 기록) · 그 밖 = 파트너 첫 화면 · 기록 없음.
 * `locale` 은 주소 첫 조각(화면이 넘김) — 모르는 값이면 `th`.
 */
export function goPlan(search: string, locale: string): { dest: string; track: TrackHit | null } {
  const q = new URLSearchParams(search);
  if ((q.get('to') ?? '').trim() !== 'line') {
    const loc = /^[a-z]{2}$/.test(locale) ? locale : 'th';
    return { dest: `/${loc}/partner`, track: null };
  }
  const code = (q.get('i') ?? '').trim();
  return { dest: PARTNER_LINE, track: CODE_RE.test(code) ? { code, kind: 'line' } : null };
}

/** 메일로 들어왔는가 — 주소의 `m`(초대 화면은 `cta`) · LINE 왕복 표시 `src=email` · 같은 탭의 표시(같은 코드). */
export function cameFromEmail(search: string, code: string, stored: string | null): boolean {
  if (!CODE_RE.test(code)) return false;
  const q = new URLSearchParams(search);
  if ((q.get('i') ?? '').trim() === code && (TRACK_KINDS as readonly string[]).includes((q.get('m') ?? '').trim())) return true;
  if ((q.get('src') ?? '').trim() === 'email') return true;
  return (stored ?? '').trim() === code;
}

/**
 * 기록 한 번 쏘기 — 응답을 기다리지 않는다. `sendBeacon`(글자 본문 = 사전 확인 요청 없음) · 안 되면 `fetch keepalive`.
 * 돌려주는 값 = 쏘기를 시도했는가(시험용). 🚨 어떤 실패도 밖으로 던지지 않는다.
 */
export function fireTrack(apiBase: string | null, hit: TrackHit): boolean {
  if (!apiBase) return false;
  const url = `${apiBase}/trading-invite-track`;
  const body = JSON.stringify({ i: hit.code, m: hit.kind });
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      if (navigator.sendBeacon(url, new Blob([body], { type: 'text/plain;charset=UTF-8' }))) return true;
    }
  } catch { /* 아래로 */ }
  try {
    void fetch(url, {
      method: 'POST', body, keepalive: true, mode: 'no-cors', credentials: 'omit',
      headers: { 'content-type': 'text/plain;charset=UTF-8' },
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}
