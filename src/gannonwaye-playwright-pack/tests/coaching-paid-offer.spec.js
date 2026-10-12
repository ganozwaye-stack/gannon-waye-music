const {test,expect}=require('@playwright/test');
test('paid offer reaches specific availability enquiry without booking or charging',async({page},info)=>{
 let writes=0;
 await page.route('**/functions/**',route=>{if(route.request().method()!=='GET'){writes++;return route.abort();}return route.continue();});
 await page.goto('/coaching?view=coaching',{waitUntil:'domcontentloaded'});
 const card=page.getByTestId('paid-consultation-offer');
 await expect(card).toContainText('A$99');await expect(card).toContainText('45 minutes');
 await expect(card).toContainText('An enquiry is not a confirmed booking');
 await expect(page.getByText(/first three appointments total A\$198/)).toBeVisible();
 await expect(page.getByText(/ten-session package is A\$850/)).toBeVisible();
 expect(await card.innerText()).not.toContain('free');
 await page.getByTestId('coaching-request-availability').click();
 await expect(page).toHaveURL(/\/contact\?topic=coaching$/);
 await expect(page.getByTestId('coaching-contact-request')).toBeVisible();
 const href=await page.getByTestId('coaching-email-link').getAttribute('href');
 expect(href).toMatch(/^mailto:gannonwayemusic@gmail.com\?/);
 expect(decodeURIComponent(href)).toContain('A$99, 45-minute paid initial consultation');
 expect(decodeURIComponent(href)).not.toMatch(/date.of.birth|diagnos|medical/);
 await expect(page.getByText('Opening your email app does not send a message or reserve an appointment.',{exact:false})).toBeVisible();
 expect(writes).toBe(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.addStyleTag({content:'[class*="fixed"]{display:none!important}'});
 await page.getByTestId('coaching-contact-request').screenshot({path:require('os').tmpdir()+'/gw-paid-consultation-contact-'+info.project.name+'.jpg',type:'jpeg',quality:60});
});
test('home contact route exposes coaching and footer accurately describes paused signup',async({page})=>{
 await page.goto('/contact',{waitUntil:'domcontentloaded'});
 await expect(page.getByTestId('contact-coaching-offer')).toHaveAttribute('href','/coaching?view=coaching');
 const footer=page.locator('footer');
 await expect(footer).toContainText('Email signup is temporarily paused.');
 await expect(footer.getByRole('link',{name:'View update-list status'})).toHaveAttribute('href','/#updates');
 await expect(footer.getByRole('link',{name:'Join the Update List'})).toHaveCount(0);
});

test('paid offer and held original books remain independent choices',async({page})=>{
 let paymentCalls=0;
 await page.route('**/functions/**',route=>{paymentCalls++;return route.abort();});
 await page.goto('/coaching?view=coaching',{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'Back to the choices',exact:true}).click();
 await page.getByRole('button',{name:'Explore the Journals',exact:true}).click();
 await expect(page.getByTestId('journal-shelf')).toBeVisible();
 await expect(page.locator('[data-testid^="journal-cover-"]')).toHaveCount(6);
 await page.getByTestId('journal-cover-choosing-yourself').click();
 const modal=page.getByTestId('journal-preview-modal');
 await expect(modal.getByTestId('journal-sample-question')).toHaveCount(1);
 await expect(modal.getByRole('button',{name:'Purchase',exact:true})).toBeDisabled();
 await expect(modal).toContainText('Online purchasing is being prepared');
 await expect(modal.getByRole('button',{name:'Access your purchased journal'})).toHaveCount(0);
 expect(paymentCalls).toBe(0);
});
