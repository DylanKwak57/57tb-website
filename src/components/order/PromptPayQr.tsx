'use client';

import { useEffect, useState } from 'react';

/**
 * PromptPay QR — 태국 손님은 은행앱으로 QR을 스캔해 이체한다.
 * 금액을 QR에 넣어 손님이 직접 입력하지 않게 하고, SlipOK의 금액 일치 검증(허용오차 0)과 맞춘다.
 *
 * 페이로드 생성은 검증된 `promptpay-qr`을 쓴다(자체 구현 금지 — 태그·필드 순서가 은행앱 호환성에 영향).
 * 라이브러리는 실제로 QR이 필요한 시점에만 동적 로드해 초기 번들에 넣지 않는다.
 */
export function PromptPayQr({ promptPayId, amount }: { promptPayId: string; amount: number | null }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (amount === null) return;
    let active = true;
    setFailed(false);
    (async () => {
      try {
        const [{ default: generatePayload }, { default: QRCode }] = await Promise.all([
          import('promptpay-qr'),
          import('qrcode'),
        ]);
        const payload = generatePayload(promptPayId, { amount });
        const url = await QRCode.toDataURL(payload, { margin: 1, width: 480, errorCorrectionLevel: 'M' });
        if (active) setDataUrl(url);
      } catch {
        if (active) setFailed(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [promptPayId, amount]);

  if (amount === null) return null;

  return (
    <div className="mt-5 border border-brand-gold/25 bg-brand-card p-5 text-center" lang="th">
      <p className="text-sm font-medium text-brand-white">สแกน QR เพื่อโอนเงิน</p>
      {failed ? (
        <p className="mt-3 text-xs leading-relaxed text-brand-gray-light">ไม่สามารถสร้าง QR ได้ กรุณาสอบถามทาง LINE</p>
      ) : dataUrl ? (
        <>
          {/* QR은 라이브러리가 만든 data URL이므로 next/image 최적화 대상이 아니다. */}
          <img alt="PromptPay QR" className="mx-auto mt-4 h-52 w-52" height="480" src={dataUrl} width="480" />
          <p className="mt-4 font-serif text-xl text-brand-gold">฿{amount.toLocaleString('en-US')}</p>
          <p className="mt-2 text-xs leading-relaxed text-brand-gray-light">
            ยอดเงินถูกกำหนดไว้ใน QR แล้ว หลังโอนกรุณาอัปโหลดสลิป
          </p>
          {/* 같은 기기에서는 화면의 QR을 카메라로 스캔할 수 없다(2026-07-26 대표님 지적).
              폰으로 주문한 손님은 QR을 저장해 은행 앱의 갤러리에서 고르거나, 계좌번호로 이체한다. */}
          <a
            className="mt-4 inline-flex min-h-11 items-center justify-center border border-brand-gold px-5 text-xs font-bold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black"
            download={`promptpay-${amount}.png`}
            href={dataUrl}
          >
            บันทึกรูป QR
          </a>
          <p className="mt-3 text-xs leading-relaxed text-brand-gray-light">
            สั่งซื้อจากมือถือ: บันทึกรูป QR แล้วเปิดแอปธนาคาร เลือกสแกนจากรูปภาพ
          </p>
        </>
      ) : (
        <p className="mt-3 text-xs text-brand-gray-light">กำลังสร้าง QR…</p>
      )}
    </div>
  );
}
