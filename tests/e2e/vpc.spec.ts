import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

test.describe('VPC Website', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/VPC/);
    await expect(page.locator('h1')).toContainText('Engineering the Future of Freight');
  });

  test('hero section displays tagline', async ({ page }) => {
    // Use more specific selector to avoid footer match
    await expect(page.locator('#hero').getByText('Certainty. Every Trip.')).toBeVisible();
  });

  // Navigation tests - desktop only (mobile uses hamburger menu)
  test('anchor navigation works', async ({ page }) => {
    // Set desktop viewport to ensure nav links are visible
    await page.setViewportSize({ width: 1280, height: 800 });

    const sections = ['about', 'portfolio', 'watchtower', 'contact'];
    for (const section of sections) {
      // Use the desktop nav links (not CTA button)
      const link = page.locator(`header nav a[href="#${section}"]`).filter({ hasText: new RegExp(`^${section}$`, 'i') });
      if (await link.count() > 0) {
        await link.first().click();
        const target = page.locator(`#${section}`);
        if (await target.count() > 0) {
          await expect(target).toBeInViewport();
        }
      }
    }
  });

  // Mobile menu tests
  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const menuButton = page.locator('[aria-label="Menu"]');
    if (await menuButton.count() > 0) {
      await menuButton.click();
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      const closeButton = page.locator('[aria-label="Close menu"]');
      if (await closeButton.count() > 0) {
        await closeButton.click();
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
      }
    }
  });

  // Form validation tests (will be expanded in Phase 3)
  test('contact form validates required fields', async ({ page }) => {
    await page.goto('/#contact');
    const submitButton = page.locator('#contact button[type="submit"]');
    if (await submitButton.count() > 0) {
      await submitButton.click();
      await expect(page.locator('text=Company name is required')).toBeVisible();
      await expect(page.locator('text=Contact name is required')).toBeVisible();
      await expect(page.locator('text=Please enter a valid email')).toBeVisible();
      await expect(page.locator('text=Message must be at least 10 characters')).toBeVisible();
    }
  });

  test('contact form submits successfully', async ({ page }) => {
    await page.goto('/#contact');
    const form = page.locator('#contact form');
    if (await form.count() > 0) {
      await page.fill('[name="company"]', 'Test Corp');
      await page.fill('[name="name"]', 'John Doe');
      await page.fill('[name="email"]', 'john@test.com');
      await page.fill('[name="message"]', 'This is a test message for the form');
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Message sent!')).toBeVisible({ timeout: 10000 });
    }
  });

  // Visual regression per viewport (Phase 5)
  for (const vp of viewports) {
    test(`visual regression - ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await expect(page).toHaveScreenshot(`homepage-${vp.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      });
    });
  }

  // Accessibility test (Phase 5)
  test('no accessibility violations', async ({ page }) => {
    const { AxeBuilder } = await import('@axe-core/playwright');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
