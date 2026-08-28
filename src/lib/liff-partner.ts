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
 * LINE 연결 링크 — **`liff.login()` 을 쓰지 않는다.**
 *
 * 🚨 `liff.login()` 은 브라우저 안에서 `access.line.me` **웹 로그인 화면**으로 보낸다.
 *    데스크톱은 QR·이메일, 모바일도 굳이 웹으로 붙는다 — 대부분이 모바일인 우리 상황에 최악이다.
 * ✅ **`liff.line.me/{LIFF_ID}{경로}` 를 그냥 열면** LINE 이 **앱으로 전환**해 그 안에서 우리 페이지를 연다.
 *    앱 안은 이미 로그인 상태라 비밀번호가 없고, Add friend 옵션이 On 이라 친구 추가까지 끝난다.
 *    (주문 LINE 연결이 같은 방식이고 2026-08-04 실기기 검증을 통과했다 — `lineLinkUrl()`)
 * 🚨 `?openExternalBrowser=1` 을 붙이지 말 것 — 그건 **밖으로 밀어내는** 파라미터라 정반대다.
 *
 * ⚠️ LINE 앱 안에서는 페이지가 **새로 열린다**(다른 브라우저 컨텍스트) → 입력값은 넘어가지 않는다.
 *    그래서 연결 버튼을 폼 **맨 위**에 둔다. 아직 아무것도 입력하지 않았으면 잃을 게 없다.
 */
export const PARTNER_LIFF_ENDPOINT_PATH = '/th/partner';

export function partnerLiffUrl(path: string): string | null {
  if (!PARTNER_LIFF_ID) return null;
  // 로컬 정적 서버는 `/x.html` 로 열린다 — 라이브 경로(`/x`)와 맞춘다.
  const clean = (path.startsWith('/') ? path : `/${path}`).replace(/\.html$/, '');
  // 🚨 LINE 은 붙인 경로를 **Endpoint 뒤에** 이어 붙인다.
  //    Endpoint = `https://57tb.art/th/partner/` 이므로 그 아래 경로만 넘긴다.
  //    (`/th/partner/mist` 를 그대로 넘기면 `/th/partner/th/partner/mist` 가 된다.)
  const sub = clean.startsWith(PARTNER_LIFF_ENDPOINT_PATH)
    ? clean.slice(PARTNER_LIFF_ENDPOINT_PATH.length) || '/'
    : clean;
  return `https://liff.line.me/${PARTNER_LIFF_ID}${sub}`;
}
