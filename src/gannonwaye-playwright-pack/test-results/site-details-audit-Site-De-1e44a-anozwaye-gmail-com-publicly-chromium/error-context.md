# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site-details-audit.spec.js >> Site Details Audit — Public pages must not expose wrong emails >> /store/checkout-success does not expose ganozwaye@gmail.com publicly
- Location: tests\site-details-audit.spec.js:10:9

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
      - heading "Payment Received" [level=1] [ref=e36]
      - paragraph [ref=e37]: Thank you for supporting the Thank You project.
      - generic [ref=e38]:
        - paragraph [ref=e39]: ✅ Your payment or pre-order has been received. A confirmation email will be sent to the email used at checkout.
        - paragraph [ref=e40]: If you do not receive an email within a few minutes, please contact us through the website.
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
        - link "Contact Support" [ref=e46] [cursor=pointer]:
          - /url: /contact
          - button "Contact Support" [ref=e47]
  - contentinfo [ref=e48]:
    - generic [ref=e49]:
      - generic [ref=e50]:
        - generic [ref=e51]:
          - generic [ref=e53]: GW
          - paragraph [ref=e54]: Australian singer-songwriter crafting honest stories through melody and verse.
        - generic [ref=e55]:
          - heading "Navigate" [level=4] [ref=e56]
          - generic [ref=e57]:
            - link "Home" [ref=e58] [cursor=pointer]:
              - /url: /
            - link "My Story" [ref=e59] [cursor=pointer]:
              - /url: /this-is-my-life
            - link "Music" [ref=e60] [cursor=pointer]:
              - /url: /music
            - link "Videos" [ref=e61] [cursor=pointer]:
              - /url: /videos
            - link "Store" [ref=e62] [cursor=pointer]:
              - /url: /store
            - link "Community" [ref=e63] [cursor=pointer]:
              - /url: /community
            - link "Contact" [ref=e64] [cursor=pointer]:
              - /url: /contact
            - link "Order Status" [ref=e65] [cursor=pointer]:
              - /url: /order-status
            - link "The 7 Day Standard" [ref=e66] [cursor=pointer]:
              - /url: /7-day-standard
            - link "Current Single" [ref=e67] [cursor=pointer]:
              - /url: /current-single
            - link "Merch Feedback" [ref=e68] [cursor=pointer]:
              - /url: /merch-feedback
            - link "Back This Project 🤍" [ref=e69] [cursor=pointer]:
              - /url: /back-this
        - generic [ref=e70]:
          - heading "Contact" [level=4] [ref=e71]
          - paragraph [ref=e72]: For press, management & enquiries
          - link "hello@gannonwaye.com" [ref=e73] [cursor=pointer]:
            - /url: mailto:hello@gannonwaye.com
          - heading "Legal" [level=4] [ref=e74]
          - generic [ref=e75]:
            - link "Privacy Policy" [ref=e76] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e77] [cursor=pointer]:
              - /url: /terms-of-service
            - link "Contact Gannon" [ref=e78] [cursor=pointer]:
              - /url: /contact
          - heading "Social" [level=4] [ref=e79]
          - generic [ref=e80]:
            - link "Instagram @gann0nwaye" [ref=e81] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e82] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e83] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e84]:
        - paragraph [ref=e85]: Stay in the loop
        - heading "New music & community updates" [level=3] [ref=e86]
        - generic [ref=e87]:
          - textbox "Your name *" [ref=e88]
          - textbox "your@email.com *" [ref=e89]
          - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e90]
          - textbox "Birthday (optional — we'll send you something special)" [ref=e91]
          - paragraph [ref=e92]: Birthday optional — we'll send you something special 🎂
          - combobox [ref=e93]:
            - option "How did you find me? *" [selected]
            - option "Google"
            - option "Instagram"
            - option "Facebook"
            - option "TikTok"
            - option "X (Twitter)"
            - option "Friend / Word of Mouth"
            - option "I know Gannon"
            - option "Other"
          - button "Subscribe" [ref=e94] [cursor=pointer]
      - generic [ref=e95]:
        - paragraph [ref=e96]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
        - paragraph [ref=e97]: "* The AI memorial reflective companion available on the tribute page (/mum) is configured as a comforting, gentle remembrance journal companion. It is not an active representation of Sonia, does not offer professional medical, legal, or grief counseling, and should not be used as a substitute for clinical therapy."
      - generic [ref=e98]:
        - generic [ref=e99]:
          - img "GW Heart" [ref=e100]
          - link "Support the project 🤍" [ref=e101] [cursor=pointer]:
            - /url: /back-this
          - img "GW Heart" [ref=e102]
        - paragraph [ref=e103]: © 2026 Gannon Waye. All rights reserved.
```