# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment-success.spec.js >> Payment Success & Cancel Routes >> no 404 page shown on any success/cancel route
- Location: tests\payment-success.spec.js:63:3

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "Gannon Waye — Home" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e9]: GW
      - generic [ref=e10]:
        - link "Home" [ref=e11] [cursor=pointer]:
          - /url: /
        - link "My Story" [ref=e12] [cursor=pointer]:
          - /url: /this-is-my-life
        - link "Music" [ref=e13] [cursor=pointer]:
          - /url: /music
        - link "Videos" [ref=e14] [cursor=pointer]:
          - /url: /videos
        - link "Community" [ref=e15] [cursor=pointer]:
          - /url: /community
        - link "Store" [ref=e16] [cursor=pointer]:
          - /url: /store
        - link "Contact" [ref=e17] [cursor=pointer]:
          - /url: /contact
        - link "Back This 🤍" [ref=e18] [cursor=pointer]:
          - /url: /back-this
      - button [ref=e20] [cursor=pointer]:
        - img [ref=e21]
  - button [ref=e25] [cursor=pointer]:
    - img [ref=e26]
  - main [ref=e30]:
    - generic [ref=e32]:
      - img [ref=e33]
      - heading "Checkout Cancelled" [level=1] [ref=e37]
      - generic [ref=e38]:
        - paragraph [ref=e39]: No payment was processed. Your cart items are still saved.
        - paragraph [ref=e40]: You can return to the store at any time to complete your order.
      - generic [ref=e41]:
        - link "Return to Store" [ref=e42] [cursor=pointer]:
          - /url: /store
          - button "Return to Store" [ref=e43]:
            - img
            - text: Return to Store
        - link "Back Home" [ref=e44] [cursor=pointer]:
          - /url: /
          - button "Back Home" [ref=e45]:
            - img
            - text: Back Home
  - contentinfo [ref=e46]:
    - generic [ref=e47]:
      - generic [ref=e48]:
        - generic [ref=e49]:
          - generic [ref=e51]: GW
          - paragraph [ref=e52]: Australian singer-songwriter crafting honest stories through melody and verse.
        - generic [ref=e53]:
          - heading "Navigate" [level=4] [ref=e54]
          - generic [ref=e55]:
            - link "Home" [ref=e56] [cursor=pointer]:
              - /url: /
            - link "My Story" [ref=e57] [cursor=pointer]:
              - /url: /this-is-my-life
            - link "Music" [ref=e58] [cursor=pointer]:
              - /url: /music
            - link "Videos" [ref=e59] [cursor=pointer]:
              - /url: /videos
            - link "Store" [ref=e60] [cursor=pointer]:
              - /url: /store
            - link "Community" [ref=e61] [cursor=pointer]:
              - /url: /community
            - link "Contact" [ref=e62] [cursor=pointer]:
              - /url: /contact
            - link "Order Status" [ref=e63] [cursor=pointer]:
              - /url: /order-status
            - link "The 7 Day Standard" [ref=e64] [cursor=pointer]:
              - /url: /7-day-standard
            - link "Current Single" [ref=e65] [cursor=pointer]:
              - /url: /current-single
            - link "Merch Feedback" [ref=e66] [cursor=pointer]:
              - /url: /merch-feedback
            - link "Back This Project 🤍" [ref=e67] [cursor=pointer]:
              - /url: /back-this
        - generic [ref=e68]:
          - heading "Contact" [level=4] [ref=e69]
          - paragraph [ref=e70]: For press, management & enquiries
          - link "hello@gannonwaye.com" [ref=e71] [cursor=pointer]:
            - /url: mailto:hello@gannonwaye.com
          - heading "Legal" [level=4] [ref=e72]
          - generic [ref=e73]:
            - link "Privacy Policy" [ref=e74] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e75] [cursor=pointer]:
              - /url: /terms-of-service
            - link "Contact Gannon" [ref=e76] [cursor=pointer]:
              - /url: /contact
          - heading "Social" [level=4] [ref=e77]
          - generic [ref=e78]:
            - link "Instagram @gann0nwaye" [ref=e79] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e80] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e81] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e82]:
        - paragraph [ref=e83]: Stay in the loop
        - heading "New music & community updates" [level=3] [ref=e84]
        - generic [ref=e85]:
          - textbox "Your name *" [ref=e86]
          - textbox "your@email.com *" [ref=e87]
          - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e88]
          - textbox "Birthday (optional — we'll send you something special)" [ref=e89]
          - paragraph [ref=e90]: Birthday optional — we'll send you something special 🎂
          - combobox [ref=e91]:
            - option "How did you find me? *" [selected]
            - option "Google"
            - option "Instagram"
            - option "Facebook"
            - option "TikTok"
            - option "X (Twitter)"
            - option "Friend / Word of Mouth"
            - option "I know Gannon"
            - option "Other"
          - button "Subscribe" [ref=e92] [cursor=pointer]
      - generic [ref=e93]:
        - paragraph [ref=e94]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
        - paragraph [ref=e95]: "* The AI memorial reflective companion available on the tribute page (/mum) is configured as a comforting, gentle remembrance journal companion. It is not an active representation of Sonia, does not offer professional medical, legal, or grief counseling, and should not be used as a substitute for clinical therapy."
      - generic [ref=e96]:
        - generic [ref=e97]:
          - img "GW Heart" [ref=e98]
          - link "Support the project 🤍" [ref=e99] [cursor=pointer]:
            - /url: /back-this
          - img "GW Heart" [ref=e100]
        - paragraph [ref=e101]: © 2026 Gannon Waye. All rights reserved.
```