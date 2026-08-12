'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { liffReturnPath } from '@/lib/liff';

/**
 * 로케일 없는 진입(`/`)을 태국어로 보낸다.
 *
 * 🚨 LIFF 로그인 복귀도 여기로 온다 — Endpoint URL이 사이트 루트이기 때문이다.
 *    `liff.state`에 원래 보던 경로가 실려 오므로, 그게 있으면 **거기로 되돌린다**.
 *    무조건 `/th`로 보내면 손님이 보던 제품 페이지를 잃는다.
 */
export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const back = liffReturnPath(window.location.search);
    router.replace(back ?? '/th');
  }, [router]);
  return null;
}
