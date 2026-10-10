const {test,expect}=require('@playwright/test');
test('production intake hold blocks both button and direct form submission',async({page})=>{
 test.skip(process.env.PRODUCTION_HOLD!=='1','Run against an isolated local production build');
 let requests=0;await page.route('**/functions/submitCoachingInterest',route=>{requests++;return route.fulfill({json:{saved:true}});});
 await page.goto('/coaching?view=coaching');
 const form=page.getByTestId('coaching-interest-form');
 for(const [label,value]of [['First name','Test'],['Last name','Person'],['Date of birth','2000-02-29'],['Mobile number','+61 400 123 456'],['Email address','test@example.invalid'],['What brings you here, and what would you like support with?','Private preview only.']])await page.getByLabel(label+' *',{exact:true}).fill(value);
 await page.getByLabel('Gannon may contact me about my interest.').check();
 await expect(form.getByRole('button',{name:'Register your interest',exact:true})).toBeDisabled();
 await form.evaluate(node=>node.requestSubmit());
 await expect(page.getByRole('alert')).toHaveText('Registration is being prepared. No details have been submitted.');
 expect(requests).toBe(0);await expect(page.getByTestId('coaching-interest-success')).toHaveCount(0);
});
