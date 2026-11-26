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

async function captureWA(page: import('@playwright/test').Page) {
  const opened: string[] = [];
  await page.exposeFunction('captureOpen', (u: string) => opened.push(u));
  await page.evaluate(() => { window.open = ((u: string) => { (window as any).captureOpen(u); return {} as Window; }) as typeof window.open; });
  return opened;
}

test('quote will not send until the required fields are filled', async ({ page }) => {
  await page.goto('/quote.html');
  const opened = await captureWA(page);
  const next = page.locator('[data-mnext]:visible, [data-msend]:visible').first();
  await next.click();
  await expect(page.locator('input[data-f=dest]:visible')).toHaveClass(/vx-miss/);
  await expect(page.locator('input[data-f=dest]:visible')).toBeFocused();
  await page.locator('input[data-f=dest]:visible').fill('Ikeja');
  await next.click();
  expect(opened.length).toBe(0);
  await page.locator('[data-msend]:visible').first().click();
  await expect(page.locator('input[data-f=name]:visible')).toHaveClass(/vx-miss/);
  expect(opened.length).toBe(0);
  await page.locator('input[data-f=name]:visible').fill('Ade');
  await page.locator('input[data-f=wa]:visible').fill('+234 800 000 0000');
  await page.locator('input[data-f=co]:visible').fill('Acme "Logistics" Ltd');
  await page.locator('[data-msend]:visible').first().click();
  await expect.poll(() => opened.length).toBe(1);
  const text = decodeURIComponent(opened[0]);
  expect(text).toContain('Deliver to: Ikeja');
  expect(text).toContain('Company: Acme "Logistics" Ltd');
  await page.locator('[data-medit]:visible').first().click();
  await expect(page.locator('input[data-f=co]:visible')).toHaveValue('Acme "Logistics" Ltd');
});

test('early-access request uses readable field names', async ({ page }) => {
  await page.goto('/watchtower.html');
  const opened = await captureWA(page);
  const f = page.locator('form[data-wa]');
  await f.locator('input[name=n]').fill('Ade');
  await f.locator('input[name=c]').fill('Acme');
  await f.locator('input[name=e]').fill('ade@acme.com');
  await f.locator('button[type=submit]').click();
  await expect.poll(() => opened.length).toBe(1);
  const text = decodeURIComponent(opened[0]);
  expect(text).toContain('Name: Ade');
  expect(text).toContain('Work email: ade@acme.com');
});

test('quote flags an unpicked date and keeps flags after a re-render', async ({ page }) => {
  await page.goto('/quote.html');
  const opened = await captureWA(page);
  await page.locator('select[data-f=when]:visible').selectOption('Pick a date');
  if (await page.evaluate('S.m.calOpen')) { await page.locator('[data-calopen]:visible').first().click(); }
  await page.locator('input[data-f=dest]:visible').fill('Ikeja');
  const next = page.locator('[data-mnext]:visible, [data-msend]:visible').first();
  await next.click();
  await expect(page.locator('[data-calopen]:visible').first()).toHaveClass(/vx-miss/);
  await page.locator('select[data-f=size]:visible').selectOption('20 ft');
  await expect(page.locator('[data-calopen]:visible').first()).toHaveClass(/vx-miss/);
  expect(opened.length).toBe(0);
});

test('a TDO file name is shown as text, not markup', async ({ page }) => {
  await page.goto('/quote.html');
  await page.locator('input[data-tdo]').first().setInputFiles({ name: 'a<b>c.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF') });
  await expect(page.locator('.file b').first()).toHaveText('a<b>c.pdf');
});

test('clearing the track box hides the old result', async ({ page }) => {
  await page.goto('/track.html?q=CMAU4829139');
  await expect(page.locator('#res')).toBeVisible();
  await page.fill('#q1', '');
  await page.locator('#tf button[type=submit], #tf button').first().click();
  await expect(page.locator('#res')).toBeHidden();
});
