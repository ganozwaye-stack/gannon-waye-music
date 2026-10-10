const { test, expect } = require('@playwright/test');
test('original fan decodes six full covers and fits within the story', async ({ page }, testInfo) => {
  await page.goto('/coaching');
  const fan = page.getByTestId('coaching-original-fan');
  await expect(fan).toBeVisible();
  await expect(fan.getByTestId('coaching-fan-cover')).toHaveCount(6);
  await expect.poll(() => fan.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth === 1042 && image.naturalHeight === 1474))).toBe(true);
  const boxes = await fan.locator('img').evaluateAll(images => images.map(image => {const r = image.getBoundingClientRect(); return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};}));
  const stage = await fan.boundingBox();
  for (const box of boxes) {
    expect(box.left).toBeGreaterThanOrEqual(stage.x - 1);
    expect(box.right).toBeLessThanOrEqual(stage.x + stage.width + 1);
    expect(box.top).toBeGreaterThanOrEqual(stage.y - 1);
    expect(box.bottom).toBeLessThanOrEqual(stage.y + stage.height + 1);
  }
  const intro = await page.getByTestId('coaching-approved-intro').boundingBox();
  expect(intro.y + intro.height).toBeLessThan(stage.y);
  const choice = await page.getByRole('button', {name:'Explore the Journals',exact:true}).boundingBox();
  expect(choice.y + choice.height).toBeLessThan(stage.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.addStyleTag({content:'[class*="fixed"] { display:none !important; }'});
  await page.screenshot({path:require('path').join(require('os').tmpdir(), 'gw-coaching-original-fan-'+testInfo.project.name+'.jpg'),fullPage:true,type:'jpeg',quality:55});
});

test('metallic display keeps cover pixels unfiltered and stays still with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/coaching');
  const fan=page.getByTestId('coaching-original-fan');
  await expect(fan.getByTestId('coaching-display-base')).toBeVisible();
  await expect(fan.locator('.coaching-journal-rim')).toHaveCount(6);
  await expect(fan.locator('.coaching-edge-glint')).toHaveCount(6);
  const properties=await fan.locator('img').evaluateAll(images=>images.map(image=>{
    const style=getComputedStyle(image),rim=getComputedStyle(image.parentElement);
    return {filter:style.filter,opacity:style.opacity,background:rim.backgroundImage,shadow:rim.boxShadow,animation:rim.animationName};
  }));
  for(const p of properties){
    expect(p.filter).toBe('none');expect(p.opacity).toBe('1');
    expect(p.background).toContain('linear-gradient');expect(p.shadow).not.toBe('none');expect(p.animation).toBe('none');
  }
  expect(await fan.evaluate(element=>element.getAnimations({subtree:true}).length)).toBe(0);
});

test('newspaper story wraps on desktop and flows around the display on phone', async ({ page }) => {
  await page.goto('/coaching');
  const story=page.getByTestId('coaching-story-newspaper'),fan=page.getByTestId('coaching-original-fan');
  await expect(story.locator('[data-testid^="coaching-approved-"]')).toHaveCount(7);
  const fanBox=await fan.boundingBox();
  const training=await page.getByTestId('coaching-approved-story').boundingBox();
  expect(training.y+training.height).toBeLessThan(fanBox.y+1);
  const flow=await fan.evaluate(element=>({float:getComputedStyle(element).float,viewport:innerWidth}));
  const education=page.getByTestId('coaching-approved-recovery');
  if(flow.viewport>=768){
    expect(flow.float).toBe('right');
    const firstLine=await education.evaluate(element=>{
      const range=document.createRange();range.setStart(element.firstChild,0);range.setEnd(element.firstChild,30);
      return Array.from(range.getClientRects()).map(r=>({left:r.left,right:r.right,top:r.top}));
    });
    expect(firstLine[0].right).toBeLessThan(fanBox.x-16);
    expect(firstLine[0].top).toBeLessThan(fanBox.y+fanBox.height);
  }else{
    expect(flow.float).toBe('none');
    const educationBox=await education.boundingBox();
    expect(educationBox.y).toBeGreaterThanOrEqual(fanBox.y+fanBox.height);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
