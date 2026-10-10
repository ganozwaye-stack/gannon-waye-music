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
test('landing offers two separate choices and the agreed revised story and wallpaper hero',async({page})=>{
 await page.goto(origin+'/coaching');
 const paragraphs=["If there’s one thing my life has shown me, it’s my sheer determination and drive to succeed.","I know what it’s like to need support, and I know what it’s like to not find it. And I still had to survive. At 28, I used drugs for the first time. I rang Mum straight away and asked for help. Over the next two years, I went to rehab twice before finding recovery. I returned to church, attended Narcotics Anonymous and took on roles helping others. My healing isn’t complete, but I’m determined to keep going.","It wasn’t until I became a personal trainer that I realised how much the work went beyond fitness. Exercise could offer clarity and a sense of healing, but often our conversations reached beyond the gym. I found myself encouraging clients, lifting them up and helping them build confidence to take on challenges in their everyday lives. It was motivation for life, and supporting that growth brought me so much joy.","I studied mental health at TAFE, completed my Diploma of Counselling in 2020 and began university in 2021. I now hold a Bachelor of Psychological Studies. Along the way, I earned high distinctions and was invited to join Golden Key. Seven years of education and personal development, including further learning in mental health, have deepened what I bring to supporting others.","My coaching brings together that education and lived experience. Through life coaching and mindset mentorship, I listen, help you recognise your strengths and work with you on practical steps towards what matters to you. Honesty, integrity and transparency guide how I work. Shame has no place in healing.","I find purpose and joy in helping others move towards their future. I share my journey because I want it to benefit others, beyond my own life. I believe God can use it for something greater than myself.","If you’re looking for support, explore my journals or learn more about coaching."];
 const introduction=page.locator('[data-testid^="coaching-approved-"]');
 await expect(introduction).toHaveCount(7);
 await expect(introduction).toHaveText(paragraphs);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 const ending=await page.getByTestId('coaching-approved-ending').boundingBox();
 const choices=await page.getByRole('button',{name:'Explore the Journals',exact:true}).boundingBox();
 expect(choices.y).toBeGreaterThanOrEqual(ending.y+ending.height);
 for(const name of ['Explore the Journals','Enquire about Coaching']) {
  const box=await page.getByRole('button',{name,exact:true}).boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
 }
 const headingStyle=await page.getByRole('heading',{level:1}).evaluate(el=>({font:getComputedStyle(el).fontFamily,weight:getComputedStyle(el).fontWeight}));
 expect(headingStyle.font).toContain('Poppins');
 expect(headingStyle.weight).toBe('700');
 const loadedHeadingFont=await page.evaluate(async()=>{const faces=await document.fonts.load('700 48px Poppins');return faces.length>0&&faces.every(face=>face.status==='loaded');});
 expect(loadedHeadingFont).toBe(true);
 const wallpaper=page.getByTestId('coaching-hero-wallpaper');
 await wallpaper.evaluate(image=>image.decode());
 await expect(wallpaper).toHaveAttribute('src',/94d50ca39_77B69334/);
 await expect(wallpaper).toHaveAttribute('alt','');
 await expect(page.getByTestId('coaching-hero-overlay')).toBeVisible();
 const type=await introduction.first().evaluate(element=>getComputedStyle(element).fontSize);
 expect(parseFloat(type)).toBeGreaterThanOrEqual(18);
 await page.evaluate(()=>{for(const el of document.querySelectorAll('body *'))if(getComputedStyle(el).position==='fixed')el.setAttribute('data-review-fixed','');});
 const reviewStyle=await page.addStyleTag({content:'[data-review-fixed],[data-review-fixed] *,[class~="fixed"],[class~="fixed"] *,[style*="position: fixed"],[style*="position: fixed"] *{visibility:hidden!important;opacity:0!important}'});
 await page.getByTestId('coaching-editorial-intro').screenshot({path:require('path').join(require('os').tmpdir(),'gw-coaching-editorial-'+test.info().project.name+'.jpg'),type:'jpeg',quality:55});
 await reviewStyle.evaluate(element=>element.remove());
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
