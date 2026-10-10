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
  await page.screenshot({path:require('path').join(require('os').tmpdir(), 'gw-coaching-metallic-service-'+testInfo.project.name+'.jpg'),fullPage:true,type:'jpeg',quality:55});
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

test('newspaper story follows the central fan contour and reports column balance', async ({ page }, testInfo) => {
  await page.goto('/coaching');await page.evaluate(()=>document.fonts.ready);
  const story=page.getByTestId('coaching-story-newspaper'),fan=page.getByTestId('coaching-original-fan');
  await expect(story.locator('[data-testid^="coaching-approved-"]')).toHaveCount(7);
  const stage=await fan.boundingBox(),article=await story.boundingBox(),education=await page.getByTestId('coaching-approved-recovery').boundingBox();
  const geometry=await story.evaluate(element=>{
    const lines=Array.from(element.querySelectorAll('[data-testid^="coaching-approved-"]')).flatMap(p=>{
      const range=document.createRange();range.selectNodeContents(p);
      return Array.from(range.getClientRects()).map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom}));
    });
    const fan=element.querySelector('[data-testid="coaching-original-fan"]'),scale=fan.getBoundingClientRect().width/1080;
    const cards=Array.from(fan.querySelectorAll('.coaching-journal-rim')).map(card=>{
      const s=getComputedStyle(card),m=new DOMMatrix(s.transform),angle=Math.atan2(m.b,m.a),r=card.getBoundingClientRect();
      const w=(parseFloat(s.width)+parseFloat(s.borderLeftWidth)+parseFloat(s.borderRightWidth))*scale/2,h=(parseFloat(s.height)+parseFloat(s.borderTopWidth)+parseFloat(s.borderBottomWidth))*scale/2;
      return [[-w,-h],[w,-h],[w,h],[-w,h]].map(([x,y])=>({x:(r.left+r.right)/2+x*Math.cos(angle)-y*Math.sin(angle),y:(r.top+r.bottom)/2+x*Math.sin(angle)+y*Math.cos(angle)}));
    });
    return {viewport:innerWidth,lines,cards};
  });
  if(geometry.viewport>=1024){
    expect(education.y).toBeLessThan(stage.y);
    expect(Math.abs(stage.x+stage.width/2-(article.x+article.width/2))).toBeLessThan(1);
    const center=article.x+article.width/2,left=geometry.lines.filter(r=>(r.left+r.right)/2<center),right=geometry.lines.filter(r=>(r.left+r.right)/2>=center);
    const overlaps=(line,polygon)=>{
      const rect=[{x:line.left,y:line.top},{x:line.right,y:line.top},{x:line.right,y:line.bottom},{x:line.left,y:line.bottom}];
      for(const shape of [rect,polygon])for(let i=0;i<shape.length;i++){
        const a=shape[i],b=shape[(i+1)%shape.length],axis={x:-(b.y-a.y),y:b.x-a.x};
        const project=points=>points.map(p=>p.x*axis.x+p.y*axis.y),one=project(rect),two=project(polygon);
        if(Math.max(...one)<=Math.min(...two)||Math.max(...two)<=Math.min(...one))return false;
      }
      return true;
    };
    for(const line of geometry.lines)for(const polygon of geometry.cards)expect(overlaps(line,polygon)).toBe(false);
    const middle=rows=>rows.filter(r=>r.top>=stage.y+stage.height*.3&&r.bottom<=stage.y+stage.height*.8);
    expect(middle(left).length).toBeGreaterThan(0);expect(middle(right).length).toBeGreaterThan(0);
    expect(middle(left).some(r=>r.right<center-100)).toBe(true);
    expect(middle(right).some(r=>r.left>center+100)).toBe(true);
    const below=rows=>rows.filter(r=>r.top>stage.y+stage.height+40);
    expect(below(left).some(r=>r.right>stage.x+50)).toBe(true);
    expect(below(right).some(r=>r.left<stage.x+stage.width-50)).toBe(true);
    geometry.bottomDifference=Math.abs(Math.max(...left.map(r=>r.bottom))-Math.max(...right.map(r=>r.bottom)));
    expect(Number.isFinite(geometry.bottomDifference)).toBe(true);
  }else{
    const before=await page.getByTestId('coaching-approved-story').boundingBox();
    expect(before.y+before.height).toBeLessThanOrEqual(stage.y+1);
    expect(education.y).toBeGreaterThanOrEqual(stage.y+stage.height);
  }
  require('fs').writeFileSync(require('path').join(require('os').tmpdir(),'gw-coaching-service-layout-'+testInfo.project.name+'.json'),JSON.stringify({article,stage,...geometry}));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
