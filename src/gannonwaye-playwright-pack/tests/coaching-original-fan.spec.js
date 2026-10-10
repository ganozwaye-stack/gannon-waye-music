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
  await page.screenshot({path:require('path').join(require('os').tmpdir(), 'gw-coaching-metallic-central-'+testInfo.project.name+'.jpg'),fullPage:true,type:'jpeg',quality:55});
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

test('newspaper story renders two symmetric columns around a central display with linear phone order', async ({ page }, testInfo) => {
  await page.goto('/coaching');
  await page.evaluate(()=>document.fonts.ready);
  const story=page.getByTestId('coaching-story-newspaper'),fan=page.getByTestId('coaching-original-fan');
  await expect(story.locator('[data-testid^="coaching-approved-"]')).toHaveCount(7);
  const stage=await fan.boundingBox(), article=await story.boundingBox();
  const geometry=await story.evaluate(element=>{
    const lines=column=>Array.from(element.querySelectorAll(column+' p')).flatMap(p=>{
      const range=document.createRange();range.selectNodeContents(p);
      return Array.from(range.getClientRects()).map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom}));
    });
    return {viewport:innerWidth,left:lines('.coaching-story-left'),right:lines('.coaching-story-right'),columns:getComputedStyle(element).gridTemplateColumns};
  });
  if(geometry.viewport>=1024){
    expect(Math.abs(stage.x+stage.width/2-(article.x+article.width/2))).toBeLessThan(1);
    const leftColumn=await page.getByTestId('coaching-story-left').boundingBox(),rightColumn=await page.getByTestId('coaching-story-right').boundingBox();
    expect(Math.abs(leftColumn.y-rightColumn.y)).toBeLessThan(1);
    const middle=rows=>rows.filter(r=>r.top>=stage.y+stage.height*.35&&r.bottom<=stage.y+stage.height*.75);
    expect(middle(geometry.left).length).toBeGreaterThan(0);expect(middle(geometry.right).length).toBeGreaterThan(0);
    for(const line of middle(geometry.left))expect(line.right).toBeLessThan(stage.x-8);
    for(const line of middle(geometry.right))expect(line.left).toBeGreaterThan(stage.x+stage.width+8);
    const below=rows=>rows.filter(r=>r.top>stage.y+stage.height+64);
    expect(below(geometry.left).some(r=>r.right>stage.x+50)).toBe(true);
    expect(below(geometry.right).some(r=>r.left<stage.x+stage.width-50)).toBe(true);
  }else{
    const before=await page.getByTestId('coaching-approved-story').boundingBox(),after=await page.getByTestId('coaching-approved-recovery').boundingBox();
    expect(before.y+before.height).toBeLessThanOrEqual(stage.y+1);
    expect(after.y).toBeGreaterThanOrEqual(stage.y+stage.height);
  }
  require('fs').writeFileSync(require('path').join(require('os').tmpdir(),'gw-coaching-central-layout-'+testInfo.project.name+'.json'),JSON.stringify({article,stage,...geometry}));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
