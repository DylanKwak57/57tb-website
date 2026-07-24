import { expect, test } from '@playwright/test';

const magicPath = '/th/products/valentine-magic-straight-system';
const lppPath = '/th/products/valentine-lpp-treatment';

test('catalog exposes both Valentine products without changing legacy copy', async ({ page }) => {
  await page.goto('/th/products');

  await expect(page.getByRole('heading', { name: 'VALENTINE PROFESSIONAL' })).toBeVisible();
  await expect(page.getByRole('link', { name: /น้ำยา Multi Perm/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /L\.P\.P Treatment/ })).toBeVisible();
  await expect(page.getByText('Eucalyptus Scaling Gel', { exact: true })).toBeVisible();

  const cards = page.locator('a[href$="valentine-magic-straight-system"], a[href$="valentine-lpp-treatment"]');
  expect((await cards.nth(0).boundingBox())?.height).toBe((await cards.nth(1).boundingBox())?.height);

  await page.setViewportSize({ width: 390, height: 844 });
  expect((await cards.nth(0).boundingBox())?.height).toBe((await cards.nth(1).boundingBox())?.height);
});

test('Valentine professional product guides render only the selected Magic set and all LPP visuals', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(magicPath);

  const selected = page.locator('[data-selected-gallery]');
  await expect(selected).toHaveAttribute('data-selected-gallery', 'h1');
  await expect(selected.locator('[data-testid="valentine-main-gallery"] img')).toHaveCount(8);
  await expect(selected.locator('[data-testid="valentine-detail-gallery"] img')).toHaveCount(6);
  await expect(selected.locator('img').first()).toHaveAttribute('src', /\/h1\/main-01\.webp$/);
  await expect(selected.locator('img').first()).toHaveAttribute('loading', 'lazy');
  await expect(selected.locator('img').first()).toHaveAttribute('decoding', 'async');
  await expect(page.locator('#main-content')).toContainText('PROFESSIONAL PRODUCT GUIDE');
  await expect(page.locator('#main-content')).not.toContainText(/shopee/i);
  for (const code of ['H1', 'D1', 'C2', 'L2']) {
    const button = page.getByRole('button', { name: new RegExp(code) });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(selected).toHaveAttribute('data-selected-gallery', code.toLowerCase());
    await expect(selected.locator('img').first()).toHaveAttribute('src', new RegExp(`/${code.toLowerCase()}/main-01\\.webp$`));
    await expect(selected.locator('img')).toHaveCount(14);
    await selected.locator('img').evaluateAll(async (images) => {
      const htmlImages = images as HTMLImageElement[];
      htmlImages.forEach((image) => { image.loading = 'eager'; });
      await Promise.all(htmlImages.map((image) => image.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => image.addEventListener('load', () => resolve(), { once: true }))));
    });
    await expect.poll(() => selected.locator('img').evaluateAll((images) => (images as HTMLImageElement[]).every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
  }
  const square = await selected.locator('[data-testid="valentine-main-gallery"] img').first().evaluate((image) => image.getBoundingClientRect());
  expect(Math.abs(square.width - square.height)).toBeLessThan(1);
  const detail = await selected.locator('[data-testid="valentine-detail-gallery"] img').first().evaluate((image) => image.getBoundingClientRect());
  expect(Math.abs((detail.width / detail.height) - (4 / 5))).toBeLessThan(0.01);
  for (const width of [320, 360, 390, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  await page.setViewportSize({ width: 320, height: 844 });
  const headingLines = await page.locator('[data-testid="multi-perm-heading"] span').evaluateAll((spans) => spans.map((span) => {
    const range = document.createRange();
    range.selectNodeContents(span);
    return range.getClientRects().length;
  }));
  expect(headingLines).toEqual([1, 1]);

  await page.goto(lppPath);
  const lppGallery = page.locator('[data-selected-gallery="lpp"]');
  await expect(lppGallery.locator('[data-testid="valentine-main-gallery"] img')).toHaveCount(8);
  await expect(lppGallery.locator('[data-testid="valentine-detail-gallery"] img')).toHaveCount(6);
  await expect(lppGallery.locator('img').first()).toHaveAttribute('src', /\/gallery\/main-01\.webp$/);
  await expect(lppGallery.locator('img')).toHaveCount(14);
  await expect(lppGallery.locator('img').first()).toHaveAttribute('loading', 'lazy');
  await expect(page.locator('#main-content')).toContainText('PROFESSIONAL PRODUCT GUIDE');
  await expect(page.locator('#main-content')).not.toContainText(/shopee/i);
  await lppGallery.locator('img').evaluateAll(async (images) => {
    const htmlImages = images as HTMLImageElement[];
    htmlImages.forEach((image) => { image.loading = 'eager'; });
    await Promise.all(htmlImages.map((image) => image.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => image.addEventListener('load', () => resolve(), { once: true }))));
  });
  await expect.poll(() => lppGallery.locator('img').evaluateAll((images) => (images as HTMLImageElement[]).every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
  await expect(page.locator('#formula-finder')).toHaveCount(0);
  await expect(page.locator('#main-content')).not.toContainText('Multi Perm');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
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
  await expect(page.locator('section[lang="th"]').first()).toContainText(/น้ำยา Multi Perm.*2 ขั้นตอน.*สำหรับช่างมืออาชีพ/);
  await expect(page.locator('section[lang="th"]').first()).toContainText('ใช้ได้ทั้งดัดดิจิตอล ยืดวอลลุ่ม (วอลลุ่มเมจิก) และรีบอนดิ้ง');
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

  await expect(page.getByRole('heading', { name: /น้ำยา Multi Perm/ })).toBeVisible();
  await expect(page.getByRole('radio', { name: /L2/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth))
    .toBe(await page.evaluate(() => document.documentElement.clientWidth));
});

test('Multi Perm Thai heading keeps two intentional lines without overflow', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.goto(magicPath);
    const heading = page.getByTestId('multi-perm-heading');
    await expect(heading.locator('span')).toHaveCount(2);
    expect(await heading.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await heading.evaluate((element) => getComputedStyle(element).fontFamily)).toMatch(/Noto_Sans_Thai/);
  }
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
