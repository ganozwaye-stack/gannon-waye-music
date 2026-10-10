const {test,expect}=require('@playwright/test');
test('recovery shows original boutique and verified catalogue without fabricated failure',async({page},info)=>{
 let paymentRequests=0;
 await page.route('**/functions/createCheckoutSession',route=>{paymentRequests++;return route.abort();});
 await page.goto('/store');
 await expect(page.getByTestId('store-page')).toBeVisible();
 await expect(page.getByTestId('locked-storefront-world')).toBeVisible();
 await expect(page.getByTestId('store-checkout-notice')).toContainText('Checkout is temporarily unavailable');
 await expect(page.getByTestId('product-card')).toHaveCount(3);
 const text=await page.locator('body').innerText();
 expect(text).not.toContain('500 — Internal Server Error');
 expect(text).not.toContain('storefront worker failed');
 expect(await page.getByTestId('product-card').allTextContents()).not.toEqual(expect.arrayContaining([expect.stringContaining('Set Free Heart Hoodie')]));
 expect(await page.getByTestId('product-card').allTextContents()).not.toEqual(expect.arrayContaining([expect.stringContaining('Without You Here Hoodie')]));
 const hoodie=page.getByTestId('product-card').filter({hasText:'Hoodie'}).first();
 await expect(hoodie.getByTestId('product-price')).toContainText('$98');
 await hoodie.getByRole('button',{name:/^Select size M/}).click();
 await hoodie.getByTestId('add-to-cart-btn').click();
 await expect(hoodie.getByTestId('add-to-cart-success')).toBeVisible();
 expect(paymentRequests).toBe(0);
 await page.addStyleTag({content:'[class*="fixed"]{display:none!important}'});
 await page.screenshot({path:require('os').tmpdir()+'/gw-store-recovered-'+info.project.name+'.jpg',type:'jpeg',quality:60,fullPage:true});
});
test('all existing transaction routes stay held without payment requests',async({page})=>{
 let calls=0;
 await page.route('**/functions/createCheckoutSession',route=>{calls++;return route.abort();});
 for(const route of ['/store/cart','/store/cart-details','/store/checkout']){
  await page.goto(route);
  await expect(page.getByTestId('store-checkout-hold')).toBeVisible();
  await expect(page.getByRole('heading',{name:'Checkout is temporarily unavailable'})).toBeVisible();
  expect(await page.locator('body').innerText()).not.toContain('500 — Internal Server Error');
 }
 expect(calls).toBe(0);
});
