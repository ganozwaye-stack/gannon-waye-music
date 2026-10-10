const {test,expect}=require('@playwright/test');
test('public page and CTA telemetry strips personal query values and intake details',async({page})=>{
 const events=[];
 await page.addInitScript(()=>{window.__safeEvents=[];window.gtag=(name,event,props)=>window.__safeEvents.push({event,props});});
 await page.route('**/functions/submitCoachingInterest',route=>{const body=route.request().postDataJSON();return route.fulfill({json:{saved:true,receipt:body.submission_id}});});
 await page.goto('/coaching?utm_source=instagram&utm_campaign=journal_october&email=PRIVATE_EMAIL&message=PRIVATE_HEALTH');
 await page.getByRole('button',{name:'Enquire about Coaching',exact:true}).click();
 await expect(page.getByTestId('coaching-interest-form')).toBeVisible();
 const recorded=await page.evaluate(()=>({events:window.__safeEvents,source:sessionStorage.getItem('gw_recorded_source')}));
 expect(JSON.stringify(recorded)).not.toContain('PRIVATE');
 expect(recorded.events.filter(e=>e.event==='coaching_cta')).toHaveLength(1);
 const viewed=recorded.events.filter(e=>e.event==='page_view');expect(viewed).toHaveLength(1);
 expect(JSON.parse(recorded.source).first).toEqual({source:'instagram',medium:'',campaign:'journal_october'});
 expect(JSON.parse(recorded.source).last.source).toBe('instagram');
});
test('explicit test traffic produces no shared telemetry',async({page})=>{
 await page.addInitScript(()=>{window.__safeEvents=[];window.gtag=(name,event,props)=>window.__safeEvents.push({event,props});});
 await page.goto('/coaching?analytics_test=1');
 await page.getByRole('button',{name:'Enquire about Coaching',exact:true}).click();
 expect(await page.evaluate(()=>window.__safeEvents)).toEqual([]);
});
