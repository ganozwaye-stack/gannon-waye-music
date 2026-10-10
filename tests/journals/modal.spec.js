import { test, expect } from '@playwright/test';
import { PUBLIC_JOURNALS } from '../../src/lib/publicJournalCatalogue.js';
const origin = process.env.BASE_URL || 'http://localhost:5173';
test('each preview stays selected consistently and contains only one genuine question', async ({ page }) => {
  await page.goto(origin + '/coaching');
  await page.getByRole('button', {name:'Explore the Journals',exact:true}).click();
  for (const book of PUBLIC_JOURNALS) {
    await page.getByTestId('journal-cover-' + book.id).click();
    const dialog = page.getByTestId('journal-preview-modal');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: book.title, exact: true })).toBeVisible();
    await expect(dialog.getByTestId('journal-sample-question')).toHaveText(book.sampleQuestion);
    await expect(dialog.getByTestId('journal-sample-question')).toHaveCount(1);
    if (book.coverImageUrl) await expect(dialog.getByRole('img', { name: book.title + ' cover' })).toHaveAttribute('src', book.coverImageUrl);
    await expect(dialog.getByRole('button', { name: 'Purchase', exact: true })).toBeDisabled();
    await dialog.getByTestId('journal-close').click();
    await expect(dialog).not.toBeVisible();
  }
});
test('browser Back closes preview and a different book reopens without stale content', async ({ page }) => {
  await page.goto(origin + '/coaching');
  await page.getByRole('button', {name:'Explore the Journals',exact:true}).click();
  await page.getByTestId('journal-cover-' + PUBLIC_JOURNALS[0].id).click();
  await expect(page.getByTestId('journal-preview-modal')).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId('journal-preview-modal')).not.toBeVisible();
  await page.getByTestId('journal-cover-' + PUBLIC_JOURNALS[1].id).click();
  await expect(page.getByTestId('journal-sample-question')).toHaveText(PUBLIC_JOURNALS[1].sampleQuestion);
});
test('held page never sends payment or private-download requests', async ({ page }) => {
  const requests = [];
  page.on('request', request => {
    if (/\/functions\/(createJournalCheckout|downloadJournal|getJournalPurchases)(?:[/?]|$)/i.test(request.url()) || /checkout\.stripe\.com/i.test(request.url())) requests.push(request.url());
  });
  await page.goto(origin + '/coaching');
  await page.getByRole('button', {name:'Explore the Journals',exact:true}).click();
  await page.getByTestId('journal-cover-' + PUBLIC_JOURNALS[0].id).click();
  await expect(page.getByRole('button', { name: 'Purchase', exact: true })).toBeDisabled();
  expect(requests).toEqual([]);
});
