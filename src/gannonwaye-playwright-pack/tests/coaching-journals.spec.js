const { test, expect } = require('@playwright/test');
let PUBLIC_JOURNALS;
test.beforeAll(async () => { ({ PUBLIC_JOURNALS } = await import('../../lib/publicJournalCatalogue.js')); });
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
test('three chosen books total A$29.70, explicit six bundle A$49, no duplicate titles and reopen resets', async ({ page }) => {
  await page.goto(origin + '/coaching');
  await page.getByRole('button', {name:'Explore the Journals',exact:true}).click();
  await page.getByTestId('journal-cover-' + PUBLIC_JOURNALS[0].id).click();
  const dialog = page.getByTestId('journal-preview-modal');
  const total = dialog.getByTestId('journal-selection-total');
  await expect(total).toHaveText('Total: A$9.90');
  await dialog.getByRole('checkbox', { name: PUBLIC_JOURNALS[1].title + ' · A$9.90', exact: true }).check();
  await dialog.getByRole('checkbox', { name: PUBLIC_JOURNALS[2].title + ' · A$9.90', exact: true }).check();
  await expect(total).toHaveText('Total: A$29.70');
  await expect(dialog.getByRole('list', { name: 'Selected journals' }).getByRole('listitem')).toHaveCount(3);
  await dialog.getByRole('checkbox', { name: 'Choose the whole six-journal bundle · A$49', exact: true }).check();
  await expect(total).toHaveText('Total: A$49.00');
  const titles = await dialog.getByRole('list', { name: 'Selected journals' }).getByRole('listitem').allTextContents();
  expect(titles).toHaveLength(6);
  expect(new Set(titles).size).toBe(6);
  await page.screenshot({ path: '/tmp/gw-coaching-journal-bundle.png', fullPage: true });
  await dialog.getByTestId('journal-close').click();
  await page.getByTestId('journal-cover-' + PUBLIC_JOURNALS[1].id).click();
  await expect(page.getByTestId('journal-selection-total')).toHaveText('Total: A$9.90');
  await expect(page.getByTestId('journal-preview-modal').getByRole('heading', { name: PUBLIC_JOURNALS[1].title, exact: true })).toBeVisible();
});

test('purchase return stays held without confirmation or private download requests',async({page})=>{
 const requests=[];
 page.on('request',request=>{if(/\/functions\/(confirmJournalPurchase|downloadJournal|getJournalPurchases|createJournalCheckout|cancelJournalCheckout)(?:[/?]|$)/i.test(request.url()))requests.push(request.url());});
 await page.goto(origin+'/journals/purchase?session_id=cs_test_abcdefghijklmnop');
 await expect(page.getByTestId('journal-purchase-return')).toBeVisible();
 await expect(page.getByText('Online purchasing is being prepared. No payment is accepted by this page.')).toBeVisible();
 await expect(page.getByRole('button',{name:'Download journal',exact:true})).toHaveCount(0);
 expect(requests).toEqual([]);
});
test('landing offers two separate choices and exactly the approved three paragraphs',async({page})=>{
 await page.goto(origin+'/coaching');
 const paragraphs=["I’ve always felt drawn to helping people find clarity, understand challenges, and build confidence to move forward. In personal training, I realised it was forty percent muscle, sixty percent mental.","That experience, plus my studies and lived experience, shapes my coaching today. Even with seven years of learning, I was caught in abuse. That’s why I say openly: understanding doesn’t make you immune, and none of that means you’re weak. Writing and music helped me find words and strength; the journals grew from that.","Wherever you are in your journey, you’re welcome to start here. Explore the journals and choose one that speaks to you, or get in touch about one-on-one coaching so we can talk about what you’d like to work towards. You don’t need to have it all figured out. Let’s start with what matters to you."];
 for(const [i,id] of ['coaching-approved-intro','coaching-approved-story','coaching-approved-ending'].entries())
   await expect(page.getByTestId(id)).toHaveText(paragraphs[i]);
 await expect(page.getByTestId('journal-shelf')).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'One-on-one coaching',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Enquire about Coaching',exact:true}).click();
 await expect(page.getByRole('heading',{name:'One-on-one coaching',exact:true})).toBeVisible();
 await expect(page.getByTestId('journal-shelf')).toHaveCount(0);
 await page.goBack();
 await expect(page.getByRole('heading',{name:'One-on-one coaching',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Explore the Journals',exact:true}).click();
 await expect(page.getByTestId('journal-shelf')).toBeVisible();
 await expect(page.getByRole('heading',{name:'One-on-one coaching',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Back to the choices',exact:true}).click();
 await expect(page.getByTestId('journal-shelf')).toHaveCount(0);
});
