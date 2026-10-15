import { test, expect } from '@playwright/test';

test('desktop navigation, scroll timeline, and project details work', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 650, behavior: 'instant' }));
  await expect(page.locator('.hero-title-second')).toHaveCSS('opacity', '1');
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect.poll(() => page.locator('#about').evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(130);
  await page.getByRole('link', { name: 'Projects', exact: true }).click();
  await page.getByRole('button', { name: 'View Multi-Tenant SaaS Platform details' }).click();
  await expect(page.getByRole('dialog', { name: 'Multi-Tenant SaaS Platform' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Certifications', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Certifications' })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  expect(errors).toEqual([]);
});

test('contact validates input and previews a draft without pretending to send', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#contact');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('textbox', { name: 'First name', exact: true }).fill('Test');
  await page.getByRole('textbox', { name: 'Last name', exact: true }).fill('Visitor');
  await page.getByRole('textbox', { name: 'Email address', exact: true }).fill('test@example.com');
  await page.getByRole('textbox', { name: 'Message', exact: true }).fill('Let us discuss a new web project.');
  await expect(page.locator('.terminal')).toContainText('Test Visitor');
  await expect(page.locator('.terminal')).toContainText('Let us discuss a new web project.');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByRole('dialog', { name: 'Your message draft' })).toBeVisible();
  await expect(page.locator('dialog pre')).toContainText('test@example.com');
  await expect(page.getByRole('dialog')).toContainText('no message has been sent');
});

test('mobile menu and narrow layouts remain usable', async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('link', { name: 'Skills', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => page.locator('#skills').evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(100);
});

test('reduced motion removes pinned animation and preserves content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'First name', exact: true })).toBeInViewport();
});
