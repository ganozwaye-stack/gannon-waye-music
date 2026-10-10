const {test,expect}=require('@playwright/test');
const fixture={"id":"6a538a537c7842081551d561","title":"Set Free","artwork_url":"https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e2c44c509_image.png","release_date":"2026-09-25","description":"Set Free catches the instant Gannon Waye stops trying to make harm look like love and draws a final boundary. Built around the lyric “I’m removing access to me,” it turns a lived experience of manipulation and self-doubt into direct contemporary pop about choosing peace, self-respect and freedom.","current_single_hero_copy":"Set Free is the turning point. It is the sound of choosing peace, restoring boundaries and reclaiming your own direction.","spotify_link":"https://open.spotify.com/track/6TzrIFIkFu5HNyZGM4RmqG","apple_music_link":"https://music.apple.com/au/album/set-free/6810393345?i=6810393349","other_links":[{"platform":"Spotify","url":"https://open.spotify.com/track/6TzrIFIkFu5HNyZGM4RmqG"},{"platform":"Spotify single","url":"https://open.spotify.com/album/4iYpXDouz4oi33IUgrrx0T"},{"platform":"Apple Music","url":"https://music.apple.com/au/album/set-free/6810393345?i=6810393349"},{"platform":"All platforms","url":"https://too.fm/setfree_gannonwaye"}],"is_published":true,"publishing_safe":true,"status":"released","public_release_approval_status":"approved"};
async function previewRelease(page, records=[fixture]) {
 await page.route('**/src/api/base44Client.js*',async route=>{
   const response=await route.fetch();
   const source=await response.text();
   const needle="const data = entityMockData[entityName] || [];";
   if(!source.includes(needle))throw new Error('Local fixture injection point changed');
   await route.fulfill({response,body:source.replace(needle,'const data = entityName === "Release" ? '+JSON.stringify(records)+' : (entityMockData[entityName] || []);')});
 });
 await page.addInitScript(()=>{localStorage.setItem('gw_onboarding_seen','true');});
}

const HEART='https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/07efd5c33_SetFree_heart_760.png';
test('compact galaxy composition preserves original face, links and connected coaching',async({page},info)=>{
 await previewRelease(page);
 const blocked=[];
 page.on('request',r=>{if(/checkout.stripe.com|functions\/(createCheckoutSession|createJournalCheckout|downloadJournal)/.test(r.url()))blocked.push(r.url());});
 await page.goto('/?home-preview=galaxy');
 const opening=page.getByTestId('home-opening');
 await expect(page.getByTestId('compact-home-welcome')).toBeVisible();
 await expect(page.getByTestId('galaxy-depth-heart')).toHaveAttribute('src',HEART);
 await expect.poll(()=>page.getByTestId('galaxy-depth-heart').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
 await expect.poll(()=>page.getByTestId('galaxy-depth-backdrop').locator('img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
 expect(await page.getByTestId('galaxy-depth-heart').evaluate(img=>getComputedStyle(img).objectFit)).toBe('contain');
 expect(await page.getByTestId('galaxy-depth-heart').evaluate(img=>getComputedStyle(img).filter)).toBe('none');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const hero=await page.getByTestId('compact-galaxy-hero').boundingBox();
 const coaching=await page.getByTestId('compact-home-coaching').boundingBox();
 expect(Math.abs(coaching.y-hero.y-hero.height)).toBeLessThanOrEqual(2);
 const logo=await opening.getByRole('img',{name:'Gannon Waye Music',exact:true}).boundingBox();
 expect(Math.abs(logo.x+logo.width/2-page.viewportSize().width/2)).toBeLessThanOrEqual(2);
 if(info.project.name==='chromium'){
  const welcome=await page.getByTestId('compact-home-welcome').boundingBox();
  const planet=await page.getByTestId('compact-heart-planet').boundingBox();
  expect(welcome.x).toBeGreaterThan(planet.x);
  expect(hero.height).toBeLessThan(680);
 }
 await expect(opening.getByRole('link',{name:'Listen on Spotify',exact:true})).toHaveAttribute('href',fixture.spotify_link);
 await page.evaluate(()=>{for(const el of document.querySelectorAll('*'))if(getComputedStyle(el).position==='fixed')el.setAttribute('data-preview-fixed','true');});
 const hide=await page.addStyleTag({content:'[data-preview-fixed],[data-preview-fixed] *{visibility:hidden!important}'});
 await opening.screenshot({path:require('node:path').join(require('node:os').tmpdir(),'gw-galaxy-'+info.project.name+'.jpg'),type:'jpeg',quality:65});
 await hide.evaluate(el=>el.remove());
 await opening.getByRole('link',{name:'Explore the Journals',exact:true}).click();
 await expect(page.getByTestId('journal-shelf')).toBeVisible();
 await page.goBack();
 await page.getByTestId('home-opening').getByRole('link',{name:'Enquire about Coaching',exact:true}).click();
 await expect(page.getByRole('heading',{name:'One-on-one coaching',exact:true})).toBeVisible();
 expect(blocked).toEqual([]);
});
test('reduced motion disables float, orbit and parallax',async({page})=>{
 await previewRelease(page);await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/?home-preview=galaxy');
 await expect(page.getByTestId('galaxy-depth-stage')).toHaveAttribute('data-reduced-motion','true');
 await expect(page.getByTestId('galaxy-depth-stage')).toHaveAttribute('data-parallax','disabled');
 expect(await page.locator('.gw-depth-satellite').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 expect(await page.getByTestId('galaxy-depth-float').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
});
test('fine-pointer parallax only applies on suitable desktop screens',async({page},info)=>{
 await previewRelease(page);await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/?home-preview=galaxy');
 const stage=page.getByTestId('galaxy-depth-stage');
 if(info.project.name==='chromium'){
  await expect(stage).toHaveAttribute('data-parallax','enabled');
  const rect=await stage.boundingBox();
  await page.mouse.move(rect.x+rect.width*.9,rect.y+rect.height*.9);
  await expect.poll(()=>page.getByTestId('galaxy-depth-foreground').evaluate(el=>getComputedStyle(el).transform)).not.toBe('none');
 }else await expect(stage).toHaveAttribute('data-parallax','disabled');
});
