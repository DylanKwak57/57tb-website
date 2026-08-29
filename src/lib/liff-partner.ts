import { loadLiff, type Liff } from '@/lib/liff';

/**
 * 파트너(체험단) 전용 LIFF — **손님용 LIFF와 다른 앱이다.**
 *
 * 🚨 `liff.init()` 은 한 페이지에서 **한 앱만** 붙일 수 있다.
 *    파트너 라우트(`/[locale]/partner/**`)는 `(main)` 레이아웃 밖이라 `PriceProvider`·`LiffReturn` 이
 *    올라오지 않는다 → 손님용 LIFF가 init 되지 않으므로 충돌이 없다.
 *    🚫 파트너 페이지를 `(main)` 안으로 옮기면 이 전제가 깨진다.
 *
 * 🚨 이 LIFF의 Login 채널(`2011282070`)은 손님 채널과 **같은 Provider(`57totalbeauty Auto`)** 에 있다
 *    → userId 네임스페이스가 같다. 다만 **친구로 붙는 OA는 이 채널에 연결된 `57TB Partner`(@347jyzxd)** 다.
 *    Add friend 옵션이 On 이라 로그인만 하면 파트너 채널 친구가 된다.
 */

export const PARTNER_LIFF_ID: string | null =
  process.env.NEXT_PUBLIC_PARTNER_LIFF_ID?.trim() || null;

let initPromise: Promise<Liff> | null = null;

export function initPartnerLiff(): Promise<Liff> {
  if (!PARTNER_LIFF_ID) return Promise.reject(new Error('no_liff_id'));
  if (!initPromise) {
    initPromise = loadLiff()
      .then(async (liff) => {
        await liff.init({ liffId: PARTNER_LIFF_ID as string });
        return liff;
      })
      .catch((error) => {
        initPromise = null; // 실패는 캐시하지 않는다.
        throw error;
      });
  }
  return initPromise;
}

/**
 * 이미 로그인돼 있으면 조용히 토큰을 준다. 🚫 여기서 로그인 화면으로 보내지 않는다.
 *
 * 🚨 `broken` 을 함께 돌려주는 이유 — 폼을 LINE 연결 뒤로 잠그기 때문이다.
 *    SDK 가 안 뜨거나 LINE 앱 안인데도 토큰이 안 나오면 **폼이 영영 안 보이는 막다른 길**이 된다.
 *    그런 경우엔 잠그지 않는다(잠금은 편의를 위한 것이지 보안 장치가 아니다 — 검증은 서버가 한다).
 */
/**
 * 친구인가. **`Add friend: aggressive` 라도 예외가 있다** —
 * `normal` 이던 시절에 이미 이 채널을 인증한 사람은 재방문해도 동의 화면이 안 뜨고,
 * 따라서 자동 추가도 안 된다(2026-08-28 에이 사례).
 * 신규 사용자는 자동 추가되므로 여기서 false 가 나오는 일은 드물다.
 * 🚨 친구가 아니면 push 가 도달하지 않는다 → **폼 안에서 해결한다.** 따로 링크를 보내지 않는다.
 */
export async function partnerIsFriend(): Promise<boolean | null> {
  if (!PARTNER_LIFF_ID) return null;
  try {
    const liff = await initPartnerLiff();
    if (!liff.isLoggedIn()) return null;
    const f = await liff.getFriendship();
    return !!f?.friendFlag;
  } catch {
    return null; // 모르면 안내하지 않는다 — 없는 문제를 만들지 않는다
  }
}

export async function partnerIdTokenSilently(): Promise<{ token: string | null; broken: boolean }> {
  if (!PARTNER_LIFF_ID) return { token: null, broken: true };
  try {
    const liff = await initPartnerLiff();
    const token = liff.isLoggedIn() ? liff.getIDToken() : null;
    // LINE 앱 안까지 들어왔는데 토큰이 없다 = 더 할 수 있는 게 없다 → 잠그지 않는다.
    return { token, broken: !token && liff.isInClient() };
  } catch {
    return { token: null, broken: true }; // SDK 로드·init 실패
  }
}

/**
 * 🖥️ PC 전용 — LINE **웹 로그인**(QR·이메일)을 연다. 모바일 버튼에는 절대 연결하지 말 것(위 주석).
 * `redirectUri` 는 LIFF Endpoint(`/th/partner/`) 아래 경로여야 LINE 이 받아준다.
 */
export async function startPartnerDesktopLogin(path: string): Promise<void> {
  const liff = await initPartnerLiff();
  if (liff.isLoggedIn()) { window.location.reload(); return; }
  const clean = path.startsWith('/') ? path : `/${path}`;
  liff.login({ redirectUri: `${window.location.origin}${clean}` });
}

/**
 * LINE 연결 링크 — **모바일은 `liff.login()` 을 쓰지 않는다.**
 *
 * 🚨 모바일에서 `liff.login()` 은 `access.line.me` **웹 로그인 화면**으로 보낸다 —
 *    앱 전환이면 비밀번호 없이 끝나는데 굳이 웹으로 붙는다. 대부분이 모바일인 우리 상황에 최악이다.
 * ✅ **`liff.line.me/{LIFF_ID}{경로}` 를 그냥 열면** LINE 이 **앱으로 전환**해 그 안에서 우리 페이지를 연다.
 *    앱 안은 이미 로그인 상태라 비밀번호가 없고, Add friend 옵션이 On 이라 친구 추가까지 끝난다.
 *    (주문 LINE 연결이 같은 방식이고 2026-08-04 실기기 검증을 통과했다 — `lineLinkUrl()`)
 * 🚨 `?openExternalBrowser=1` 을 붙이지 말 것 — 그건 **밖으로 밀어내는** 파라미터라 정반대다.
 *
 * 🖥️ **PC 는 반대로 `liff.login()` 이 필수다** (2026-08-29 실측으로 잡은 버그).
 *    PC 브라우저에서 `liff.line.me` 를 열면 LINE 이 **로그인 없이** Endpoint 로 그냥 되돌린다 —
 *    앱이 없으니 자동 로그인이 성립하지 않는데, 우리가 `liff.login()` 을 뺐으니
 *    **로그인을 시작하는 코드가 아예 없어** 버튼이 "눌러도 아무 변화 없음"이 됐다.
 *    ⇒ PC 에서만 `startPartnerDesktopLogin()` 으로 웹 로그인(QR·이메일)을 연다.
 *
 * ⚠️ LINE 앱 안에서는 페이지가 **새로 열린다**(다른 브라우저 컨텍스트) → 입력값은 넘어가지 않는다.
 *    그래서 연결 버튼을 폼 **맨 위**에 둔다. 아직 아무것도 입력하지 않았으면 잃을 게 없다.
 */
export const PARTNER_LIFF_ENDPOINT_PATH = '/th/partner';

export function partnerLiffUrl(path: string): string | null {
  if (!PARTNER_LIFF_ID) return null;
  // 로컬 정적 서버는 `/x.html` 로 열린다 — 라이브 경로(`/x`)와 맞춘다.
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  // 🚨 쿼리를 떼고 경로만 다듬는다 — 붙인 채로 `.html$` 를 지우려 하면 매칭되지 않는다.
  //    쿼리는 그대로 실어 보낸다: LINE 이 `liff.state` 에 담아 Endpoint 로 되돌려 준다.
  const qi = withSlash.indexOf('?');
  const pathname = (qi >= 0 ? withSlash.slice(0, qi) : withSlash).replace(/\.html$/, '');
  const query = qi >= 0 ? withSlash.slice(qi) : '';
  // 🚨 LINE 은 붙인 경로를 **Endpoint 뒤에** 이어 붙인다.
  //    Endpoint = `https://57tb.art/th/partner/` 이므로 그 아래 경로만 넘긴다.
  //    (`/th/partner/mist` 를 그대로 넘기면 `/th/partner/th/partner/mist` 가 된다.)
  const sub = pathname.startsWith(PARTNER_LIFF_ENDPOINT_PATH)
    ? pathname.slice(PARTNER_LIFF_ENDPOINT_PATH.length) || '/'
    : pathname;
  return `https://liff.line.me/${PARTNER_LIFF_ID}${sub}${query}`;
}
