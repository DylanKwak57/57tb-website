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

/** 이미 로그인돼 있으면 조용히 토큰을 준다. 🚫 여기서 로그인 화면으로 보내지 않는다. */
export async function partnerIdTokenSilently(): Promise<string | null> {
  if (!PARTNER_LIFF_ID) return null;
  try {
    const liff = await initPartnerLiff();
    if (!liff.isLoggedIn()) return null;
    return liff.getIDToken();
  } catch {
    return null;
  }
}

/**
 * 원장이 직접 눌렀을 때만 로그인으로 보낸다. 돌아오는 곳은 **지금 이 페이지**다.
 * 🚨 `redirectUri` 를 주지 않으면 LIFF Endpoint(사이트 루트)로 떨어져 폼을 잃는다.
 * 🚨 세션이 남아 있어도 ID token 은 먼저 만료된다 → 끊고 새로 받는다(손님용과 같은 이유).
 */
export async function startPartnerLogin(): Promise<void> {
  if (!PARTNER_LIFF_ID) return;
  const liff = await initPartnerLiff();
  if (liff.isLoggedIn()) liff.logout();
  liff.login({ redirectUri: window.location.href });
}
