import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { PRODUCTS, getProduct, localize, productName } from '../src/data/products.ts';
import { formulaReducer } from '../src/lib/formula-state.ts';

test('localize and productName use explicit locales with Thai fallback', () => {
  const magic = getProduct('valentine-magic-straight-system');
  assert.ok(magic);
  assert.equal(localize(magic.description, 'en', 'th'), magic.description.en);
  assert.equal(localize(magic.description, 'ja', 'th'), magic.description.th);
  assert.equal(productName(magic, 'en'), magic.nameEn);
  assert.equal(productName(magic, 'ko'), magic.nameKo);
});

test('catalog keeps 16 legacy entries and two Valentine entries', () => {
  assert.equal(PRODUCTS.filter((product) => product.brand !== 'valentine').length, 16);
  assert.deepEqual(PRODUCTS.filter((product) => product.brand === 'valentine').map((product) => product.slug), ['valentine-magic-straight-system', 'valentine-lpp-treatment']);
});

test('formula reducer supports empty, partial, complete and reset transitions', () => {
  const first = formulaReducer({}, { type: 'select-step1', value: 'h1' });
  assert.deepEqual(first, { step1: 'h1' });
  const complete = formulaReducer(first, { type: 'select-step2', value: 'c2' });
  assert.deepEqual(complete, { step1: 'h1', step2: 'c2' });
  assert.deepEqual(formulaReducer(complete, { type: 'reset' }), {});
});

test('Magic label matrix is complete and neutral', () => {
  const magic = getProduct('valentine-magic-straight-system');
  assert.ok(magic && magic.detailMode === 'guided-system');
  const tuples = magic.guidedSystem.pairingRules.map((rule) => `${rule.step1Id}:${rule.step2Id}`);
  assert.deepEqual(tuples.sort(), ['d1:c2', 'd1:l2', 'h1:c2', 'h1:l2']);
  assert.ok(magic.guidedSystem.pairingRules.every((rule) => rule.allowed && !/recommend|preferred/i.test(rule.reason.th)));
});

test('Valentine is positioned as the professional Multi Perm system', () => {
  const magic = getProduct('valentine-magic-straight-system');
  assert.ok(magic && magic.detailMode === 'guided-system');
  assert.equal(magic.nameTh, 'Valentine Professional น้ำยา Multi Perm');
  assert.equal(magic.nameEn, 'Valentine Professional Multi Perm System');
  assert.equal(magic.nameKo, 'Valentine Professional 멀티펌 시스템');
  assert.match(magic.description.th, /น้ำยายืดผมและน้ำยาดัดผมอเนกประสงค์สำหรับงานซาลอน/);
  assert.match(magic.description.th, /ใช้ได้ทั้งดัดดิจิตอล ยืดวอลลุ่ม \(วอลลุ่มเมจิก\) และรีบอนดิ้ง/);
  assert.equal(magic.guidedSystem.step1Options[0].description.th, 'น้ำยา Multi Perm ขั้นตอนที่ 1 สูตรสำหรับผมสุขภาพดี · 500 ml · 15–20 นาที');
  assert.equal(magic.guidedSystem.step1Options[1].description.th, 'น้ำยา Multi Perm ขั้นตอนที่ 1 สูตรสำหรับผมเสีย · 500 ml · 10–15 นาที');

  for (const file of ['src/data/products.ts', 'src/components/products/ValentineProductDetail.tsx', 'src/components/products/ValentineShopeeGallery.tsx']) {
    const source = readFileSync(join(process.cwd(), file), 'utf8');
    assert.doesNotMatch(source, /ระบบยืดผม|ครีมยืดผม|ระบบน้ำยาดัดร้อน|น้ำยาดัดร้อนขั้นตอนที่ 1/);
  }
});
