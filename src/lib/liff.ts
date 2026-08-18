import { ORDER_API_BASE } from '@/data/order';

/**
 * LINE 계정 연결(LIFF) — 배송 알림을 받을 손님의 LINE userId를 확보한다.
 *
 * 왜 LIFF인가: 홈페이지는 정적 export라 서버 라우트가 없다. LIFF는 **ID token**을 브라우저에 주고
 * 검증은 우리 Edge Function이 LINE 서버에 맡기므로(채널 시크릿 불필요) 콜백 라우트가 필요 없다.
 *
 * 🚨 userId는 **Provider 단위**로 발급된다 — 이 LIFF의 LINE Login 채널이 57TB Booking & More(@361lxvmy)와
 *    같은 Provider에 있어야 한다. 다르면 연결은 되는데 push만 조용히 실패한다.
 * 🚨 알림은 회사 예약채널이 개인 판매자 주문을 대신 전하는 구조다 → 메시지 첫 줄에 `จำหน่ายโดย 57TB TRADING`.
 */

/** LIFF 앱 ID. 없으면 LINE 연결 버튼을 아예 보여주지 않는다(깨진 링크를 노출하지 않는다). */
export const LIFF_ID: string | null = process.env.NEXT_PUBLIC_LIFF_ID?.trim() || null;

/** 57TB Booking & More 친구 추가. 친구가 아니면 push가 도달하지 않는다. */
export const BOOKING_OA_URL = 'https://line.me/R/ti/p/@361lxvmy?openExternalBrowser=1';

/**
 * LINE 연결 화면으로 가는 링크.
 * 🚨 우리 페이지 주소가 아니라 **LIFF URL**로 연다 — LINE 앱이 설치돼 있으면 앱 안에서 열려 로그인이 매끄럽다.
 * 🚨 자격증명은 **연결 전용 토큰(`lt`)** 하나만 싣는다. 결제 세션 id(`s`)는 상태 조회 자격이라
 *    LINE 로그·브라우저 기록에 남기면 안 된다(코덱스 지적 2026-08-04). `lt`는 1회 소진·7일 만료다.
 */
export function lineLinkUrl(input: { orderNo: string; linkToken: string }): string | null {
  if (!LIFF_ID || !input.linkToken) return null;
  const query = new URLSearchParams({ no: input.orderNo, lt: input.linkToken });
  // 🚨 LIFF Endpoint URL을 사이트 루트(`https://57tb.art/`)로 바꿨다 (2026-08-12).
  //    종전에는 `/th/order/line`이 endpoint라, 제품 페이지에서 로그인하면 redirectUri가
  //    endpoint 하위가 아니어서 LINE이 **400 Bad Request**를 냈다(가격 조회 로그인이 전부 실패).
  //    endpoint가 루트가 됐으므로 연결 화면은 **LIFF URL 뒤에 경로를 붙여** 지정한다.
  return `https://liff.line.me/${LIFF_ID}/th/order/line?${query.toString()}`;
}

type Friendship = { friendFlag: boolean };

/** 쓰는 만큼만 선언한다 — SDK 전체 타입을 끌어오지 않는다. */
export type Liff = {
  init(config: { liffId: string }): Promise<void>;
  isLoggedIn(): boolean;
  login(config?: { redirectUri?: string }): void;
  /** 만료된 ID token 을 쥔 세션을 끊을 때 쓴다 (startLineLogin 주석 참조). */
  logout(): void;
  getIDToken(): string | null;
  isInClient(): boolean;
  getFriendship(): Promise<Friendship>;
  closeWindow(): void;
};

declare global {
  interface Window {
    liff?: Liff;
  }
}

const SDK_URL = 'https://static.line-scdn.net/liff/edge/2/sdk.js';

/** LIFF SDK를 한 번만 읽어 온다(정적 사이트라 런타임에 붙인다). */
export function loadLiff(): Promise<Liff> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('no_window'));
      return;
    }
    if (window.liff) {
      resolve(window.liff);
      return;
    }
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => (window.liff ? resolve(window.liff) : reject(new Error('sdk_failed')));
    script.onerror = () => reject(new Error('sdk_failed'));
    document.head.appendChild(script);
  });
}

/**
 * LIFF 초기화는 한 번만 한다 — 가격 조회(모든 페이지)와 LINE 연결 화면이 같은 SDK를 쓴다.
 * 같은 페이지에서 두 번 init하면 SDK가 경고를 내므로 약속을 재사용한다.
 */
let initPromise: Promise<Liff> | null = null;

export function initLiff(): Promise<Liff> {
  if (!LIFF_ID) return Promise.reject(new Error('no_liff_id'));
  if (!initPromise) {
    initPromise = loadLiff()
      .then(async (liff) => {
        await liff.init({ liffId: LIFF_ID as string });
        return liff;
      })
      .catch((error) => {
        initPromise = null; // 실패는 캐시하지 않는다 — 다음 시도에서 다시 붙는다.
        throw error;
      });
  }
  return initPromise;
}

/**
 * 가격 조회용 ID token.
 *
 * 🚨 여기서 로그인 화면으로 **보내지 않는다** — 손님이 제품을 보다가 갑자기 LINE으로 튕기면 안 된다.
 *    이미 로그인돼 있으면 조용히 토큰을 주고, 아니면 null을 준다(화면이 로그인 버튼을 보여준다).
 * 🚨 sessionStorage에 잠깐 둔다(탭을 닫으면 지워진다). 만료된 토큰은 서버가 `no_auth`로 돌려주므로
 *    호출부가 캐시를 버리고 한 번 다시 받는다.
 */
const ID_TOKEN_KEY = 'trading:idToken';

export function rememberIdToken(token: string): void {
  try { sessionStorage.setItem(ID_TOKEN_KEY, token); } catch { /* 없어도 매번 다시 받으면 된다 */ }
}

export function recallIdToken(): string {
  try { return sessionStorage.getItem(ID_TOKEN_KEY) ?? ''; } catch { return ''; }
}

export function forgetIdToken(): void {
  try { sessionStorage.removeItem(ID_TOKEN_KEY); } catch { /* 무시 */ }
}

export async function getIdTokenSilently(options?: { fresh?: boolean }): Promise<string | null> {
  if (!options?.fresh) {
    const cached = recallIdToken();
    if (cached) return cached;
  }
  if (!LIFF_ID) return null;
  try {
    const liff = await initLiff();
    if (!liff.isLoggedIn()) return null;
    const token = liff.getIDToken();
    if (!token) return null;
    rememberIdToken(token);
    return token;
  } catch {
    return null;
  }
}

/**
 * 손님이 직접 누른 경우에만 LINE 로그인으로 보낸다. 돌아오면 같은 페이지다.
 *
 * 🚨 **`isLoggedIn()`이 true여도 그냥 돌아가면 안 된다** (2026-08-18 실장애).
 *    LIFF 세션은 오래 살아 있는데 **ID token 은 갱신되지 않아** 먼저 만료된다.
 *    그러면 서버가 `IdToken expired`로 거부해 로그인 버튼이 뜨는데,
 *    버튼을 눌러도 `isLoggedIn()`이 true라 아무 일도 일어나지 않았다 — 손님 눈에는 "버튼이 안 먹는" 상태.
 *    **로그인 버튼이 보인다는 것 자체가 "서버가 토큰을 거부했다"는 뜻**이므로,
 *    세션이 남아 있으면 끊고 새로 로그인시킨다.
 */
export async function startLineLogin(): Promise<void> {
  if (!LIFF_ID) return;
  const liff = await initLiff();
  if (liff.isLoggedIn()) {
    forgetIdToken(); // 만료된 캐시를 먼저 버린다 — 돌아온 뒤 옛 토큰을 다시 집지 않게.
    liff.logout();
  }
  liff.login({ redirectUri: window.location.href });
}

/**
 * LIFF가 넘겨주는 파라미터를 읽는다.
 * LINE은 보통 쿼리를 그대로 붙여 주지만, `liff.state`에 담아 오기도 한다 — 그 값은
 * `?no=…` 형태일 수도, `/th/order/line?no=…`처럼 **경로가 앞에 붙은** 형태일 수도 있다(둘 다 처리).
 */
export function readLiffParams(search: string): URLSearchParams {
  const params = new URLSearchParams(search);
  const state = params.get('liff.state');
  if (state) {
    const questionMark = state.indexOf('?');
    const query = questionMark >= 0 ? state.slice(questionMark + 1) : state;
    new URLSearchParams(query).forEach((value, key) => {
      if (!params.has(key)) params.set(key, value);
    });
  }
  return params;
}

/**
 * 로그인 리다이렉트를 건너 살아남게 파라미터를 잠깐 보관한다.
 * `liff.login()`이 URL을 갈아치우는 경우가 있어 돌아왔을 때 주문번호·토큰이 사라질 수 있다.
 * 🚨 sessionStorage를 쓴다(탭을 닫으면 지워진다). 연결 토큰을 localStorage에 남기지 않는다.
 */
const STASH_KEY = 'trading:lineLink';

export function stashLinkParams(value: { orderNo: string; linkToken: string }): void {
  try { sessionStorage.setItem(STASH_KEY, JSON.stringify(value)); } catch { /* 없어도 URL로 대부분 복구된다 */ }
}

export function recallLinkParams(): { orderNo: string; linkToken: string } | null {
  try {
    const raw = sessionStorage.getItem(STASH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { orderNo?: string; linkToken?: string };
    if (!parsed.orderNo || !parsed.linkToken) return null;
    return { orderNo: parsed.orderNo, linkToken: parsed.linkToken };
  } catch {
    return null;
  }
}

export function forgetLinkParams(): void {
  try { sessionStorage.removeItem(STASH_KEY); } catch { /* 무시 */ }
}

export type LinkFailure =
  | 'unavailable' | 'invalid_link' | 'already_linked' | 'already_notified' | 'invalid_token' | 'failed';

/** 주문에 LINE 계정을 붙인다. 성공하면 null, 실패하면 사유. */
export async function linkLineAccount(input: {
  orderNo: string;
  linkToken: string;
  idToken: string;
}): Promise<LinkFailure | null> {
  if (!ORDER_API_BASE) return 'unavailable';
  try {
    const res = await fetch(`${ORDER_API_BASE}/trading-line-link`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        orderNo: input.orderNo,
        linkToken: input.linkToken,
        idToken: input.idToken,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.status === 404) return 'invalid_link';
    // 🚨 409가 두 가지다 — "이미 다른 LINE이 연결됨"과 "이미 발송이 나감". 손님에게 할 말이 다르므로 구분한다.
    //    상태코드만 보고 뭉치면 발송이 끝난 주문에도 "연결 완료"라고 안내하게 된다(코덱스 지적 2026-08-04).
    if (res.status === 409) return body.error === 'already_notified' ? 'already_notified' : 'already_linked';
    if (res.status === 401) return 'invalid_token';
    if (!res.ok || !body.ok) return 'failed';
    return null;
  } catch {
    return 'failed';
  }
}

/** 실패 안내(태국어). 원인은 짧게, 다음 행동을 분명히. */
export function linkFailureMessage(reason: LinkFailure): string {
  // 만료·오용·없는 주문을 하나로 묶는다(서버도 같은 응답이라 구분할 수 없고, 손님이 할 일은 같다).
  if (reason === 'invalid_link') return 'ลิงก์นี้ใช้ไม่ได้แล้ว กรุณาสอบถามทาง LINE';
  // 다른 LINE 계정이 이미 붙어 있다 — 손님이 스스로 고칠 수 없으니 문의로 보낸다.
  if (reason === 'already_linked') return 'คำสั่งซื้อนี้เชื่อมต่อกับบัญชี LINE อื่นแล้ว กรุณาสอบถามทาง LINE';
  // 이미 배송 알림이 나간 뒤라 연결해도 그 알림은 받을 수 없다 → 상태 조회로 안내한다.
  if (reason === 'already_notified') return 'คำสั่งซื้อนี้จัดส่งแล้ว กรุณาตรวจสอบสถานะจากปุ่มด้านล่าง';
  if (reason === 'invalid_token') return 'การเชื่อมต่อบัญชี LINE ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
  if (reason === 'unavailable') return 'ขณะนี้ยังไม่เปิดให้เชื่อมต่อ กรุณาสอบถามทาง LINE';
  return 'การเชื่อมต่อขัดข้อง กรุณาลองใหม่';
}

/**
 * LIFF 로그인 후 돌아온 루트(`/`)에서 **원래 보던 경로**를 꺼낸다. (2026-08-12 신설)
 *
 * 🚨 LIFF Endpoint가 사이트 루트라, 로그인 복귀는 항상 `https://57tb.art/?liff.state=…`로 온다.
 *    루트 페이지가 이 값을 무시하고 `/th`로 보내면 손님은 **보던 제품 페이지를 잃는다**(실제로 그랬다).
 * 🚨 값은 **여러 번 인코딩돼 온다**(`%252Fth%252F…`) → `%25`가 사라질 때까지 반복해 푼다.
 * 🚨 오픈 리다이렉트 방지: `/`로 시작하고 `//`가 아닌 **내부 경로만** 허용한다.
 */
export function liffReturnPath(search: string): string | null {
  const raw = new URLSearchParams(search).get('liff.state');
  if (!raw) return null;
  let value = raw;
  for (let i = 0; i < 5 && /%25|%2F/i.test(value); i += 1) {
    try {
      const next = decodeURIComponent(value);
      if (next === value) break;
      value = next;
    } catch {
      break;
    }
  }
  if (!value.startsWith('/') || value.startsWith('//')) return null;
  return value;
}
