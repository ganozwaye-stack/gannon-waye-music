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
for(let option=1;option<=5;option++)test('homepage concept '+option+' has verified release, welcome and functional coaching choices',async({page},testInfo)=>{
 await previewRelease(page);
 const requests=[];
 page.on('request',request=>{if(/checkout\.stripe\.com|\/functions\/(createCheckoutSession|createJournalCheckout|downloadJournal|confirmJournalPurchase)/.test(request.url()))requests.push(request.url());});
 await page.goto('/?home-preview='+option);
 const opening=page.getByTestId('home-opening');
 await expect(opening).toHaveAttribute('data-option',String(option));
 await expect(opening.getByRole('heading',{name:'Set Free',exact:true})).toBeVisible();
 await expect(opening.getByText('Gannon Waye · Released 25 September 2026')).toBeVisible();
 await expect(opening.getByRole('heading',{name:'I’m Gannon Waye. I’m glad you’re here.',exact:true})).toBeVisible();
 await expect(opening.getByRole('heading',{name:'Start with what matters to you.',exact:true})).toBeVisible();
 await expect(opening.getByRole('link',{name:'Listen on Spotify',exact:true})).toHaveAttribute('href',fixture.spotify_link);
 await expect(opening.getByRole('link',{name:'Apple Music',exact:true})).toHaveAttribute('href',fixture.apple_music_link);
 await expect(opening.getByRole('link',{name:'All platforms',exact:true})).toHaveAttribute('href',fixture.other_links.find(x=>x.platform==='All platforms').url);
 await expect(page.getByTestId('home-release-cover')).toHaveAttribute('src',fixture.artwork_url);
 await expect(page.getByTestId('home-release-cover')).toHaveJSProperty('naturalWidth',expect.any(Number));
 await expect.poll(()=>page.getByTestId('home-release-cover').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await expect(opening).not.toContainText(/pre.?save/i);
 if(testInfo.project.name==='chromium')await opening.screenshot({path:'/tmp/gw-home-concept-'+option+'.jpg',type:'jpeg',quality:50});
 await opening.getByRole('link',{name:'Explore the Journals',exact:true}).click();
 await expect(page.getByTestId('journal-shelf')).toBeVisible();
 await page.goBack();
 await page.getByTestId('home-opening').getByRole('link',{name:'Enquire about Coaching',exact:true}).click();
 await expect(page.getByRole('heading',{name:'One-on-one coaching',exact:true})).toBeVisible();
 expect(requests).toEqual([]);
});
test('default homepage preserves the existing hero',async({page})=>{
 await previewRelease(page);
 await page.goto('/');
 await expect(page.getByTestId('home-opening')).toHaveCount(0);
 await expect(page.getByRole('region',{name:'Set Free, the new single, out now',exact:true})).toBeVisible();
});
test('preview fails closed when the release is held',async({page})=>{
 await previewRelease(page,[{...fixture,public_release_approval_status:'pending'}]);
 await page.goto('/?home-preview=1');
 const opening=page.getByTestId('home-opening');
 await expect(opening.getByRole('heading',{name:'Set Free',exact:true})).toHaveCount(0);
 await expect(opening.getByRole('link',{name:'Listen on Spotify',exact:true})).toHaveCount(0);
 await expect(page.getByTestId('home-release-cover')).toHaveCount(0);
});
