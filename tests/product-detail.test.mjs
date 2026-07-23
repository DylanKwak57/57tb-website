import assert from 'node:assert/strict';
import test from 'node:test';
import { PRODUCTS, getProduct, localize, productName } from '../src/data/products.ts';
import { formulaReducer } from '../src/lib/formula-state.ts';

test('localize and productName use explicit Thai fallback', () => {
  const magic = getProduct('valentine-magic-straight-system');
  assert.ok(magic);
  assert.equal(localize(magic.description, 'en', 'th'), magic.description.th);
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
