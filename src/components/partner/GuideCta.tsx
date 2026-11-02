'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * 파트너 가이드 하단 공통 CTA — `/th/partner/guide` · `/scalp` · `/protein` 공용 (2026-11-02)
 * 파트너 전용 OA `57TB Partner`(@347jyzxd)로 연결한다.
 * 🚨 가격·공급가를 쓰지 않는다 — 가이드는 키트를 받은 원장 누구나 본다.
 *
 * 🚨 기기별로 주소가 다르다 (2026-11-02 대표님 실측 "LINE 버튼 누르면 우리 페이지로 안 간다")
 *   - `line.me/R/oaMessage/...`(문구 미리 채운 채팅) = **휴대폰 LINE 에서만** 열린다.
 *     컴퓨터 브라우저에서는 LINE 홈페이지(line.me/ko)로 떨어진다.
 *   - `line.me/R/ti/p/@347jyzxd`(친구추가) = 컴퓨터에서도 QR 화면이 뜬다 — 기존 파트너 페이지와 같은 주소.
 *   ⇒ 기본(서버 렌더)은 어디서나 열리는 친구추가 주소, 휴대폰이면 화면이 뜬 뒤 문구 채운 채팅 주소로 바꾼다.
 *
 * 🔀 2026-11-02 대표님 "하나로 합쳐" — `파트너 등록` 버튼은 같은 채팅으로 가서 차이가 없었다(뺌).
 *    두피케어 회차 신청 폼이 생기면 그 폼으로 연결해 다시 넣는다.
 */
const ADD_FRIEND = 'https://line.me/R/ti/p/@347jyzxd?openExternalBrowser=1';
const OA_MESSAGE = 'https://line.me/R/oaMessage/@347jyzxd/?';
const ORDER_TEXT = 'สนใจสั่งซื้อ Bellista Scalp Care';

/** `orderText` = 휴대폰 채팅에 미리 채울 문구. 없으면 두피케어 문구(입구·두피 페이지 기존 동작 그대로). */
export default function GuideCta({ orderText = ORDER_TEXT }: { orderText?: string } = {}) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const orderUrl = mobile ? OA_MESSAGE + encodeURIComponent(orderText) : ADD_FRIEND;

  return (
    <section className="border-t border-brand-dark px-6 py-16 text-center">
      <h2 className="text-lg font-semibold sm:text-xl">สั่งซื้อ · สอบถาม</h2>
      <div className="mx-auto mt-8 flex max-w-xs flex-col gap-3">
        <a
          href={orderUrl}
          className="inline-block rounded-full bg-brand-gold px-9 py-3.5 text-sm font-semibold text-brand-black transition hover:opacity-90"
        >
          สั่งซื้อ · สอบถามทาง LINE
        </a>
      </div>
      <p className="mt-6">
        <Link href="/th/partner#products" className="text-[13px] text-brand-gold underline underline-offset-4">
          ดูสินค้าทั้งหมด
        </Link>
      </p>
      <p className="mt-10 text-[13px] text-brand-gold">
        บริษัท 57 Total Beauty · ผู้นำเข้าและผู้จดแจ้ง อย. ผลิตภัณฑ์ Bellista ในประเทศไทย
      </p>
    </section>
  );
}
