import { expect, test } from '@playwright/test';

const magicPath = '/th/products/valentine-magic-straight-system';
const lppPath = '/th/products/valentine-lpp-treatment';

test('catalog exposes both Valentine products without changing legacy copy', async ({ page }) => {
  await page.goto('/th/products');

  await expect(page.getByRole('heading', { name: 'VALENTINE PROFESSIONAL' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Magic Straight System/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /L\.P\.P Treatment/ })).toBeVisible();
  await expect(page.getByText('Eucalyptus Scaling Gel', { exact: true })).toBeVisible();
});

test('Magic finder supports initial, partial, complete and reset states', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(magicPath);

  const result = page.locator('[aria-live="polite"]');
  await expect(result).toContainText('เลือกทั้ง 2 ขั้นตอน');

  await page.getByRole('radio', { name: /H1/ }).check();
  await expect(result).toContainText('เลือกทั้ง 2 ขั้นตอน');

  await page.getByRole('radio', { name: /C2/ }).check();
  await expect(result).toContainText('H1 + C2');

  await page.getByRole('button', { name: 'ล้างการเลือก' }).click();
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(page.locator('#formula-finder')).toBeFocused();
  await expect(page.locator('html')).toHaveJSProperty('scrollWidth', 360);
});

test('Valentine locale fallback, metadata, LPP facts and 404 are correct', async ({ page }) => {
  await page.goto('/en/products/valentine-magic-straight-system');
  await expect(page.locator('section[lang="th"]').first()).toContainText('ระบบยืดผม');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://57tb.art/en/products/valentine-magic-straight-system',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://57tb.art/products/valentine-magic-straight-system/thumb.webp',
  );

  await page.goto(lppPath);
  await expect(page.getByRole('heading', { name: 'สรุปการใช้' })).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('อย่างน้อย 5 นาที');
  await expect(page.locator('#main-content')).toContainText('ประมาณ 20 นาที');
  await expect(page.locator('#main-content')).not.toContainText('BELLISTA');

  const response = await page.goto('/th/products/not-a-product');
  expect(response?.status()).toBe(404);
});

test('Magic remains readable in dark theme and reduced motion', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto(magicPath);

  await expect(page.getByRole('heading', { name: /ระบบยืดผม/ })).toBeVisible();
  await expect(page.getByRole('radio', { name: /L2/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth))
    .toBe(await page.evaluate(() => document.documentElement.clientWidth));
});

test('Magic has complete neutral selection table without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4173${magicPath}`);

  const table = page.locator('noscript table');
  await expect(table).toContainText('H1');
  await expect(table).toContainText('D1');
  await expect(table).toContainText('C2');
  await expect(table).toContainText('L2');
  await context.close();
});
