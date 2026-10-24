/* eslint-disable no-undef */
const {test,expect}=require('@playwright/test');
test('native queue exposes drafts and never invents posting receipts or mutates a status',async({page})=>{
 let writes=0;
 await page.route('**/api/**',route=>{
  if(new URL(route.request().url()).pathname.startsWith('/src/'))return route.continue();
  if(route.request().method()!=='GET'){if(route.request().url().includes('/entities/ContentCalendarPost'))writes++;return route.abort();}
  if(route.request().url().includes('/entities/ContentCalendarPost'))return route.fulfill({json:[
   {id:'draft-fixture',platform:'tiktok',status:'draft',caption:'Native caption',hashtags:'#music',media_status:'not_started'},
   {id:'recorded-fixture',platform:'facebook',status:'posted',caption:'Previously recorded caption',media_status:'approved_public'},
   {id:'out-of-scope-fixture',platform:'youtube_shorts',status:'approved',caption:'Preserved outside current scope'}
  ]});
  return route.abort();
 });
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.evaluate(async()=>{const fixture=await import('/src/gannonwaye-playwright-pack/tests/fixtures/nativeSocialHarness.jsx');fixture.mountQueueFixture([{id:'draft-fixture',platform:'tiktok',status:'draft',caption:'Native caption',hashtags:'#music',media_status:'not_started'},{id:'recorded-fixture',platform:'facebook',status:'posted',caption:'Previously recorded caption',media_status:'approved_public'},{id:'out-of-scope-fixture',platform:'youtube_shorts',status:'approved',caption:'Preserved outside current scope'}]);});
 const queue=page.getByTestId('native-social-queue');
 await expect(queue.getByTestId('native-social-draft')).toHaveCount(2);
 await expect(queue).toContainText('Provider receipt unavailable');
 await expect(queue).toContainText('1 records for other platforms remain stored');
 await expect(queue.getByRole('button',{name:/Mark.*Posted|Mark.*Scheduled/})).toHaveCount(0);
 await expect(queue.locator('a[href*="metricool"]')).toHaveCount(0);
 await queue.getByLabel('Platform',{exact:true}).selectOption('tiktok');
 await expect(queue.getByTestId('native-social-draft')).toHaveCount(1);
 await expect(queue).toContainText('Native caption');
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('Permission denied');}},configurable:true});});
 await queue.getByRole('button',{name:'Copy native draft'}).click();
 await expect(queue.getByRole('status')).toContainText('Copy failed.');
 expect(writes).toBe(0);
});