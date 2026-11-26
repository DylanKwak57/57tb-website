// 초대 메일 기록 — 도착 화면 쪽 순수 규칙(28번 설계 §10-1 · 11/26).
// 실행: node --experimental-strip-types --import ./tests/ts-resolve.mjs --test tests/invite-track.test.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  PARTNER_LINE, TRACK_KINDS, cameFromEmail, fireTrack, goPlan, readTrack,
} from '../src/components/partner/inviteTrackCore.ts';

test('go: to=line 일 때만 LINE 파트너 계정으로 · 코드가 맞으면 line 기록', () => {
  assert.deepEqual(goPlan('?to=line&i=test57inv8', 'th'), { dest: PARTNER_LINE, track: { code: 'test57inv8', kind: 'line' } });
  assert.deepEqual(goPlan('?to=line', 'th'), { dest: PARTNER_LINE, track: null });
  assert.deepEqual(goPlan('?to=line&i=bad!', 'th'), { dest: PARTNER_LINE, track: null });
});

test('go: to 가 line 이 아니면 LINE 으로 넘기지 않고 파트너 첫 화면 · 기록 없음', () => {
  for (const q of ['', '?i=test57inv8', '?to=https://evil.example&i=test57inv8', '?to=LINE&i=test57inv8',
    '?to=line2', '?to=%2F%2Fevil.example', '?to=javascript:alert(1)', '?to=&i=test57inv8', '?to=cta&i=test57inv8']) {
    const p = goPlan(q, 'th');
    assert.equal(p.dest, '/th/partner', q);
    assert.equal(p.track, null, q);
    assert.notEqual(p.dest, PARTNER_LINE, q);
  }
  assert.equal(goPlan('?to=x', 'en').dest, '/en/partner');
  assert.equal(goPlan('?to=x', '//evil').dest, '/th/partner');
});

test('도착 화면: i(형식 맞음) + 그 화면의 m 이 둘 다 있을 때만', () => {
  assert.deepEqual(readTrack('?i=test57inv8&m=cta', ['cta']), { code: 'test57inv8', kind: 'cta' });
  assert.deepEqual(readTrack('?from=mist&i=abcd1234ef&m=guide', ['guide']), { code: 'abcd1234ef', kind: 'guide' });
  assert.equal(readTrack('?i=test57inv8', ['cta']), null);             // m 없음 = 옛 링크 · 공개 화면
  assert.equal(readTrack('?m=cta', ['cta']), null);                     // i 없음
  assert.equal(readTrack('?i=test57inv8&m=img', ['cta']), null);        // 그 화면이 받지 않는 종류
  assert.equal(readTrack('?i=bad-code&m=cta', ['cta']), null);          // 형식 틀림
  assert.equal(readTrack('?i=short&m=cta', ['cta']), null);
  assert.equal(readTrack('?apply=1&i=test57inv8&m=cta', ['cta']), null); // LINE 왕복 = 다시 안 쏨
  assert.deepEqual([...TRACK_KINDS], ['cta', 'img', 'info', 'guide', 'line']);
});

test('메일 유입 판정: m · src=email · 같은 탭 표시(같은 코드만)', () => {
  assert.equal(cameFromEmail('?i=test57inv8&m=cta', 'test57inv8', null), true);
  assert.equal(cameFromEmail('?apply=1&i=test57inv8&src=email', 'test57inv8', null), true);
  assert.equal(cameFromEmail('?i=test57inv8', 'test57inv8', 'test57inv8'), true);
  assert.equal(cameFromEmail('?i=test57inv8', 'test57inv8', 'otherCode99'), false);
  assert.equal(cameFromEmail('?i=test57inv8', 'test57inv8', null), false);
  assert.equal(cameFromEmail('?i=test57inv8&m=zzz', 'test57inv8', null), false);
});

test('기록 쏘기: 주소 없음 = 안 쏨 · sendBeacon 글자 본문 · 실패해도 던지지 않음', () => {
  assert.equal(fireTrack(null, { code: 'test57inv8', kind: 'cta' }), false);
  const sent = [];
  const origNav = globalThis.navigator;
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { sendBeacon: (u, b) => { sent.push([u, b]); return true; } } });
  try {
    assert.equal(fireTrack('https://api.example/functions/v1', { code: 'test57inv8', kind: 'line' }), true);
    assert.equal(sent[0][0], 'https://api.example/functions/v1/trading-invite-track');
    assert.equal(sent[0][1].type, 'text/plain;charset=utf-8');
    // 비콘이 터져도 fetch 로 넘어가고, fetch 도 터지면 false — 예외는 밖으로 안 나감
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { sendBeacon: () => { throw new Error('x'); } } });
    const origFetch = globalThis.fetch;
    globalThis.fetch = () => { throw new Error('offline'); };
    try { assert.equal(fireTrack('https://api.example/functions/v1', { code: 'test57inv8', kind: 'cta' }), false); }
    finally { globalThis.fetch = origFetch; }
  } finally {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: origNav });
  }
});

test('go 화면: LINE 으로 넘기는 곳은 goPlan 하나 · 화면 글자 링크도 같은 LINE 주소', () => {
  const src = readFileSync(new URL('../src/components/partner/GoView.tsx', import.meta.url), 'utf8');
  assert.match(src, /window\.location\.replace\(dest\)/);
  assert.match(src, /dest = plan\.dest/);
  assert.match(src, /href=\{PARTNER_LINE\}/);
  assert.doesNotMatch(src, /searchParams\.get\('to'\)/); // to 값을 직접 목적지로 쓰지 않음
});
