'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SELLER } from '@/data/order';
import {
  BOOKING_OA_URL, forgetLinkParams, initLiff, LIFF_ID, linkFailureMessage, linkLineAccount, loadLiff,
  readLiffParams, recallLinkParams, rememberIdToken, stashLinkParams,
} from '@/lib/liff';
import { assetPath } from '@/lib/utils';

/**
 * LINE 배송 알림 연결 화면 — LIFF 앱의 엔드포인트다(`https://liff.line.me/<LIFF_ID>` 가 여기로 온다).
 *
 * 하는 일: LINE 로그인 → ID token → 우리 서버가 검증해 주문에 userId를 붙인다.
 *
 * 🚨 브라우저가 userId를 직접 보내지 않는다 — ID token만 보내고 검증·추출은 서버가 한다.
 * 🚨 소유 증명은 URL의 연결 토큰(`lt`) 하나뿐이다. 전화 뒷 4자리는 1만 가지라 대입으로 뚫려서 쓰지 않는다.
 * 🚨 친구가 아니면 push가 도달하지 않는다 → 연결 후 친구 상태를 확인해 추가를 안내한다.
 * 🚨 태국어 문구는 에이(CFO) 검수 대상이다. 고치면 검수 페이지(`3a9a2fb1-c15d-81a8-821c-e6d467032a2c`)도 갱신할 것.
 */

type Phase = 'booting' | 'linking' | 'done' | 'error';

export function OrderLineLink({ locale }: { locale: string }) {
  const [phase, setPhase] = useState<Phase>('booting');
  const [message, setMessage] = useState<string | null>(null);
  const [orderNo, setOrderNo] = useState('');
  const [canRetry, setCanRetry] = useState(false);
  const [isFriend, setIsFriend] = useState<boolean | null>(null);
  const [inClient, setInClient] = useState(false);
  const started = useRef(false);

  const run = useCallback(async () => {
    setPhase('booting');
    setMessage(null);
    setCanRetry(false);

    if (!LIFF_ID) {
      setMessage('ขณะนี้ยังไม่เปิดให้เชื่อมต่อ LINE กรุณาสอบถามทาง LINE');
      setPhase('error');
      return;
    }

    // 로그인 리다이렉트로 URL이 갈릴 수 있어 저장해 둔 값도 함께 본다.
    const params = readLiffParams(window.location.search);
    const stashed = recallLinkParams();
    const no = (params.get('no') ?? '').trim() || stashed?.orderNo || '';
    const linkToken = (params.get('lt') ?? '').trim() || stashed?.linkToken || '';
    setOrderNo(no);
    if (!no || !linkToken) {
      setMessage('ลิงก์ไม่ถูกต้อง กรุณาเปิดลิงก์จากหน้ายืนยันการชำระเงินอีกครั้ง');
      setPhase('error');
      return;
    }
    stashLinkParams({ orderNo: no, linkToken });

    let idToken: string | null = null;
    try {
      // 초기화는 공용 `initLiff()`를 쓴다 — 가격 조회가 같은 페이지에서 이미 init했을 수 있다(중복 init 방지).
      const liff = await initLiff();
      setInClient(liff.isInClient());
      if (!liff.isLoggedIn()) {
        // LINE 로그인으로 나갔다가 같은 주소로 돌아온다(쿼리 유지 + 위 저장분으로 보강).
        liff.login({ redirectUri: window.location.href });
        return;
      }
      idToken = liff.getIDToken();
      // 같은 토큰을 가격 조회도 쓴다 — 여기서 로그인한 손님이 제품 화면으로 돌아가면 바로 가격이 보인다.
      if (idToken) rememberIdToken(idToken);
    } catch {
      setMessage('ไม่สามารถเชื่อมต่อ LINE ได้ กรุณาลองใหม่อีกครั้ง');
      setCanRetry(true);
      setPhase('error');
      return;
    }
    if (!idToken) {
      // 토큰 만료·재로그인 필요 — 막다른 화면으로 두지 않고 다시 시도할 길을 준다.
      setMessage('เซสชัน LINE หมดอายุ กรุณาลองใหม่อีกครั้ง');
      setCanRetry(true);
      setPhase('error');
      return;
    }

    setPhase('linking');
    const failure = await linkLineAccount({ orderNo: no, linkToken, idToken });
    if (failure) {
      setMessage(linkFailureMessage(failure));
      // 🚨 어떤 실패도 완료 화면으로 보내지 않는다. 성공(같은 계정 재연결 포함)은 서버가 ok로 돌려준다.
      //    `already_linked`는 **다른 LINE 계정이 이미 붙은** 경우라 이 손님은 알림을 못 받는다 —
      //    완료로 표시하면 받지도 못할 알림을 기다리게 된다(코덱스 지적 2026-08-04).
      if (failure === 'already_linked' || failure === 'already_notified') forgetLinkParams();
      setCanRetry(failure === 'failed' || failure === 'invalid_token');
      setPhase('error');
      return;
    }
    forgetLinkParams();
    setPhase('done');
    // 친구 여부는 부가 정보다 — LIFF에 봇이 연결돼 있지 않으면 조회가 실패할 수 있으니 실패를 삼킨다.
    try {
      const liff = await loadLiff();
      const friendship = await liff.getFriendship();
      setIsFriend(friendship.friendFlag);
    } catch {
      setIsFriend(null);
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    run();
  }, [run]);

  return (
    <div className="min-h-screen bg-brand-black pb-16 pt-20">
      <section className="mx-auto max-w-[560px] px-4 md:px-6" lang="th">
        <div className="border border-brand-gold/30 bg-brand-card p-5 md:p-7">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-champagne">
            แจ้งเตือนการจัดส่งทาง LINE
          </p>
          <p className="mt-2 font-serif text-2xl text-brand-white">{orderNo || '—'}</p>

          {(phase === 'booting' || phase === 'linking') && (
            <p className="mt-4 text-sm text-brand-gray-light">กำลังเชื่อมต่อ…</p>
          )}

          {phase === 'done' && (
            <div className="mt-4">
              <p className="text-sm leading-relaxed text-brand-gray-light">
                เชื่อมต่อเรียบร้อยแล้ว
                <br />
                เมื่อจัดส่งสินค้า เราจะแจ้งเลขพัสดุให้ทาง LINE
              </p>
              <p className="mt-4 text-xs leading-relaxed text-brand-gray">
                ข้อความแจ้งเตือนจะส่งจากบัญชี 57TB Booking &amp; More · จำหน่ายโดย {SELLER.name}
              </p>
              {isFriend === false && (
                <div className="mt-5 border border-brand-gold/30 bg-brand-black/40 p-4">
                  <p className="text-sm leading-relaxed text-brand-gray-light">
                    กรุณาเพิ่มเพื่อนบัญชี 57TB Booking &amp; More ก่อน มิฉะนั้นจะไม่ได้รับข้อความแจ้งเตือน
                  </p>
                  <a
                    className="mt-4 flex min-h-12 items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black"
                    href={BOOKING_OA_URL}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    เพิ่มเพื่อน
                  </a>
                </div>
              )}
            </div>
          )}

          {phase === 'error' && (
            <div className="mt-4">
              {message && <p aria-live="polite" className="text-sm text-brand-champagne">{message}</p>}
              {canRetry && (
                <button
                  className="mt-5 flex min-h-12 w-full items-center justify-center bg-brand-gold px-4 py-3 text-sm font-bold text-brand-black"
                  onClick={run}
                  type="button"
                >
                  ลองอีกครั้ง
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3">
          <a
            className="flex min-h-12 items-center justify-center border border-brand-gold px-4 py-3 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
            href={assetPath(`/${locale}/order/status${orderNo ? `?no=${encodeURIComponent(orderNo)}` : ''}`)}
          >
            ตรวจสอบสถานะการจัดส่ง
          </a>
          {inClient && phase === 'done' && (
            <button
              className="flex min-h-12 items-center justify-center border border-brand-gold/40 px-4 py-3 text-sm text-brand-gold"
              onClick={() => loadLiff().then((liff) => liff.closeWindow()).catch(() => undefined)}
              type="button"
            >
              ปิดหน้าต่าง
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
