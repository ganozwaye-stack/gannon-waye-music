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
Received string:        "GANNON WAYE
HOME
BIOGRAPHY
MUSIC
STORE
COACHING
PRESS
CONTACT
MORE
SUPPORT

The collection is available to browse. Checkout is temporarily unavailable while payment checks are completed.

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

SET FREE, OUT NOW
◆
JOIN THE COMMUNITY AND FOLLOW THE STORY
◆
INDEPENDENT, HEART-FIRST MUSIC FROM GANNON WAYE
◆
SET FREE, OUT NOW
◆
JOIN THE COMMUNITY AND FOLLOW THE STORY
◆
INDEPENDENT, HEART-FIRST MUSIC FROM GANNON WAYE
◆"
```

```
Error: apiRequestContext._wrapApiCall: file data stream has unexpected number of bytes
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "Gannon Waye · Home" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: Gannon Waye
      - generic [ref=e8]:
        - link "Home" [ref=e10] [cursor=pointer]:
          - /url: /
        - link "Biography" [ref=e12] [cursor=pointer]:
          - /url: /biography
        - button "Open Music menu" [ref=e14] [cursor=pointer]:
          - text: Music
          - img [ref=e15]
        - link "Store" [ref=e18] [cursor=pointer]:
          - /url: /store
        - link "Coaching" [ref=e20] [cursor=pointer]:
          - /url: /coaching
        - link "Press" [ref=e22] [cursor=pointer]:
          - /url: /press
        - link "Contact" [ref=e24] [cursor=pointer]:
          - /url: /contact
        - button "Open more navigation links" [ref=e26] [cursor=pointer]:
          - text: More
          - img [ref=e27]
      - generic [ref=e29]:
        - link "Support the project" [ref=e30] [cursor=pointer]:
          - /url: /back-this
          - img [ref=e31]
          - text: Support
        - button "Search the site" [ref=e33] [cursor=pointer]:
          - img [ref=e34]
        - button "Open cart" [ref=e37] [cursor=pointer]:
          - img [ref=e38]
  - main [ref=e42]:
    - generic [ref=e43]:
      - region "Permanent Gannon Waye boutique world" [ref=e44]:
        - img "Gannon Waye Boutique, official merchandise store"
      - generic [ref=e45]:
        - status [ref=e46]: The collection is available to browse. Checkout is temporarily unavailable while payment checks are completed.
        - generic [ref=e48]:
          - generic [ref=e49]:
            - paragraph [ref=e50]: The Single · Out Now
            - heading "Set Free" [level=2] [ref=e51]
            - paragraph [ref=e52]: Carry the Message
            - paragraph [ref=e53]: The Set Free collection is here. Every piece carries the message of the single, so what you wear says what you feel.
            - link "Shop the Collection" [ref=e54] [cursor=pointer]:
              - /url: "#store-products"
              - text: Shop the Collection
              - img [ref=e55]
          - img "Set Free hoodie, cracked heart design" [ref=e58]
        - generic [ref=e59]:
          - img [ref=e60]
          - paragraph [ref=e62]: The Set Free merch has dropped · Shop it below
        - generic [ref=e63]:
          - paragraph [ref=e64]: Available now
          - heading "Shop the collection" [level=1] [ref=e65]
          - paragraph [ref=e68]: Everything here is in stock and ready to ship within Australia.
          - paragraph [ref=e69]: Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.
        - generic [ref=e71]: Merch
        - generic [ref=e73]:
          - generic [ref=e74]:
            - generic [ref=e75] [cursor=pointer]:
              - generic [ref=e76]:
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 1" [ref=e77]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 2" [ref=e78]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 3" [ref=e79]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 4" [ref=e80]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 5" [ref=e81]
                - generic [ref=e82]:
                  - button [ref=e83]
                  - button [ref=e84]
                  - button [ref=e85]
                  - button [ref=e86]
                  - button [ref=e87]
              - img [ref=e89]
              - generic [ref=e92]: Available Now
            - generic [ref=e93]:
              - paragraph [ref=e95]: "\"Respect Is Earned\" Hoodie — Dark Grey"
              - paragraph [ref=e96]: $98 AUD
              - paragraph [ref=e97]: Available in S, M, L and XL. Delivery is calculated before payment.
              - group "Complete the Set" [ref=e98]:
                - generic [ref=e99]: Complete the Set
                - paragraph [ref=e100]: Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.
                - generic [ref=e101]:
                  - generic [ref=e102] [cursor=pointer]:
                    - generic [ref=e103]:
                      - radio "This item $98 AUD" [checked] [ref=e104]
                      - generic [ref=e105]: This item
                    - generic [ref=e106]: $98 AUD
                  - generic [ref=e107] [cursor=pointer]:
                    - generic [ref=e108]:
                      - radio "Winter Writing & Comfort Bundle $119 AUD" [ref=e109]
                      - generic [ref=e110]: Winter Writing & Comfort Bundle
                    - generic [ref=e111]: $119 AUD
                - link "View the Winter Writing & Comfort Bundle" [ref=e112] [cursor=pointer]:
                  - /url: "#store-product-6a9a945016c72a1e3c04935f"
              - generic [ref=e113]:
                - paragraph [ref=e114]: Select size
                - generic [ref=e115]:
                  - button "Select size S, 3 in stock" [ref=e116] [cursor=pointer]: S (3)
                  - button "Select size M, 4 in stock" [ref=e117] [cursor=pointer]: M (4)
                  - button "Select size L, 5 in stock" [ref=e118] [cursor=pointer]: L (5)
                  - button "Select size XL, 2 in stock" [ref=e119] [cursor=pointer]: XL (2)
              - button "Add to Cart" [ref=e120] [cursor=pointer]:
                - img [ref=e121]
                - text: Add to Cart
          - generic [ref=e122]:
            - generic [ref=e123] [cursor=pointer]:
              - generic [ref=e124]:
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 1" [ref=e125]
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 2" [ref=e126]
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 3" [ref=e127]
                - generic [ref=e128]:
                  - button [ref=e129]
                  - button [ref=e130]
                  - button [ref=e131]
              - img [ref=e133]
              - generic [ref=e136]: In Stock
            - generic [ref=e137]:
              - paragraph [ref=e139]: Respect Is Earned Journal, Pen and Thermos Gift Box Bundle
              - paragraph [ref=e140]: $59 AUD
              - paragraph [ref=e141]: Journal, matching pen and thermos presented as one complete gift box set. Delivery is calculated before payment.
              - group "Complete the Set" [ref=e142]:
                - generic [ref=e143]: Complete the Set
                - paragraph [ref=e144]: Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.
                - generic [ref=e145]:
                  - generic [ref=e146] [cursor=pointer]:
                    - generic [ref=e147]:
                      - radio "This item $59 AUD" [checked] [ref=e148]
                      - generic [ref=e149]: This item
                    - generic [ref=e150]: $59 AUD
                  - generic [ref=e151] [cursor=pointer]:
                    - generic [ref=e152]:
                      - radio "Winter Writing & Comfort Bundle $119 AUD" [ref=e153]
                      - generic [ref=e154]: Winter Writing & Comfort Bundle
                    - generic [ref=e155]: $119 AUD
                - link "View the Winter Writing & Comfort Bundle" [ref=e156] [cursor=pointer]:
                  - /url: "#store-product-6a9a945016c72a1e3c04935f"
              - button "Add to Cart" [ref=e157] [cursor=pointer]:
                - img [ref=e158]
                - text: Add to Cart
          - generic [ref=e159]:
            - generic [ref=e160] [cursor=pointer]:
              - generic [ref=e161]:
                - img "Winter Writing & Comfort Bundle 1" [ref=e162]
                - img "Winter Writing & Comfort Bundle 2" [ref=e163]
                - generic [ref=e164]:
                  - button [ref=e165]
                  - button [ref=e166]
              - img [ref=e168]
              - generic [ref=e171]: In Stock
            - generic [ref=e172]:
              - paragraph [ref=e174]: Winter Writing & Comfort Bundle
              - paragraph [ref=e175]: $119 AUD
              - generic [ref=e176]:
                - paragraph [ref=e177]: Select size
                - generic [ref=e178]:
                  - button "Select size S, 3 in stock" [ref=e179] [cursor=pointer]: S (3)
                  - button "Select size M, 4 in stock" [ref=e180] [cursor=pointer]: M (4)
                  - button "Select size L, 5 in stock" [ref=e181] [cursor=pointer]: L (5)
                  - button "Select size XL, 2 in stock" [ref=e182] [cursor=pointer]: XL (2)
              - button "Add to Cart" [ref=e183] [cursor=pointer]:
                - img [ref=e184]
                - text: Add to Cart
        - region "Merch expression of interest vote" [ref=e186]:
          - generic [ref=e187]:
            - generic [ref=e188]:
              - paragraph [ref=e189]: Expressions of Interest
              - heading "Vote for what you'd buy" [level=2] [ref=e190]
              - paragraph [ref=e191]: These are concept designs, not yet for sale. Vote for the pieces you would actually buy and the most loved ones get made first.
            - generic [ref=e192]:
              - generic [ref=e193]:
                - img "Thank You Hoodie, Signed concept" [ref=e195]
                - generic [ref=e196]:
                  - heading "Thank You Hoodie, Signed" [level=3] [ref=e197]
                  - paragraph [ref=e198]: Front and back print with the gold signature.
                  - button "I'd buy this" [ref=e199] [cursor=pointer]:
                    - img [ref=e200]
                    - text: I'd buy this
              - generic [ref=e202]:
                - img "Thank You Hoodie, Clean concept" [ref=e204]
                - generic [ref=e205]:
                  - heading "Thank You Hoodie, Clean" [level=3] [ref=e206]
                  - paragraph [ref=e207]: Respect Is Earned back print, clean front.
                  - button "I'd buy this" [ref=e208] [cursor=pointer]:
                    - img [ref=e209]
                    - text: I'd buy this
              - generic [ref=e211]:
                - img "Thank You Hoodie, No Signature concept" [ref=e213]
                - generic [ref=e214]:
                  - heading "Thank You Hoodie, No Signature" [level=3] [ref=e215]
                  - paragraph [ref=e216]: The same design without the signature marks.
                  - button "I'd buy this" [ref=e217] [cursor=pointer]:
                    - img [ref=e218]
                    - text: I'd buy this
              - generic [ref=e220]:
                - img "Set Free Heart Hoodie concept" [ref=e222]
                - generic [ref=e223]:
                  - heading "Set Free Heart Hoodie" [level=3] [ref=e224]
                  - paragraph [ref=e225]: Gold filigree heart and lyric on the back.
                  - button "I'd buy this" [ref=e226] [cursor=pointer]:
                    - img [ref=e227]
                    - text: I'd buy this
              - generic [ref=e229]:
                - img "Set Free Minimal Hoodie concept" [ref=e231]
                - generic [ref=e232]:
                  - heading "Set Free Minimal Hoodie" [level=3] [ref=e233]
                  - paragraph [ref=e234]: Subtle gold Set Free chest print and orbit.
                  - button "I'd buy this" [ref=e235] [cursor=pointer]:
                    - img [ref=e236]
                    - text: I'd buy this
              - generic [ref=e238]:
                - img "Set Free Heart Tee concept" [ref=e240]
                - generic [ref=e241]:
                  - heading "Set Free Heart Tee" [level=3] [ref=e242]
                  - paragraph [ref=e243]: Broken gold heart with the Set Free lyric.
                  - button "I'd buy this" [ref=e244] [cursor=pointer]:
                    - img [ref=e245]
                    - text: I'd buy this
              - generic [ref=e247]:
                - img "Set Free Tote Bag concept" [ref=e249]
                - generic [ref=e250]:
                  - heading "Set Free Tote Bag" [level=3] [ref=e251]
                  - paragraph [ref=e252]: Natural canvas tote with the broken heart artwork.
                  - button "I'd buy this" [ref=e253] [cursor=pointer]:
                    - img [ref=e254]
                    - text: I'd buy this
              - generic [ref=e256]:
                - img "Set Free Journal concept" [ref=e258]
                - generic [ref=e259]:
                  - heading "Set Free Journal" [level=3] [ref=e260]
                  - paragraph [ref=e261]: Hardcover journal with gold foil broken heart.
                  - button "I'd buy this" [ref=e262] [cursor=pointer]:
                    - img [ref=e263]
                    - text: I'd buy this
              - generic [ref=e265]:
                - img "Thankyou Complete Set concept" [ref=e267]
                - generic [ref=e268]:
                  - heading "Thankyou Complete Set" [level=3] [ref=e269]
                  - paragraph [ref=e270]: Hoodie, mug, journal, pen, thermos and gift box.
                  - button "I'd buy this" [ref=e271] [cursor=pointer]:
                    - img [ref=e272]
                    - text: I'd buy this
            - paragraph [ref=e274]:
              - img [ref=e275]
              - text: Votes go straight to Gannon, privately. Nothing is ever shown publicly.
        - paragraph [ref=e278]: Independent music, merchandise, and community support.
  - contentinfo [ref=e279]:
    - generic [ref=e280]:
      - generic [ref=e281]:
        - generic [ref=e282]:
          - img "Gannon Waye" [ref=e283]
          - paragraph [ref=e284]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
        - generic [ref=e285]:
          - heading "Navigate" [level=4] [ref=e286]
          - generic [ref=e287]:
            - link "Home" [ref=e288] [cursor=pointer]:
              - /url: /
            - link "Biography" [ref=e289] [cursor=pointer]:
              - /url: /biography
            - link "Music" [ref=e290] [cursor=pointer]:
              - /url: /music
            - link "Lyrics" [ref=e291] [cursor=pointer]:
              - /url: /lyrics
            - link "Store" [ref=e292] [cursor=pointer]:
              - /url: /store
            - link "Press" [ref=e293] [cursor=pointer]:
              - /url: /press
            - link "Mum Tribute" [ref=e294] [cursor=pointer]:
              - /url: /remember-mum
            - link "Contact" [ref=e295] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e296]:
          - heading "Contact" [level=4] [ref=e297]
          - paragraph [ref=e298]: For music, media, collaboration, and business enquiries
          - link "gannonwayemusic@gmail.com" [ref=e299] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e300]
          - generic [ref=e301]:
            - link "Privacy Policy" [ref=e302] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e303] [cursor=pointer]:
              - /url: /terms-of-service
          - heading "Social" [level=4] [ref=e304]
          - generic [ref=e305]:
            - link "Instagram @gann0nwaye" [ref=e306] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e307] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e308] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e309]:
        - paragraph [ref=e310]: Stay connected
        - heading "Music and merchandise updates" [level=3] [ref=e311]
        - paragraph [ref=e312]: One clear signup form, with explicit consent, is available on the home page.
        - link "Join the Update List" [ref=e313] [cursor=pointer]:
          - /url: /#updates
      - generic [ref=e314]:
        - paragraph [ref=e315]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
        - paragraph [ref=e316]: © 2026 Gannon Waye. All rights reserved.
  - generic [ref=e318]:
    - generic [ref=e319]:
      - generic [ref=e320]: Set Free, out now
      - generic [ref=e321]: ◆
      - generic [ref=e322]: Join the community and follow the story
      - generic [ref=e323]: ◆
      - generic [ref=e324]: Independent, heart-first music from Gannon Waye
      - generic [ref=e325]: ◆
    - generic [ref=e326]:
      - generic [ref=e327]: Set Free, out now
      - generic [ref=e328]: ◆
      - generic [ref=e329]: Join the community and follow the story
      - generic [ref=e330]: ◆
      - generic [ref=e331]: Independent, heart-first music from Gannon Waye
      - generic [ref=e332]: ◆
  - dialog "Stay updated on new releases?" [ref=e333]:
    - button "Close" [ref=e334] [cursor=pointer]:
      - img [ref=e335]
    - generic [ref=e338]:
      - img [ref=e340]
      - paragraph [ref=e343]: Stay Close
      - heading "Stay updated on new releases?" [level=2] [ref=e344]
      - paragraph [ref=e345]: Be the first to hear about new music. Set Free is out now.
      - generic [ref=e346]:
        - textbox "Your email address" [ref=e347]:
          - /placeholder: your@email.com
        - button "Keep Me Updated" [ref=e348] [cursor=pointer]
      - button "No thanks, I am just browsing" [ref=e349] [cursor=pointer]
  - button "Open fan chat" [ref=e350] [cursor=pointer]:
    - img [ref=e351]
```