import { test, expect } from '@playwright/test';

const pages = [
  'index', 'services-terminal', 'services-road', 'carriers', 'track', 'watchtower',
  'proof-of-delivery', 'quote', 'about', 'privacy', 'terms',
];

for (const name of pages) {
  test(`${name} loads cleanly`, async ({ page }) => {
    const problems: string[] = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('response', (r) => {
      if (r.status() >= 400 && r.url().startsWith('http://localhost')) problems.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(`/${name}.html`);
    await page.waitForLoadState('networkidle');

    expect(problems).toEqual([]);
    await expect(page).toHaveTitle(/VirgoPoint Haulage/);
    await expect(page.locator('footer.vx-f')).toHaveCount(1);
    // One Get a quote on the page: the red button in the header.
    await expect(page.locator('header.snav a, header.zsnav a', { hasText: /^Get a quote$/ })).toHaveCount(1);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = page.viewportSize()!.width;
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);

    // Standing rule: no small label directly above a page headline.
    const labelAboveH1 = await page.evaluate(() =>
      [...document.querySelectorAll('h1')].some((h) => h.previousElementSibling?.matches('.lbm, .ey6')),
    );
    expect(labelAboveH1).toBe(false);
  });
}

test('track hands off to WhatsApp, never shows made-up results', async ({ page }) => {
  await page.goto('/track.html');
  await page.fill('#q1', 'CMAU 482913 9');
  await page.click('#tf button[type=submit]');
  await expect(page.locator('#rq')).toHaveText('CMAU 482913 9');
  await expect(page.locator('#rwa')).toHaveAttribute('href', /wa\.me\/2349096673176\?text=Status%20for%20CMAU/);
  await expect(page.locator('text=Delivered')).toHaveCount(0);
});

test('transporter form writes the details into WhatsApp', async ({ page }) => {
  await page.goto('/carriers.html');
  const opened: string[] = [];
  await page.exposeFunction('captureOpen', (u: string) => opened.push(u));
  await page.evaluate(() => { window.open = ((u: string) => { (window as any).captureOpen(u); return {} as Window; }) as typeof window.open; });
  await page.fill('input[name=co]', 'Acme Haulage');
  await page.fill('input[name=n]', 'Ade');
  await page.fill('input[name=wa]', '+2348000000000');
  await page.fill('input[name=t]', '4');
  await page.click('#register button[type=submit]');
  await expect.poll(() => opened.length).toBe(1);
  expect(decodeURIComponent(opened[0])).toContain('Company');
  expect(decodeURIComponent(opened[0])).toContain('Acme Haulage');
});

test('Carriers is not listed as a service', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('header a', { hasText: /^Carriers$/ })).toHaveCount(0);
  await expect(page.locator('.vx-sc h3')).toHaveText(['Terminal collection', 'Road haulage']);
});

test('WhatsApp opens in a new tab and the form page stays put', async ({ page, context }) => {
  await context.route('https://wa.me/**', (route) => route.fulfill({ status: 200, body: 'ok' }));
  await page.goto('/carriers.html');
  await page.fill('input[name=co]', 'Acme Haulage');
  await page.fill('input[name=n]', 'Ade');
  await page.fill('input[name=wa]', '+2348000000000');
  await page.fill('input[name=t]', '4');
  const popup = context.waitForEvent('page');
  await page.click('#register button[type=submit]');
  expect((await popup).url()).toContain('wa.me/2349096673176');
  await page.waitForTimeout(300);
  expect(page.url()).toContain('/carriers');
  await expect(page.locator('#register .ok2')).toBeVisible();
});

test('quote form has no map pin that the request cannot carry', async ({ page }) => {
  await page.goto('/quote.html');
  await expect(page.locator('[data-mapopen]:visible')).toHaveCount(0);
});
