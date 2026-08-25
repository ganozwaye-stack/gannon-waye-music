# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment-success.spec.js >> Payment Success & Cancel Routes >> no 404 page shown on any success/cancel route
- Location: src/gannonwaye-playwright-pack/tests/payment-success.spec.js:64:3

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "could not be found"
Received string:        "<!doctype html><html lang=\"en\"><head>
    <meta charset=\"utf-8\">
    <link rel=\"icon\" type=\"image/svg+xml\" href=\"https://base44.com/logo_v2.svg\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <link rel=\"canonical\" href=\"https://gannonwaye.com/\">
    <link rel=\"manifest\" href=\"/manifest.json\">
    <title>gannon waye music</title>
    <meta name=\"description\" content=\"official website of australian singer-songwriter gannon waye. explore the artist story, community, store, and music approved for public sharing.\">

    <meta property=\"og:type\" content=\"website\">
    <meta property=\"og:title\" content=\"gannon waye music\">
    <meta property=\"og:description\" content=\"official website of australian singer-songwriter gannon waye. music approved for public sharing appears on the music page.\">
    <meta property=\"og:image\" content=\"https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png\">
    <meta property=\"og:image:width\" content=\"1200\">
    <meta property=\"og:image:height\" content=\"630\">

    <meta name=\"twitter:card\" content=\"summary_large_image\">
    <meta name=\"twitter:title\" content=\"gannon waye music\">
    <meta name=\"twitter:description\" content=\"official artist website. music approved for public sharing appears on the music page.\">
    <meta name=\"twitter:image\" content=\"https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png\">

    <script>
      function loadscript(a) {
        var b = document.getelementsbytagname(\"head\")[0],
            c = document.createelement(\"script\");
        c.type = \"text/javascript\";
        c.src = \"https://tracker.metricool.com/resources/be.js\";
        c.onreadystatechange = a;
        c.onload = a;
        b.appendchild(c);
      }
      loadscript(function() {
        if (window.betracker) {
          window.betracker.t({ hash: \"43e1b8642d4b57b01f381dc3811a224c\" });
        }
      });
    </script><script type=\"text/javascript\" src=\"https://tracker.metricool.com/resources/be.js\"></script>

    <script async=\"\" src=\"https://www.googletagmanager.com/gtag/js?id=g-xxxxxxxxxx\"></script>
    <script>
      window.datalayer = window.datalayer || [];
      function gtag() { window.datalayer.push(arguments); }
      window.gtag = gtag;
      gtag(\"js\", new date());
      gtag(\"config\", \"g-xxxxxxxxxx\", { send_page_view: true });
    </script>

    <script type=\"application/ld+json\">
    {
      \"@context\": \"https://schema.org\",
      \"@type\": \"musicgroup\",
      \"name\": \"gannon waye\",
      \"genre\": \"contemporary pop / singer-songwriter\",
      \"url\": \"https://gannonwaye.com/\",
      \"image\": \"https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png\"
    }
    </script>
    <script type=\"module\" crossorigin=\"\" src=\"/assets/index-bmadidfq.js\"></script>
    <link rel=\"stylesheet\" crossorigin=\"\" href=\"/assets/index-dz5zfmuk.css\">
    <script type=\"module\">
if (window.self === window.top) {
  let lastpath = \"\";
  function getpagenamefrompath(path) {
    const segments = path.split(\"/\").filter(boolean);
    return segments[0] || null;
  }
  function trackpageview() {
    const path = window.location.pathname;
    if (path === lastpath) return;
    lastpath = path;
    const pagename = getpagenamefrompath(path) || \"home\";
    const appid = \"69eb7905ca6eb4180010f794\";
    if (!appid) return;
    fetch(`/api/app-logs/${appid}/log-user-in-app/${pagename}`, {
      method: \"post\",
    }).catch(() => {});
  }
  const originalpushstate = history.pushstate.bind(history);
  history.pushstate = function (...args) {
    originalpushstate(...args);
    trackpageview();
  };
  const originalreplacestate = history.replacestate.bind(history);
  history.replacestate = function (...args) {
    originalreplacestate(...args);
    trackpageview();
  };
  window.addeventlistener(\"popstate\", trackpageview);
  trackpageview();
}
</script>
  <style type=\"text/css\">[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,blinkmacsystemfont,segoe ui,roboto,helvetica neue,arial,noto sans,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol,noto color emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translatex(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translatey(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translatey(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translatey(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaley(3) translatey(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaley(3) translatey(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaley(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translatey(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translatey(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translatey(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translatey(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translatey(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translatey(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translatey(var(--swipe-amount-y,0)) translatex(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translatex(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translatex(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translatex(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translatex(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translatey(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translatey(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translatey(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translatey(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}</style><script src=\"https://js.stripe.com/v3\"></script></head>

  <body>
    <div id=\"root\"><div class=\"min-h-screen flex items-center justify-center p-6 bg-background\"><div class=\"max-w-md w-full\"><div class=\"text-center space-y-6\"><div class=\"space-y-2\"><h1 class=\"text-7xl font-display text-muted-foreground/30\">404</h1><div class=\"h-px w-16 bg-border mx-auto\"></div></div><div class=\"space-y-3\"><h2 class=\"text-2xl font-display text-foreground\">page not found</h2><p class=\"font-body text-muted-foreground leading-relaxed\">the page <span class=\"font-medium text-foreground\">\"store/checkout-success\"</span> could not be found.</p></div><div class=\"pt-6\"><button class=\"inline-flex items-center px-6 py-3 text-sm font-body tracking-wider uppercase text-foreground bg-card border border-border/40 rounded-full hover:border-primary/30 hover:text-primary transition-colors\">go home</button></div></div></div></div><div class=\"fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] \" style=\"pointer-events: none;\"><div class=\"fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] \" style=\"pointer-events: none;\"></div></div></div>
  

<script type=\"text/javascript\" crossorigin=\"anonymous\" src=\"https://us-assets.i.posthog.com/array/phc_yamdjc6mmr3xryqhqqqngyb4zxq4my9goc9qkrwkp8ij/config.js\"></script></body></html>"
```

# Page snapshot

```yaml
- generic [ref=e5]:
  - heading "404" [level=1] [ref=e7]
  - generic [ref=e9]:
    - heading "Page Not Found" [level=2] [ref=e10]
    - paragraph [ref=e11]:
      - text: The page
      - generic [ref=e12]: "\"store/checkout-success\""
      - text: could not be found.
  - button "Go Home" [ref=e14] [cursor=pointer]
```

# Test source

```ts
  1  | // @ts-check
  2  |  
  3  | /* eslint-disable no-undef */
  4  | const { test, expect } = require('@playwright/test');
  5  | 
  6  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  7  | 
  8  | test.describe('Payment Success & Cancel Routes', () => {
  9  |   test('/checkout-success returns 200 and shows page', async ({ page }) => {
  10 |     const response = await page.goto(`${BASE_URL}/checkout-success`);
  11 |     expect(response?.status()).not.toBe(404);
  12 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  13 |   });
  14 | 
  15 |   test('/store/checkout-success returns 200 and shows page', async ({ page }) => {
  16 |     const response = await page.goto(`${BASE_URL}/store/checkout-success`);
  17 |     expect(response?.status()).not.toBe(404);
  18 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  19 |   });
  20 | 
  21 |   test('/payment-success returns 200 and shows page', async ({ page }) => {
  22 |     const response = await page.goto(`${BASE_URL}/payment-success`);
  23 |     expect(response?.status()).not.toBe(404);
  24 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  25 |   });
  26 | 
  27 |   test('/order-success returns 200 and shows page', async ({ page }) => {
  28 |     const response = await page.goto(`${BASE_URL}/order-success`);
  29 |     expect(response?.status()).not.toBe(404);
  30 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('/checkout-cancel returns 200 and shows cancel page', async ({ page }) => {
  34 |     const response = await page.goto(`${BASE_URL}/checkout-cancel`);
  35 |     expect(response?.status()).not.toBe(404);
  36 |     await expect(page.locator('text=Checkout Cancelled')).toBeVisible();
  37 |   });
  38 | 
  39 |   test('/store/checkout-cancel returns 200 and shows cancel page', async ({ page }) => {
  40 |     const response = await page.goto(`${BASE_URL}/store/checkout-cancel`);
  41 |     expect(response?.status()).not.toBe(404);
  42 |     await expect(page.locator('text=Checkout Cancelled')).toBeVisible();
  43 |   });
  44 | 
  45 |   test('/checkout-success with session_id shows reference', async ({ page }) => {
  46 |     await page.goto(`${BASE_URL}/checkout-success?session_id=cs_test_abc123`);
  47 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  48 |     await expect(page.locator('text=cs_test_abc123')).toBeVisible();
  49 |   });
  50 | 
  51 |   test('success page has Return to Store button', async ({ page }) => {
  52 |     await page.goto(`${BASE_URL}/checkout-success`);
  53 |     await expect(page.locator('text=Return to Store')).toBeVisible();
  54 |   });
  55 | 
  56 |   test('cancel page has Return to Store button', async ({ page }) => {
  57 |     await page.goto(`${BASE_URL}/checkout-cancel`);
  58 |     const returnBtn = page.locator('text=Return to Store');
  59 |     await expect(returnBtn).toBeVisible();
  60 |     await returnBtn.click();
  61 |     await expect(page).toHaveURL(/\/store/);
  62 |   });
  63 | 
  64 |   test('no 404 page shown on any success/cancel route', async ({ page }) => {
  65 |     const routes = [
  66 |       '/checkout-success',
  67 |       '/store/checkout-success',
  68 |       '/payment-success',
  69 |       '/order-success',
  70 |       '/checkout-cancel',
  71 |       '/store/checkout-cancel',
  72 |     ];
  73 |     for (const route of routes) {
  74 |       await page.goto(`${BASE_URL}${route}`);
  75 |       const content = await page.content();
> 76 |       expect(content.toLowerCase()).not.toContain('could not be found');
     |                                         ^ Error: expect(received).not.toContain(expected) // indexOf
  77 |       expect(content.toLowerCase()).not.toContain('page not found');
  78 |     }
  79 |   });
  80 | });
```