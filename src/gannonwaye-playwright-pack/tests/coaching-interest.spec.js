const {test,expect}=require('@playwright/test');
async function fill(page) {
 for(const [label,value] of [['First name','Test'],['Last name','Person'],['Date of birth','2000-02-29'],['Mobile number','+61 400 123 456'],['Email address','test@example.invalid'],['What brings you here, and what would you like support with?','I would like to explore journals and coaching.']]) await page.getByLabel(label+' *',{exact:true}).fill(value);
 await page.getByLabel('Gannon may contact me about my interest.').check();
}
test('required private interest form saves only after a matching receipt and prevents repeat handlers',async({page})=>{
 let calls=0,payload;
 await page.route('**/functions/submitCoachingInterest',async route=>{calls++;payload=route.request().postDataJSON();await new Promise(resolve=>setTimeout(resolve,150));await route.fulfill({json:{saved:true,receipt:payload.submission_id}});});
 await page.goto('/coaching?view=coaching');
 await expect(page.getByTestId('coaching-interest-form')).toBeVisible();
 await page.evaluate(()=>{for(const el of document.querySelectorAll('body *'))if(['fixed','sticky'].includes(getComputedStyle(el).position))el.setAttribute('data-review-fixed','');});
 const reviewStyle=await page.addStyleTag({content:'[data-review-fixed]{display:none!important}'});
 await page.getByTestId('coaching-interest-form').screenshot({path:require('path').join(require('os').tmpdir(),'gw-interest-preview-'+test.info().project.name+'.jpg'),type:'jpeg',quality:55});
 await reviewStyle.evaluate(el=>el.remove());
 await page.evaluate(()=>document.querySelectorAll('[data-review-fixed]').forEach(el=>el.removeAttribute('data-review-fixed')));
 await fill(page);
 await page.getByRole('button',{name:'Register your interest',exact:true}).dblclick();
 await expect(page.getByTestId('coaching-interest-success')).toBeVisible();
 expect(calls).toBe(1);expect(payload).toHaveProperty('date_of_birth','2000-02-29');
 await expect(page.getByText('This is not an appointment booking or a payment.',{exact:false})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('failed or missing saved receipt never shows registration success',async({page})=>{
 await page.route('**/functions/submitCoachingInterest',route=>route.fulfill({json:{saved:false}}));
 await page.goto('/coaching?view=coaching');await fill(page);
 await page.getByRole('button',{name:'Register your interest',exact:true}).click();
 await expect(page.getByRole('alert')).toBeVisible();
 await expect(page.getByTestId('coaching-interest-success')).toHaveCount(0);
});
test('blank required details and future birth date do not send requests',async({page})=>{
 let calls=0;await page.route('**/functions/submitCoachingInterest',route=>{calls++;return route.fulfill({json:{}});});
 await page.goto('/coaching?view=coaching');
 await page.getByRole('button',{name:'Register your interest',exact:true}).click();expect(calls).toBe(0);
 await fill(page);await page.getByLabel('Date of birth *',{exact:true}).fill('2099-01-01');
 await page.getByRole('button',{name:'Register your interest',exact:true}).click();expect(calls).toBe(0);
});
