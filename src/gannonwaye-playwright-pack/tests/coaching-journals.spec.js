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
test('landing offers two separate choices and exactly the approved full introduction',async({page})=>{
 await page.goto(origin+'/coaching');
 const paragraphs=["I’ve always felt drawn to helping people find clarity, understand the challenges they’re facing, and build the confidence to move forward. When I worked as a personal trainer, I realised how much that work went beyond fitness. For me, it felt like forty percent muscle and sixty percent mental. I saw clients grow in self-belief, reach their goals, and achieve things they hadn’t thought possible.","Coaching has a lot in common with that: listening, recognising someone’s strengths, helping them take steps towards what matters. I’ve invested seven years in education and my own development, including studying psychology. And even with that knowledge, I became caught in an abusive relationship. That’s part of why I speak openly about manipulation, control, and domestic abuse. Understanding these things doesn’t make you immune to experiencing them. If you’ve ever wondered how you ended up there, it doesn’t mean you’re unintelligent or weak.","My own recovery is still unfolding. Writing music has helped me express feelings I couldn’t always explain, and find strength when I needed it. These journals grew out of that journey. They offer space for you to find your own words, reflect on what matters to you, and explore what you need next. You don’t need to have everything figured out to begin.","You can simply buy the journals and write privately, at your own pace. If you’d like more personal support, I also offer one-on-one coaching, drawing on my practical experience, education and lived experience. We start with your goals and work from there. I’m currently preparing additional tools and resources to support your growth.","I want to pay forward what’s helped me, and use the gifts God has given me to bless others. My hope is that through my music, these journals, and the support I offer, you’ll find something that helps you see possibility in your own journey. Sometimes that begins with one small step.","Wherever you are in your journey, you’re welcome to start here. Explore the journals and choose one that speaks to you, or get in touch about one-on-one coaching so we can talk about what you’d like to work towards. You don’t need to have it all figured out. Let’s start with what matters to you."];
 const introduction=page.locator('[data-testid^="coaching-approved-"]');
 await expect(introduction).toHaveCount(6);
 await expect(introduction).toHaveText(paragraphs);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 const ending=await page.getByTestId('coaching-approved-ending').boundingBox();
 const choices=await page.getByRole('button',{name:'Explore the Journals',exact:true}).boundingBox();
 expect(choices.y).toBeGreaterThanOrEqual(ending.y+ending.height);
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
