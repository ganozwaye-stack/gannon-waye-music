# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-recovery.spec.js >> recovery shows original boutique and verified catalogue without fabricated failure
- Location: src/gannonwaye-playwright-pack/tests/store-recovery.spec.js:2:1

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "Set Free Heart Hoodie"
Received string:        "The collection is available to browse. Checkout is temporarily unavailable while payment checks are completed.

THE SINGLE · OUT NOW

SET FREE

CARRY THE MESSAGE

The Set Free collection is here. Every piece carries the message of the single, so what you wear says what you feel.

SHOP THE COLLECTION

THE SET FREE MERCH HAS DROPPED · SHOP IT BELOW

AVAILABLE NOW

Shop the collection

Everything here is in stock and ready to ship within Australia.

Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.

MERCH
AVAILABLE NOW

\"Respect Is Earned\" Hoodie — Dark Grey

$98 AUD

Available in S, M, L and XL. Delivery is calculated before payment.

COMPLETE THE SET

Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.

This item
$98 AUD
Winter Writing & Comfort Bundle
$119 AUD
View the Winter Writing & Comfort Bundle

SELECT SIZE

S (3)
M (4)
L (5)
XL (2)
ADD TO CART
IN STOCK

Respect Is Earned Journal, Pen and Thermos Gift Box Bundle

$59 AUD

Journal, matching pen and thermos presented as one complete gift box set. Delivery is calculated before payment.

COMPLETE THE SET

Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.

This item
$59 AUD
Winter Writing & Comfort Bundle
$119 AUD
View the Winter Writing & Comfort Bundle
ADD TO CART
IN STOCK

Winter Writing & Comfort Bundle

$119 AUD

SELECT SIZE

S (3)
M (4)
L (5)
XL (2)
ADD TO CART

EXPRESSIONS OF INTEREST

Vote for what you'd buy

These are concept designs, not yet for sale. Vote for the pieces you would actually buy and the most loved ones get made first.

Thank You Hoodie, Signed

Front and back print with the gold signature.

I'D BUY THIS
Thank You Hoodie, Clean

Respect Is Earned back print, clean front.

I'D BUY THIS
Thank You Hoodie, No Signature

The same design without the signature marks.

I'D BUY THIS
Set Free Heart Hoodie

Gold filigree heart and lyric on the back.

I'D BUY THIS
Set Free Minimal Hoodie

Subtle gold Set Free chest print and orbit.

I'D BUY THIS
Set Free Heart Tee

Broken gold heart with the Set Free lyric.

I'D BUY THIS
Set Free Tote Bag

Natural canvas tote with the broken heart artwork.

I'D BUY THIS
Set Free Journal

Hardcover journal with gold foil broken heart.

I'D BUY THIS
Thankyou Complete Set

Hoodie, mug, journal, pen, thermos and gift box.

I'D BUY THIS

Votes go straight to Gannon, privately. Nothing is ever shown publicly.

Independent music, merchandise, and community support.

Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.

NAVIGATE
Home
Biography
Music
Lyrics
Store
Press
Mum Tribute
Contact
CONTACT

For music, media, collaboration, and business enquiries

gannonwayemusic@gmail.com
LEGAL
Privacy Policy
Terms of Service
SOCIAL
Instagram @gann0nwaye
TikTok @gann0nwaye
YouTube @gannonwayeofficial

STAY CONNECTED

Music and merchandise updates

One clear signup form, with explicit consent, is available on the home page.

JOIN THE UPDATE LIST

Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.

© 2026 Gannon Waye. All rights reserved.

HOME
MUSIC
STORE
LYRICS
CONTACT"
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "Gannon Waye · Home" [ref=e6] [cursor=pointer]:
        - /url: /
      - generic [ref=e7]:
        - button "Search the site" [ref=e8] [cursor=pointer]:
          - img [ref=e9]
        - button "Open cart" [ref=e12] [cursor=pointer]:
          - img [ref=e13]
        - button "Open navigation menu" [ref=e17] [cursor=pointer]:
          - img [ref=e18]
  - main [ref=e19]:
    - generic [ref=e20]:
      - region "Permanent Gannon Waye boutique world" [ref=e21]:
        - img "Gannon Waye Boutique, official merchandise store"
      - generic [ref=e22]:
        - status [ref=e23]: The collection is available to browse. Checkout is temporarily unavailable while payment checks are completed.
        - generic [ref=e25]:
          - generic [ref=e26]:
            - paragraph [ref=e27]: The Single · Out Now
            - heading "Set Free" [level=2] [ref=e28]
            - paragraph [ref=e29]: Carry the Message
            - paragraph [ref=e30]: The Set Free collection is here. Every piece carries the message of the single, so what you wear says what you feel.
            - link "Shop the Collection" [ref=e31] [cursor=pointer]:
              - /url: "#store-products"
              - text: Shop the Collection
              - img [ref=e32]
          - img "Set Free hoodie, cracked heart design" [ref=e35]
        - generic [ref=e36]:
          - img [ref=e37]
          - paragraph [ref=e39]: The Set Free merch has dropped · Shop it below
        - generic [ref=e40]:
          - paragraph [ref=e41]: Available now
          - heading "Shop the collection" [level=1] [ref=e42]
          - paragraph [ref=e45]: Everything here is in stock and ready to ship within Australia.
          - paragraph [ref=e46]: Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.
        - generic [ref=e48]: Merch
        - generic [ref=e50]:
          - generic [ref=e51]:
            - generic [ref=e52] [cursor=pointer]:
              - generic [ref=e53]:
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 1" [ref=e54]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 2" [ref=e55]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 3" [ref=e56]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 4" [ref=e57]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 5" [ref=e58]
                - generic [ref=e59]:
                  - button [ref=e60]
                  - button [ref=e61]
                  - button [ref=e62]
                  - button [ref=e63]
                  - button [ref=e64]
              - img [ref=e66]
              - generic [ref=e69]: Available Now
            - generic [ref=e70]:
              - paragraph [ref=e72]: "\"Respect Is Earned\" Hoodie — Dark Grey"
              - paragraph [ref=e73]: $98 AUD
              - paragraph [ref=e74]: Available in S, M, L and XL. Delivery is calculated before payment.
              - group "Complete the Set" [ref=e75]:
                - generic [ref=e76]: Complete the Set
                - paragraph [ref=e77]: Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.
                - generic [ref=e78]:
                  - generic [ref=e79] [cursor=pointer]:
                    - generic [ref=e80]:
                      - radio "This item $98 AUD" [checked] [ref=e81]
                      - generic [ref=e82]: This item
                    - generic [ref=e83]: $98 AUD
                  - generic [ref=e84] [cursor=pointer]:
                    - generic [ref=e85]:
                      - radio "Winter Writing & Comfort Bundle $119 AUD" [ref=e86]
                      - generic [ref=e87]: Winter Writing & Comfort Bundle
                    - generic [ref=e88]: $119 AUD
                - link "View the Winter Writing & Comfort Bundle" [ref=e89] [cursor=pointer]:
                  - /url: "#store-product-6a9a945016c72a1e3c04935f"
              - generic [ref=e90]:
                - paragraph [ref=e91]: Select size
                - generic [ref=e92]:
                  - button "Select size S, 3 in stock" [ref=e93] [cursor=pointer]: S (3)
                  - button "Select size M, 4 in stock" [ref=e94] [cursor=pointer]: M (4)
                  - button "Select size L, 5 in stock" [ref=e95] [cursor=pointer]: L (5)
                  - button "Select size XL, 2 in stock" [ref=e96] [cursor=pointer]: XL (2)
              - button "Add to Cart" [ref=e97] [cursor=pointer]:
                - img [ref=e98]
                - text: Add to Cart
          - generic [ref=e99]:
            - generic [ref=e100] [cursor=pointer]:
              - generic [ref=e101]:
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 1" [ref=e102]
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 2" [ref=e103]
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 3" [ref=e104]
                - generic [ref=e105]:
                  - button [ref=e106]
                  - button [ref=e107]
                  - button [ref=e108]
              - img [ref=e110]
              - generic [ref=e113]: In Stock
            - generic [ref=e114]:
              - paragraph [ref=e116]: Respect Is Earned Journal, Pen and Thermos Gift Box Bundle
              - paragraph [ref=e117]: $59 AUD
              - paragraph [ref=e118]: Journal, matching pen and thermos presented as one complete gift box set. Delivery is calculated before payment.
              - group "Complete the Set" [ref=e119]:
                - generic [ref=e120]: Complete the Set
                - paragraph [ref=e121]: Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.
                - generic [ref=e122]:
                  - generic [ref=e123] [cursor=pointer]:
                    - generic [ref=e124]:
                      - radio "This item $59 AUD" [checked] [ref=e125]
                      - generic [ref=e126]: This item
                    - generic [ref=e127]: $59 AUD
                  - generic [ref=e128] [cursor=pointer]:
                    - generic [ref=e129]:
                      - radio "Winter Writing & Comfort Bundle $119 AUD" [ref=e130]
                      - generic [ref=e131]: Winter Writing & Comfort Bundle
                    - generic [ref=e132]: $119 AUD
                - link "View the Winter Writing & Comfort Bundle" [ref=e133] [cursor=pointer]:
                  - /url: "#store-product-6a9a945016c72a1e3c04935f"
              - button "Add to Cart" [ref=e134] [cursor=pointer]:
                - img [ref=e135]
                - text: Add to Cart
          - generic [ref=e136]:
            - generic [ref=e137] [cursor=pointer]:
              - generic [ref=e138]:
                - img "Winter Writing & Comfort Bundle 1" [ref=e139]
                - img "Winter Writing & Comfort Bundle 2" [ref=e140]
                - generic [ref=e141]:
                  - button [ref=e142]
                  - button [ref=e143]
              - img [ref=e145]
              - generic [ref=e148]: In Stock
            - generic [ref=e149]:
              - paragraph [ref=e151]: Winter Writing & Comfort Bundle
              - paragraph [ref=e152]: $119 AUD
              - generic [ref=e153]:
                - paragraph [ref=e154]: Select size
                - generic [ref=e155]:
                  - button "Select size S, 3 in stock" [ref=e156] [cursor=pointer]: S (3)
                  - button "Select size M, 4 in stock" [ref=e157] [cursor=pointer]: M (4)
                  - button "Select size L, 5 in stock" [ref=e158] [cursor=pointer]: L (5)
                  - button "Select size XL, 2 in stock" [ref=e159] [cursor=pointer]: XL (2)
              - button "Add to Cart" [ref=e160] [cursor=pointer]:
                - img [ref=e161]
                - text: Add to Cart
        - region "Merch expression of interest vote" [ref=e163]:
          - generic [ref=e164]:
            - generic [ref=e165]:
              - paragraph [ref=e166]: Expressions of Interest
              - heading "Vote for what you'd buy" [level=2] [ref=e167]
              - paragraph [ref=e168]: These are concept designs, not yet for sale. Vote for the pieces you would actually buy and the most loved ones get made first.
            - generic [ref=e169]:
              - generic [ref=e170]:
                - img "Thank You Hoodie, Signed concept" [ref=e172]
                - generic [ref=e173]:
                  - heading "Thank You Hoodie, Signed" [level=3] [ref=e174]
                  - paragraph [ref=e175]: Front and back print with the gold signature.
                  - button "I'd buy this" [ref=e176] [cursor=pointer]:
                    - img [ref=e177]
                    - text: I'd buy this
              - generic [ref=e179]:
                - img "Thank You Hoodie, Clean concept" [ref=e181]
                - generic [ref=e182]:
                  - heading "Thank You Hoodie, Clean" [level=3] [ref=e183]
                  - paragraph [ref=e184]: Respect Is Earned back print, clean front.
                  - button "I'd buy this" [ref=e185] [cursor=pointer]:
                    - img [ref=e186]
                    - text: I'd buy this
              - generic [ref=e188]:
                - img "Thank You Hoodie, No Signature concept" [ref=e190]
                - generic [ref=e191]:
                  - heading "Thank You Hoodie, No Signature" [level=3] [ref=e192]
                  - paragraph [ref=e193]: The same design without the signature marks.
                  - button "I'd buy this" [ref=e194] [cursor=pointer]:
                    - img [ref=e195]
                    - text: I'd buy this
              - generic [ref=e197]:
                - img "Set Free Heart Hoodie concept" [ref=e199]
                - generic [ref=e200]:
                  - heading "Set Free Heart Hoodie" [level=3] [ref=e201]
                  - paragraph [ref=e202]: Gold filigree heart and lyric on the back.
                  - button "I'd buy this" [ref=e203] [cursor=pointer]:
                    - img [ref=e204]
                    - text: I'd buy this
              - generic [ref=e206]:
                - img "Set Free Minimal Hoodie concept" [ref=e208]
                - generic [ref=e209]:
                  - heading "Set Free Minimal Hoodie" [level=3] [ref=e210]
                  - paragraph [ref=e211]: Subtle gold Set Free chest print and orbit.
                  - button "I'd buy this" [ref=e212] [cursor=pointer]:
                    - img [ref=e213]
                    - text: I'd buy this
              - generic [ref=e215]:
                - img "Set Free Heart Tee concept" [ref=e217]
                - generic [ref=e218]:
                  - heading "Set Free Heart Tee" [level=3] [ref=e219]
                  - paragraph [ref=e220]: Broken gold heart with the Set Free lyric.
                  - button "I'd buy this" [ref=e221] [cursor=pointer]:
                    - img [ref=e222]
                    - text: I'd buy this
              - generic [ref=e224]:
                - img "Set Free Tote Bag concept" [ref=e226]
                - generic [ref=e227]:
                  - heading "Set Free Tote Bag" [level=3] [ref=e228]
                  - paragraph [ref=e229]: Natural canvas tote with the broken heart artwork.
                  - button "I'd buy this" [ref=e230] [cursor=pointer]:
                    - img [ref=e231]
                    - text: I'd buy this
              - generic [ref=e233]:
                - img "Set Free Journal concept" [ref=e235]
                - generic [ref=e236]:
                  - heading "Set Free Journal" [level=3] [ref=e237]
                  - paragraph [ref=e238]: Hardcover journal with gold foil broken heart.
                  - button "I'd buy this" [ref=e239] [cursor=pointer]:
                    - img [ref=e240]
                    - text: I'd buy this
              - generic [ref=e242]:
                - img "Thankyou Complete Set concept" [ref=e244]
                - generic [ref=e245]:
                  - heading "Thankyou Complete Set" [level=3] [ref=e246]
                  - paragraph [ref=e247]: Hoodie, mug, journal, pen, thermos and gift box.
                  - button "I'd buy this" [ref=e248] [cursor=pointer]:
                    - img [ref=e249]
                    - text: I'd buy this
            - paragraph [ref=e251]:
              - img [ref=e252]
              - text: Votes go straight to Gannon, privately. Nothing is ever shown publicly.
        - paragraph [ref=e255]: Independent music, merchandise, and community support.
  - contentinfo [ref=e256]:
    - generic [ref=e257]:
      - generic [ref=e258]:
        - generic [ref=e259]:
          - img "Gannon Waye" [ref=e260]
          - paragraph [ref=e261]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
        - generic [ref=e262]:
          - heading "Navigate" [level=4] [ref=e263]
          - generic [ref=e264]:
            - link "Home" [ref=e265] [cursor=pointer]:
              - /url: /
            - link "Biography" [ref=e266] [cursor=pointer]:
              - /url: /biography
            - link "Music" [ref=e267] [cursor=pointer]:
              - /url: /music
            - link "Lyrics" [ref=e268] [cursor=pointer]:
              - /url: /lyrics
            - link "Store" [ref=e269] [cursor=pointer]:
              - /url: /store
            - link "Press" [ref=e270] [cursor=pointer]:
              - /url: /press
            - link "Mum Tribute" [ref=e271] [cursor=pointer]:
              - /url: /remember-mum
            - link "Contact" [ref=e272] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e273]:
          - heading "Contact" [level=4] [ref=e274]
          - paragraph [ref=e275]: For music, media, collaboration, and business enquiries
          - link "gannonwayemusic@gmail.com" [ref=e276] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e277]
          - generic [ref=e278]:
            - link "Privacy Policy" [ref=e279] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e280] [cursor=pointer]:
              - /url: /terms-of-service
          - heading "Social" [level=4] [ref=e281]
          - generic [ref=e282]:
            - link "Instagram @gann0nwaye" [ref=e283] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e284] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e285] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e286]:
        - paragraph [ref=e287]: Stay connected
        - heading "Music and merchandise updates" [level=3] [ref=e288]
        - paragraph [ref=e289]: One clear signup form, with explicit consent, is available on the home page.
        - link "Join the Update List" [ref=e290] [cursor=pointer]:
          - /url: /#updates
      - generic [ref=e291]:
        - paragraph [ref=e292]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
        - paragraph [ref=e293]: © 2026 Gannon Waye. All rights reserved.
  - navigation [ref=e294]:
    - generic [ref=e295]:
      - link "Home" [ref=e296] [cursor=pointer]:
        - /url: /
        - generic [ref=e297]:
          - img [ref=e298]
          - generic [ref=e301]: Home
      - link "Music" [ref=e302] [cursor=pointer]:
        - /url: /music
        - generic [ref=e303]:
          - img [ref=e304]
          - generic [ref=e308]: Music
      - link "Store" [ref=e309] [cursor=pointer]:
        - /url: /store
        - generic [ref=e311]:
          - img [ref=e312]
          - generic [ref=e315]: Store
      - link "Lyrics" [ref=e316] [cursor=pointer]:
        - /url: /lyrics
        - generic [ref=e317]:
          - img [ref=e318]
          - generic [ref=e321]: Lyrics
      - link "Contact" [ref=e322] [cursor=pointer]:
        - /url: /contact
        - generic [ref=e323]:
          - img [ref=e324]
          - generic [ref=e327]: Contact
  - button "Open fan chat" [ref=e328] [cursor=pointer]:
    - img [ref=e329]
```

# Test source

```ts
  1  | const {test,expect}=require('@playwright/test');
  2  | test('recovery shows original boutique and verified catalogue without fabricated failure',async({page},info)=>{
  3  |  let paymentRequests=0;
  4  |  await page.route('**/functions/createCheckoutSession',route=>{paymentRequests++;return route.abort();});
  5  |  await page.goto('/store');
  6  |  await expect(page.getByTestId('store-page')).toBeVisible();
  7  |  await expect(page.getByTestId('locked-storefront-world')).toBeVisible();
  8  |  await expect(page.getByTestId('store-checkout-notice')).toContainText('Checkout is temporarily unavailable');
  9  |  await expect(page.getByTestId('product-card')).toHaveCount(3);
  10 |  const text=await page.locator('body').innerText();
  11 |  expect(text).not.toContain('500 — Internal Server Error');
  12 |  expect(text).not.toContain('storefront worker failed');
> 13 |  expect(text).not.toContain('Set Free Heart Hoodie');
     |                   ^ Error: expect(received).not.toContain(expected) // indexOf
  14 |  expect(text).not.toContain('Without You Here Hoodie');
  15 |  const hoodie=page.getByTestId('product-card').filter({hasText:'Hoodie'}).first();
  16 |  await expect(hoodie.getByTestId('product-price')).toContainText('$98');
  17 |  await hoodie.getByRole('button',{name:/^Select size M/}).click();
  18 |  await hoodie.getByTestId('add-to-cart-btn').click();
  19 |  await expect(hoodie.getByTestId('add-to-cart-success')).toBeVisible();
  20 |  expect(paymentRequests).toBe(0);
  21 |  await page.addStyleTag({content:'[class*="fixed"]{display:none!important}'});
  22 |  await page.screenshot({path:require('os').tmpdir()+'/gw-store-recovered-'+info.project.name+'.jpg',type:'jpeg',quality:60,fullPage:true});
  23 | });
  24 | test('all existing transaction routes stay held without payment requests',async({page})=>{
  25 |  let calls=0;
  26 |  await page.route('**/functions/createCheckoutSession',route=>{calls++;return route.abort();});
  27 |  for(const route of ['/store/cart','/store/cart-details','/store/checkout']){
  28 |   await page.goto(route);
  29 |   await expect(page.getByTestId('store-checkout-hold')).toBeVisible();
  30 |   await expect(page.getByRole('heading',{name:'Checkout is temporarily unavailable'})).toBeVisible();
  31 |   expect(await page.locator('body').innerText()).not.toContain('500 — Internal Server Error');
  32 |  }
  33 |  expect(calls).toBe(0);
  34 | });
  35 | 
```