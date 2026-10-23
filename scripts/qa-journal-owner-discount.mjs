import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,extname} from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const root=resolve('.codex-worktrees/journal-checkout-live-frontend/dist');
const evidence=resolve('docs/journal-owner-discount-review-20261023');await mkdir(evidence,{recursive:true});
const server=createServer(async(req,res)=>{try{let path=join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!path.startsWith(root))throw Error('Bad path');try{if(!(await stat(path)).isFile())path=join(root,'index.html');}catch{path=join(root,'index.html');}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.svg':'image/svg+xml'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true});const receipts=[];
try{
 for(const size of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844}]){
  const context=await browser.newContext({viewport:{width:size.width,height:size.height}});let signed=false;const requests=[];
  await context.route('**/*',async route=>{
   const req=route.request(),url=new URL(req.url());
   if(url.pathname.includes('/files/mp/public/'))return route.continue();
   if(/\/api\/apps\//.test(url.pathname)){
    const path=url.pathname;requests.push({method:req.method(),path});
    if(path.endsWith('/functions/getJournalPurchases'))return route.fulfill({status:signed?200:401,json:signed?{purchases:[],pending:[],ownedBookIds:[],buyer:{email:'gannonwayemusic@gmail.com',verified:true,ownerTestEligible:true},offerTerms:{catalogueVersion:'gw_br11_hb10_singles_20261022',termsVersion:'gw_journal_mixed_delivery_v2_20261022'}}:{error:'sign_in_required'}});
    if(path.endsWith('/functions/createJournalCheckout')){
     const body=req.postDataJSON();assert.equal(body.action,'quote_owner_test');assert.deepEqual(body.offer_id,['building-resilience']);assert.equal(body.owner_test_code,'NunY@69Ony@Son!@');
     return route.fulfill({json:{status:'owner_test_quote',total_cents:99,base_total_cents:990,percent:90}});
    }
    if(path.endsWith('/entities/User/me'))return route.fulfill({status:signed?200:401,json:signed?{id:'fixture',email:'gannonwayemusic@gmail.com',is_verified:true,role:'user'}:{message:'Not authenticated'}});
    if(path.includes('/auth/')){
     if(path.endsWith('/register'))return route.fulfill({status:409,json:{message:'User already exists',code:'user_exists'}});
     if(path.endsWith('/login')){signed=true;return route.fulfill({json:{access_token:'SYNTHETIC_LOCAL_ONLY',token_type:'bearer',user:{id:'fixture',email:'gannonwayemusic@gmail.com',is_verified:true}}});}
     if(path.endsWith('/me'))return route.fulfill({status:signed?200:401,json:signed?{id:'fixture',email:'gannonwayemusic@gmail.com',is_verified:true,role:'user'}:{message:'Not authenticated'}});
     return route.fulfill({json:{}});
    }
    return route.fulfill({json:path.includes('/entities/')?[]:{}});
   }
   if(url.hostname==='127.0.0.2')return route.fulfill({response:await route.fetch({url:base+url.pathname+url.search})});
   if(url.hostname==='127.0.0.1')return route.continue();
   if(req.resourceType()==='image'||req.resourceType()==='font'||req.resourceType()==='stylesheet')return route.continue();
   return route.abort();
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base.replace('127.0.0.1','127.0.0.2')+'/coaching?view=journals&journal=building-resilience',{waitUntil:'domcontentloaded'});
  const panel=page.getByTestId('journal-purchase-panel');try{await panel.waitFor({timeout:8000});}catch(e){console.log(JSON.stringify({url:page.url(),title:await page.title(),body:(await page.locator('body').innerText()).slice(0,2000),errors,requests}));throw e;}
  await panel.getByRole('heading',{name:'Sign in or create your journal account'}).waitFor();
  assert.equal(await panel.getByText('First name',{exact:true}).count(),0);
  await panel.getByRole('button',{name:'Create a journal account',exact:true}).click();
  await panel.getByLabel('Email address',{exact:true}).fill('gannonwayemusic@gmail.com');
  await panel.getByLabel('Password',{exact:true}).fill('SyntheticFixtureOnly123!');
  await panel.getByRole('button',{name:'Create account',exact:true}).click();
  await panel.getByText('An account already exists for this email. Choose Sign in below to continue.',{exact:true}).waitFor();
  await page.screenshot({path:join(evidence,size.name+'-inline-account.png'),fullPage:false});
  await panel.getByRole('button',{name:'Sign in',exact:true}).last().click();
  await panel.getByRole('button',{name:'Sign in',exact:true}).first().click();
  try{await panel.getByText('Step 2 · Enter your buyer details.',{exact:false}).waitFor({timeout:10000});}catch(error){console.log(JSON.stringify({requests,signed,panelText:await panel.innerText()}));throw error;}
  await panel.getByLabel('First name',{exact:true}).fill('Synthetic');
  await panel.getByLabel('Last name',{exact:true}).fill('Fixture');
  await panel.getByLabel('Date of birth',{exact:true}).fill('1990-01-01');
  await panel.getByLabel('Phone number',{exact:true}).fill('+61400000000');
  await panel.getByLabel('Owner test code',{exact:true}).fill('NunY@69Ony@Son!@');
  await panel.getByRole('button',{name:'Apply owner test code',exact:true}).click();
  await panel.getByTestId('journal-selection-total').getByText('Total: A$0.99',{exact:true}).waitFor();
  assert.equal(await panel.getByRole('button',{name:'Buy selected journals',exact:true}).isEnabled(),false);
  await panel.getByRole('checkbox',{name:/I have read and agree/}).check();
  await panel.getByRole('checkbox',{name:/I understand that these journals/}).check();
  assert.equal(await panel.getByRole('button',{name:'Buy selected journals',exact:true}).isEnabled(),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:join(evidence,size.name+'-owner99-ready.png'),fullPage:false});
  assert.equal(errors.length,0,JSON.stringify(errors));
  assert.equal(requests.filter(x=>x.path.endsWith('/functions/createJournalCheckout')).length,1);
  receipts.push({viewport:size,inlineExistingAccountError:true,sameDialogSignIn:true,buyerFieldsOnlyAfterVerifiedLookup:true,selectedTitlePreserved:true,ownerQuote99:true,acknowledgementsInitiallyUnchecked:true,noCheckoutCreated:true,noPayment:true,noHorizontalOverflow:true,pageErrors:errors});
  await page.getByTestId('journal-close').click();
  const cards=await page.getByTestId('journal-shelf').locator(':scope > button').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect(),im=node.querySelector('img').getBoundingClientRect();return {id:node.getAttribute('data-testid'),availability:node.getAttribute('data-availability'),x:r.x,y:r.y,width:r.width,height:r.height,imageHeight:im.height};}));
  assert.deepEqual(cards.slice(0,2).map(c=>c.id),['journal-cover-building-resilience','journal-cover-healthy-boundaries']);
  assert.ok(cards.slice(0,2).every(c=>c.availability==='available'));assert.ok(cards.slice(2).every(c=>c.availability==='upcoming'));
  if(size.name==='desktop'){assert.equal(Math.round(cards[0].y),Math.round(cards[1].y));assert.ok(cards.slice(2).every(c=>Math.round(c.y)===Math.round(cards[2].y)));assert.ok(cards[2].y>cards[0].y);assert.ok(cards[0].imageHeight>cards[2].imageHeight);}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.getByTestId('journal-shelf').scrollIntoViewIfNeeded();await page.screenshot({path:join(evidence,size.name+'-available-first-shelf.png'),fullPage:false});
  receipts.at(-1).availableFirst=true;receipts.at(-1).responsiveShelf=cards;
  await context.close();
 }
 await writeFile(join(evidence,'visual-functional-fixture-receipt.json'),JSON.stringify({checkedAt:new Date().toISOString(),scope:'isolated synthetic browser fixtures, no actual sign-in, order or email',receipts},null,2));
 console.log(JSON.stringify({status:'passed',views:receipts.length,evidence,screenshots:6,noRealAuthPaymentOrEmail:true}));
}finally{await browser.close();await new Promise(r=>server.close(r));}