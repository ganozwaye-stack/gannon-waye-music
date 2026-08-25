# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.js >> Order Review / Checkout Page >> different sizes create separate cart lines
- Location: src/gannonwaye-playwright-pack/tests/checkout.spec.js:105:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first()

```

```yaml
- navigation:
  - link "Gannon Waye · Home":
    - /url: /
    - text: GW
  - link "Home":
    - /url: /
  - link "Biography":
    - /url: /biography
  - link "Music":
    - /url: /music
  - link "Store":
    - /url: /store
  - link "Supporters":
    - /url: /back-this
  - link "Mum's Garden":
    - /url: /mums-garden
  - link "Press":
    - /url: /press
  - link "Contact":
    - /url: /contact
  - button "More":
    - text: More
    - img
  - button:
    - img
  - button "Open cart":
    - img
- main:
  - img "Gannon Waye Boutique — official merch store"
  - paragraph: Boutique · Step Inside
  - heading "Gannon Waye" [level=1]
  - paragraph: Official Merch Store
  - link "All Products":
    - /url: /store/all
    - img
    - text: All Products
  - link "Listen":
    - /url: /music
    - img
    - text: Listen
  - link "Cart":
    - /url: /store/cart
    - img
    - text: Cart
  - paragraph: Gannon Waye
  - paragraph: Boutique · Step Inside
  - button "Respect Is Earned Hoodie Hoodie Respect Is Earned Hoodie $98":
    - img "Respect Is Earned Hoodie"
    - text: Hoodie Respect Is Earned Hoodie $98
  - button "Respect Is Earned Hoodie — Back Coming Soon Hoodie Back View Coming Soon":
    - img "Respect Is Earned Hoodie — Back"
    - text: Coming Soon Hoodie Back View Coming Soon
  - button "Winter Writing & Comfort Bundle Featured Bundle Winter Bundle $119":
    - img "Winter Writing & Comfort Bundle"
    - text: Featured Bundle Winter Bundle $119
  - button "Thankyou Journal, Pen & Thermos Flask Bundle Bundle Journal Bundle $59":
    - img "Thankyou Journal, Pen & Thermos Flask Bundle"
    - text: Bundle Journal Bundle $59
  - button "Thankyou \"Respect Is Earned\" Coffee Mug Mug Coffee Mug $9.90":
    - img "Thankyou \"Respect Is Earned\" Coffee Mug"
    - text: Mug Coffee Mug $9.90
  - button "Thankyou \"Respect Is Earned\" Wall Poster Poster Wall Poster From $19":
    - img "Thankyou \"Respect Is Earned\" Wall Poster"
    - text: Poster Wall Poster From $19
  - button "Thankyou CD Sold Out Thankyou CD Sold Out":
    - img "Thankyou CD"
    - text: Sold Out Thankyou CD Sold Out
  - button "Thankyou Tote Bag Sold Out Tote Bag $15":
    - img "Thankyou Tote Bag"
    - text: Sold Out Tote Bag $15
  - button "Mum's Garden Private Mum's Garden Tribute":
    - img "Mum's Garden"
    - text: Private Mum's Garden Tribute
  - paragraph: Hover or tap zones to explore · Click to quick-view & shop
  - paragraph: Most Popular
  - heading "Featured Gear" [level=2]
  - button "Respect Is Earned Hoodie ‹ › ★ Best Seller Respect Is Earned Hoodie Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye si… $98 SHOP NOW →":
    - img "Respect Is Earned Hoodie"
    - button "‹"
    - button "›"
    - button
    - button
    - button
    - button
    - button
    - text: ★ Best Seller Respect Is Earned Hoodie
    - paragraph: Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye si…
    - text: $98 SHOP NOW →
  - button "Winter Writing & Comfort Bundle ‹ › Featured Bundle Winter Bundle $119 SHOP NOW →":
    - img "Winter Writing & Comfort Bundle"
    - button "‹"
    - button "›"
    - button
    - button
    - button
    - button
    - button
    - button
    - text: Featured Bundle Winter Bundle $119 SHOP NOW →
  - button "Thankyou Journal, Pen & Thermos Flask Bundle ‹ › Bundle Journal Bundle $59 SHOP NOW →":
    - img "Thankyou Journal, Pen & Thermos Flask Bundle"
    - button "‹"
    - button "›"
    - button
    - button
    - button
    - button
    - text: Bundle Journal Bundle $59 SHOP NOW →
  - heading "Gannon Waye Merch Store — Full Collection" [level=2]
  - button "Respect Is Earned Hoodie Hoodie Respect Is Earned Hoodie $98 View →":
    - img "Respect Is Earned Hoodie"
    - text: Hoodie
    - paragraph: Respect Is Earned Hoodie
    - text: $98 View →
  - button "Respect Is Earned Hoodie — Back Coming Soon Hoodie Back View Coming Soon View →":
    - img "Respect Is Earned Hoodie — Back"
    - text: Coming Soon
    - paragraph: Hoodie Back View
    - text: Coming Soon View →
  - button "Winter Writing & Comfort Bundle Featured Bundle Winter Bundle $119 View →":
    - img "Winter Writing & Comfort Bundle"
    - text: Featured Bundle
    - paragraph: Winter Bundle
    - text: $119 View →
  - button "Thankyou Journal, Pen & Thermos Flask Bundle Bundle Journal Bundle $59 View →":
    - img "Thankyou Journal, Pen & Thermos Flask Bundle"
    - text: Bundle
    - paragraph: Journal Bundle
    - text: $59 View →
  - button "Thankyou \"Respect Is Earned\" Coffee Mug Mug Coffee Mug $9.90 View →":
    - img "Thankyou \"Respect Is Earned\" Coffee Mug"
    - text: Mug
    - paragraph: Coffee Mug
    - text: $9.90 View →
  - button "Thankyou \"Respect Is Earned\" Wall Poster Poster Wall Poster From $19 View →":
    - img "Thankyou \"Respect Is Earned\" Wall Poster"
    - text: Poster
    - paragraph: Wall Poster
    - text: From $19 View →
  - button "Thankyou CD Sold Out Thankyou CD Sold Out Waitlist →":
    - img "Thankyou CD"
    - text: Sold Out
    - paragraph: Thankyou CD
    - text: Sold Out Waitlist →
  - button "Thankyou Tote Bag Sold Out Tote Bag $15 Waitlist →":
    - img "Thankyou Tote Bag"
    - text: Sold Out
    - paragraph: Tote Bag
    - text: $15 Waitlist →
  - button "Mum's Garden Private Mum's Garden Tribute Visit →":
    - img "Mum's Garden"
    - text: Private
    - paragraph: Mum's Garden
    - text: Tribute Visit →
  - paragraph: The Collection
  - heading "Merch Gallery" [level=2]
  - paragraph: Every piece carries a meaning. Hover to explore the details.
  - img "Respect Is Earned Hoodie"
  - text: Hoodie
  - heading "Respect Is Earned Hoodie" [level=3]
  - paragraph: Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye signature de…
  - text: $98 View →
  - img "Respect Is Earned Hoodie — Back"
  - text: Coming Soon
  - heading "Hoodie Back View" [level=3]
  - paragraph: Without You Here — Memorial Merchandise. Coming soon.…
  - text: Coming Soon View →
  - img "Winter Writing & Comfort Bundle"
  - text: Featured Bundle
  - heading "Winter Bundle" [level=3]
  - paragraph: The hero bundle of the Thankyou Merch Store. Includes the oversized Respect Is Earned hoodie plus th…
  - text: $119 View →
  - img "Thankyou Journal, Pen & Thermos Flask Bundle"
  - text: Bundle
  - heading "Journal Bundle" [level=3]
  - paragraph: A premium Thankyou writing set featuring the Respect Is Earned journal, matching pen and thermos fla…
  - text: $59 View →
  - img "Thankyou \"Respect Is Earned\" Coffee Mug"
  - text: Mug
  - heading "Coffee Mug" [level=3]
  - paragraph: Ceramic Thankyou coffee mug featuring the Respect Is Earned lyric artwork. A simple daily reminder f…
  - text: $9.90 View →
  - img "Thankyou \"Respect Is Earned\" Wall Poster"
  - text: Poster
  - heading "Wall Poster" [level=3]
  - paragraph: Premium Thankyou lyric wall poster. Multiple sizes available — A4 $19 · A3 $29 · A2 $39 · A1 $59.…
  - text: From $19 View →
  - button "View Full Product Grid & Checkout →"
- contentinfo:
  - text: GW
  - paragraph: Australian singer-songwriter crafting honest stories through melody and verse.
  - heading "Navigate" [level=4]
  - link "Home":
    - /url: /
  - link "Music":
    - /url: /music
  - link "Lyrics":
    - /url: /lyrics
  - link "Store":
    - /url: /store
  - link "Press":
    - /url: /press
  - link "Subscribe 🤍":
    - /url: /back-this
  - link "Community":
    - /url: /community
  - link "Biography":
    - /url: /biography
  - link "Lyric Library":
    - /url: /lyric-library
  - link "Mixing Services":
    - /url: /mixing-services
  - link "Gift Cards":
    - /url: /gift-cards
  - link "Mum Tribute":
    - /url: /remember-mum
  - link "Systems Manager":
    - /url: /systems-manager
  - link "Contact":
    - /url: /contact
  - heading "Contact" [level=4]
  - paragraph: For press, management & enquiries
  - link "gannonwayemusic@gmail.com":
    - /url: mailto:gannonwayemusic@gmail.com
  - heading "Legal" [level=4]
  - link "Privacy Policy":
    - /url: /privacy-policy
  - link "Terms of Service":
    - /url: /terms-of-service
  - link "Contact Gannon":
    - /url: /contact
  - heading "Social" [level=4]
  - link "Instagram @gann0nwaye":
    - /url: https://www.instagram.com/gann0nwaye
  - link "TikTok @gann0nwaye":
    - /url: https://www.tiktok.com/@gann0nwaye
  - link "YouTube @gannonwayeofficial":
    - /url: https://www.youtube.com/@gannonwayeofficial
  - paragraph: Stay in the loop
  - heading "New music & community updates" [level=3]
  - textbox "Your name *"
  - textbox "your@email.com *"
  - textbox "Phone incl. country code e.g. +61 400 000 000 *"
  - textbox "Birthday (optional — we'll send you something special)"
  - paragraph: Birthday optional — we'll send you something special 🎂
  - combobox:
    - option "How did you find me? *" [selected]
    - option "Google"
    - option "Instagram"
    - option "Facebook"
    - option "TikTok"
    - option "X (Twitter)"
    - option "Friend / Word of Mouth"
    - option "I know Gannon"
    - option "Other"
  - button "Subscribe"
  - paragraph: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
  - img "GW Heart"
  - link "Support the project 🤍":
    - /url: /back-this
  - img "GW Heart"
  - paragraph: © 2026 Gannon Waye. All rights reserved.
- img
- paragraph: 🖤10% of all proceeds support 1800RESPECT
- button "Dismiss":
  - img
```

# Test source

```ts
  16  |   country: 'Australia',
  17  | };
  18  | 
  19  | async function fillDetailsAndNavigate(page) {
  20  |   // Set localStorage details so checkout page loads correctly
  21  |   await page.goto(`${BASE_URL}/store`);
  22  |   await page.evaluate((d) => {
  23  |     localStorage.setItem('gannon_checkout_details_v1', JSON.stringify({
  24  |       ...d,
  25  |       dob: '', business_name: '', abn: '',
  26  |       order_support_consent: true, marketing_opt_in: false,
  27  |     }));
  28  |   }, DETAILS);
  29  | 
  30  |   // Add item to cart via UI
  31  |   await page.waitForSelector('[data-testid="product-card"]');
  32  |   
  33  |   // Select size M first if visible
  34  |   const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  35  |   if (await sizeM.isVisible().catch(() => false)) {
  36  |     await sizeM.click({ force: true });
  37  |   }
  38  | 
  39  |   const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  40  |   const count = await addBtns.count();
  41  |   for (let i = 0; i < count; i++) {
  42  |     const btn = addBtns.nth(i);
  43  |     if (await btn.isVisible()) {
  44  |       await btn.click({ force: true });
  45  |       // Wait for the cart drawer checkout button to ensure Zustand state is saved
  46  |       await page.waitForSelector('[data-testid="go-to-checkout-button"]', { timeout: 5000 }).catch(() => {});
  47  |       break;
  48  |     }
  49  |   }
  50  |   await page.goto(`${BASE_URL}/store/checkout`);
  51  |   await page.waitForSelector('[data-testid="checkout-page"]');
  52  | }
  53  | 
  54  | test.describe('Order Review / Checkout Page', () => {
  55  |   test('checkout page loads with items', async ({ page }) => {
  56  |     await fillDetailsAndNavigate(page);
  57  |     await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
  58  |     await expect(page.locator('[data-testid="checkout-items"]')).toBeVisible();
  59  |   });
  60  | 
  61  |   test('customer summary is visible', async ({ page }) => {
  62  |     await fillDetailsAndNavigate(page);
  63  |     await expect(page.locator('[data-testid="checkout-customer-summary"]')).toBeVisible();
  64  |     await expect(page.locator('[data-testid="checkout-customer-summary"]')).toContainText('Gannon Test');
  65  |   });
  66  | 
  67  |   test('delivery summary is visible', async ({ page }) => {
  68  |     await fillDetailsAndNavigate(page);
  69  |     await expect(page.locator('[data-testid="checkout-delivery-summary"]')).toBeVisible();
  70  |     await expect(page.locator('[data-testid="checkout-delivery-summary"]')).toContainText('Melbourne');
  71  |   });
  72  | 
  73  |   test('cart items are shown', async ({ page }) => {
  74  |     await fillDetailsAndNavigate(page);
  75  |     const lines = page.locator('[data-testid="cart-line"]');
  76  |     await expect(lines.first()).toBeVisible();
  77  |   });
  78  | 
  79  |   test('customer can increase item quantity', async ({ page }) => {
  80  |     await fillDetailsAndNavigate(page);
  81  |     const increaseBtn = page.locator('[data-testid="cart-line-increase"]').first();
  82  |     await increaseBtn.click();
  83  |     // Total should update — just assert it's still visible
  84  |     await expect(page.locator('[data-testid="checkout-total"]')).toBeVisible();
  85  |   });
  86  | 
  87  |   test('customer can decrease item quantity', async ({ page }) => {
  88  |     await fillDetailsAndNavigate(page);
  89  |     // First increase so decrease doesn't remove item
  90  |     await page.locator('[data-testid="cart-line-increase"]').first().click();
  91  |     await page.locator('[data-testid="cart-line-decrease"]').first().click();
  92  |     await expect(page.locator('[data-testid="checkout-total"]')).toBeVisible();
  93  |   });
  94  | 
  95  |   test('customer can remove item', async ({ page }) => {
  96  |     await fillDetailsAndNavigate(page);
  97  |     // Add a second item via cart store manipulation, then remove the first
  98  |     await page.locator('[data-testid="cart-line-remove"]').first().click();
  99  |     // Either shows empty state or remaining items
  100 |     const isEmpty = await page.locator('[data-testid="empty-cart-return-store"]').isVisible().catch(() => false);
  101 |     const hasItems = await page.locator('[data-testid="cart-line"]').count() >= 0;
  102 |     expect(isEmpty || hasItems).toBeTruthy();
  103 |   });
  104 | 
  105 |   test('different sizes create separate cart lines', async ({ page }) => {
  106 |     await page.goto(`${BASE_URL}/store`);
  107 |     await page.evaluate((d) => {
  108 |       localStorage.setItem('gannon_checkout_details_v1', JSON.stringify({
  109 |         ...d, dob: '', business_name: '', abn: '',
  110 |         order_support_consent: true, marketing_opt_in: false,
  111 |       }));
  112 |     }, DETAILS);
  113 | 
  114 |     // Find Hoodie product card with sizes - select size M
  115 |     const hoodieCard = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
> 116 |     await expect(hoodieCard).toBeVisible();
      |                              ^ Error: expect(locator).toBeVisible() failed
  117 | 
  118 |     const sizeM = hoodieCard.locator('button').filter({ hasText: /^M$/ });
  119 |     await sizeM.click({ force: true });
  120 |     await hoodieCard.locator('[data-testid="add-to-cart-btn"]').click({ force: true });
  121 | 
  122 |     // Now add size L — navigate back to store
  123 |     await page.goto(`${BASE_URL}/store`);
  124 |     const hoodieCard2 = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
  125 |     await expect(hoodieCard2).toBeVisible();
  126 | 
  127 |     const sizeL = hoodieCard2.locator('button').filter({ hasText: /^L$/ });
  128 |     await sizeL.click({ force: true });
  129 |     await hoodieCard2.locator('[data-testid="add-to-cart-btn"]').click({ force: true });
  130 | 
  131 |     await page.goto(`${BASE_URL}/store/checkout`);
  132 |     const lines = page.locator('[data-testid="cart-line"]');
  133 |     const lineCount = await lines.count();
  134 |     expect(lineCount).toBeGreaterThanOrEqual(2);
  135 |   });
  136 | 
  137 |   test('promo code input is visible', async ({ page }) => {
  138 |     await fillDetailsAndNavigate(page);
  139 |     await expect(page.locator('[data-testid="promo-code-input"]')).toBeVisible();
  140 |     await expect(page.locator('[data-testid="apply-promo-code"]')).toBeVisible();
  141 |   });
  142 | 
  143 |   test('valid promo code applies', async ({ page }) => {
  144 |     await fillDetailsAndNavigate(page);
  145 |     await page.fill('[data-testid="promo-code-input"]', 'F20UN26DVIP');
  146 |     await page.locator('[data-testid="apply-promo-code"]').click();
  147 |     // Should show discount or success — not an error
  148 |     await page.waitForTimeout(2000);
  149 |     const hasError = await page.locator('.text-destructive').isVisible().catch(() => false);
  150 |     // May show as applied (check for promo display or no error)
  151 |     const hasPrimarySuccess = await page.locator('.text-primary').isVisible().catch(() => false);
  152 |     expect(hasError === false || hasPrimarySuccess === true).toBeTruthy();
  153 |   });
  154 | 
  155 |   test('invalid promo code rejects', async ({ page }) => {
  156 |     await fillDetailsAndNavigate(page);
  157 |     await page.fill('[data-testid="promo-code-input"]', 'INVALIDCODE999');
  158 |     await page.locator('[data-testid="apply-promo-code"]').click();
  159 |     await page.waitForTimeout(2000);
  160 |     await expect(page.locator('.text-destructive').first()).toBeVisible();
  161 |   });
  162 | 
  163 |   test('shipping is shown once and combined', async ({ page }) => {
  164 |     await fillDetailsAndNavigate(page);
  165 |     await expect(page.locator('[data-testid="checkout-shipping"]')).toBeVisible();
  166 |     const shippingEls = await page.locator('[data-testid="checkout-shipping"]').count();
  167 |     expect(shippingEls).toBe(1);
  168 |   });
  169 | 
  170 |   test('subtotal and total are visible', async ({ page }) => {
  171 |     await fillDetailsAndNavigate(page);
  172 |     await expect(page.locator('[data-testid="checkout-subtotal"]')).toBeVisible();
  173 |     await expect(page.locator('[data-testid="checkout-total"]')).toBeVisible();
  174 |   });
  175 | 
  176 |   test('pay button is visible and enabled', async ({ page }) => {
  177 |     await fillDetailsAndNavigate(page);
  178 |     const payBtn = page.locator('[data-testid="checkout-pay-button"]');
  179 |     await expect(payBtn).toBeVisible();
  180 |     await expect(payBtn).not.toBeDisabled();
  181 |   });
  182 | 
  183 |   test('empty cart shows return to store button', async ({ page }) => {
  184 |     await page.goto(`${BASE_URL}/store`);
  185 |     await page.evaluate(() => {
  186 |       const key = 'gannon_store_cart_v2';
  187 |       localStorage.setItem(key, JSON.stringify({ state: { items: [], __version: 3 }, version: 0 }));
  188 |     });
  189 |     await page.goto(`${BASE_URL}/store/checkout`);
  190 |     await expect(page.locator('[data-testid="empty-cart-return-store"]')).toBeVisible();
  191 |   });
  192 | });
```