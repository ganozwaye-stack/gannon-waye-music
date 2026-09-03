# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: route-click-proof.spec.js >> API Keys Not Exposed In Frontend >> No print provider API keys exposed in /admin/print-fulfilment
- Location: src/gannonwaye-playwright-pack/tests/route-click-proof.spec.js:93:7

# Error details

```
Error: expect(received).not.toMatch(expected)

Expected pattern: not /[a-f0-9]{32,}/
Received string:      "<!DOCTYPE html><html lang=\"en\"><head>
    <script type=\"module\">import { injectIntoGlobalHook } from \"/@react-refresh\";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;</script>

    <script type=\"module\" src=\"/@vite/client\"></script>

    <meta charset=\"UTF-8\">
    <link rel=\"icon\" type=\"image/png\" href=\"https://media.base44.com/images/public/69eb7905ca6eb4180010f794/adcdec40c_GWheartlacewrap.png\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <link rel=\"canonical\" href=\"https://gannonwaye.com/\">
    <link rel=\"manifest\" href=\"/manifest.json\">
    <title>Gannon Waye | Australian Singer-Songwriter</title>
    <meta name=\"description\" content=\"Official website of Australian singer-songwriter Gannon Waye. Hear emotionally honest music, discover the story, wear the message, and connect.\">
    <meta name=\"theme-color\" content=\"#08080e\">

    <meta property=\"og:type\" content=\"website\">
    <meta property=\"og:title\" content=\"Gannon Waye | Australian Singer-Songwriter\">
    <meta property=\"og:description\" content=\"Emotionally honest independent music about survival, grief, self-worth, and choosing yourself.\">
    <meta property=\"og:url\" content=\"https://gannonwaye.com/\">
    <meta property=\"og:site_name\" content=\"Gannon Waye\">
    <meta property=\"og:image\" content=\"https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png\">
    <meta property=\"og:image:width\" content=\"1200\">
    <meta property=\"og:image:height\" content=\"630\">

    <meta name=\"twitter:card\" content=\"summary_large_image\">
    <meta name=\"twitter:title\" content=\"Gannon Waye | Australian Singer-Songwriter\">
    <meta name=\"twitter:description\" content=\"Emotionally honest independent music about survival, grief, self-worth, and choosing yourself.\">
    <meta name=\"twitter:image\" content=\"https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png\">

    <script>
      function loadScript(a) {
        var b = document.getElementsByTagName(\"head\")[0],
            c = document.createElement(\"script\");
        c.type = \"text/javascript\";
        c.src = \"https://tracker.metricool.com/resources/be.js\";
        c.onreadystatechange = a;
        c.onload = a;
        b.appendChild(c);
      }
      loadScript(function() {
        if (window.beTracker) {
          window.beTracker.t({ hash: \"43e1b8642d4b57b01f381dc3811a224c\" });
        }
      });
    </script><script type=\"text/javascript\" src=\"https://tracker.metricool.com/resources/be.js\"></script>

    <script type=\"application/ld+json\">
    {
      \"@context\": \"https://schema.org\",
      \"@type\": \"MusicGroup\",
      \"name\": \"Gannon Waye\",
      \"genre\": \"Contemporary Pop / Singer-Songwriter\",
      \"url\": \"https://gannonwaye.com/\",
      \"image\": \"https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png\"
    }
    </script>
      <!-- Tailwind CSS CDN for visual editing -->
    <script src=\"https://cdn.tailwindcss.com\"></script>
    <script src=\"/node_modules/@base44/vite-plugin/dist/injections/unhandled-errors-handlers.js\" type=\"module\"></script>
    <script src=\"/node_modules/@base44/vite-plugin/dist/injections/sandbox-hmr-notifier.js\" type=\"module\"></script>
    <script src=\"/node_modules/@base44/vite-plugin/dist/injections/navigation-notifier.js\" type=\"module\"></script>
  <style>*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.fixed{position:fixed}.bottom-\\[calc\\(8\\.75rem\\+env\\(safe-area-inset-bottom\\)\\)\\]{bottom:calc(8.75rem + env(safe-area-inset-bottom))}.right-4{right:1rem}.top-0{top:0px}.z-50{z-index:50}.z-\\[100\\]{z-index:100}.mx-auto{margin-left:auto;margin-right:auto}.flex{display:flex}.inline-flex{display:inline-flex}.h-8{height:2rem}.h-px{height:1px}.max-h-screen{max-height:100vh}.min-h-screen{min-height:100vh}.w-16{width:4rem}.w-full{width:100%}.max-w-md{max-width:28rem}.flex-col-reverse{flex-direction:column-reverse}.items-center{align-items:center}.justify-center{justify-content:center}.gap-2{gap:0.5rem}.space-y-2 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.5rem * var(--tw-space-y-reverse))}.space-y-3 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.75rem * var(--tw-space-y-reverse))}.space-y-6 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem * var(--tw-space-y-reverse))}.whitespace-nowrap{white-space:nowrap}.rounded-full{border-radius:9999px}.border{border-width:1px}.border-0{border-width:0px}.p-4{padding:1rem}.p-6{padding:1.5rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-3{padding-top:0.75rem;padding-bottom:0.75rem}.pt-6{padding-top:1.5rem}.text-center{text-align:center}.text-2xl{font-size:1.5rem;line-height:2rem}.text-7xl{font-size:4.5rem;line-height:1}.text-sm{font-size:0.875rem;line-height:1.25rem}.text-xs{font-size:0.75rem;line-height:1rem}.font-medium{font-weight:500}.uppercase{text-transform:uppercase}.leading-relaxed{line-height:1.625}.tracking-wider{letter-spacing:0.05em}.shadow{--tw-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.transition-colors{transition-property:color, background-color, border-color, fill, stroke, -webkit-text-decoration-color;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, -webkit-text-decoration-color;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.focus-visible\\:outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.focus-visible\\:ring-1:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:opacity-50:disabled{opacity:0.5}@media (min-width: 640px){.sm\\:bottom-0{bottom:0px}.sm\\:bottom-4{bottom:1rem}.sm\\:right-0{right:0px}.sm\\:top-auto{top:auto}.sm\\:flex-col{flex-direction:column}}@media (min-width: 768px){.md\\:max-w-\\[420px\\]{max-width:420px}}.\\[\\&_svg\\]\\:pointer-events-none svg{pointer-events:none}.\\[\\&_svg\\]\\:size-4 svg{width:1rem;height:1rem}.\\[\\&_svg\\]\\:shrink-0 svg{flex-shrink:0}</style><style type=\"text/css\">[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}</style><style type=\"text/css\" data-vite-dev-id=\"/app/src/index.css\">@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Dancing+Script:wght@400;600&family=Poppins:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap');

*, ::before, ::after{
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

::backdrop{
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

/*
! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com
*/

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: #e5e7eb; /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured `sans` font-family by default.
5. Use the user's configured `sans` font-feature-settings by default.
6. Use the user's configured `sans` font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  -o-tab-size: 4;
     tab-size: 4; /* 3 */
  font-family: ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */
  font-feature-settings: normal; /* 5 */
  font-variation-settings: normal; /* 6 */
  -webkit-tap-highlight-color: transparent; /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
*/

body {
  margin: 0; /* 1 */
  line-height: inherit; /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured `mono` font-family by default.
2. Use the user's configured `mono` font-feature-settings by default.
3. Use the user's configured `mono` font-variation-settings by default.
4. Correct the odd `em` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */
  font-feature-settings: normal; /* 2 */
  font-variation-settings: normal; /* 3 */
  font-size: 1em; /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent `sub` and `sup` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-feature-settings: inherit; /* 1 */
  font-variation-settings: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  letter-spacing: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
input:where([type='button']),
input:where([type='reset']),
input:where([type='submit']) {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to `inherit` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/

dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role=\"button\"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */

[hidden]:where(:not([hidden=\"until-found\"])) {
  display: none;
}

:root {
    --font-display: 'Playfair Display', serif;
    --font-body: 'Poppins', sans-serif;
    --font-serif: 'Cormorant Garamond', serif;
    --garden-navy: 156 35% 4%;
    --garden-cream: 47 100% 93%;
    --garden-gold: 46 63% 52%;
    --garden-green: 133 29% 23%;
    --garden-green-deep: 150 33% 12%;
    --garden-orange: 16 67% 63%;
    --garden-mist: 200 14% 72%;

    --background: 220 15% 6%;
    --foreground: 38 45% 90%;
    --card: 220 12% 9%;
    --card-foreground: 38 45% 90%;
    --popover: 220 12% 9%;
    --popover-foreground: 38 45% 90%;
    --primary: 46 63% 52%;
    --primary-foreground: 220 15% 6%;
    --secondary: 220 10% 14%;
    --secondary-foreground: 38 40% 80%;
    --muted: 220 10% 14%;
    --muted-foreground: 38 22% 60%;
    --accent: 46 63% 52%;
    --accent-foreground: 38 45% 90%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 220 10% 16%;
    --input: 220 10% 16%;
    --ring: 46 63% 52%;
    --chart-1: 46 63% 52%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
    --sidebar-background: 220 12% 8%;
    --sidebar-foreground: 38 40% 80%;
    --sidebar-primary: 46 63% 52%;
    --sidebar-primary-foreground: 220 15% 6%;
    --sidebar-accent: 220 10% 14%;
    --sidebar-accent-foreground: 38 40% 80%;
    --sidebar-border: 220 10% 16%;
    --sidebar-ring: 46 63% 52%;
  }

.dark {
    --background: 220 15% 6%;
    --foreground: 38 45% 90%;
    --card: 220 12% 9%;
    --card-foreground: 38 45% 90%;
    --popover: 220 12% 9%;
    --popover-foreground: 38 45% 90%;
    --primary: 46 63% 52%;
    --primary-foreground: 220 15% 6%;
    --secondary: 220 10% 14%;
    --secondary-foreground: 38 40% 80%;
    --muted: 220 10% 14%;
    --muted-foreground: 38 22% 60%;
    --accent: 46 63% 52%;
    --accent-foreground: 38 45% 90%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 220 10% 16%;
    --input: 220 10% 16%;
    --ring: 46 63% 52%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 220 12% 8%;
    --sidebar-foreground: 38 40% 80%;
    --sidebar-primary: 46 63% 52%;
    --sidebar-primary-foreground: 220 15% 6%;
    --sidebar-accent: 220 10% 14%;
    --sidebar-accent-foreground: 38 40% 80%;
    --sidebar-border: 220 10% 16%;
    --sidebar-ring: 46 63% 52%;
  }

*{
  border-color: hsl(var(--border));
  outline-color: hsl(var(--ring) / 0.5);
}

body{
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
    /* overscroll-behavior: none was here and is deliberately gone.
       On iOS it suppresses rubber-banding, and combined with a root-level
       scroll container it can leave the page feeling stuck on touch. */
    overscroll-behavior-y: auto;
    padding-bottom: env(safe-area-inset-bottom);
    /* belt and braces: guarantee touch scrolling on older iOS WebKit */
    -webkit-overflow-scrolling: touch;
}

/* padding-top was on <html>. Root-element padding fights viewport height
     maths on iOS and pushes content past the fold. Safe-area inset belongs
     on the body, not on the root. */

html {
    -webkit-text-size-adjust: 100%;
  }

body {
    padding-top: env(safe-area-inset-top);
  }

button, a, [role=\"button\"]{
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}

p, span, h1, h2, h3, h4, h5, h6{
  -webkit-user-select: text;
     -moz-user-select: text;
          user-select: text;
}

/* ── Mobile overflow safety net ── */

/* body ONLY, never html: overflow on <html> stops the browser propagating
     the body's overflow to the viewport, which kills document scrolling,
     breaks every position:sticky on the site, and makes framer-motion's
     useScroll() read zero (all the garden parallax dies with it).
     `clip` instead of `hidden`: it prevents horizontal overflow WITHOUT
     creating a scroll container, so sticky keeps working. */

body {
    max-width: 100%;
    /* hidden is the fallback for older iOS Safari, which shipped `clip`
       only in v16. On body (never html) `hidden` still scrolls vertically. */
    overflow-x: hidden;
  }

/* Where `clip` is supported, prefer it — it stops horizontal overflow
     WITHOUT creating a scroll container, so position:sticky keeps working. */

@supports (overflow-x: clip) {
    body {
      overflow-x: clip;
    }
  }

img, video, canvas, svg, iframe {
    max-width: 100%;
    height: auto;
  }

/* long strings (URLs, emails, long words) wrap instead of pushing layout off-screen */

p, h1, h2, h3, h4, h5, h6, span, a, li, button, label, td, th, div {
    overflow-wrap: anywhere;
  }

/* prevent any element from blowing past its container on small screens */

table, pre, code {
    max-width: 100%;
  }

table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

.\\!container{
  width: 100% !important;
}

.container{
  width: 100%;
}

@media (min-width: 640px){

  .\\!container{
    max-width: 640px !important;
  }

  .container{
    max-width: 640px;
  }
}

@media (min-width: 768px){

  .\\!container{
    max-width: 768px !important;
  }

  .container{
    max-width: 768px;
  }
}

@media (min-width: 1024px){

  .\\!container{
    max-width: 1024px !important;
  }

  .container{
    max-width: 1024px;
  }
}

@media (min-width: 1280px){

  .\\!container{
    max-width: 1280px !important;
  }

  .container{
    max-width: 1280px;
  }
}

@media (min-width: 1536px){

  .\\!container{
    max-width: 1536px !important;
  }

  .container{
    max-width: 1536px;
  }
}

.gradient-gold-text{
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
    background-image: linear-gradient(90deg, #a9842c 0%, #d4af37 38%, #f0e6c8 50%, #d4af37 62%, #a9842c 100%);
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.3));
    -webkit-text-stroke: 0.5px rgba(30, 25, 15, 0.6);
}

.gradient-gold-glow{
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
    background-image: linear-gradient(90deg, #a9842c 0%, #d4af37 38%, #f0e6c8 50%, #d4af37 62%, #a9842c 100%);
    filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.4)) drop-shadow(0 0 6px rgba(212, 175, 55, 0.3));
    -webkit-text-stroke: 0.5px rgba(30, 25, 15, 0.6);
}

.gradient-gold-button{
  font-weight: 500;
  color: hsl(var(--primary-foreground));
    background: linear-gradient(90deg, #a9842c 0%, #d4af37 38%, #f0e6c8 50%, #d4af37 62%, #a9842c 100%);
    box-shadow: 0 0 12px rgba(212, 175, 55, 0.3);
    transition: all 0.3s ease;
}

.gradient-gold-button:hover {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
    transform: translateY(-2px);
  }

.gw-neon-name {
    color: #FDF4E0;
    text-shadow:
      0 0 6px rgba(253, 244, 224, 0.9),
      0 0 18px rgba(212, 175, 55, 0.7),
      0 0 42px rgba(212, 175, 55, 0.45),
      0 0 80px rgba(212, 175, 55, 0.25);
    animation: gwNeonPulse 3.6s ease-in-out infinite;
  }

.sr-only{
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.pointer-events-none{
  pointer-events: none;
}

.pointer-events-auto{
  pointer-events: auto;
}

.visible{
  visibility: visible;
}

.invisible{
  visibility: hidden;
}

.collapse{
  visibility: collapse;
}

.static{
  position: static;
}

.fixed{
  position: fixed;
}

.absolute{
  position: absolute;
}

.relative{
  position: relative;
}

.sticky{
  position: sticky;
}

.-inset-1{
  inset: -0.25rem;
}

.-inset-10{
  inset: -2.5rem;
}

.-inset-4{
  inset: -1rem;
}

.inset-0{
  inset: 0px;
}

.inset-2{
  inset: 0.5rem;
}

.inset-x-0{
  left: 0px;
  right: 0px;
}

.inset-y-0{
  top: 0px;
  bottom: 0px;
}

.-bottom-12{
  bottom: -3rem;
}

.-left-1{
  left: -0.25rem;
}

.-left-1\\.5{
  left: -0.375rem;
}

.-left-12{
  left: -3rem;
}

.-left-2{
  left: -0.5rem;
}

.-left-8{
  left: -2rem;
}

.-right-0\\.5{
  right: -0.125rem;
}

.-right-1{
  right: -0.25rem;
}

.-right-1\\.5{
  right: -0.375rem;
}

.-right-12{
  right: -3rem;
}

.-right-8{
  right: -2rem;
}

.-top-0\\.5{
  top: -0.125rem;
}

.-top-1{
  top: -0.25rem;
}

.-top-1\\.5{
  top: -0.375rem;
}

.-top-12{
  top: -3rem;
}

.-top-3{
  top: -0.75rem;
}

.-top-5{
  top: -1.25rem;
}

.-top-6{
  top: -1.5rem;
}

.-top-8{
  top: -2rem;
}

.bottom-0{
  bottom: 0px;
}

.bottom-1{
  bottom: 0.25rem;
}

.bottom-10{
  bottom: 2.5rem;
}

.bottom-16{
  bottom: 4rem;
}

.bottom-2{
  bottom: 0.5rem;
}

.bottom-2\\.5{
  bottom: 0.625rem;
}

.bottom-24{
  bottom: 6rem;
}

.bottom-3{
  bottom: 0.75rem;
}

.bottom-4{
  bottom: 1rem;
}

.bottom-5{
  bottom: 1.25rem;
}

.bottom-6{
  bottom: 1.5rem;
}

.bottom-8{
  bottom: 2rem;
}

.bottom-\\[18\\%\\]{
  bottom: 18%;
}

.bottom-\\[calc\\(4\\.5rem\\+env\\(safe-area-inset-bottom\\)\\)\\]{
  bottom: calc(4.5rem + env(safe-area-inset-bottom));
}

.bottom-\\[calc\\(8\\.75rem\\+env\\(safe-area-inset-bottom\\)\\)\\]{
  bottom: calc(8.75rem + env(safe-area-inset-bottom));
}

.left-0{
  left: 0px;
}

.left-0\\.5{
  left: 0.125rem;
}

.left-1{
  left: 0.25rem;
}

.left-1\\/2{
  left: 50%;
}

.left-1\\/4{
  left: 25%;
}

.left-2{
  left: 0.5rem;
}

.left-2\\.5{
  left: 0.625rem;
}

.left-3{
  left: 0.75rem;
}

.left-4{
  left: 1rem;
}

.left-5{
  left: 1.25rem;
}

.left-8{
  left: 2rem;
}

.left-\\[50\\%\\]{
  left: 50%;
}

.right-0{
  right: 0px;
}

.right-1{
  right: 0.25rem;
}

.right-1\\/4{
  right: 25%;
}

.right-12{
  right: 3rem;
}

.right-2{
  right: 0.5rem;
}

.right-2\\.5{
  right: 0.625rem;
}

.right-3{
  right: 0.75rem;
}

.right-4{
  right: 1rem;
}

.right-5{
  right: 1.25rem;
}

.right-6{
  right: 1.5rem;
}

.right-full{
  right: 100%;
}

.top-0{
  top: 0px;
}

.top-0\\.5{
  top: 0.125rem;
}

.top-1{
  top: 0.25rem;
}

.top-1\\.5{
  top: 0.375rem;
}

.top-1\\/2{
  top: 50%;
}

.top-16{
  top: 4rem;
}

.top-2{
  top: 0.5rem;
}

.top-2\\.5{
  top: 0.625rem;
}

.top-3{
  top: 0.75rem;
}

.top-3\\.5{
  top: 0.875rem;
}

.top-32{
  top: 8rem;
}

.top-4{
  top: 1rem;
}

.top-5{
  top: 1.25rem;
}

.top-6{
  top: 1.5rem;
}

.top-\\[10\\%\\]{
  top: 10%;
}

.top-\\[1px\\]{
  top: 1px;
}

.top-\\[32\\%\\]{
  top: 32%;
}

.top-\\[50\\%\\]{
  top: 50%;
}

.top-\\[60\\%\\]{
  top: 60%;
}

.top-full{
  top: 100%;
}

.-z-10{
  z-index: -10;
}

.z-0{
  z-index: 0;
}

.z-10{
  z-index: 10;
}

.z-20{
  z-index: 20;
}

.z-30{
  z-index: 30;
}

.z-40{
  z-index: 40;
}

.z-50{
  z-index: 50;
}

.z-\\[100\\]{
  z-index: 100;
}

.z-\\[10\\]{
  z-index: 10;
}

.z-\\[1\\]{
  z-index: 1;
}

.z-\\[200\\]{
  z-index: 200;
}

.z-\\[2\\]{
  z-index: 2;
}

.z-\\[3\\]{
  z-index: 3;
}

.z-\\[4\\]{
  z-index: 4;
}

.z-\\[5\\]{
  z-index: 5;
}

.z-\\[60\\]{
  z-index: 60;
}

.col-span-1{
  grid-column: span 1 / span 1;
}

.col-span-10{
  grid-column: span 10 / span 10;
}

.col-span-2{
  grid-column: span 2 / span 2;
}

.col-span-3{
  grid-column: span 3 / span 3;
}

.row-span-2{
  grid-row: span 2 / span 2;
}

.-mx-1{
  margin-left: -0.25rem;
  margin-right: -0.25rem;
}

.-mx-2{
  margin-left: -0.5rem;
  margin-right: -0.5rem;
}

.mx-1{
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.mx-2{
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.mx-3\\.5{
  margin-left: 0.875rem;
  margin-right: 0.875rem;
}

.mx-6{
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}

.mx-auto{
  margin-left: auto;
  margin-right: auto;
}

.my-0\\.5{
  margin-top: 0.125rem;
  margin-bottom: 0.125rem;
}

.my-1{
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.my-10{
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
}

.my-2{
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.my-3{
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

.my-4{
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.my-6{
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.my-8{
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.my-auto{
  margin-top: auto;
  margin-bottom: auto;
}

.-ml-4{
  margin-left: -1rem;
}

.-mt-4{
  margin-top: -1rem;
}

.mb-0\\.5{
  margin-bottom: 0.125rem;
}

.mb-1{
  margin-bottom: 0.25rem;
}

.mb-1\\.5{
  margin-bottom: 0.375rem;
}

.mb-10{
  margin-bottom: 2.5rem;
}

.mb-12{
  margin-bottom: 3rem;
}

.mb-14{
  margin-bottom: 3.5rem;
}

.mb-16{
  margin-bottom: 4rem;
}

.mb-2{
  margin-bottom: 0.5rem;
}

.mb-2\\.5{
  margin-bottom: 0.625rem;
}

.mb-20{
  margin-bottom: 5rem;
}

.mb-3{
  margin-bottom: 0.75rem;
}

.mb-4{
  margin-bottom: 1rem;
}

.mb-5{
  margin-bottom: 1.25rem;
}

.mb-6{
  margin-bottom: 1.5rem;
}

.mb-7{
  margin-bottom: 1.75rem;
}

.mb-8{
  margin-bottom: 2rem;
}

.ml-0\\.5{
  margin-left: 0.125rem;
}

.ml-1{
  margin-left: 0.25rem;
}

.ml-10{
  margin-left: 2.5rem;
}

.ml-2{
  margin-left: 0.5rem;
}

.ml-3{
  margin-left: 0.75rem;
}

.ml-4{
  margin-left: 1rem;
}

.ml-5{
  margin-left: 1.25rem;
}

.ml-auto{
  margin-left: auto;
}

.mr-0\\.5{
  margin-right: 0.125rem;
}

.mr-1{
  margin-right: 0.25rem;
}

.mr-1\\.5{
  margin-right: 0.375rem;
}

.mr-2{
  margin-right: 0.5rem;
}

.mr-4{
  margin-right: 1rem;
}

.mt-0\\.5{
  margin-top: 0.125rem;
}

.mt-1{
  margin-top: 0.25rem;
}

.mt-1\\.5{
  margin-top: 0.375rem;
}

.mt-10{
  margin-top: 2.5rem;
}

.mt-12{
  margin-top: 3rem;
}

.mt-14{
  margin-top: 3.5rem;
}

.mt-16{
  margin-top: 4rem;
}

.mt-2{
  margin-top: 0.5rem;
}

.mt-2\\.5{
  margin-top: 0.625rem;
}

.mt-20{
  margin-top: 5rem;
}

.mt-24{
  margin-top: 6rem;
}

.mt-3{
  margin-top: 0.75rem;
}

.mt-4{
  margin-top: 1rem;
}

.mt-5{
  margin-top: 1.25rem;
}

.mt-6{
  margin-top: 1.5rem;
}

.mt-7{
  margin-top: 1.75rem;
}

.mt-8{
  margin-top: 2rem;
}

.mt-auto{
  margin-top: auto;
}

.line-clamp-1{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.line-clamp-4{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.line-clamp-6{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
}

.block{
  display: block;
}

.inline-block{
  display: inline-block;
}

.inline{
  display: inline;
}

.flex{
  display: flex;
}

.inline-flex{
  display: inline-flex;
}

.table{
  display: table;
}

.grid{
  display: grid;
}

.hidden{
  display: none;
}

.aspect-\\[3\\/2\\]{
  aspect-ratio: 3/2;
}

.aspect-\\[3\\/4\\]{
  aspect-ratio: 3/4;
}

.aspect-\\[4\\/3\\]{
  aspect-ratio: 4/3;
}

.aspect-\\[4\\/5\\]{
  aspect-ratio: 4/5;
}

.aspect-\\[9\\/16\\]{
  aspect-ratio: 9/16;
}

.aspect-square{
  aspect-ratio: 1 / 1;
}

.aspect-video{
  aspect-ratio: 16 / 9;
}

.size-4{
  width: 1rem;
  height: 1rem;
}

.h-0\\.5{
  height: 0.125rem;
}

.h-1{
  height: 0.25rem;
}

.h-1\\.5{
  height: 0.375rem;
}

.h-1\\/2{
  height: 50%;
}

.h-1\\/3{
  height: 33.333333%;
}

.h-10{
  height: 2.5rem;
}

.h-11{
  height: 2.75rem;
}

.h-12{
  height: 3rem;
}

.h-14{
  height: 3.5rem;
}

.h-16{
  height: 4rem;
}

.h-2{
  height: 0.5rem;
}

.h-2\\.5{
  height: 0.625rem;
}

.h-2\\/3{
  height: 66.666667%;
}

.h-20{
  height: 5rem;
}

.h-24{
  height: 6rem;
}

.h-28{
  height: 7rem;
}

.h-3{
  height: 0.75rem;
}

.h-3\\.5{
  height: 0.875rem;
}

.h-32{
  height: 8rem;
}

.h-36{
  height: 9rem;
}

.h-4{
  height: 1rem;
}

.h-40{
  height: 10rem;
}

.h-44{
  height: 11rem;
}

.h-48{
  height: 12rem;
}

.h-5{
  height: 1.25rem;
}

.h-52{
  height: 13rem;
}

.h-6{
  height: 1.5rem;
}

.h-64{
  height: 16rem;
}

.h-7{
  height: 1.75rem;
}

.h-8{
  height: 2rem;
}

.h-9{
  height: 2.25rem;
}

.h-96{
  height: 24rem;
}

.h-\\[180px\\]{
  height: 180px;
}

.h-\\[1px\\]{
  height: 1px;
}

.h-\\[200px\\]{
  height: 200px;
}

.h-\\[300px\\]{
  height: 300px;
}

.h-\\[400px\\]{
  height: 400px;
}

.h-\\[40vh\\]{
  height: 40vh;
}

.h-\\[52px\\]{
  height: 52px;
}

.h-\\[600px\\]{
  height: 600px;
}

.h-\\[6px\\]{
  height: 6px;
}

.h-\\[calc\\(100vh-4rem\\)\\]{
  height: calc(100vh - 4rem);
}

.h-\\[var\\(--radix-navigation-menu-viewport-height\\)\\]{
  height: var(--radix-navigation-menu-viewport-height);
}

.h-\\[var\\(--radix-select-trigger-height\\)\\]{
  height: var(--radix-select-trigger-height);
}

.h-auto{
  height: auto;
}

.h-full{
  height: 100%;
}

.h-px{
  height: 1px;
}

.h-screen{
  height: 100vh;
}

.h-svh{
  height: 100svh;
}

.max-h-0{
  max-height: 0px;
}

.max-h-32{
  max-height: 8rem;
}

.max-h-40{
  max-height: 10rem;
}

.max-h-44{
  max-height: 11rem;
}

.max-h-48{
  max-height: 12rem;
}

.max-h-64{
  max-height: 16rem;
}

.max-h-72{
  max-height: 18rem;
}

.max-h-80{
  max-height: 20rem;
}

.max-h-96{
  max-height: 24rem;
}

.max-h-\\[200px\\]{
  max-height: 200px;
}

.max-h-\\[300px\\]{
  max-height: 300px;
}

.max-h-\\[350px\\]{
  max-height: 350px;
}

.max-h-\\[500px\\]{
  max-height: 500px;
}

.max-h-\\[50vh\\]{
  max-height: 50vh;
}

.max-h-\\[520px\\]{
  max-height: 520px;
}

.max-h-\\[60vh\\]{
  max-height: 60vh;
}

.max-h-\\[70vh\\]{
  max-height: 70vh;
}

.max-h-\\[72vh\\]{
  max-height: 72vh;
}

.max-h-\\[75vh\\]{
  max-height: 75vh;
}

.max-h-\\[80vh\\]{
  max-height: 80vh;
}

.max-h-\\[85vh\\]{
  max-height: 85vh;
}

.max-h-\\[90vh\\]{
  max-height: 90vh;
}

.max-h-\\[calc\\(100dvh-5\\.5rem\\)\\]{
  max-height: calc(100dvh - 5.5rem);
}

.max-h-full{
  max-height: 100%;
}

.max-h-screen{
  max-height: 100vh;
}

.min-h-0{
  min-height: 0px;
}

.min-h-24{
  min-height: 6rem;
}

.min-h-48{
  min-height: 12rem;
}

.min-h-\\[100px\\]{
  min-height: 100px;
}

.min-h-\\[100svh\\]{
  min-height: 100svh;
}

.min-h-\\[120px\\]{
  min-height: 120px;
}

.min-h-\\[160px\\]{
  min-height: 160px;
}

.min-h-\\[200px\\]{
  min-height: 200px;
}

.min-h-\\[220px\\]{
  min-height: 220px;
}

.min-h-\\[250px\\]{
  min-height: 250px;
}

.min-h-\\[260px\\]{
  min-height: 260px;
}

.min-h-\\[3\\.5rem\\]{
  min-height: 3.5rem;
}

.min-h-\\[300px\\]{
  min-height: 300px;
}

.min-h-\\[360px\\]{
  min-height: 360px;
}

.min-h-\\[400px\\]{
  min-height: 400px;
}

.min-h-\\[52px\\]{
  min-height: 52px;
}

.min-h-\\[56vw\\]{
  min-height: 56vw;
}

.min-h-\\[60px\\]{
  min-height: 60px;
}

.min-h-\\[60vh\\]{
  min-height: 60vh;
}

.min-h-\\[70vh\\]{
  min-height: 70vh;
}

.min-h-\\[78vh\\]{
  min-height: 78vh;
}

.min-h-\\[80px\\]{
  min-height: 80px;
}

.min-h-\\[92svh\\]{
  min-height: 92svh;
}

.min-h-full{
  min-height: 100%;
}

.min-h-screen{
  min-height: 100vh;
}

.min-h-svh{
  min-height: 100svh;
}

.w-0{
  width: 0px;
}

.w-0\\.5{
  width: 0.125rem;
}

.w-1{
  width: 0.25rem;
}

.w-1\\.5{
  width: 0.375rem;
}

.w-1\\/2{
  width: 50%;
}

.w-1\\/4{
  width: 25%;
}

.w-10{
  width: 2.5rem;
}

.w-11{
  width: 2.75rem;
}

.w-12{
  width: 3rem;
}

.w-14{
  width: 3.5rem;
}

.w-16{
  width: 4rem;
}

.w-2{
  width: 0.5rem;
}

.w-2\\.5{
  width: 0.625rem;
}

.w-20{
  width: 5rem;
}

.w-24{
  width: 6rem;
}

.w-28{
  width: 7rem;
}

.w-3{
  width: 0.75rem;
}

.w-3\\.5{
  width: 0.875rem;
}

.w-3\\/4{
  width: 75%;
}

.w-32{
  width: 8rem;
}

.w-36{
  width: 9rem;
}

.w-4{
  width: 1rem;
}

.w-40{
  width: 10rem;
}

.w-44{
  width: 11rem;
}

.w-48{
  width: 12rem;
}

.w-5{
  width: 1.25rem;
}

.w-52{
  width: 13rem;
}

.w-56{
  width: 14rem;
}

.w-6{
  width: 1.5rem;
}

.w-60{
  width: 15rem;
}

.w-64{
  width: 16rem;
}

.w-7{
  width: 1.75rem;
}

.w-72{
  width: 18rem;
}

.w-8{
  width: 2rem;
}

.w-9{
  width: 2.25rem;
}

.w-96{
  width: 24rem;
}

.w-\\[--sidebar-width\\]{
  width: var(--sidebar-width);
}

.w-\\[100px\\]{
  width: 100px;
}

.w-\\[1px\\]{
  width: 1px;
}

.w-\\[380px\\]{
  width: 380px;
}

.w-\\[40\\%\\]{
  width: 40%;
}

.w-\\[400px\\]{
  width: 400px;
}

.w-\\[600px\\]{
  width: 600px;
}

.w-\\[6px\\]{
  width: 6px;
}

.w-\\[800px\\]{
  width: 800px;
}

.w-\\[95\\%\\]{
  width: 95%;
}

.w-\\[calc\\(100\\%-1rem\\)\\]{
  width: calc(100% - 1rem);
}

.w-auto{
  width: auto;
}

.w-fit{
  width: -moz-fit-content;
  width: fit-content;
}

.w-full{
  width: 100%;
}

.w-max{
  width: -moz-max-content;
  width: max-content;
}

.w-px{
  width: 1px;
}

.min-w-0{
  min-width: 0px;
}

.min-w-10{
  min-width: 2.5rem;
}

.min-w-28{
  min-width: 7rem;
}

.min-w-48{
  min-width: 12rem;
}

.min-w-5{
  min-width: 1.25rem;
}

.min-w-8{
  min-width: 2rem;
}

.min-w-9{
  min-width: 2.25rem;
}

.min-w-\\[12rem\\]{
  min-width: 12rem;
}

.min-w-\\[130px\\]{
  min-width: 130px;
}

.min-w-\\[16px\\]{
  min-width: 16px;
}

.min-w-\\[200px\\]{
  min-width: 200px;
}

.min-w-\\[48px\\]{
  min-width: 48px;
}

.min-w-\\[80vw\\]{
  min-width: 80vw;
}

.min-w-\\[8rem\\]{
  min-width: 8rem;
}

.min-w-\\[var\\(--radix-select-trigger-width\\)\\]{
  min-width: var(--radix-select-trigger-width);
}

.min-w-max{
  min-width: -moz-max-content;
  min-width: max-content;
}

.max-w-12{
  max-width: 3rem;
}

.max-w-2xl{
  max-width: 42rem;
}

.max-w-3xl{
  max-width: 48rem;
}

.max-w-4xl{
  max-width: 56rem;
}

.max-w-5xl{
  max-width: 64rem;
}

.max-w-6xl{
  max-width: 72rem;
}

.max-w-7xl{
  max-width: 80rem;
}

.max-w-\\[--skeleton-width\\]{
  max-width: var(--skeleton-width);
}

.max-w-\\[1400px\\]{
  max-width: 1400px;
}

.max-w-\\[140px\\]{
  max-width: 140px;
}

.max-w-\\[1600px\\]{
  max-width: 1600px;
}

.max-w-\\[18rem\\]{
  max-width: 18rem;
}

.max-w-\\[200px\\]{
  max-width: 200px;
}

.max-w-\\[240px\\]{
  max-width: 240px;
}

.max-w-\\[280px\\]{
  max-width: 280px;
}

.max-w-\\[420px\\]{
  max-width: 420px;
}

.max-w-\\[440px\\]{
  max-width: 440px;
}

.max-w-\\[60\\%\\]{
  max-width: 60%;
}

.max-w-\\[62rem\\]{
  max-width: 62rem;
}

.max-w-\\[80\\%\\]{
  max-width: 80%;
}

.max-w-\\[85\\%\\]{
  max-width: 85%;
}

.max-w-full{
  max-width: 100%;
}

.max-w-lg{
  max-width: 32rem;
}

.max-w-max{
  max-width: -moz-max-content;
  max-width: max-content;
}

.max-w-md{
  max-width: 28rem;
}

.max-w-none{
  max-width: none;
}

.max-w-sm{
  max-width: 24rem;
}

.max-w-xl{
  max-width: 36rem;
}

.max-w-xs{
  max-width: 20rem;
}

.flex-1{
  flex: 1 1 0%;
}

.flex-shrink-0{
  flex-shrink: 0;
}

.shrink-0{
  flex-shrink: 0;
}

.grow{
  flex-grow: 1;
}

.grow-0{
  flex-grow: 0;
}

.basis-full{
  flex-basis: 100%;
}

.caption-bottom{
  caption-side: bottom;
}

.border-collapse{
  border-collapse: collapse;
}

.origin-center{
  transform-origin: center;
}

.origin-left{
  transform-origin: left;
}

.-translate-x-1\\/2{
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-x-px{
  --tw-translate-x: -1px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-1\\/2{
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-0{
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-5{
  --tw-translate-x: 1.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-\\[-50\\%\\]{
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-x-px{
  --tw-translate-x: 1px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-\\[-50\\%\\]{
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-rotate-90{
  --tw-rotate: -90deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-180{
  --tw-rotate: 180deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-45{
  --tw-rotate: 45deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.rotate-90{
  --tw-rotate: 90deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-100{
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-105{
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.scale-\\[0\\.99\\]{
  --tw-scale-x: 0.99;
  --tw-scale-y: 0.99;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.transform{
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

@keyframes bounce{

  0%, 100%{
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }

  50%{
    transform: none;
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
}

.animate-bounce{
  animation: bounce 1s infinite;
}

@keyframes ping{

  75%, 100%{
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping{
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pulse{

  50%{
    opacity: .5;
  }
}

.animate-pulse{
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin{

  to{
    transform: rotate(360deg);
  }
}

.animate-spin{
  animation: spin 1s linear infinite;
}

.cursor-default{
  cursor: default;
}

.cursor-grab{
  cursor: grab;
}

.cursor-not-allowed{
  cursor: not-allowed;
}

.cursor-pointer{
  cursor: pointer;
}

.cursor-zoom-in{
  cursor: zoom-in;
}

.touch-none{
  touch-action: none;
}

.touch-pan-y{
  --tw-pan-y: pan-y;
  touch-action: var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom);
}

.select-none{
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}

.select-all{
  -webkit-user-select: all;
     -moz-user-select: all;
          user-select: all;
}

.resize-none{
  resize: none;
}

.snap-x{
  scroll-snap-type: x var(--tw-scroll-snap-strictness);
}

.snap-mandatory{
  --tw-scroll-snap-strictness: mandatory;
}

.snap-center{
  scroll-snap-align: center;
}

.list-inside{
  list-style-position: inside;
}

.list-decimal{
  list-style-type: decimal;
}

.list-disc{
  list-style-type: disc;
}

.list-none{
  list-style-type: none;
}

.columns-1{
  -moz-columns: 1;
       columns: 1;
}

.columns-2{
  -moz-columns: 2;
       columns: 2;
}

.break-inside-avoid{
  -moz-column-break-inside: avoid;
       break-inside: avoid;
}

.auto-rows-\\[170px\\]{
  grid-auto-rows: 170px;
}

.grid-cols-1{
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-12{
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.grid-cols-2{
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3{
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-cols-4{
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.grid-cols-5{
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.grid-cols-6{
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.grid-cols-\\[1fr_auto\\]{
  grid-template-columns: 1fr auto;
}

.grid-cols-\\[1fr_auto_1fr\\]{
  grid-template-columns: 1fr auto 1fr;
}

.grid-cols-\\[1fr_auto_auto\\]{
  grid-template-columns: 1fr auto auto;
}

.flex-row{
  flex-direction: row;
}

.flex-col{
  flex-direction: column;
}

.flex-col-reverse{
  flex-direction: column-reverse;
}

.flex-wrap{
  flex-wrap: wrap;
}

.flex-nowrap{
  flex-wrap: nowrap;
}

.place-items-center{
  place-items: center;
}

.items-start{
  align-items: flex-start;
}

.items-end{
  align-items: flex-end;
}

.items-center{
  align-items: center;
}

.items-baseline{
  align-items: baseline;
}

.items-stretch{
  align-items: stretch;
}

.justify-start{
  justify-content: flex-start;
}

.justify-end{
  justify-content: flex-end;
}

.justify-center{
  justify-content: center;
}

.justify-between{
  justify-content: space-between;
}

.justify-around{
  justify-content: space-around;
}

.gap-0{
  gap: 0px;
}

.gap-0\\.5{
  gap: 0.125rem;
}

.gap-1{
  gap: 0.25rem;
}

.gap-1\\.5{
  gap: 0.375rem;
}

.gap-10{
  gap: 2.5rem;
}

.gap-12{
  gap: 3rem;
}

.gap-2{
  gap: 0.5rem;
}

.gap-2\\.5{
  gap: 0.625rem;
}

.gap-3{
  gap: 0.75rem;
}

.gap-4{
  gap: 1rem;
}

.gap-5{
  gap: 1.25rem;
}

.gap-6{
  gap: 1.5rem;
}

.gap-8{
  gap: 2rem;
}

.gap-9{
  gap: 2.25rem;
}

.gap-x-4{
  -moz-column-gap: 1rem;
       column-gap: 1rem;
}

.gap-y-1\\.5{
  row-gap: 0.375rem;
}

.space-x-1 > :not([hidden]) ~ :not([hidden]){
  --tw-space-x-reverse: 0;
  margin-right: calc(0.25rem * var(--tw-space-x-reverse));
  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-4 > :not([hidden]) ~ :not([hidden]){
  --tw-space-x-reverse: 0;
  margin-right: calc(1rem * var(--tw-space-x-reverse));
  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
}

.space-y-0 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0px * var(--tw-space-y-reverse));
}

.space-y-0\\.5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.125rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.125rem * var(--tw-space-y-reverse));
}

.space-y-1 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}

.space-y-1\\.5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.375rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.375rem * var(--tw-space-y-reverse));
}

.space-y-10 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(2.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(2.5rem * var(--tw-space-y-reverse));
}

.space-y-12 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(3rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(3rem * var(--tw-space-y-reverse));
}

.space-y-14 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(3.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(3.5rem * var(--tw-space-y-reverse));
}

.space-y-16 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(4rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(4rem * var(--tw-space-y-reverse));
}

.space-y-2 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}

.space-y-2\\.5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.625rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.625rem * var(--tw-space-y-reverse));
}

.space-y-3 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
}

.space-y-4 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}

.space-y-5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(1.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.25rem * var(--tw-space-y-reverse));
}

.space-y-6 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
}

.space-y-7 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(1.75rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.75rem * var(--tw-space-y-reverse));
}

.space-y-8 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(2rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(2rem * var(--tw-space-y-reverse));
}

.self-start{
  align-self: flex-start;
}

.self-center{
  align-self: center;
}

.overflow-auto{
  overflow: auto;
}

.overflow-hidden{
  overflow: hidden;
}

.overflow-x-auto{
  overflow-x: auto;
}

.overflow-y-auto{
  overflow-y: auto;
}

.overflow-x-hidden{
  overflow-x: hidden;
}

.overscroll-contain{
  overscroll-behavior: contain;
}

.overscroll-y-contain{
  overscroll-behavior-y: contain;
}

.truncate{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.whitespace-nowrap{
  white-space: nowrap;
}

.whitespace-pre{
  white-space: pre;
}

.whitespace-pre-line{
  white-space: pre-line;
}

.whitespace-pre-wrap{
  white-space: pre-wrap;
}

.break-words{
  overflow-wrap: break-word;
}

.break-all{
  word-break: break-all;
}

.rounded{
  border-radius: 0.25rem;
}

.rounded-2xl{
  border-radius: 1rem;
}

.rounded-3xl{
  border-radius: 1.5rem;
}

.rounded-\\[2px\\]{
  border-radius: 2px;
}

.rounded-\\[inherit\\]{
  border-radius: inherit;
}

.rounded-full{
  border-radius: 9999px;
}

.rounded-lg{
  border-radius: var(--radius);
}

.rounded-md{
  border-radius: calc(var(--radius) - 2px);
}

.rounded-none{
  border-radius: 0px;
}

.rounded-sm{
  border-radius: calc(var(--radius) - 4px);
}

.rounded-xl{
  border-radius: 0.75rem;
}

.rounded-b-2xl{
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.rounded-r-2xl{
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.rounded-r-xl{
  border-top-right-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
}

.rounded-t-2xl{
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.rounded-t-3xl{
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
}

.rounded-t-\\[10px\\]{
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.rounded-bl-2xl{
  border-bottom-left-radius: 1rem;
}

.rounded-tl-2xl{
  border-top-left-radius: 1rem;
}

.rounded-tl-sm{
  border-top-left-radius: calc(var(--radius) - 4px);
}

.border{
  border-width: 1px;
}

.border-0{
  border-width: 0px;
}

.border-2{
  border-width: 2px;
}

.border-4{
  border-width: 4px;
}

.border-\\[1\\.5px\\]{
  border-width: 1.5px;
}

.border-y{
  border-top-width: 1px;
  border-bottom-width: 1px;
}

.border-b{
  border-bottom-width: 1px;
}

.border-b-2{
  border-bottom-width: 2px;
}

.border-l{
  border-left-width: 1px;
}

.border-l-2{
  border-left-width: 2px;
}

.border-l-4{
  border-left-width: 4px;
}

.border-r{
  border-right-width: 1px;
}

.border-t{
  border-top-width: 1px;
}

.border-dashed{
  border-style: dashed;
}

.border-none{
  border-style: none;
}

.border-\\[\\#00A8E1\\]\\/30{
  border-color: rgb(0 168 225 / 0.3);
}

.border-\\[\\#00FFFF\\]\\/30{
  border-color: rgb(0 255 255 / 0.3);
}

.border-\\[\\#1DB954\\]\\/30{
  border-color: rgb(29 185 84 / 0.3);
}

.border-\\[\\#A238FF\\]\\/30{
  border-color: rgb(162 56 255 / 0.3);
}

.border-\\[\\#C9A84C\\]{
  --tw-border-opacity: 1;
  border-color: rgb(201 168 76 / var(--tw-border-opacity, 1));
}

.border-\\[\\#C9A84C\\]\\/20{
  border-color: rgb(201 168 76 / 0.2);
}

.border-\\[\\#F5594E\\]\\/30{
  border-color: rgb(245 89 78 / 0.3);
}

.border-\\[\\#FA243C\\]\\/30{
  border-color: rgb(250 36 60 / 0.3);
}

.border-\\[\\#FF0000\\]\\/30{
  border-color: rgb(255 0 0 / 0.3);
}

.border-\\[\\#FF5500\\]\\/30{
  border-color: rgb(255 85 0 / 0.3);
}

.border-\\[\\#FFA200\\]\\/30{
  border-color: rgb(255 162 0 / 0.3);
}

.border-\\[\\#FFE08A\\]\\/20{
  border-color: rgb(255 224 138 / 0.2);
}

.border-\\[\\#FFE08A\\]\\/50{
  border-color: rgb(255 224 138 / 0.5);
}

.border-\\[--color-border\\]{
  border-color: var(--color-border);
}

.border-\\[hsl\\(46_63\\%_52\\%\\/0\\.25\\)\\]{
  border-color: hsl(46 63% 52%/0.25);
}

.border-\\[hsl\\(var\\(--garden-gold\\)\\)\\]\\/20{
  border-color: hsl(var(--garden-gold) / 0.2);
}

.border-\\[hsl\\(var\\(--garden-gold\\)\\)\\]\\/25{
  border-color: hsl(var(--garden-gold) / 0.25);
}

.border-\\[hsl\\(var\\(--garden-gold\\)\\)\\]\\/30{
  border-color: hsl(var(--garden-gold) / 0.3);
}

.border-\\[hsl\\(var\\(--garden-gold\\)\\)\\]\\/35{
  border-color: hsl(var(--garden-gold) / 0.35);
}

.border-\\[hsl\\(var\\(--garden-gold\\)\\)\\]\\/40{
  border-color: hsl(var(--garden-gold) / 0.4);
}

.border-\\[hsl\\(var\\(--garden-green\\)\\)\\]\\/60{
  border-color: hsl(var(--garden-green) / 0.6);
}

.border-\\[hsl\\(var\\(--garden-orange\\)\\)\\]\\/50{
  border-color: hsl(var(--garden-orange) / 0.5);
}

.border-\\[hsl\\(var\\(--garden-orange\\)\\)\\]\\/55{
  border-color: hsl(var(--garden-orange) / 0.55);
}

.border-accent\\/20{
  border-color: hsl(var(--accent) / 0.2);
}

.border-accent\\/30{
  border-color: hsl(var(--accent) / 0.3);
}

.border-accent\\/40{
  border-color: hsl(var(--accent) / 0.4);
}

.border-amber-500\\/20{
  border-color: rgb(245 158 11 / 0.2);
}

.border-amber-500\\/25{
  border-color: rgb(245 158 11 / 0.25);
}

.border-amber-500\\/30{
  border-color: rgb(245 158 11 / 0.3);
}

.border-amber-500\\/40{
  border-color: rgb(245 158 11 / 0.4);
}

.border-amber-500\\/50{
  border-color: rgb(245 158 11 / 0.5);
}

.border-amber-500\\/60{
  border-color: rgb(245 158 11 / 0.6);
}

.border-amber-600\\/30{
  border-color: rgb(217 119 6 / 0.3);
}

.border-background{
  border-color: hsl(var(--background));
}

.border-blue-200{
  --tw-border-opacity: 1;
  border-color: rgb(191 219 254 / var(--tw-border-opacity, 1));
}

.border-blue-400\\/30{
  border-color: rgb(96 165 250 / 0.3);
}

.border-blue-500\\/20{
  border-color: rgb(59 130 246 / 0.2);
}

.border-blue-500\\/25{
  border-color: rgb(59 130 246 / 0.25);
}

.border-blue-500\\/30{
  border-color: rgb(59 130 246 / 0.3);
}

.border-blue-500\\/40{
  border-color: rgb(59 130 246 / 0.4);
}

.border-blue-600{
  --tw-border-opacity: 1;
  border-color: rgb(37 99 235 / var(--tw-border-opacity, 1));
}

.border-blue-600\\/30{
  border-color: rgb(37 99 235 / 0.3);
}

.border-border{
  border-color: hsl(var(--border));
}

.border-border\\/10{
  border-color: hsl(var(--border) / 0.1);
}

.border-border\\/15{
  border-color: hsl(var(--border) / 0.15);
}

.border-border\\/20{
  border-color: hsl(var(--border) / 0.2);
}

.border-border\\/25{
  border-color: hsl(var(--border) / 0.25);
}

.border-border\\/30{
  border-color: hsl(var(--border) / 0.3);
}

.border-border\\/40{
  border-color: hsl(var(--border) / 0.4);
}

.border-border\\/50{
  border-color: hsl(var(--border) / 0.5);
}

.border-border\\/60{
  border-color: hsl(var(--border) / 0.6);
}

.border-cyan-500\\/20{
  border-color: rgb(6 182 212 / 0.2);
}

.border-cyan-500\\/30{
  border-color: rgb(6 182 212 / 0.3);
}

.border-cyan-500\\/40{
  border-color: rgb(6 182 212 / 0.4);
}

.border-destructive{
  border-color: hsl(var(--destructive));
}

.border-destructive\\/20{
  border-color: hsl(var(--destructive) / 0.2);
}

.border-destructive\\/30{
  border-color: hsl(var(--destructive) / 0.3);
}

.border-destructive\\/40{
  border-color: hsl(var(--destructive) / 0.4);
}

.border-destructive\\/50{
  border-color: hsl(var(--destructive) / 0.5);
}

.border-destructive\\/60{
  border-color: hsl(var(--destructive) / 0.6);
}

.border-emerald-500\\/20{
  border-color: rgb(16 185 129 / 0.2);
}

.border-emerald-500\\/30{
  border-color: rgb(16 185 129 / 0.3);
}

.border-foreground\\/20{
  border-color: hsl(var(--foreground) / 0.2);
}

.border-gray-500\\/20{
  border-color: rgb(107 114 128 / 0.2);
}

.border-gray-500\\/30{
  border-color: rgb(107 114 128 / 0.3);
}

.border-green-200{
  --tw-border-opacity: 1;
  border-color: rgb(187 247 208 / var(--tw-border-opacity, 1));
}

.border-green-400\\/30{
  border-color: rgb(74 222 128 / 0.3);
}

.border-green-500{
  --tw-border-opacity: 1;
  border-color: rgb(34 197 94 / var(--tw-border-opacity, 1));
}

.border-green-500\\/10{
  border-color: rgb(34 197 94 / 0.1);
}

.border-green-500\\/20{
  border-color: rgb(34 197 94 / 0.2);
}

.border-green-500\\/30{
  border-color: rgb(34 197 94 / 0.3);
}

.border-green-500\\/40{
  border-color: rgb(34 197 94 / 0.4);
}

.border-green-500\\/50{
  border-color: rgb(34 197 94 / 0.5);
}

.border-green-600\\/30{
  border-color: rgb(22 163 74 / 0.3);
}

.border-indigo-500\\/20{
  border-color: rgb(99 102 241 / 0.2);
}

.border-indigo-500\\/30{
  border-color: rgb(99 102 241 / 0.3);
}

.border-input{
  border-color: hsl(var(--input));
}

.border-lime-500\\/20{
  border-color: rgb(132 204 22 / 0.2);
}

.border-muted-foreground{
  border-color: hsl(var(--muted-foreground));
}

.border-muted-foreground\\/30{
  border-color: hsl(var(--muted-foreground) / 0.3);
}

.border-orange-500\\/20{
  border-color: rgb(249 115 22 / 0.2);
}

.border-orange-500\\/30{
  border-color: rgb(249 115 22 / 0.3);
}

.border-orange-500\\/40{
  border-color: rgb(249 115 22 / 0.4);
}

.border-pink-500\\/20{
  border-color: rgb(236 72 153 / 0.2);
}

.border-pink-500\\/30{
  border-color: rgb(236 72 153 / 0.3);
}

.border-pink-500\\/40{
  border-color: rgb(236 72 153 / 0.4);
}

.border-primary{
  border-color: hsl(var(--primary));
}

.border-primary-foreground\\/30{
  border-color: hsl(var(--primary-foreground) / 0.3);
}

.border-primary\\/10{
  border-color: hsl(var(--primary) / 0.1);
}

.border-primary\\/15{
  border-color: hsl(var(--primary) / 0.15);
}

.border-primary\\/20{
  border-color: hsl(var(--primary) / 0.2);
}

.border-primary\\/25{
  border-color: hsl(var(--primary) / 0.25);
}

.border-primary\\/30{
  border-color: hsl(var(--primary) / 0.3);
}

.border-primary\\/35{
  border-color: hsl(var(--primary) / 0.35);
}

.border-primary\\/40{
  border-color: hsl(var(--primary) / 0.4);
}

.border-primary\\/45{
  border-color: hsl(var(--primary) / 0.45);
}

.border-primary\\/50{
  border-color: hsl(var(--primary) / 0.5);
}

.border-primary\\/60{
  border-color: hsl(var(--primary) / 0.6);
}

.border-primary\\/80{
  border-color: hsl(var(--primary) / 0.8);
}

.border-purple-500\\/20{
  border-color: rgb(168 85 247 / 0.2);
}

.border-purple-500\\/30{
  border-color: rgb(168 85 247 / 0.3);
}

.border-purple-500\\/40{
  border-color: rgb(168 85 247 / 0.4);
}

.border-red-300{
  --tw-border-opacity: 1;
  border-color: rgb(252 165 165 / var(--tw-border-opacity, 1));
}

.border-red-500{
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity, 1));
}

.border-red-500\\/10{
  border-color: rgb(239 68 68 / 0.1);
}

.border-red-500\\/20{
  border-color: rgb(239 68 68 / 0.2);
}

.border-red-500\\/25{
  border-color: rgb(239 68 68 / 0.25);
}

.border-red-500\\/30{
  border-color: rgb(239 68 68 / 0.3);
}

.border-red-500\\/40{
  border-color: rgb(239 68 68 / 0.4);
}

.border-red-500\\/50{
  border-color: rgb(239 68 68 / 0.5);
}

.border-red-500\\/60{
  border-color: rgb(239 68 68 / 0.6);
}

.border-red-600\\/20{
  border-color: rgb(220 38 38 / 0.2);
}

.border-red-600\\/30{
  border-color: rgb(220 38 38 / 0.3);
}

.border-red-700\\/40{
  border-color: rgb(185 28 28 / 0.4);
}

.border-rose-500\\/20{
  border-color: rgb(244 63 94 / 0.2);
}

.border-rose-500\\/30{
  border-color: rgb(244 63 94 / 0.3);
}

.border-secondary{
  border-color: hsl(var(--secondary));
}

.border-sidebar-border{
  border-color: hsl(var(--sidebar-border));
}

.border-sky-500\\/20{
  border-color: rgb(14 165 233 / 0.2);
}

.border-sky-500\\/30{
  border-color: rgb(14 165 233 / 0.3);
}

.border-slate-100{
  --tw-border-opacity: 1;
  border-color: rgb(241 245 249 / var(--tw-border-opacity, 1));
}

.border-slate-200{
  --tw-border-opacity: 1;
  border-color: rgb(226 232 240 / var(--tw-border-opacity, 1));
}

.border-slate-500\\/20{
  border-color: rgb(100 116 139 / 0.2);
}

.border-slate-500\\/30{
  border-color: rgb(100 116 139 / 0.3);
}

.border-teal-500\\/20{
  border-color: rgb(20 184 166 / 0.2);
}

.border-teal-500\\/30{
  border-color: rgb(20 184 166 / 0.3);
}

.border-transparent{
  border-color: transparent;
}

.border-white\\/10{
  border-color: rgb(255 255 255 / 0.1);
}

.border-white\\/20{
  border-color: rgb(255 255 255 / 0.2);
}

.border-white\\/5{
  border-color: rgb(255 255 255 / 0.05);
}

.border-yellow-400\\/30{
  border-color: rgb(250 204 21 / 0.3);
}

.border-yellow-500\\/20{
  border-color: rgb(234 179 8 / 0.2);
}

.border-yellow-500\\/30{
  border-color: rgb(234 179 8 / 0.3);
}

.border-yellow-500\\/40{
  border-color: rgb(234 179 8 / 0.4);
}

.border-yellow-500\\/60{
  border-color: rgb(234 179 8 / 0.6);
}

.border-zinc-500\\/20{
  border-color: rgb(113 113 122 / 0.2);
}

.border-zinc-500\\/30{
  border-color: rgb(113 113 122 / 0.3);
}

.border-zinc-700{
  --tw-border-opacity: 1;
  border-color: rgb(63 63 70 / var(--tw-border-opacity, 1));
}

.border-zinc-800{
  --tw-border-opacity: 1;
  border-color: rgb(39 39 42 / var(--tw-border-opacity, 1));
}

.border-l-amber-500{
  --tw-border-opacity: 1;
  border-left-color: rgb(245 158 11 / var(--tw-border-opacity, 1));
}

.border-l-blue-500{
  --tw-border-opacity: 1;
  border-left-color: rgb(59 130 246 / var(--tw-border-opacity, 1));
}

.border-l-green-500{
  --tw-border-opacity: 1;
  border-left-color: rgb(34 197 94 / var(--tw-border-opacity, 1));
}

.border-l-muted-foreground{
  border-left-color: hsl(var(--muted-foreground));
}

.border-l-orange-500{
  --tw-border-opacity: 1;
  border-left-color: rgb(249 115 22 / var(--tw-border-opacity, 1));
}

.border-l-primary{
  border-left-color: hsl(var(--primary));
}

.border-l-purple-500{
  --tw-border-opacity: 1;
  border-left-color: rgb(168 85 247 / var(--tw-border-opacity, 1));
}

.border-l-red-500{
  --tw-border-opacity: 1;
  border-left-color: rgb(239 68 68 / var(--tw-border-opacity, 1));
}

.border-l-transparent{
  border-left-color: transparent;
}

.border-l-yellow-500{
  --tw-border-opacity: 1;
  border-left-color: rgb(234 179 8 / var(--tw-border-opacity, 1));
}

.border-t-primary{
  border-top-color: hsl(var(--primary));
}

.border-t-primary-foreground{
  border-top-color: hsl(var(--primary-foreground));
}

.border-t-slate-800{
  --tw-border-opacity: 1;
  border-top-color: rgb(30 41 59 / var(--tw-border-opacity, 1));
}

.border-t-transparent{
  border-top-color: transparent;
}

.bg-\\[\\#00A8E1\\]\\/10{
  background-color: rgb(0 168 225 / 0.1);
}

.bg-\\[\\#00FFFF\\]\\/10{
  background-color: rgb(0 255 255 / 0.1);
}

.bg-\\[\\#050508\\]{
  --tw-bg-opacity: 1;
  background-color: rgb(5 5 8 / var(--tw-bg-opacity, 1));
}

.bg-\\[\\#050607\\]{
  --tw-bg-opacity: 1;
  background-color: rgb(5 6 7 / var(--tw-bg-opacity, 1));
}

.bg-\\[\\#09090E\\]{
  --tw-bg-opacity: 1;
  background-color: rgb(9 9 14 / var(--tw-bg-opacity, 1));
}

.bg-\\[\\#111118\\]{
  --tw-bg-opacity: 1;
  background-color: rgb(17 17 24 / var(--tw-bg-opacity, 1));
}

.bg-\\[\\#1DB954\\]{
  --tw-bg-opacity: 1;
  background-color: rgb(29 185 84 / var(--tw-bg-opacity, 1));
}

.bg-\\[\\#1DB954\\]\\/10{
  background-color: rgb(29 185 84 / 0.1);
}

.bg-\\[\\#1c1c1e\\]{
  --tw-bg-opacity: 1;
  background-color: rgb(28 28 30 / var(--tw-bg-opacity, 1));
}

.bg-\\[\\#2c2c2e\\]{
  --tw-bg-opacity: 1;
  background-color: rgb(44 44 46 / var(--tw-bg-opacity, 1));
}

.bg-\\[\\#A238FF\\]\\/10{
  background-color: rgb(162 56 255 / 0.1);
}

.bg-\\[\\#C9A84C\\]{
  --tw-bg-opacity: 1;
  background-color: rgb(201 168 76 / var(--tw-bg-opacity, 1));
}

.bg-\\[\\#C9A84C\\]\\/10{
  background-color: rgb(201 168 76 / 0.1);
}

.bg-\\[\\#C9A84C\\]\\/20{
  background-color: rgb(201 168 76 / 0.2);
}

.bg-\\[\\#C9A84C\\]\\/30{
  background-color: rgb(201 168 76 / 0.3);
}

.bg-\\[\\#C9A84C\\]\\/5{
  background-color: rgb(201 168 76 / 0.05);
}

.bg-\\[\\#F5594E\\]\\/10{
  background-color: rgb(245 89 78 / 0.1);
}

.bg-\\[\\#FA243C\\]\\/10{
  background-color: rgb(250 36 60 / 0.1);
}

.bg-\\[\\#FF0000\\]\\/10{
  background-color: rgb(255 0 0 / 0.1);
}

.bg-\\[\\#FF5500\\]\\/10{
  background-color: rgb(255 85 0 / 0.1);
}

.bg-\\[\\#FFA200\\]\\/10{
  background-color: rgb(255 162 0 / 0.1);
}

.bg-\\[\\#FFE08A\\]\\/10{
  background-color: rgb(255 224 138 / 0.1);
}

.bg-\\[\\#FFE08A\\]\\/5{
  background-color: rgb(255 224 138 / 0.05);
}

.bg-\\[--color-bg\\]{
  background-color: var(--color-bg);
}

.bg-accent{
  background-color: hsl(var(--accent));
}

.bg-accent\\/10{
  background-color: hsl(var(--accent) / 0.1);
}

.bg-accent\\/5{
  background-color: hsl(var(--accent) / 0.05);
}

.bg-accent\\/80{
  background-color: hsl(var(--accent) / 0.8);
}

.bg-amber-400{
  --tw-bg-opacity: 1;
  background-color: rgb(251 191 36 / var(--tw-bg-opacity, 1));
}

.bg-amber-500{
  --tw-bg-opacity: 1;
  background-color: rgb(245 158 11 / var(--tw-bg-opacity, 1));
}

.bg-amber-500\\/10{
  background-color: rgb(245 158 11 / 0.1);
}

.bg-amber-500\\/15{
  background-color: rgb(245 158 11 / 0.15);
}

.bg-amber-500\\/20{
  background-color: rgb(245 158 11 / 0.2);
}

.bg-amber-500\\/5{
  background-color: rgb(245 158 11 / 0.05);
}

.bg-amber-600{
  --tw-bg-opacity: 1;
  background-color: rgb(217 119 6 / var(--tw-bg-opacity, 1));
}

.bg-amber-900\\/10{
  background-color: rgb(120 53 15 / 0.1);
}

.bg-amber-900\\/20{
  background-color: rgb(120 53 15 / 0.2);
}

.bg-amber-900\\/30{
  background-color: rgb(120 53 15 / 0.3);
}

.bg-background{
  background-color: hsl(var(--background));
}

.bg-background\\/30{
  background-color: hsl(var(--background) / 0.3);
}

.bg-background\\/35{
  background-color: hsl(var(--background) / 0.35);
}

.bg-background\\/40{
  background-color: hsl(var(--background) / 0.4);
}

.bg-background\\/50{
  background-color: hsl(var(--background) / 0.5);
}

.bg-background\\/55{
  background-color: hsl(var(--background) / 0.55);
}

.bg-background\\/60{
  background-color: hsl(var(--background) / 0.6);
}

.bg-background\\/70{
  background-color: hsl(var(--background) / 0.7);
}

.bg-background\\/80{
  background-color: hsl(var(--background) / 0.8);
}

.bg-background\\/85{
  background-color: hsl(var(--background) / 0.85);
}

.bg-background\\/90{
  background-color: hsl(var(--background) / 0.9);
}

.bg-background\\/95{
  background-color: hsl(var(--background) / 0.95);
}

.bg-black{
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity, 1));
}

.bg-black\\/20{
  background-color: rgb(0 0 0 / 0.2);
}

.bg-black\\/25{
  background-color: rgb(0 0 0 / 0.25);
}

.bg-black\\/30{
  background-color: rgb(0 0 0 / 0.3);
}

.bg-black\\/40{
  background-color: rgb(0 0 0 / 0.4);
}

.bg-black\\/45{
  background-color: rgb(0 0 0 / 0.45);
}

.bg-black\\/50{
  background-color: rgb(0 0 0 / 0.5);
}

.bg-black\\/60{
  background-color: rgb(0 0 0 / 0.6);
}

.bg-black\\/70{
  background-color: rgb(0 0 0 / 0.7);
}

.bg-black\\/75{
  background-color: rgb(0 0 0 / 0.75);
}

.bg-black\\/80{
  background-color: rgb(0 0 0 / 0.8);
}

.bg-black\\/85{
  background-color: rgb(0 0 0 / 0.85);
}

.bg-black\\/90{
  background-color: rgb(0 0 0 / 0.9);
}

.bg-black\\/95{
  background-color: rgb(0 0 0 / 0.95);
}

.bg-blue-400\\/10{
  background-color: rgb(96 165 250 / 0.1);
}

.bg-blue-50{
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}

.bg-blue-500{
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
}

.bg-blue-500\\/10{
  background-color: rgb(59 130 246 / 0.1);
}

.bg-blue-500\\/15{
  background-color: rgb(59 130 246 / 0.15);
}

.bg-blue-500\\/20{
  background-color: rgb(59 130 246 / 0.2);
}

.bg-blue-500\\/5{
  background-color: rgb(59 130 246 / 0.05);
}

.bg-blue-600{
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));
}

.bg-blue-900\\/10{
  background-color: rgb(30 58 138 / 0.1);
}

.bg-blue-900\\/20{
  background-color: rgb(30 58 138 / 0.2);
}

.bg-border{
  background-color: hsl(var(--border));
}

.bg-border\\/40{
  background-color: hsl(var(--border) / 0.4);
}

.bg-border\\/50{
  background-color: hsl(var(--border) / 0.5);
}

.bg-card{
  background-color: hsl(var(--card));
}

.bg-card\\/20{
  background-color: hsl(var(--card) / 0.2);
}

.bg-card\\/25{
  background-color: hsl(var(--card) / 0.25);
}

.bg-card\\/30{
  background-color: hsl(var(--card) / 0.3);
}

.bg-card\\/40{
  background-color: hsl(var(--card) / 0.4);
}

.bg-card\\/50{
  background-color: hsl(var(--card) / 0.5);
}

.bg-card\\/55{
  background-color: hsl(var(--card) / 0.55);
}

.bg-card\\/60{
  background-color: hsl(var(--card) / 0.6);
}

.bg-card\\/70{
  background-color: hsl(var(--card) / 0.7);
}

.bg-card\\/80{
  background-color: hsl(var(--card) / 0.8);
}

.bg-card\\/85{
  background-color: hsl(var(--card) / 0.85);
}

.bg-card\\/90{
  background-color: hsl(var(--card) / 0.9);
}

.bg-card\\/95{
  background-color: hsl(var(--card) / 0.95);
}

.bg-chart-2\\/20{
  background-color: hsl(var(--chart-2) / 0.2);
}

.bg-chart-2\\/30{
  background-color: hsl(var(--chart-2) / 0.3);
}

.bg-chart-4\\/20{
  background-color: hsl(var(--chart-4) / 0.2);
}

.bg-cyan-400{
  --tw-bg-opacity: 1;
  background-color: rgb(34 211 238 / var(--tw-bg-opacity, 1));
}

.bg-cyan-500\\/10{
  background-color: rgb(6 182 212 / 0.1);
}

.bg-cyan-500\\/15{
  background-color: rgb(6 182 212 / 0.15);
}

.bg-cyan-500\\/20{
  background-color: rgb(6 182 212 / 0.2);
}

.bg-cyan-500\\/5{
  background-color: rgb(6 182 212 / 0.05);
}

.bg-destructive{
  background-color: hsl(var(--destructive));
}

.bg-destructive\\/10{
  background-color: hsl(var(--destructive) / 0.1);
}

.bg-destructive\\/20{
  background-color: hsl(var(--destructive) / 0.2);
}

.bg-destructive\\/5{
  background-color: hsl(var(--destructive) / 0.05);
}

.bg-destructive\\/60{
  background-color: hsl(var(--destructive) / 0.6);
}

.bg-destructive\\/80{
  background-color: hsl(var(--destructive) / 0.8);
}

.bg-destructive\\/90{
  background-color: hsl(var(--destructive) / 0.9);
}

.bg-emerald-500\\/10{
  background-color: rgb(16 185 129 / 0.1);
}

.bg-emerald-500\\/20{
  background-color: rgb(16 185 129 / 0.2);
}

.bg-foreground{
  background-color: hsl(var(--foreground));
}

.bg-foreground\\/10{
  background-color: hsl(var(--foreground) / 0.1);
}

.bg-gray-500\\/10{
  background-color: rgb(107 114 128 / 0.1);
}

.bg-gray-500\\/20{
  background-color: rgb(107 114 128 / 0.2);
}

.bg-green-400{
  --tw-bg-opacity: 1;
  background-color: rgb(74 222 128 / var(--tw-bg-opacity, 1));
}

.bg-green-400\\/10{
  background-color: rgb(74 222 128 / 0.1);
}

.bg-green-500{
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
}

.bg-green-500\\/10{
  background-color: rgb(34 197 94 / 0.1);
}

.bg-green-500\\/15{
  background-color: rgb(34 197 94 / 0.15);
}

.bg-green-500\\/20{
  background-color: rgb(34 197 94 / 0.2);
}

.bg-green-500\\/5{
  background-color: rgb(34 197 94 / 0.05);
}

.bg-green-500\\/60{
  background-color: rgb(34 197 94 / 0.6);
}

.bg-green-600{
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
}

.bg-green-600\\/15{
  background-color: rgb(22 163 74 / 0.15);
}

.bg-green-600\\/20{
  background-color: rgb(22 163 74 / 0.2);
}

.bg-green-700\\/10{
  background-color: rgb(21 128 61 / 0.1);
}

.bg-green-900\\/20{
  background-color: rgb(20 83 45 / 0.2);
}

.bg-green-900\\/30{
  background-color: rgb(20 83 45 / 0.3);
}

.bg-indigo-500\\/10{
  background-color: rgb(99 102 241 / 0.1);
}

.bg-indigo-500\\/20{
  background-color: rgb(99 102 241 / 0.2);
}

.bg-lime-500\\/10{
  background-color: rgb(132 204 22 / 0.1);
}

.bg-muted{
  background-color: hsl(var(--muted));
}

.bg-muted-foreground{
  background-color: hsl(var(--muted-foreground));
}

.bg-muted-foreground\\/10{
  background-color: hsl(var(--muted-foreground) / 0.1);
}

.bg-muted-foreground\\/30{
  background-color: hsl(var(--muted-foreground) / 0.3);
}

.bg-muted-foreground\\/40{
  background-color: hsl(var(--muted-foreground) / 0.4);
}

.bg-muted\\/20{
  background-color: hsl(var(--muted) / 0.2);
}

.bg-muted\\/30{
  background-color: hsl(var(--muted) / 0.3);
}

.bg-muted\\/5{
  background-color: hsl(var(--muted) / 0.05);
}

.bg-muted\\/50{
  background-color: hsl(var(--muted) / 0.5);
}

.bg-orange-100{
  --tw-bg-opacity: 1;
  background-color: rgb(255 237 213 / var(--tw-bg-opacity, 1));
}

.bg-orange-400\\/20{
  background-color: rgb(251 146 60 / 0.2);
}

.bg-orange-500{
  --tw-bg-opacity: 1;
  background-color: rgb(249 115 22 / var(--tw-bg-opacity, 1));
}

.bg-orange-500\\/10{
  background-color: rgb(249 115 22 / 0.1);
}

.bg-orange-500\\/15{
  background-color: rgb(249 115 22 / 0.15);
}

.bg-orange-500\\/20{
  background-color: rgb(249 115 22 / 0.2);
}

.bg-orange-500\\/5{
  background-color: rgb(249 115 22 / 0.05);
}

.bg-orange-600{
  --tw-bg-opacity: 1;
  background-color: rgb(234 88 12 / var(--tw-bg-opacity, 1));
}

.bg-pink-500\\/10{
  background-color: rgb(236 72 153 / 0.1);
}

.bg-pink-500\\/15{
  background-color: rgb(236 72 153 / 0.15);
}

.bg-pink-500\\/20{
  background-color: rgb(236 72 153 / 0.2);
}

.bg-pink-500\\/5{
  background-color: rgb(236 72 153 / 0.05);
}

.bg-popover{
  background-color: hsl(var(--popover));
}

.bg-primary{
  background-color: hsl(var(--primary));
}

.bg-primary-foreground{
  background-color: hsl(var(--primary-foreground));
}

.bg-primary\\/10{
  background-color: hsl(var(--primary) / 0.1);
}

.bg-primary\\/15{
  background-color: hsl(var(--primary) / 0.15);
}

.bg-primary\\/20{
  background-color: hsl(var(--primary) / 0.2);
}

.bg-primary\\/30{
  background-color: hsl(var(--primary) / 0.3);
}

.bg-primary\\/40{
  background-color: hsl(var(--primary) / 0.4);
}

.bg-primary\\/5{
  background-color: hsl(var(--primary) / 0.05);
}

.bg-primary\\/50{
  background-color: hsl(var(--primary) / 0.5);
}

.bg-primary\\/60{
  background-color: hsl(var(--primary) / 0.6);
}

.bg-primary\\/70{
  background-color: hsl(var(--primary) / 0.7);
}

.bg-primary\\/80{
  background-color: hsl(var(--primary) / 0.8);
}

.bg-primary\\/90{
  background-color: hsl(var(--primary) / 0.9);
}

.bg-purple-500\\/10{
  background-color: rgb(168 85 247 / 0.1);
}

.bg-purple-500\\/15{
  background-color: rgb(168 85 247 / 0.15);
}

.bg-purple-500\\/20{
  background-color: rgb(168 85 247 / 0.2);
}

.bg-purple-500\\/5{
  background-color: rgb(168 85 247 / 0.05);
}

.bg-red-100{
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
}

.bg-red-400{
  --tw-bg-opacity: 1;
  background-color: rgb(248 113 113 / var(--tw-bg-opacity, 1));
}

.bg-red-500{
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));
}

.bg-red-500\\/10{
  background-color: rgb(239 68 68 / 0.1);
}

.bg-red-500\\/15{
  background-color: rgb(239 68 68 / 0.15);
}

.bg-red-500\\/20{
  background-color: rgb(239 68 68 / 0.2);
}

.bg-red-500\\/5{
  background-color: rgb(239 68 68 / 0.05);
}

.bg-red-500\\/80{
  background-color: rgb(239 68 68 / 0.8);
}

.bg-red-600{
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity, 1));
}

.bg-red-600\\/10{
  background-color: rgb(220 38 38 / 0.1);
}

.bg-red-600\\/20{
  background-color: rgb(220 38 38 / 0.2);
}

.bg-red-700\\/10{
  background-color: rgb(185 28 28 / 0.1);
}

.bg-red-700\\/20{
  background-color: rgb(185 28 28 / 0.2);
}

.bg-red-900\\/20{
  background-color: rgb(127 29 29 / 0.2);
}

.bg-rose-500\\/10{
  background-color: rgb(244 63 94 / 0.1);
}

.bg-rose-500\\/20{
  background-color: rgb(244 63 94 / 0.2);
}

.bg-rose-500\\/5{
  background-color: rgb(244 63 94 / 0.05);
}

.bg-secondary{
  background-color: hsl(var(--secondary));
}

.bg-secondary\\/10{
  background-color: hsl(var(--secondary) / 0.1);
}

.bg-secondary\\/20{
  background-color: hsl(var(--secondary) / 0.2);
}

.bg-secondary\\/30{
  background-color: hsl(var(--secondary) / 0.3);
}

.bg-secondary\\/40{
  background-color: hsl(var(--secondary) / 0.4);
}

.bg-secondary\\/5{
  background-color: hsl(var(--secondary) / 0.05);
}

.bg-secondary\\/50{
  background-color: hsl(var(--secondary) / 0.5);
}

.bg-secondary\\/60{
  background-color: hsl(var(--secondary) / 0.6);
}

.bg-secondary\\/80{
  background-color: hsl(var(--secondary) / 0.8);
}

.bg-sidebar{
  background-color: hsl(var(--sidebar-background));
}

.bg-sidebar-border{
  background-color: hsl(var(--sidebar-border));
}

.bg-sky-400{
  --tw-bg-opacity: 1;
  background-color: rgb(56 189 248 / var(--tw-bg-opacity, 1));
}

.bg-sky-500\\/10{
  background-color: rgb(14 165 233 / 0.1);
}

.bg-sky-500\\/20{
  background-color: rgb(14 165 233 / 0.2);
}

.bg-slate-50{
  --tw-bg-opacity: 1;
  background-color: rgb(248 250 252 / var(--tw-bg-opacity, 1));
}

.bg-slate-500\\/10{
  background-color: rgb(100 116 139 / 0.1);
}

.bg-slate-500\\/20{
  background-color: rgb(100 116 139 / 0.2);
}

.bg-teal-500\\/10{
  background-color: rgb(20 184 166 / 0.1);
}

.bg-teal-500\\/20{
  background-color: rgb(20 184 166 / 0.2);
}

.bg-transparent{
  background-color: transparent;
}

.bg-violet-400{
  --tw-bg-opacity: 1;
  background-color: rgb(167 139 250 / var(--tw-bg-opacity, 1));
}

.bg-violet-500\\/10{
  background-color: rgb(139 92 246 / 0.1);
}

.bg-white{
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}

.bg-white\\/10{
  background-color: rgb(255 255 255 / 0.1);
}

.bg-white\\/20{
  background-color: rgb(255 255 255 / 0.2);
}

.bg-white\\/5{
  background-color: rgb(255 255 255 / 0.05);
}

.bg-white\\/50{
  background-color: rgb(255 255 255 / 0.5);
}

.bg-white\\/\\[0\\.02\\]{
  background-color: rgb(255 255 255 / 0.02);
}

.bg-yellow-400{
  --tw-bg-opacity: 1;
  background-color: rgb(250 204 21 / var(--tw-bg-opacity, 1));
}

.bg-yellow-400\\/10{
  background-color: rgb(250 204 21 / 0.1);
}

.bg-yellow-500{
  --tw-bg-opacity: 1;
  background-color: rgb(234 179 8 / var(--tw-bg-opacity, 1));
}

.bg-yellow-500\\/10{
  background-color: rgb(234 179 8 / 0.1);
}

.bg-yellow-500\\/15{
  background-color: rgb(234 179 8 / 0.15);
}

.bg-yellow-500\\/20{
  background-color: rgb(234 179 8 / 0.2);
}

.bg-yellow-500\\/5{
  background-color: rgb(234 179 8 / 0.05);
}

.bg-yellow-600{
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity, 1));
}

.bg-zinc-500{
  --tw-bg-opacity: 1;
  background-color: rgb(113 113 122 / var(--tw-bg-opacity, 1));
}

.bg-zinc-500\\/10{
  background-color: rgb(113 113 122 / 0.1);
}

.bg-zinc-500\\/5{
  background-color: rgb(113 113 122 / 0.05);
}

.bg-zinc-900{
  --tw-bg-opacity: 1;
  background-color: rgb(24 24 27 / var(--tw-bg-opacity, 1));
}

.bg-zinc-950\\/80{
  background-color: rgb(9 9 11 / 0.8);
}

.bg-zinc-950\\/90{
  background-color: rgb(9 9 11 / 0.9);
}

.bg-\\[radial-gradient\\(ellipse_at_center\\2c rgba\\(201\\2c 168\\2c 76\\2c 0\\.06\\)_0\\%\\2c transparent_70\\%\\)\\]{
  background-image: radial-gradient(ellipse at center,rgba(201,168,76,0.06) 0%,transparent 70%);
}

.bg-gradient-to-b{
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

.bg-gradient-to-br{
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-l{
  background-image: linear-gradient(to left, var(--tw-gradient-stops));
}

.bg-gradient-to-r{
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-t{
  background-image: linear-gradient(to top, var(--tw-gradient-stops));
}

.from-\\[\\#C9A84C\\]{
  --tw-gradient-from: #C9A84C var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(201 168 76 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-500{
  --tw-gradient-from: #f59e0b var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(245 158 11 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-500\\/10{
  --tw-gradient-from: rgb(245 158 11 / 0.1) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(245 158 11 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-500\\/20{
  --tw-gradient-from: rgb(245 158 11 / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(245 158 11 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-500\\/5{
  --tw-gradient-from: rgb(245 158 11 / 0.05) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(245 158 11 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-600{
  --tw-gradient-from: #d97706 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(217 119 6 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-amber-600\\/20{
  --tw-gradient-from: rgb(217 119 6 / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(217 119 6 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-background{
  --tw-gradient-from: hsl(var(--background)) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--background) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-background\\/60{
  --tw-gradient-from: hsl(var(--background) / 0.6) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--background) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-background\\/70{
  --tw-gradient-from: hsl(var(--background) / 0.7) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--background) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-background\\/80{
  --tw-gradient-from: hsl(var(--background) / 0.8) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--background) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-background\\/85{
  --tw-gradient-from: hsl(var(--background) / 0.85) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--background) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-black\\/60{
  --tw-gradient-from: rgb(0 0 0 / 0.6) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-black\\/70{
  --tw-gradient-from: rgb(0 0 0 / 0.7) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-black\\/80{
  --tw-gradient-from: rgb(0 0 0 / 0.8) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-black\\/85{
  --tw-gradient-from: rgb(0 0 0 / 0.85) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-50{
  --tw-gradient-from: #eff6ff var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(239 246 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-500{
  --tw-gradient-from: #3b82f6 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(59 130 246 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-500\\/10{
  --tw-gradient-from: rgb(59 130 246 / 0.1) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(59 130 246 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-500\\/5{
  --tw-gradient-from: rgb(59 130 246 / 0.05) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(59 130 246 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-600{
  --tw-gradient-from: #2563eb var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(37 99 235 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-blue-900\\/30{
  --tw-gradient-from: rgb(30 58 138 / 0.3) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(30 58 138 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-card{
  --tw-gradient-from: hsl(var(--card)) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--card) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-card\\/60{
  --tw-gradient-from: hsl(var(--card) / 0.6) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--card) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-cyan-400{
  --tw-gradient-from: #22d3ee var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(34 211 238 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-cyan-500\\/20{
  --tw-gradient-from: rgb(6 182 212 / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(6 182 212 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-emerald-500{
  --tw-gradient-from: #10b981 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(16 185 129 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-emerald-600{
  --tw-gradient-from: #059669 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(5 150 105 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-gray-400\\/20{
  --tw-gradient-from: rgb(156 163 175 / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(156 163 175 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-gray-800\\/30{
  --tw-gradient-from: rgb(31 41 55 / 0.3) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(31 41 55 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-50{
  --tw-gradient-from: #f0fdf4 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(240 253 244 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-green-500\\/10{
  --tw-gradient-from: rgb(34 197 94 / 0.1) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(34 197 94 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-neutral-800\\/30{
  --tw-gradient-from: rgb(38 38 38 / 0.3) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(38 38 38 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-orange-500\\/10{
  --tw-gradient-from: rgb(249 115 22 / 0.1) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(249 115 22 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-orange-500\\/20{
  --tw-gradient-from: rgb(249 115 22 / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(249 115 22 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-pink-400{
  --tw-gradient-from: #f472b6 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(244 114 182 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-pink-500\\/10{
  --tw-gradient-from: rgb(236 72 153 / 0.1) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(236 72 153 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-primary{
  --tw-gradient-from: hsl(var(--primary)) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--primary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-primary\\/10{
  --tw-gradient-from: hsl(var(--primary) / 0.1) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--primary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-primary\\/20{
  --tw-gradient-from: hsl(var(--primary) / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--primary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-primary\\/30{
  --tw-gradient-from: hsl(var(--primary) / 0.3) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--primary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-primary\\/5{
  --tw-gradient-from: hsl(var(--primary) / 0.05) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--primary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-primary\\/50{
  --tw-gradient-from: hsl(var(--primary) / 0.5) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--primary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-primary\\/60{
  --tw-gradient-from: hsl(var(--primary) / 0.6) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--primary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-primary\\/70{
  --tw-gradient-from: hsl(var(--primary) / 0.7) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--primary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-500{
  --tw-gradient-from: #a855f7 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(168 85 247 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-500\\/10{
  --tw-gradient-from: rgb(168 85 247 / 0.1) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(168 85 247 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-600{
  --tw-gradient-from: #9333ea var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(147 51 234 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-900\\/20{
  --tw-gradient-from: rgb(88 28 135 / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(88 28 135 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-purple-900\\/40{
  --tw-gradient-from: rgb(88 28 135 / 0.4) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(88 28 135 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-500{
  --tw-gradient-from: #ef4444 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(239 68 68 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-600{
  --tw-gradient-from: #dc2626 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(220 38 38 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-red-950\\/20{
  --tw-gradient-from: rgb(69 10 10 / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(69 10 10 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-rose-500\\/20{
  --tw-gradient-from: rgb(244 63 94 / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(244 63 94 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-secondary\\/20{
  --tw-gradient-from: hsl(var(--secondary) / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--secondary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-secondary\\/30{
  --tw-gradient-from: hsl(var(--secondary) / 0.3) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--secondary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-secondary\\/40{
  --tw-gradient-from: hsl(var(--secondary) / 0.4) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--secondary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-slate-800\\/30{
  --tw-gradient-from: rgb(30 41 59 / 0.3) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(30 41 59 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-slate-900{
  --tw-gradient-from: #0f172a var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(15 23 42 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-stone-800\\/30{
  --tw-gradient-from: rgb(41 37 36 / 0.3) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(41 37 36 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-transparent{
  --tw-gradient-from: transparent var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-white{
  --tw-gradient-from: #fff var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-yellow-500\\/20{
  --tw-gradient-from: rgb(234 179 8 / 0.2) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(234 179 8 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-zinc-800\\/30{
  --tw-gradient-from: rgb(39 39 42 / 0.3) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(39 39 42 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.via-\\[\\#FFE08A\\]\\/40{
  --tw-gradient-to: rgb(255 224 138 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(255 224 138 / 0.4) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-background\\/10{
  --tw-gradient-to: hsl(var(--background) / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), hsl(var(--background) / 0.1) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-background\\/40{
  --tw-gradient-to: hsl(var(--background) / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), hsl(var(--background) / 0.4) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-background\\/80{
  --tw-gradient-to: hsl(var(--background) / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), hsl(var(--background) / 0.8) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-background\\/85{
  --tw-gradient-to: hsl(var(--background) / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), hsl(var(--background) / 0.85) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-background\\/95{
  --tw-gradient-to: hsl(var(--background) / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), hsl(var(--background) / 0.95) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-black\\/20{
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.2) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-black\\/30{
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), rgb(0 0 0 / 0.3) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-card{
  --tw-gradient-to: hsl(var(--card) / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), hsl(var(--card)) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-primary{
  --tw-gradient-to: hsl(var(--primary) / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), hsl(var(--primary)) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-primary\\/20{
  --tw-gradient-to: hsl(var(--primary) / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), hsl(var(--primary) / 0.2) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-primary\\/5{
  --tw-gradient-to: hsl(var(--primary) / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), hsl(var(--primary) / 0.05) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-secondary\\/20{
  --tw-gradient-to: hsl(var(--secondary) / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), hsl(var(--secondary) / 0.2) var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-transparent{
  --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), transparent var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.via-white{
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), #fff var(--tw-gradient-via-position), var(--tw-gradient-to);
}

.to-\\[\\#FFE08A\\]{
  --tw-gradient-to: #FFE08A var(--tw-gradient-to-position);
}

.to-accent{
  --tw-gradient-to: hsl(var(--accent)) var(--tw-gradient-to-position);
}

.to-accent\\/10{
  --tw-gradient-to: hsl(var(--accent) / 0.1) var(--tw-gradient-to-position);
}

.to-amber-700{
  --tw-gradient-to: #b45309 var(--tw-gradient-to-position);
}

.to-amber-800{
  --tw-gradient-to: #92400e var(--tw-gradient-to-position);
}

.to-background{
  --tw-gradient-to: hsl(var(--background)) var(--tw-gradient-to-position);
}

.to-background\\/10{
  --tw-gradient-to: hsl(var(--background) / 0.1) var(--tw-gradient-to-position);
}

.to-background\\/20{
  --tw-gradient-to: hsl(var(--background) / 0.2) var(--tw-gradient-to-position);
}

.to-background\\/40{
  --tw-gradient-to: hsl(var(--background) / 0.4) var(--tw-gradient-to-position);
}

.to-blue-100{
  --tw-gradient-to: #dbeafe var(--tw-gradient-to-position);
}

.to-blue-500{
  --tw-gradient-to: #3b82f6 var(--tw-gradient-to-position);
}

.to-blue-700{
  --tw-gradient-to: #1d4ed8 var(--tw-gradient-to-position);
}

.to-blue-800{
  --tw-gradient-to: #1e40af var(--tw-gradient-to-position);
}

.to-blue-900\\/30{
  --tw-gradient-to: rgb(30 58 138 / 0.3) var(--tw-gradient-to-position);
}

.to-card{
  --tw-gradient-to: hsl(var(--card)) var(--tw-gradient-to-position);
}

.to-emerald-700{
  --tw-gradient-to: #047857 var(--tw-gradient-to-position);
}

.to-emerald-800{
  --tw-gradient-to: #065f46 var(--tw-gradient-to-position);
}

.to-gray-400\\/5{
  --tw-gradient-to: rgb(156 163 175 / 0.05) var(--tw-gradient-to-position);
}

.to-green-100{
  --tw-gradient-to: #dcfce7 var(--tw-gradient-to-position);
}

.to-orange-500\\/5{
  --tw-gradient-to: rgb(249 115 22 / 0.05) var(--tw-gradient-to-position);
}

.to-primary{
  --tw-gradient-to: hsl(var(--primary)) var(--tw-gradient-to-position);
}

.to-primary\\/20{
  --tw-gradient-to: hsl(var(--primary) / 0.2) var(--tw-gradient-to-position);
}

.to-primary\\/25{
  --tw-gradient-to: hsl(var(--primary) / 0.25) var(--tw-gradient-to-position);
}

.to-primary\\/30{
  --tw-gradient-to: hsl(var(--primary) / 0.3) var(--tw-gradient-to-position);
}

.to-primary\\/5{
  --tw-gradient-to: hsl(var(--primary) / 0.05) var(--tw-gradient-to-position);
}

.to-primary\\/60{
  --tw-gradient-to: hsl(var(--primary) / 0.6) var(--tw-gradient-to-position);
}

.to-purple-700{
  --tw-gradient-to: #7e22ce var(--tw-gradient-to-position);
}

.to-purple-800{
  --tw-gradient-to: #6b21a8 var(--tw-gradient-to-position);
}

.to-purple-900\\/30{
  --tw-gradient-to: rgb(88 28 135 / 0.3) var(--tw-gradient-to-position);
}

.to-red-700{
  --tw-gradient-to: #b91c1c var(--tw-gradient-to-position);
}

.to-red-800{
  --tw-gradient-to: #991b1b var(--tw-gradient-to-position);
}

.to-rose-500{
  --tw-gradient-to: #f43f5e var(--tw-gradient-to-position);
}

.to-secondary\\/10{
  --tw-gradient-to: hsl(var(--secondary) / 0.1) var(--tw-gradient-to-position);
}

.to-secondary\\/20{
  --tw-gradient-to: hsl(var(--secondary) / 0.2) var(--tw-gradient-to-position);
}

.to-secondary\\/30{
  --tw-gradient-to: hsl(var(--secondary) / 0.3) var(--tw-gradient-to-position);
}

.to-secondary\\/60{
  --tw-gradient-to: hsl(var(--secondary) / 0.6) var(--tw-gradient-to-position);
}

.to-slate-50{
  --tw-gradient-to: #f8fafc var(--tw-gradient-to-position);
}

.to-slate-900{
  --tw-gradient-to: #0f172a var(--tw-gradient-to-position);
}

.to-transparent{
  --tw-gradient-to: transparent var(--tw-gradient-to-position);
}

.to-yellow-500{
  --tw-gradient-to: #eab308 var(--tw-gradient-to-position);
}

.to-yellow-500\\/5{
  --tw-gradient-to: rgb(234 179 8 / 0.05) var(--tw-gradient-to-position);
}

.fill-current{
  fill: currentColor;
}

.fill-primary{
  fill: hsl(var(--primary));
}

.fill-primary-foreground{
  fill: hsl(var(--primary-foreground));
}

.fill-red-400{
  fill: #f87171;
}

.object-contain{
  -o-object-fit: contain;
     object-fit: contain;
}

.object-cover{
  -o-object-fit: cover;
     object-fit: cover;
}

.object-\\[center_20\\%\\]{
  -o-object-position: center 20%;
     object-position: center 20%;
}

.object-\\[right_top\\]{
  -o-object-position: right top;
     object-position: right top;
}

.object-center{
  -o-object-position: center;
     object-position: center;
}

.object-top{
  -o-object-position: top;
     object-position: top;
}

.p-0{
  padding: 0px;
}

.p-0\\.5{
  padding: 0.125rem;
}

.p-1{
  padding: 0.25rem;
}

.p-1\\.5{
  padding: 0.375rem;
}

.p-10{
  padding: 2.5rem;
}

.p-12{
  padding: 3rem;
}

.p-2{
  padding: 0.5rem;
}

.p-2\\.5{
  padding: 0.625rem;
}

.p-3{
  padding: 0.75rem;
}

.p-3\\.5{
  padding: 0.875rem;
}

.p-4{
  padding: 1rem;
}

.p-5{
  padding: 1.25rem;
}

.p-6{
  padding: 1.5rem;
}

.p-7{
  padding: 1.75rem;
}

.p-8{
  padding: 2rem;
}

.p-9{
  padding: 2.25rem;
}

.p-\\[1px\\]{
  padding: 1px;
}

.px-0\\.5{
  padding-left: 0.125rem;
  padding-right: 0.125rem;
}

.px-1{
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.px-1\\.5{
  padding-left: 0.375rem;
  padding-right: 0.375rem;
}

.px-10{
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}

.px-12{
  padding-left: 3rem;
  padding-right: 3rem;
}

.px-2{
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.px-2\\.5{
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}

.px-3{
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.px-3\\.5{
  padding-left: 0.875rem;
  padding-right: 0.875rem;
}

.px-4{
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-5{
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.px-6{
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.px-7{
  padding-left: 1.75rem;
  padding-right: 1.75rem;
}

.px-8{
  padding-left: 2rem;
  padding-right: 2rem;
}

.py-0{
  padding-top: 0px;
  padding-bottom: 0px;
}

.py-0\\.5{
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}

.py-1{
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.py-1\\.5{
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}

.py-10{
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}

.py-12{
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.py-14{
  padding-top: 3.5rem;
  padding-bottom: 3.5rem;
}

.py-16{
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.py-2{
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-2\\.5{
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

.py-20{
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.py-24{
  padding-top: 6rem;
  padding-bottom: 6rem;
}

.py-3{
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.py-3\\.5{
  padding-top: 0.875rem;
  padding-bottom: 0.875rem;
}

.py-32{
  padding-top: 8rem;
  padding-bottom: 8rem;
}

.py-4{
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.py-5{
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.py-6{
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.py-7{
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
}

.py-8{
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.pb-1{
  padding-bottom: 0.25rem;
}

.pb-1\\.5{
  padding-bottom: 0.375rem;
}

.pb-10{
  padding-bottom: 2.5rem;
}

.pb-12{
  padding-bottom: 3rem;
}

.pb-14{
  padding-bottom: 3.5rem;
}

.pb-16{
  padding-bottom: 4rem;
}

.pb-2{
  padding-bottom: 0.5rem;
}

.pb-20{
  padding-bottom: 5rem;
}

.pb-24{
  padding-bottom: 6rem;
}

.pb-28{
  padding-bottom: 7rem;
}

.pb-3{
  padding-bottom: 0.75rem;
}

.pb-36{
  padding-bottom: 9rem;
}

.pb-4{
  padding-bottom: 1rem;
}

.pb-44{
  padding-bottom: 11rem;
}

.pb-5{
  padding-bottom: 1.25rem;
}

.pb-6{
  padding-bottom: 1.5rem;
}

.pb-8{
  padding-bottom: 2rem;
}

.pb-\\[calc\\(0\\.75rem\\+env\\(safe-area-inset-bottom\\)\\)\\]{
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}

.pb-\\[env\\(safe-area-inset-bottom\\)\\]{
  padding-bottom: env(safe-area-inset-bottom);
}

.pb-px{
  padding-bottom: 1px;
}

.pl-10{
  padding-left: 2.5rem;
}

.pl-11{
  padding-left: 2.75rem;
}

.pl-12{
  padding-left: 3rem;
}

.pl-14{
  padding-left: 3.5rem;
}

.pl-2{
  padding-left: 0.5rem;
}

.pl-2\\.5{
  padding-left: 0.625rem;
}

.pl-3{
  padding-left: 0.75rem;
}

.pl-4{
  padding-left: 1rem;
}

.pl-5{
  padding-left: 1.25rem;
}

.pl-6{
  padding-left: 1.5rem;
}

.pl-7{
  padding-left: 1.75rem;
}

.pl-8{
  padding-left: 2rem;
}

.pl-9{
  padding-left: 2.25rem;
}

.pr-1{
  padding-right: 0.25rem;
}

.pr-10{
  padding-right: 2.5rem;
}

.pr-11{
  padding-right: 2.75rem;
}

.pr-2{
  padding-right: 0.5rem;
}

.pr-2\\.5{
  padding-right: 0.625rem;
}

.pr-3{
  padding-right: 0.75rem;
}

.pr-4{
  padding-right: 1rem;
}

.pr-8{
  padding-right: 2rem;
}

.pt-0{
  padding-top: 0px;
}

.pt-0\\.5{
  padding-top: 0.125rem;
}

.pt-1{
  padding-top: 0.25rem;
}

.pt-10{
  padding-top: 2.5rem;
}

.pt-12{
  padding-top: 3rem;
}

.pt-14{
  padding-top: 3.5rem;
}

.pt-16{
  padding-top: 4rem;
}

.pt-2{
  padding-top: 0.5rem;
}

.pt-2\\.5{
  padding-top: 0.625rem;
}

.pt-20{
  padding-top: 5rem;
}

.pt-24{
  padding-top: 6rem;
}

.pt-28{
  padding-top: 7rem;
}

.pt-3{
  padding-top: 0.75rem;
}

.pt-32{
  padding-top: 8rem;
}

.pt-4{
  padding-top: 1rem;
}

.pt-5{
  padding-top: 1.25rem;
}

.pt-6{
  padding-top: 1.5rem;
}

.pt-7{
  padding-top: 1.75rem;
}

.pt-8{
  padding-top: 2rem;
}

.pt-\\[10vh\\]{
  padding-top: 10vh;
}

.pt-\\[20vh\\]{
  padding-top: 20vh;
}

.text-left{
  text-align: left;
}

.text-center{
  text-align: center;
}

.text-right{
  text-align: right;
}

.align-middle{
  vertical-align: middle;
}

.font-body{
  font-family: var(--font-body);
}

.font-cormorant{
  font-family: Cormorant Garamond, serif;
}

.font-display{
  font-family: var(--font-display);
}

.font-mono{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;
}

.font-poppins{
  font-family: Poppins, sans-serif;
}

.font-sans{
  font-family: ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";
}

.text-2xl{
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-3xl{
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.text-4xl{
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.text-5xl{
  font-size: 3rem;
  line-height: 1;
}

.text-6xl{
  font-size: 3.75rem;
  line-height: 1;
}

.text-7xl{
  font-size: 4.5rem;
  line-height: 1;
}

.text-\\[0\\.8rem\\]{
  font-size: 0.8rem;
}

.text-\\[10px\\]{
  font-size: 10px;
}

.text-\\[11px\\]{
  font-size: 11px;
}

.text-\\[7px\\]{
  font-size: 7px;
}

.text-\\[8px\\]{
  font-size: 8px;
}

.text-\\[9px\\]{
  font-size: 9px;
}

.text-\\[clamp\\(3rem\\2c 8vw\\2c 6\\.5rem\\)\\]{
  font-size: clamp(3rem, 8vw, 6.5rem);
}

.text-base{
  font-size: 1rem;
  line-height: 1.5rem;
}

.text-lg{
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-sm{
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xl{
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-xs{
  font-size: 0.75rem;
  line-height: 1rem;
}

.font-bold{
  font-weight: 700;
}

.font-medium{
  font-weight: 500;
}

.font-normal{
  font-weight: 400;
}

.font-semibold{
  font-weight: 600;
}

.uppercase{
  text-transform: uppercase;
}

.capitalize{
  text-transform: capitalize;
}

.normal-case{
  text-transform: none;
}

.italic{
  font-style: italic;
}

.not-italic{
  font-style: normal;
}

.tabular-nums{
  --tw-numeric-spacing: tabular-nums;
  font-variant-numeric: var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction);
}

.leading-7{
  line-height: 1.75rem;
}

.leading-\\[1\\.05\\]{
  line-height: 1.05;
}

.leading-\\[1\\.9\\]{
  line-height: 1.9;
}

.leading-\\[2\\]{
  line-height: 2;
}

.leading-loose{
  line-height: 2;
}

.leading-none{
  line-height: 1;
}

.leading-relaxed{
  line-height: 1.625;
}

.leading-snug{
  line-height: 1.375;
}

.leading-tight{
  line-height: 1.25;
}

.tracking-\\[0\\.12em\\]{
  letter-spacing: 0.12em;
}

.tracking-\\[0\\.14em\\]{
  letter-spacing: 0.14em;
}

.tracking-\\[0\\.15em\\]{
  letter-spacing: 0.15em;
}

.tracking-\\[0\\.16em\\]{
  letter-spacing: 0.16em;
}

.tracking-\\[0\\.18em\\]{
  letter-spacing: 0.18em;
}

.tracking-\\[0\\.1em\\]{
  letter-spacing: 0.1em;
}

.tracking-\\[0\\.22em\\]{
  letter-spacing: 0.22em;
}

.tracking-\\[0\\.25em\\]{
  letter-spacing: 0.25em;
}

.tracking-\\[0\\.28em\\]{
  letter-spacing: 0.28em;
}

.tracking-\\[0\\.2em\\]{
  letter-spacing: 0.2em;
}

.tracking-\\[0\\.32em\\]{
  letter-spacing: 0.32em;
}

.tracking-\\[0\\.34em\\]{
  letter-spacing: 0.34em;
}

.tracking-\\[0\\.35em\\]{
  letter-spacing: 0.35em;
}

.tracking-\\[0\\.3em\\]{
  letter-spacing: 0.3em;
}

.tracking-\\[0\\.45em\\]{
  letter-spacing: 0.45em;
}

.tracking-\\[0\\.4em\\]{
  letter-spacing: 0.4em;
}

.tracking-\\[0\\.5em\\]{
  letter-spacing: 0.5em;
}

.tracking-\\[0\\.65em\\]{
  letter-spacing: 0.65em;
}

.tracking-\\[0\\.6em\\]{
  letter-spacing: 0.6em;
}

.tracking-\\[0\\.7em\\]{
  letter-spacing: 0.7em;
}

.tracking-\\[0\\.8em\\]{
  letter-spacing: 0.8em;
}

.tracking-tight{
  letter-spacing: -0.025em;
}

.tracking-wide{
  letter-spacing: 0.025em;
}

.tracking-wider{
  letter-spacing: 0.05em;
}

.tracking-widest{
  letter-spacing: 0.1em;
}

.text-\\[\\#00A8E1\\]{
  --tw-text-opacity: 1;
  color: rgb(0 168 225 / var(--tw-text-opacity, 1));
}

.text-\\[\\#00FFFF\\]{
  --tw-text-opacity: 1;
  color: rgb(0 255 255 / var(--tw-text-opacity, 1));
}

.text-\\[\\#1DB954\\]{
  --tw-text-opacity: 1;
  color: rgb(29 185 84 / var(--tw-text-opacity, 1));
}

.text-\\[\\#A09880\\]{
  --tw-text-opacity: 1;
  color: rgb(160 152 128 / var(--tw-text-opacity, 1));
}

.text-\\[\\#A238FF\\]{
  --tw-text-opacity: 1;
  color: rgb(162 56 255 / var(--tw-text-opacity, 1));
}

.text-\\[\\#C9A84C\\]{
  --tw-text-opacity: 1;
  color: rgb(201 168 76 / var(--tw-text-opacity, 1));
}

.text-\\[\\#C9A84C\\]\\/20{
  color: rgb(201 168 76 / 0.2);
}

.text-\\[\\#C9A84C\\]\\/50{
  color: rgb(201 168 76 / 0.5);
}

.text-\\[\\#C9A84C\\]\\/60{
  color: rgb(201 168 76 / 0.6);
}

.text-\\[\\#F5594E\\]{
  --tw-text-opacity: 1;
  color: rgb(245 89 78 / var(--tw-text-opacity, 1));
}

.text-\\[\\#F5F0E8\\]{
  --tw-text-opacity: 1;
  color: rgb(245 240 232 / var(--tw-text-opacity, 1));
}

.text-\\[\\#FA243C\\]{
  --tw-text-opacity: 1;
  color: rgb(250 36 60 / var(--tw-text-opacity, 1));
}

.text-\\[\\#FF0000\\]{
  --tw-text-opacity: 1;
  color: rgb(255 0 0 / var(--tw-text-opacity, 1));
}

.text-\\[\\#FF5500\\]{
  --tw-text-opacity: 1;
  color: rgb(255 85 0 / var(--tw-text-opacity, 1));
}

.text-\\[\\#FFA200\\]{
  --tw-text-opacity: 1;
  color: rgb(255 162 0 / var(--tw-text-opacity, 1));
}

.text-\\[\\#FFE08A\\]{
  --tw-text-opacity: 1;
  color: rgb(255 224 138 / var(--tw-text-opacity, 1));
}

.text-\\[\\#FFE08A\\]\\/10{
  color: rgb(255 224 138 / 0.1);
}

.text-\\[hsl\\(var\\(--foreground\\)\\)\\]{
  color: hsl(var(--foreground));
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]{
  color: hsl(var(--garden-cream));
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/25{
  color: hsl(var(--garden-cream) / 0.25);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/30{
  color: hsl(var(--garden-cream) / 0.3);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/35{
  color: hsl(var(--garden-cream) / 0.35);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/40{
  color: hsl(var(--garden-cream) / 0.4);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/45{
  color: hsl(var(--garden-cream) / 0.45);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/50{
  color: hsl(var(--garden-cream) / 0.5);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/55{
  color: hsl(var(--garden-cream) / 0.55);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/60{
  color: hsl(var(--garden-cream) / 0.6);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/65{
  color: hsl(var(--garden-cream) / 0.65);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/70{
  color: hsl(var(--garden-cream) / 0.7);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/80{
  color: hsl(var(--garden-cream) / 0.8);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/85{
  color: hsl(var(--garden-cream) / 0.85);
}

.text-\\[hsl\\(var\\(--garden-cream\\)\\)\\]\\/90{
  color: hsl(var(--garden-cream) / 0.9);
}

.text-\\[hsl\\(var\\(--garden-gold\\)\\)\\]{
  color: hsl(var(--garden-gold));
}

.text-\\[hsl\\(var\\(--garden-gold\\)\\)\\]\\/70{
  color: hsl(var(--garden-gold) / 0.7);
}

.text-\\[hsl\\(var\\(--garden-orange\\)\\)\\]\\/70{
  color: hsl(var(--garden-orange) / 0.7);
}

.text-accent{
  color: hsl(var(--accent));
}

.text-accent-foreground{
  color: hsl(var(--accent-foreground));
}

.text-amber-100{
  --tw-text-opacity: 1;
  color: rgb(254 243 199 / var(--tw-text-opacity, 1));
}

.text-amber-200\\/70{
  color: rgb(253 230 138 / 0.7);
}

.text-amber-200\\/80{
  color: rgb(253 230 138 / 0.8);
}

.text-amber-300{
  --tw-text-opacity: 1;
  color: rgb(252 211 77 / var(--tw-text-opacity, 1));
}

.text-amber-300\\/50{
  color: rgb(252 211 77 / 0.5);
}

.text-amber-300\\/80{
  color: rgb(252 211 77 / 0.8);
}

.text-amber-400{
  --tw-text-opacity: 1;
  color: rgb(251 191 36 / var(--tw-text-opacity, 1));
}

.text-amber-400\\/50{
  color: rgb(251 191 36 / 0.5);
}

.text-amber-400\\/70{
  color: rgb(251 191 36 / 0.7);
}

.text-amber-400\\/80{
  color: rgb(251 191 36 / 0.8);
}

.text-amber-500{
  --tw-text-opacity: 1;
  color: rgb(245 158 11 / var(--tw-text-opacity, 1));
}

.text-black{
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity, 1));
}

.text-blue-200{
  --tw-text-opacity: 1;
  color: rgb(191 219 254 / var(--tw-text-opacity, 1));
}

.text-blue-200\\/70{
  color: rgb(191 219 254 / 0.7);
}

.text-blue-300{
  --tw-text-opacity: 1;
  color: rgb(147 197 253 / var(--tw-text-opacity, 1));
}

.text-blue-300\\/80{
  color: rgb(147 197 253 / 0.8);
}

.text-blue-300\\/90{
  color: rgb(147 197 253 / 0.9);
}

.text-blue-400{
  --tw-text-opacity: 1;
  color: rgb(96 165 250 / var(--tw-text-opacity, 1));
}

.text-blue-400\\/60{
  color: rgb(96 165 250 / 0.6);
}

.text-blue-400\\/70{
  color: rgb(96 165 250 / 0.7);
}

.text-blue-400\\/80{
  color: rgb(96 165 250 / 0.8);
}

.text-blue-500{
  --tw-text-opacity: 1;
  color: rgb(59 130 246 / var(--tw-text-opacity, 1));
}

.text-blue-600{
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
}

.text-blue-700{
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}

.text-blue-800{
  --tw-text-opacity: 1;
  color: rgb(30 64 175 / var(--tw-text-opacity, 1));
}

.text-blue-900{
  --tw-text-opacity: 1;
  color: rgb(30 58 138 / var(--tw-text-opacity, 1));
}

.text-border{
  color: hsl(var(--border));
}

.text-card-foreground{
  color: hsl(var(--card-foreground));
}

.text-chart-2{
  color: hsl(var(--chart-2));
}

.text-chart-3{
  color: hsl(var(--chart-3));
}

.text-chart-4{
  color: hsl(var(--chart-4));
}

.text-chart-5{
  color: hsl(var(--chart-5));
}

.text-current{
  color: currentColor;
}

.text-cyan-300{
  --tw-text-opacity: 1;
  color: rgb(103 232 249 / var(--tw-text-opacity, 1));
}

.text-cyan-400{
  --tw-text-opacity: 1;
  color: rgb(34 211 238 / var(--tw-text-opacity, 1));
}

.text-destructive{
  color: hsl(var(--destructive));
}

.text-destructive-foreground{
  color: hsl(var(--destructive-foreground));
}

.text-destructive\\/70{
  color: hsl(var(--destructive) / 0.7);
}

.text-emerald-300{
  --tw-text-opacity: 1;
  color: rgb(110 231 183 / var(--tw-text-opacity, 1));
}

.text-emerald-400{
  --tw-text-opacity: 1;
  color: rgb(52 211 153 / var(--tw-text-opacity, 1));
}

.text-foreground{
  color: hsl(var(--foreground));
}

.text-foreground\\/25{
  color: hsl(var(--foreground) / 0.25);
}

.text-foreground\\/40{
  color: hsl(var(--foreground) / 0.4);
}

.text-foreground\\/45{
  color: hsl(var(--foreground) / 0.45);
}

.text-foreground\\/50{
  color: hsl(var(--foreground) / 0.5);
}

.text-foreground\\/55{
  color: hsl(var(--foreground) / 0.55);
}

.text-foreground\\/60{
  color: hsl(var(--foreground) / 0.6);
}

.text-foreground\\/65{
  color: hsl(var(--foreground) / 0.65);
}

.text-foreground\\/70{
  color: hsl(var(--foreground) / 0.7);
}

.text-foreground\\/75{
  color: hsl(var(--foreground) / 0.75);
}

.text-foreground\\/80{
  color: hsl(var(--foreground) / 0.8);
}

.text-foreground\\/85{
  color: hsl(var(--foreground) / 0.85);
}

.text-foreground\\/90{
  color: hsl(var(--foreground) / 0.9);
}

.text-gray-300{
  --tw-text-opacity: 1;
  color: rgb(209 213 219 / var(--tw-text-opacity, 1));
}

.text-gray-400{
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity, 1));
}

.text-gray-500{
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity, 1));
}

.text-green-100{
  --tw-text-opacity: 1;
  color: rgb(220 252 231 / var(--tw-text-opacity, 1));
}

.text-green-200{
  --tw-text-opacity: 1;
  color: rgb(187 247 208 / var(--tw-text-opacity, 1));
}

.text-green-200\\/80{
  color: rgb(187 247 208 / 0.8);
}

.text-green-300{
  --tw-text-opacity: 1;
  color: rgb(134 239 172 / var(--tw-text-opacity, 1));
}

.text-green-300\\/70{
  color: rgb(134 239 172 / 0.7);
}

.text-green-300\\/80{
  color: rgb(134 239 172 / 0.8);
}

.text-green-300\\/90{
  color: rgb(134 239 172 / 0.9);
}

.text-green-400{
  --tw-text-opacity: 1;
  color: rgb(74 222 128 / var(--tw-text-opacity, 1));
}

.text-green-400\\/60{
  color: rgb(74 222 128 / 0.6);
}

.text-green-400\\/70{
  color: rgb(74 222 128 / 0.7);
}

.text-green-400\\/80{
  color: rgb(74 222 128 / 0.8);
}

.text-green-500{
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity, 1));
}

.text-green-500\\/70{
  color: rgb(34 197 94 / 0.7);
}

.text-green-600{
  --tw-text-opacity: 1;
  color: rgb(22 163 74 / var(--tw-text-opacity, 1));
}

.text-green-700{
  --tw-text-opacity: 1;
  color: rgb(21 128 61 / var(--tw-text-opacity, 1));
}

.text-green-900{
  --tw-text-opacity: 1;
  color: rgb(20 83 45 / var(--tw-text-opacity, 1));
}

.text-indigo-300{
  --tw-text-opacity: 1;
  color: rgb(165 180 252 / var(--tw-text-opacity, 1));
}

.text-indigo-400{
  --tw-text-opacity: 1;
  color: rgb(129 140 248 / var(--tw-text-opacity, 1));
}

.text-indigo-500{
  --tw-text-opacity: 1;
  color: rgb(99 102 241 / var(--tw-text-opacity, 1));
}

.text-lime-400{
  --tw-text-opacity: 1;
  color: rgb(163 230 53 / var(--tw-text-opacity, 1));
}

.text-muted-foreground{
  color: hsl(var(--muted-foreground));
}

.text-muted-foreground\\/20{
  color: hsl(var(--muted-foreground) / 0.2);
}

.text-muted-foreground\\/25{
  color: hsl(var(--muted-foreground) / 0.25);
}

.text-muted-foreground\\/30{
  color: hsl(var(--muted-foreground) / 0.3);
}

.text-muted-foreground\\/35{
  color: hsl(var(--muted-foreground) / 0.35);
}

.text-muted-foreground\\/40{
  color: hsl(var(--muted-foreground) / 0.4);
}

.text-muted-foreground\\/45{
  color: hsl(var(--muted-foreground) / 0.45);
}

.text-muted-foreground\\/50{
  color: hsl(var(--muted-foreground) / 0.5);
}

.text-muted-foreground\\/55{
  color: hsl(var(--muted-foreground) / 0.55);
}

.text-muted-foreground\\/60{
  color: hsl(var(--muted-foreground) / 0.6);
}

.text-muted-foreground\\/65{
  color: hsl(var(--muted-foreground) / 0.65);
}

.text-muted-foreground\\/70{
  color: hsl(var(--muted-foreground) / 0.7);
}

.text-orange-100\\/80{
  color: rgb(255 237 213 / 0.8);
}

.text-orange-200{
  --tw-text-opacity: 1;
  color: rgb(254 215 170 / var(--tw-text-opacity, 1));
}

.text-orange-300{
  --tw-text-opacity: 1;
  color: rgb(253 186 116 / var(--tw-text-opacity, 1));
}

.text-orange-400{
  --tw-text-opacity: 1;
  color: rgb(251 146 60 / var(--tw-text-opacity, 1));
}

.text-orange-400\\/60{
  color: rgb(251 146 60 / 0.6);
}

.text-orange-400\\/70{
  color: rgb(251 146 60 / 0.7);
}

.text-orange-500{
  --tw-text-opacity: 1;
  color: rgb(249 115 22 / var(--tw-text-opacity, 1));
}

.text-orange-600{
  --tw-text-opacity: 1;
  color: rgb(234 88 12 / var(--tw-text-opacity, 1));
}

.text-pink-300{
  --tw-text-opacity: 1;
  color: rgb(249 168 212 / var(--tw-text-opacity, 1));
}

.text-pink-400{
  --tw-text-opacity: 1;
  color: rgb(244 114 182 / var(--tw-text-opacity, 1));
}

.text-pink-500{
  --tw-text-opacity: 1;
  color: rgb(236 72 153 / var(--tw-text-opacity, 1));
}

.text-popover-foreground{
  color: hsl(var(--popover-foreground));
}

.text-primary{
  color: hsl(var(--primary));
}

.text-primary-foreground{
  color: hsl(var(--primary-foreground));
}

.text-primary\\/20{
  color: hsl(var(--primary) / 0.2);
}

.text-primary\\/25{
  color: hsl(var(--primary) / 0.25);
}

.text-primary\\/30{
  color: hsl(var(--primary) / 0.3);
}

.text-primary\\/35{
  color: hsl(var(--primary) / 0.35);
}

.text-primary\\/40{
  color: hsl(var(--primary) / 0.4);
}

.text-primary\\/45{
  color: hsl(var(--primary) / 0.45);
}

.text-primary\\/50{
  color: hsl(var(--primary) / 0.5);
}

.text-primary\\/60{
  color: hsl(var(--primary) / 0.6);
}

.text-primary\\/70{
  color: hsl(var(--primary) / 0.7);
}

.text-primary\\/75{
  color: hsl(var(--primary) / 0.75);
}

.text-primary\\/80{
  color: hsl(var(--primary) / 0.8);
}

.text-primary\\/90{
  color: hsl(var(--primary) / 0.9);
}

.text-purple-300{
  --tw-text-opacity: 1;
  color: rgb(216 180 254 / var(--tw-text-opacity, 1));
}

.text-purple-400{
  --tw-text-opacity: 1;
  color: rgb(192 132 252 / var(--tw-text-opacity, 1));
}

.text-purple-500{
  --tw-text-opacity: 1;
  color: rgb(168 85 247 / var(--tw-text-opacity, 1));
}

.text-red-100\\/80{
  color: rgb(254 226 226 / 0.8);
}

.text-red-200{
  --tw-text-opacity: 1;
  color: rgb(254 202 202 / var(--tw-text-opacity, 1));
}

.text-red-200\\/80{
  color: rgb(254 202 202 / 0.8);
}

.text-red-300{
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity, 1));
}

.text-red-300\\/70{
  color: rgb(252 165 165 / 0.7);
}

.text-red-300\\/80{
  color: rgb(252 165 165 / 0.8);
}

.text-red-300\\/90{
  color: rgb(252 165 165 / 0.9);
}

.text-red-400{
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity, 1));
}

.text-red-400\\/50{
  color: rgb(248 113 113 / 0.5);
}

.text-red-400\\/60{
  color: rgb(248 113 113 / 0.6);
}

.text-red-400\\/70{
  color: rgb(248 113 113 / 0.7);
}

.text-red-400\\/80{
  color: rgb(248 113 113 / 0.8);
}

.text-red-500{
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}

.text-red-500\\/70{
  color: rgb(239 68 68 / 0.7);
}

.text-red-600{
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}

.text-red-800{
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity, 1));
}

.text-rose-300{
  --tw-text-opacity: 1;
  color: rgb(253 164 175 / var(--tw-text-opacity, 1));
}

.text-rose-400{
  --tw-text-opacity: 1;
  color: rgb(251 113 133 / var(--tw-text-opacity, 1));
}

.text-secondary-foreground{
  color: hsl(var(--secondary-foreground));
}

.text-sidebar-foreground{
  color: hsl(var(--sidebar-foreground));
}

.text-sidebar-foreground\\/70{
  color: hsl(var(--sidebar-foreground) / 0.7);
}

.text-sky-300{
  --tw-text-opacity: 1;
  color: rgb(125 211 252 / var(--tw-text-opacity, 1));
}

.text-sky-400{
  --tw-text-opacity: 1;
  color: rgb(56 189 248 / var(--tw-text-opacity, 1));
}

.text-slate-300{
  --tw-text-opacity: 1;
  color: rgb(203 213 225 / var(--tw-text-opacity, 1));
}

.text-slate-400{
  --tw-text-opacity: 1;
  color: rgb(148 163 184 / var(--tw-text-opacity, 1));
}

.text-slate-500{
  --tw-text-opacity: 1;
  color: rgb(100 116 139 / var(--tw-text-opacity, 1));
}

.text-slate-600{
  --tw-text-opacity: 1;
  color: rgb(71 85 105 / var(--tw-text-opacity, 1));
}

.text-slate-900{
  --tw-text-opacity: 1;
  color: rgb(15 23 42 / var(--tw-text-opacity, 1));
}

.text-teal-400{
  --tw-text-opacity: 1;
  color: rgb(45 212 191 / var(--tw-text-opacity, 1));
}

.text-violet-400{
  --tw-text-opacity: 1;
  color: rgb(167 139 250 / var(--tw-text-opacity, 1));
}

.text-white{
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}

.text-white\\/10{
  color: rgb(255 255 255 / 0.1);
}

.text-white\\/20{
  color: rgb(255 255 255 / 0.2);
}

.text-white\\/30{
  color: rgb(255 255 255 / 0.3);
}

.text-white\\/40{
  color: rgb(255 255 255 / 0.4);
}

.text-white\\/50{
  color: rgb(255 255 255 / 0.5);
}

.text-white\\/60{
  color: rgb(255 255 255 / 0.6);
}

.text-white\\/65{
  color: rgb(255 255 255 / 0.65);
}

.text-white\\/70{
  color: rgb(255 255 255 / 0.7);
}

.text-white\\/80{
  color: rgb(255 255 255 / 0.8);
}

.text-white\\/85{
  color: rgb(255 255 255 / 0.85);
}

.text-white\\/90{
  color: rgb(255 255 255 / 0.9);
}

.text-yellow-100\\/80{
  color: rgb(254 249 195 / 0.8);
}

.text-yellow-200{
  --tw-text-opacity: 1;
  color: rgb(254 240 138 / var(--tw-text-opacity, 1));
}

.text-yellow-200\\/60{
  color: rgb(254 240 138 / 0.6);
}

.text-yellow-200\\/80{
  color: rgb(254 240 138 / 0.8);
}

.text-yellow-300{
  --tw-text-opacity: 1;
  color: rgb(253 224 71 / var(--tw-text-opacity, 1));
}

.text-yellow-300\\/70{
  color: rgb(253 224 71 / 0.7);
}

.text-yellow-300\\/80{
  color: rgb(253 224 71 / 0.8);
}

.text-yellow-400{
  --tw-text-opacity: 1;
  color: rgb(250 204 21 / var(--tw-text-opacity, 1));
}

.text-yellow-400\\/60{
  color: rgb(250 204 21 / 0.6);
}

.text-yellow-400\\/70{
  color: rgb(250 204 21 / 0.7);
}

.text-yellow-500{
  --tw-text-opacity: 1;
  color: rgb(234 179 8 / var(--tw-text-opacity, 1));
}

.text-yellow-500\\/60{
  color: rgb(234 179 8 / 0.6);
}

.text-yellow-500\\/70{
  color: rgb(234 179 8 / 0.7);
}

.text-yellow-600{
  --tw-text-opacity: 1;
  color: rgb(202 138 4 / var(--tw-text-opacity, 1));
}

.text-zinc-100{
  --tw-text-opacity: 1;
  color: rgb(244 244 245 / var(--tw-text-opacity, 1));
}

.text-zinc-400{
  --tw-text-opacity: 1;
  color: rgb(161 161 170 / var(--tw-text-opacity, 1));
}

.text-zinc-500{
  --tw-text-opacity: 1;
  color: rgb(113 113 122 / var(--tw-text-opacity, 1));
}

.underline{
  text-decoration-line: underline;
}

.line-through{
  text-decoration-line: line-through;
}

.underline-offset-2{
  text-underline-offset: 2px;
}

.underline-offset-4{
  text-underline-offset: 4px;
}

.placeholder-muted-foreground::-moz-placeholder{
  color: hsl(var(--muted-foreground));
}

.placeholder-muted-foreground::placeholder{
  color: hsl(var(--muted-foreground));
}

.placeholder-muted-foreground\\/35::-moz-placeholder{
  color: hsl(var(--muted-foreground) / 0.35);
}

.placeholder-muted-foreground\\/35::placeholder{
  color: hsl(var(--muted-foreground) / 0.35);
}

.accent-primary{
  accent-color: hsl(var(--primary));
}

.accent-yellow-500{
  accent-color: #eab308;
}

.opacity-0{
  opacity: 0;
}

.opacity-10{
  opacity: 0.1;
}

.opacity-100{
  opacity: 1;
}

.opacity-20{
  opacity: 0.2;
}

.opacity-25{
  opacity: 0.25;
}

.opacity-30{
  opacity: 0.3;
}

.opacity-40{
  opacity: 0.4;
}

.opacity-50{
  opacity: 0.5;
}

.opacity-60{
  opacity: 0.6;
}

.opacity-70{
  opacity: 0.7;
}

.opacity-75{
  opacity: 0.75;
}

.opacity-80{
  opacity: 0.8;
}

.opacity-85{
  opacity: 0.85;
}

.opacity-90{
  opacity: 0.9;
}

.opacity-95{
  opacity: 0.95;
}

.opacity-\\[0\\.05\\]{
  opacity: 0.05;
}

.opacity-\\[0\\.06\\]{
  opacity: 0.06;
}

.opacity-\\[0\\.07\\]{
  opacity: 0.07;
}

.opacity-\\[0\\.12\\]{
  opacity: 0.12;
}

.mix-blend-overlay{
  mix-blend-mode: overlay;
}

.shadow{
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-2xl{
  --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-\\[0_-2px_24px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.35\\)\\]{
  --tw-shadow: 0 -2px 24px rgba(0,0,0,0.35);
  --tw-shadow-colored: 0 -2px 24px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-\\[0_0_0_1px_hsl\\(var\\(--sidebar-border\\)\\)\\]{
  --tw-shadow: 0 0 0 1px hsl(var(--sidebar-border));
  --tw-shadow-colored: 0 0 0 1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-\\[0_2px_24px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.4\\)\\]{
  --tw-shadow: 0 2px 24px rgba(0,0,0,0.4);
  --tw-shadow-colored: 0 2px 24px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-inner{
  --tw-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: inset 0 2px 4px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-lg{
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-md{
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-none{
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-sm{
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-xl{
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-\\[\\#FFE08A\\]\\/5{
  --tw-shadow-color: rgb(255 224 138 / 0.05);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-black\\/30{
  --tw-shadow-color: rgb(0 0 0 / 0.3);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-primary\\/10{
  --tw-shadow-color: hsl(var(--primary) / 0.1);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-primary\\/20{
  --tw-shadow-color: hsl(var(--primary) / 0.2);
  --tw-shadow: var(--tw-shadow-colored);
}

.shadow-primary\\/5{
  --tw-shadow-color: hsl(var(--primary) / 0.05);
  --tw-shadow: var(--tw-shadow-colored);
}

.outline-none{
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.outline{
  outline-style: solid;
}

.ring{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-0{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-1{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-2{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-inset{
  --tw-ring-inset: inset;
}

.ring-primary{
  --tw-ring-color: hsl(var(--primary));
}

.ring-primary\\/0{
  --tw-ring-color: hsl(var(--primary) / 0);
}

.ring-primary\\/20{
  --tw-ring-color: hsl(var(--primary) / 0.2);
}

.ring-primary\\/30{
  --tw-ring-color: hsl(var(--primary) / 0.3);
}

.ring-ring{
  --tw-ring-color: hsl(var(--ring));
}

.ring-sidebar-ring{
  --tw-ring-color: hsl(var(--sidebar-ring));
}

.ring-offset-2{
  --tw-ring-offset-width: 2px;
}

.ring-offset-background{
  --tw-ring-offset-color: hsl(var(--background));
}

.blur{
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.blur-2xl{
  --tw-blur: blur(40px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.blur-3xl{
  --tw-blur: blur(64px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-105{
  --tw-brightness: brightness(1.05);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.brightness-110{
  --tw-brightness: brightness(1.1);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.drop-shadow{
  --tw-drop-shadow: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.drop-shadow-\\[0_0_6px_rgba\\(212\\2c 175\\2c 55\\2c 0\\.5\\)\\]{
  --tw-drop-shadow: drop-shadow(0 0 6px rgba(212,175,55,0.5));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.drop-shadow-lg{
  --tw-drop-shadow: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.grayscale{
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.grayscale-\\[15\\%\\]{
  --tw-grayscale: grayscale(15%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.saturate-100{
  --tw-saturate: saturate(1);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.sepia{
  --tw-sepia: sepia(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.filter{
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.backdrop-blur{
  --tw-backdrop-blur: blur(8px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-\\[2px\\]{
  --tw-backdrop-blur: blur(2px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-md{
  --tw-backdrop-blur: blur(12px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-sm{
  --tw-backdrop-blur: blur(4px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-blur-xl{
  --tw-backdrop-blur: blur(24px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.backdrop-filter{
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.transition{
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-\\[left\\2c right\\2c width\\]{
  transition-property: left,right,width;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-\\[margin\\2c opacity\\]{
  transition-property: margin,opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-\\[width\\2c height\\2c padding\\]{
  transition-property: width,height,padding;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-\\[width\\]{
  transition-property: width;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all{
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-colors{
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-opacity{
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-transform{
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-1000{
  transition-duration: 1000ms;
}

.duration-200{
  transition-duration: 200ms;
}

.duration-300{
  transition-duration: 300ms;
}

.duration-500{
  transition-duration: 500ms;
}

.duration-700{
  transition-duration: 700ms;
}

.ease-in{
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

.ease-in-out{
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.ease-linear{
  transition-timing-function: linear;
}

.ease-out{
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

@keyframes enter{

  from{
    opacity: var(--tw-enter-opacity, 1);
    transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0));
  }
}

@keyframes exit{

  to{
    opacity: var(--tw-exit-opacity, 1);
    transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0));
  }
}

.animate-in{
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}

.fade-in-0{
  --tw-enter-opacity: 0;
}

.zoom-in{
  --tw-enter-scale: 0;
}

.zoom-in-95{
  --tw-enter-scale: .95;
}

.duration-1000{
  animation-duration: 1000ms;
}

.duration-200{
  animation-duration: 200ms;
}

.duration-300{
  animation-duration: 300ms;
}

.duration-500{
  animation-duration: 500ms;
}

.duration-700{
  animation-duration: 700ms;
}

.ease-in{
  animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

.ease-in-out{
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.ease-linear{
  animation-timing-function: linear;
}

.ease-out{
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.running{
  animation-play-state: running;
}

.paused{
  animation-play-state: paused;
}

.\\[perspective\\:1000px\\]{
  perspective: 1000px;
}

.\\[transition-duration\\:900ms\\]{
  transition-duration: 900ms;
}

@keyframes gwNeonPulse {
  0%, 100% {
    text-shadow:
      0 0 6px rgba(253, 244, 224, 0.85),
      0 0 16px rgba(212, 175, 55, 0.6),
      0 0 40px rgba(212, 175, 55, 0.4);
  }
  50% {
    text-shadow:
      0 0 8px rgba(253, 244, 224, 1),
      0 0 24px rgba(212, 175, 55, 0.85),
      0 0 58px rgba(212, 175, 55, 0.55),
      0 0 96px rgba(212, 175, 55, 0.3);
  }
}

.group:hover .group-hover\\:gradient-gold-glow{
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
    background-image: linear-gradient(90deg, #a9842c 0%, #d4af37 38%, #f0e6c8 50%, #d4af37 62%, #a9842c 100%);
    filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.4)) drop-shadow(0 0 6px rgba(212, 175, 55, 0.3));
    -webkit-text-stroke: 0.5px rgba(30, 25, 15, 0.6);
}

.file\\:mr-2::file-selector-button{
  margin-right: 0.5rem;
}

.file\\:rounded-lg::file-selector-button{
  border-radius: var(--radius);
}

.file\\:border-0::file-selector-button{
  border-width: 0px;
}

.file\\:bg-secondary::file-selector-button{
  background-color: hsl(var(--secondary));
}

.file\\:bg-transparent::file-selector-button{
  background-color: transparent;
}

.file\\:px-3::file-selector-button{
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.file\\:py-1::file-selector-button{
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.file\\:text-sm::file-selector-button{
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.file\\:text-xs::file-selector-button{
  font-size: 0.75rem;
  line-height: 1rem;
}

.file\\:font-medium::file-selector-button{
  font-weight: 500;
}

.file\\:text-foreground::file-selector-button{
  color: hsl(var(--foreground));
}

.placeholder\\:text-\\[\\#6B6455\\]::-moz-placeholder{
  --tw-text-opacity: 1;
  color: rgb(107 100 85 / var(--tw-text-opacity, 1));
}

.placeholder\\:text-\\[\\#6B6455\\]::placeholder{
  --tw-text-opacity: 1;
  color: rgb(107 100 85 / var(--tw-text-opacity, 1));
}

.placeholder\\:text-muted-foreground::-moz-placeholder{
  color: hsl(var(--muted-foreground));
}

.placeholder\\:text-muted-foreground::placeholder{
  color: hsl(var(--muted-foreground));
}

.placeholder\\:text-muted-foreground\\/30::-moz-placeholder{
  color: hsl(var(--muted-foreground) / 0.3);
}

.placeholder\\:text-muted-foreground\\/30::placeholder{
  color: hsl(var(--muted-foreground) / 0.3);
}

.placeholder\\:text-muted-foreground\\/40::-moz-placeholder{
  color: hsl(var(--muted-foreground) / 0.4);
}

.placeholder\\:text-muted-foreground\\/40::placeholder{
  color: hsl(var(--muted-foreground) / 0.4);
}

.placeholder\\:text-muted-foreground\\/50::-moz-placeholder{
  color: hsl(var(--muted-foreground) / 0.5);
}

.placeholder\\:text-muted-foreground\\/50::placeholder{
  color: hsl(var(--muted-foreground) / 0.5);
}

.placeholder\\:text-white\\/30::-moz-placeholder{
  color: rgb(255 255 255 / 0.3);
}

.placeholder\\:text-white\\/30::placeholder{
  color: rgb(255 255 255 / 0.3);
}

.after\\:absolute::after{
  content: var(--tw-content);
  position: absolute;
}

.after\\:-inset-2::after{
  content: var(--tw-content);
  inset: -0.5rem;
}

.after\\:inset-y-0::after{
  content: var(--tw-content);
  top: 0px;
  bottom: 0px;
}

.after\\:left-1\\/2::after{
  content: var(--tw-content);
  left: 50%;
}

.after\\:w-1::after{
  content: var(--tw-content);
  width: 0.25rem;
}

.after\\:w-\\[2px\\]::after{
  content: var(--tw-content);
  width: 2px;
}

.after\\:-translate-x-1\\/2::after{
  content: var(--tw-content);
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.first\\:rounded-l-md:first-child{
  border-top-left-radius: calc(var(--radius) - 2px);
  border-bottom-left-radius: calc(var(--radius) - 2px);
}

.first\\:border-l:first-child{
  border-left-width: 1px;
}

.first\\:border-t-0:first-child{
  border-top-width: 0px;
}

.last\\:rounded-r-md:last-child{
  border-top-right-radius: calc(var(--radius) - 2px);
  border-bottom-right-radius: calc(var(--radius) - 2px);
}

.last\\:border-0:last-child{
  border-width: 0px;
}

.last\\:pb-0:last-child{
  padding-bottom: 0px;
}

.focus-within\\:relative:focus-within{
  position: relative;
}

.focus-within\\:z-20:focus-within{
  z-index: 20;
}

.hover\\:-translate-y-0\\.5:hover{
  --tw-translate-y: -0.125rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\\:-translate-y-1:hover{
  --tw-translate-y: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\\:scale-105:hover{
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\\:scale-110:hover{
  --tw-scale-x: 1.1;
  --tw-scale-y: 1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\\:scale-\\[1\\.02\\]:hover{
  --tw-scale-x: 1.02;
  --tw-scale-y: 1.02;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\\:scale-\\[1\\.03\\]:hover{
  --tw-scale-x: 1.03;
  --tw-scale-y: 1.03;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\\:border-\\[\\#C9A84C\\]\\/30:hover{
  border-color: rgb(201 168 76 / 0.3);
}

.hover\\:border-\\[\\#FFE08A\\]\\/20:hover{
  border-color: rgb(255 224 138 / 0.2);
}

.hover\\:border-\\[hsl\\(46_63\\%_52\\%\\/0\\.55\\)\\]:hover{
  border-color: hsl(46 63% 52%/0.55);
}

.hover\\:border-\\[hsl\\(var\\(--garden-gold\\)\\)\\]:hover{
  border-color: hsl(var(--garden-gold));
}

.hover\\:border-\\[hsl\\(var\\(--garden-gold\\)\\)\\]\\/50:hover{
  border-color: hsl(var(--garden-gold) / 0.5);
}

.hover\\:border-\\[hsl\\(var\\(--garden-gold\\)\\)\\]\\/60:hover{
  border-color: hsl(var(--garden-gold) / 0.6);
}

.hover\\:border-\\[hsl\\(var\\(--garden-orange\\)\\)\\]:hover{
  border-color: hsl(var(--garden-orange));
}

.hover\\:border-amber-400\\/30:hover{
  border-color: rgb(251 191 36 / 0.3);
}

.hover\\:border-amber-400\\/40:hover{
  border-color: rgb(251 191 36 / 0.4);
}

.hover\\:border-blue-500\\/40:hover{
  border-color: rgb(59 130 246 / 0.4);
}

.hover\\:border-border:hover{
  border-color: hsl(var(--border));
}

.hover\\:border-border\\/10:hover{
  border-color: hsl(var(--border) / 0.1);
}

.hover\\:border-border\\/30:hover{
  border-color: hsl(var(--border) / 0.3);
}

.hover\\:border-border\\/60:hover{
  border-color: hsl(var(--border) / 0.6);
}

.hover\\:border-border\\/80:hover{
  border-color: hsl(var(--border) / 0.8);
}

.hover\\:border-green-500\\/40:hover{
  border-color: rgb(34 197 94 / 0.4);
}

.hover\\:border-green-500\\/50:hover{
  border-color: rgb(34 197 94 / 0.5);
}

.hover\\:border-orange-500\\/60:hover{
  border-color: rgb(249 115 22 / 0.6);
}

.hover\\:border-primary:hover{
  border-color: hsl(var(--primary));
}

.hover\\:border-primary\\/10:hover{
  border-color: hsl(var(--primary) / 0.1);
}

.hover\\:border-primary\\/20:hover{
  border-color: hsl(var(--primary) / 0.2);
}

.hover\\:border-primary\\/25:hover{
  border-color: hsl(var(--primary) / 0.25);
}

.hover\\:border-primary\\/30:hover{
  border-color: hsl(var(--primary) / 0.3);
}

.hover\\:border-primary\\/35:hover{
  border-color: hsl(var(--primary) / 0.35);
}

.hover\\:border-primary\\/40:hover{
  border-color: hsl(var(--primary) / 0.4);
}

.hover\\:border-primary\\/45:hover{
  border-color: hsl(var(--primary) / 0.45);
}

.hover\\:border-primary\\/50:hover{
  border-color: hsl(var(--primary) / 0.5);
}

.hover\\:border-primary\\/60:hover{
  border-color: hsl(var(--primary) / 0.6);
}

.hover\\:border-primary\\/70:hover{
  border-color: hsl(var(--primary) / 0.7);
}

.hover\\:border-purple-500\\/50:hover{
  border-color: rgb(168 85 247 / 0.5);
}

.hover\\:border-red-400\\/50:hover{
  border-color: rgb(248 113 113 / 0.5);
}

.hover\\:border-red-500\\/30:hover{
  border-color: rgb(239 68 68 / 0.3);
}

.hover\\:border-red-500\\/40:hover{
  border-color: rgb(239 68 68 / 0.4);
}

.hover\\:border-red-500\\/60:hover{
  border-color: rgb(239 68 68 / 0.6);
}

.hover\\:border-red-500\\/70:hover{
  border-color: rgb(239 68 68 / 0.7);
}

.hover\\:border-white\\/20:hover{
  border-color: rgb(255 255 255 / 0.2);
}

.hover\\:border-white\\/30:hover{
  border-color: rgb(255 255 255 / 0.3);
}

.hover\\:border-yellow-400\\/50:hover{
  border-color: rgb(250 204 21 / 0.5);
}

.hover\\:border-yellow-500\\/40:hover{
  border-color: rgb(234 179 8 / 0.4);
}

.hover\\:border-yellow-500\\/60:hover{
  border-color: rgb(234 179 8 / 0.6);
}

.hover\\:bg-accent:hover{
  background-color: hsl(var(--accent));
}

.hover\\:bg-accent\\/10:hover{
  background-color: hsl(var(--accent) / 0.1);
}

.hover\\:bg-amber-400:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(251 191 36 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-amber-500\\/10:hover{
  background-color: rgb(245 158 11 / 0.1);
}

.hover\\:bg-amber-700:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(180 83 9 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-black\\/70:hover{
  background-color: rgb(0 0 0 / 0.7);
}

.hover\\:bg-blue-50:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-blue-500\\/20:hover{
  background-color: rgb(59 130 246 / 0.2);
}

.hover\\:bg-blue-700:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(29 78 216 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-card\\/60:hover{
  background-color: hsl(var(--card) / 0.6);
}

.hover\\:bg-card\\/80:hover{
  background-color: hsl(var(--card) / 0.8);
}

.hover\\:bg-destructive:hover{
  background-color: hsl(var(--destructive));
}

.hover\\:bg-destructive\\/10:hover{
  background-color: hsl(var(--destructive) / 0.1);
}

.hover\\:bg-destructive\\/20:hover{
  background-color: hsl(var(--destructive) / 0.2);
}

.hover\\:bg-destructive\\/80:hover{
  background-color: hsl(var(--destructive) / 0.8);
}

.hover\\:bg-destructive\\/90:hover{
  background-color: hsl(var(--destructive) / 0.9);
}

.hover\\:bg-foreground\\/5:hover{
  background-color: hsl(var(--foreground) / 0.05);
}

.hover\\:bg-green-500\\/10:hover{
  background-color: rgb(34 197 94 / 0.1);
}

.hover\\:bg-green-500\\/20:hover{
  background-color: rgb(34 197 94 / 0.2);
}

.hover\\:bg-green-500\\/30:hover{
  background-color: rgb(34 197 94 / 0.3);
}

.hover\\:bg-green-500\\/5:hover{
  background-color: rgb(34 197 94 / 0.05);
}

.hover\\:bg-green-700:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(21 128 61 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-muted:hover{
  background-color: hsl(var(--muted));
}

.hover\\:bg-muted\\/50:hover{
  background-color: hsl(var(--muted) / 0.5);
}

.hover\\:bg-orange-500\\/10:hover{
  background-color: rgb(249 115 22 / 0.1);
}

.hover\\:bg-orange-700:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(194 65 12 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-primary:hover{
  background-color: hsl(var(--primary));
}

.hover\\:bg-primary\\/10:hover{
  background-color: hsl(var(--primary) / 0.1);
}

.hover\\:bg-primary\\/20:hover{
  background-color: hsl(var(--primary) / 0.2);
}

.hover\\:bg-primary\\/30:hover{
  background-color: hsl(var(--primary) / 0.3);
}

.hover\\:bg-primary\\/40:hover{
  background-color: hsl(var(--primary) / 0.4);
}

.hover\\:bg-primary\\/5:hover{
  background-color: hsl(var(--primary) / 0.05);
}

.hover\\:bg-primary\\/80:hover{
  background-color: hsl(var(--primary) / 0.8);
}

.hover\\:bg-primary\\/90:hover{
  background-color: hsl(var(--primary) / 0.9);
}

.hover\\:bg-purple-500\\/20:hover{
  background-color: rgb(168 85 247 / 0.2);
}

.hover\\:bg-purple-500\\/5:hover{
  background-color: rgb(168 85 247 / 0.05);
}

.hover\\:bg-red-500:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-red-500\\/10:hover{
  background-color: rgb(239 68 68 / 0.1);
}

.hover\\:bg-red-500\\/15:hover{
  background-color: rgb(239 68 68 / 0.15);
}

.hover\\:bg-red-600:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-secondary:hover{
  background-color: hsl(var(--secondary));
}

.hover\\:bg-secondary\\/10:hover{
  background-color: hsl(var(--secondary) / 0.1);
}

.hover\\:bg-secondary\\/20:hover{
  background-color: hsl(var(--secondary) / 0.2);
}

.hover\\:bg-secondary\\/30:hover{
  background-color: hsl(var(--secondary) / 0.3);
}

.hover\\:bg-secondary\\/40:hover{
  background-color: hsl(var(--secondary) / 0.4);
}

.hover\\:bg-secondary\\/50:hover{
  background-color: hsl(var(--secondary) / 0.5);
}

.hover\\:bg-secondary\\/60:hover{
  background-color: hsl(var(--secondary) / 0.6);
}

.hover\\:bg-secondary\\/70:hover{
  background-color: hsl(var(--secondary) / 0.7);
}

.hover\\:bg-secondary\\/80:hover{
  background-color: hsl(var(--secondary) / 0.8);
}

.hover\\:bg-sidebar-accent:hover{
  background-color: hsl(var(--sidebar-accent));
}

.hover\\:bg-white\\/20:hover{
  background-color: rgb(255 255 255 / 0.2);
}

.hover\\:bg-white\\/40:hover{
  background-color: rgb(255 255 255 / 0.4);
}

.hover\\:bg-white\\/5:hover{
  background-color: rgb(255 255 255 / 0.05);
}

.hover\\:bg-white\\/\\[0\\.05\\]:hover{
  background-color: rgb(255 255 255 / 0.05);
}

.hover\\:bg-yellow-500\\/10:hover{
  background-color: rgb(234 179 8 / 0.1);
}

.hover\\:bg-yellow-500\\/20:hover{
  background-color: rgb(234 179 8 / 0.2);
}

.hover\\:bg-yellow-500\\/30:hover{
  background-color: rgb(234 179 8 / 0.3);
}

.hover\\:bg-zinc-800:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(39 39 42 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-zinc-900:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(24 24 27 / var(--tw-bg-opacity, 1));
}

.hover\\:text-\\[hsl\\(var\\(--garden-gold\\)\\)\\]:hover{
  color: hsl(var(--garden-gold));
}

.hover\\:text-accent-foreground:hover{
  color: hsl(var(--accent-foreground));
}

.hover\\:text-destructive:hover{
  color: hsl(var(--destructive));
}

.hover\\:text-foreground:hover{
  color: hsl(var(--foreground));
}

.hover\\:text-green-300:hover{
  --tw-text-opacity: 1;
  color: rgb(134 239 172 / var(--tw-text-opacity, 1));
}

.hover\\:text-muted-foreground:hover{
  color: hsl(var(--muted-foreground));
}

.hover\\:text-muted-foreground\\/70:hover{
  color: hsl(var(--muted-foreground) / 0.7);
}

.hover\\:text-primary:hover{
  color: hsl(var(--primary));
}

.hover\\:text-primary-foreground:hover{
  color: hsl(var(--primary-foreground));
}

.hover\\:text-primary\\/60:hover{
  color: hsl(var(--primary) / 0.6);
}

.hover\\:text-primary\\/65:hover{
  color: hsl(var(--primary) / 0.65);
}

.hover\\:text-primary\\/70:hover{
  color: hsl(var(--primary) / 0.7);
}

.hover\\:text-primary\\/80:hover{
  color: hsl(var(--primary) / 0.8);
}

.hover\\:text-red-300:hover{
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity, 1));
}

.hover\\:text-red-400:hover{
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity, 1));
}

.hover\\:text-sidebar-accent-foreground:hover{
  color: hsl(var(--sidebar-accent-foreground));
}

.hover\\:text-white:hover{
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}

.hover\\:underline:hover{
  text-decoration-line: underline;
}

.hover\\:opacity-100:hover{
  opacity: 1;
}

.hover\\:opacity-70:hover{
  opacity: 0.7;
}

.hover\\:opacity-80:hover{
  opacity: 0.8;
}

.hover\\:opacity-90:hover{
  opacity: 0.9;
}

.hover\\:shadow-2xl:hover{
  --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.hover\\:shadow-\\[0_0_0_1px_hsl\\(var\\(--sidebar-accent\\)\\)\\]:hover{
  --tw-shadow: 0 0 0 1px hsl(var(--sidebar-accent));
  --tw-shadow-colored: 0 0 0 1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.hover\\:shadow-lg:hover{
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.hover\\:shadow-md:hover{
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.hover\\:shadow-xl:hover{
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.hover\\:shadow-black\\/30:hover{
  --tw-shadow-color: rgb(0 0 0 / 0.3);
  --tw-shadow: var(--tw-shadow-colored);
}

.hover\\:shadow-primary\\/5:hover{
  --tw-shadow-color: hsl(var(--primary) / 0.05);
  --tw-shadow: var(--tw-shadow-colored);
}

.hover\\:after\\:bg-sidebar-border:hover::after{
  content: var(--tw-content);
  background-color: hsl(var(--sidebar-border));
}

.focus\\:border-destructive:focus{
  border-color: hsl(var(--destructive));
}

.focus\\:border-primary\\/40:focus{
  border-color: hsl(var(--primary) / 0.4);
}

.focus\\:border-primary\\/45:focus{
  border-color: hsl(var(--primary) / 0.45);
}

.focus\\:border-primary\\/50:focus{
  border-color: hsl(var(--primary) / 0.5);
}

.focus\\:bg-accent:focus{
  background-color: hsl(var(--accent));
}

.focus\\:bg-primary:focus{
  background-color: hsl(var(--primary));
}

.focus\\:text-accent-foreground:focus{
  color: hsl(var(--accent-foreground));
}

.focus\\:text-primary-foreground:focus{
  color: hsl(var(--primary-foreground));
}

.focus\\:opacity-100:focus{
  opacity: 1;
}

.focus\\:outline-none:focus{
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\\:ring-0:focus{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\\:ring-1:focus{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\\:ring-2:focus{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\\:ring-primary:focus{
  --tw-ring-color: hsl(var(--primary));
}

.focus\\:ring-primary\\/20:focus{
  --tw-ring-color: hsl(var(--primary) / 0.2);
}

.focus\\:ring-ring:focus{
  --tw-ring-color: hsl(var(--ring));
}

.focus\\:ring-offset-2:focus{
  --tw-ring-offset-width: 2px;
}

.focus-visible\\:outline-none:focus-visible{
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus-visible\\:ring-0:focus-visible{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-visible\\:ring-1:focus-visible{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-visible\\:ring-2:focus-visible{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-visible\\:ring-ring:focus-visible{
  --tw-ring-color: hsl(var(--ring));
}

.focus-visible\\:ring-sidebar-ring:focus-visible{
  --tw-ring-color: hsl(var(--sidebar-ring));
}

.focus-visible\\:ring-offset-1:focus-visible{
  --tw-ring-offset-width: 1px;
}

.focus-visible\\:ring-offset-2:focus-visible{
  --tw-ring-offset-width: 2px;
}

.focus-visible\\:ring-offset-background:focus-visible{
  --tw-ring-offset-color: hsl(var(--background));
}

.active\\:scale-95:active{
  --tw-scale-x: .95;
  --tw-scale-y: .95;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.active\\:cursor-grabbing:active{
  cursor: grabbing;
}

.active\\:bg-sidebar-accent:active{
  background-color: hsl(var(--sidebar-accent));
}

.active\\:text-sidebar-accent-foreground:active{
  color: hsl(var(--sidebar-accent-foreground));
}

.disabled\\:pointer-events-none:disabled{
  pointer-events: none;
}

.disabled\\:cursor-not-allowed:disabled{
  cursor: not-allowed;
}

.disabled\\:opacity-30:disabled{
  opacity: 0.3;
}

.disabled\\:opacity-40:disabled{
  opacity: 0.4;
}

.disabled\\:opacity-50:disabled{
  opacity: 0.5;
}

.group\\/menu-item:focus-within .group-focus-within\\/menu-item\\:opacity-100{
  opacity: 1;
}

.group:hover .group-hover\\:line-clamp-none{
  overflow: visible;
  display: block;
  -webkit-box-orient: horizontal;
  -webkit-line-clamp: none;
}

.group:hover .group-hover\\:max-h-20{
  max-height: 5rem;
}

.group:hover .group-hover\\:-translate-y-1{
  --tw-translate-y: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group:hover .group-hover\\:translate-x-1{
  --tw-translate-x: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group:hover .group-hover\\:translate-y-0\\.5{
  --tw-translate-y: 0.125rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group:hover .group-hover\\:scale-105{
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group:hover .group-hover\\:scale-110{
  --tw-scale-x: 1.1;
  --tw-scale-y: 1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group:hover .group-hover\\:scale-\\[1\\.03\\]{
  --tw-scale-x: 1.03;
  --tw-scale-y: 1.03;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group:hover .group-hover\\:scale-\\[1\\.05\\]{
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group:hover .group-hover\\:gap-2{
  gap: 0.5rem;
}

.group:hover .group-hover\\:border-primary{
  border-color: hsl(var(--primary));
}

.group:hover .group-hover\\:border-primary\\/40{
  border-color: hsl(var(--primary) / 0.4);
}

.group:hover .group-hover\\:border-primary\\/60{
  border-color: hsl(var(--primary) / 0.6);
}

.group:hover .group-hover\\:bg-background\\/20{
  background-color: hsl(var(--background) / 0.2);
}

.group:hover .group-hover\\:bg-black\\/60{
  background-color: rgb(0 0 0 / 0.6);
}

.group:hover .group-hover\\:bg-primary\\/10{
  background-color: hsl(var(--primary) / 0.1);
}

.group\\/btn:hover .group-hover\\/btn\\:text-primary{
  color: hsl(var(--primary));
}

.group\\/title:hover .group-hover\\/title\\:text-primary{
  color: hsl(var(--primary));
}

.group:hover .group-hover\\:text-amber-300{
  --tw-text-opacity: 1;
  color: rgb(252 211 77 / var(--tw-text-opacity, 1));
}

.group:hover .group-hover\\:text-amber-400{
  --tw-text-opacity: 1;
  color: rgb(251 191 36 / var(--tw-text-opacity, 1));
}

.group:hover .group-hover\\:text-foreground{
  color: hsl(var(--foreground));
}

.group:hover .group-hover\\:text-green-400{
  --tw-text-opacity: 1;
  color: rgb(74 222 128 / var(--tw-text-opacity, 1));
}

.group:hover .group-hover\\:text-primary{
  color: hsl(var(--primary));
}

.group:hover .group-hover\\:text-primary\\/40{
  color: hsl(var(--primary) / 0.4);
}

.group:hover .group-hover\\:text-purple-400{
  --tw-text-opacity: 1;
  color: rgb(192 132 252 / var(--tw-text-opacity, 1));
}

.group:hover .group-hover\\:text-red-400{
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity, 1));
}

.group\\/menu-item:hover .group-hover\\/menu-item\\:opacity-100{
  opacity: 1;
}

.group\\/title:hover .group-hover\\/title\\:opacity-100{
  opacity: 1;
}

.group:hover .group-hover\\:opacity-0{
  opacity: 0;
}

.group:hover .group-hover\\:opacity-100{
  opacity: 1;
}

.group:hover .group-hover\\:opacity-20{
  opacity: 0.2;
}

.group:hover .group-hover\\:opacity-50{
  opacity: 0.5;
}

.group:hover .group-hover\\:opacity-60{
  opacity: 0.6;
}

.group:hover .group-hover\\:opacity-80{
  opacity: 0.8;
}

.group:hover .group-hover\\:shadow-\\[0_0_40px_rgba\\(212\\2c 175\\2c 55\\2c 0\\.15\\)\\]{
  --tw-shadow: 0 0 40px rgba(212,175,55,0.15);
  --tw-shadow-colored: 0 0 40px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.group:hover .group-hover\\:shadow-lg{
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.group:hover .group-hover\\:ring-1{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.group:hover .group-hover\\:ring-primary\\/30{
  --tw-ring-color: hsl(var(--primary) / 0.3);
}

.group.destructive .group-\\[\\.destructive\\]\\:border-muted\\/40{
  border-color: hsl(var(--muted) / 0.4);
}

.group.toaster .group-\\[\\.toaster\\]\\:border-border{
  border-color: hsl(var(--border));
}

.group.toast .group-\\[\\.toast\\]\\:bg-muted{
  background-color: hsl(var(--muted));
}

.group.toast .group-\\[\\.toast\\]\\:bg-primary{
  background-color: hsl(var(--primary));
}

.group.toaster .group-\\[\\.toaster\\]\\:bg-background{
  background-color: hsl(var(--background));
}

.group.destructive .group-\\[\\.destructive\\]\\:text-red-300{
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity, 1));
}

.group.toast .group-\\[\\.toast\\]\\:text-muted-foreground{
  color: hsl(var(--muted-foreground));
}

.group.toast .group-\\[\\.toast\\]\\:text-primary-foreground{
  color: hsl(var(--primary-foreground));
}

.group.toaster .group-\\[\\.toaster\\]\\:text-foreground{
  color: hsl(var(--foreground));
}

.group.toaster .group-\\[\\.toaster\\]\\:shadow-lg{
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.group.destructive .group-\\[\\.destructive\\]\\:hover\\:border-destructive\\/30:hover{
  border-color: hsl(var(--destructive) / 0.3);
}

.group.destructive .group-\\[\\.destructive\\]\\:hover\\:bg-destructive:hover{
  background-color: hsl(var(--destructive));
}

.group.destructive .group-\\[\\.destructive\\]\\:hover\\:text-destructive-foreground:hover{
  color: hsl(var(--destructive-foreground));
}

.group.destructive .group-\\[\\.destructive\\]\\:hover\\:text-red-50:hover{
  --tw-text-opacity: 1;
  color: rgb(254 242 242 / var(--tw-text-opacity, 1));
}

.group.destructive .group-\\[\\.destructive\\]\\:focus\\:ring-destructive:focus{
  --tw-ring-color: hsl(var(--destructive));
}

.group.destructive .group-\\[\\.destructive\\]\\:focus\\:ring-red-400:focus{
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(248 113 113 / var(--tw-ring-opacity, 1));
}

.group.destructive .group-\\[\\.destructive\\]\\:focus\\:ring-offset-red-600:focus{
  --tw-ring-offset-color: #dc2626;
}

.peer\\/menu-button:hover ~ .peer-hover\\/menu-button\\:text-sidebar-accent-foreground{
  color: hsl(var(--sidebar-accent-foreground));
}

.peer:disabled ~ .peer-disabled\\:cursor-not-allowed{
  cursor: not-allowed;
}

.peer:disabled ~ .peer-disabled\\:opacity-70{
  opacity: 0.7;
}

.has-\\[\\[data-variant\\=inset\\]\\]\\:bg-sidebar:has([data-variant=inset]){
  background-color: hsl(var(--sidebar-background));
}

.has-\\[\\:disabled\\]\\:opacity-50:has(:disabled){
  opacity: 0.5;
}

.group\\/menu-item:has([data-sidebar=menu-action]) .group-has-\\[\\[data-sidebar\\=menu-action\\]\\]\\/menu-item\\:pr-8{
  padding-right: 2rem;
}

.aria-disabled\\:pointer-events-none[aria-disabled=\"true\"]{
  pointer-events: none;
}

.aria-disabled\\:opacity-50[aria-disabled=\"true\"]{
  opacity: 0.5;
}

.aria-selected\\:bg-accent[aria-selected=\"true\"]{
  background-color: hsl(var(--accent));
}

.aria-selected\\:bg-accent\\/50[aria-selected=\"true\"]{
  background-color: hsl(var(--accent) / 0.5);
}

.aria-selected\\:text-accent-foreground[aria-selected=\"true\"]{
  color: hsl(var(--accent-foreground));
}

.aria-selected\\:text-muted-foreground[aria-selected=\"true\"]{
  color: hsl(var(--muted-foreground));
}

.aria-selected\\:opacity-100[aria-selected=\"true\"]{
  opacity: 1;
}

.data-\\[disabled\\=true\\]\\:pointer-events-none[data-disabled=\"true\"]{
  pointer-events: none;
}

.data-\\[disabled\\]\\:pointer-events-none[data-disabled]{
  pointer-events: none;
}

.data-\\[panel-group-direction\\=vertical\\]\\:h-px[data-panel-group-direction=\"vertical\"]{
  height: 1px;
}

.data-\\[panel-group-direction\\=vertical\\]\\:w-full[data-panel-group-direction=\"vertical\"]{
  width: 100%;
}

.data-\\[side\\=bottom\\]\\:translate-y-1[data-side=\"bottom\"]{
  --tw-translate-y: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.data-\\[side\\=left\\]\\:-translate-x-1[data-side=\"left\"]{
  --tw-translate-x: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.data-\\[side\\=right\\]\\:translate-x-1[data-side=\"right\"]{
  --tw-translate-x: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.data-\\[side\\=top\\]\\:-translate-y-1[data-side=\"top\"]{
  --tw-translate-y: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.data-\\[state\\=checked\\]\\:translate-x-4[data-state=\"checked\"]{
  --tw-translate-x: 1rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.data-\\[state\\=unchecked\\]\\:translate-x-0[data-state=\"unchecked\"]{
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.data-\\[swipe\\=cancel\\]\\:translate-x-0[data-swipe=\"cancel\"]{
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.data-\\[swipe\\=end\\]\\:translate-x-\\[var\\(--radix-toast-swipe-end-x\\)\\][data-swipe=\"end\"]{
  --tw-translate-x: var(--radix-toast-swipe-end-x);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.data-\\[swipe\\=move\\]\\:translate-x-\\[var\\(--radix-toast-swipe-move-x\\)\\][data-swipe=\"move\"]{
  --tw-translate-x: var(--radix-toast-swipe-move-x);
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

@keyframes accordion-up{

  from{
    height: var(--radix-accordion-content-height);
  }

  to{
    height: 0;
  }
}

.data-\\[state\\=closed\\]\\:animate-accordion-up[data-state=\"closed\"]{
  animation: accordion-up 0.2s ease-out;
}

@keyframes accordion-down{

  from{
    height: 0;
  }

  to{
    height: var(--radix-accordion-content-height);
  }
}

.data-\\[state\\=open\\]\\:animate-accordion-down[data-state=\"open\"]{
  animation: accordion-down 0.2s ease-out;
}

.data-\\[panel-group-direction\\=vertical\\]\\:flex-col[data-panel-group-direction=\"vertical\"]{
  flex-direction: column;
}

.data-\\[state\\=active\\]\\:border-primary[data-state=\"active\"]{
  border-color: hsl(var(--primary));
}

.data-\\[active\\=true\\]\\:bg-sidebar-accent[data-active=\"true\"]{
  background-color: hsl(var(--sidebar-accent));
}

.data-\\[active\\]\\:bg-accent\\/50[data-active]{
  background-color: hsl(var(--accent) / 0.5);
}

.data-\\[selected\\=true\\]\\:bg-accent[data-selected=\"true\"]{
  background-color: hsl(var(--accent));
}

.data-\\[state\\=active\\]\\:bg-background[data-state=\"active\"]{
  background-color: hsl(var(--background));
}

.data-\\[state\\=checked\\]\\:bg-primary[data-state=\"checked\"]{
  background-color: hsl(var(--primary));
}

.data-\\[state\\=on\\]\\:bg-accent[data-state=\"on\"]{
  background-color: hsl(var(--accent));
}

.data-\\[state\\=open\\]\\:bg-accent[data-state=\"open\"]{
  background-color: hsl(var(--accent));
}

.data-\\[state\\=open\\]\\:bg-accent\\/50[data-state=\"open\"]{
  background-color: hsl(var(--accent) / 0.5);
}

.data-\\[state\\=open\\]\\:bg-secondary[data-state=\"open\"]{
  background-color: hsl(var(--secondary));
}

.data-\\[state\\=selected\\]\\:bg-muted[data-state=\"selected\"]{
  background-color: hsl(var(--muted));
}

.data-\\[state\\=unchecked\\]\\:bg-input[data-state=\"unchecked\"]{
  background-color: hsl(var(--input));
}

.data-\\[active\\=true\\]\\:font-medium[data-active=\"true\"]{
  font-weight: 500;
}

.data-\\[active\\=true\\]\\:text-sidebar-accent-foreground[data-active=\"true\"]{
  color: hsl(var(--sidebar-accent-foreground));
}

.data-\\[placeholder\\]\\:text-muted-foreground[data-placeholder]{
  color: hsl(var(--muted-foreground));
}

.data-\\[selected\\=true\\]\\:text-accent-foreground[data-selected=\"true\"]{
  color: hsl(var(--accent-foreground));
}

.data-\\[state\\=active\\]\\:text-foreground[data-state=\"active\"]{
  color: hsl(var(--foreground));
}

.data-\\[state\\=checked\\]\\:text-primary-foreground[data-state=\"checked\"]{
  color: hsl(var(--primary-foreground));
}

.data-\\[state\\=on\\]\\:text-accent-foreground[data-state=\"on\"]{
  color: hsl(var(--accent-foreground));
}

.data-\\[state\\=open\\]\\:text-accent-foreground[data-state=\"open\"]{
  color: hsl(var(--accent-foreground));
}

.data-\\[state\\=open\\]\\:text-muted-foreground[data-state=\"open\"]{
  color: hsl(var(--muted-foreground));
}

.data-\\[disabled\\=true\\]\\:opacity-50[data-disabled=\"true\"]{
  opacity: 0.5;
}

.data-\\[disabled\\]\\:opacity-50[data-disabled]{
  opacity: 0.5;
}

.data-\\[state\\=open\\]\\:opacity-100[data-state=\"open\"]{
  opacity: 1;
}

.data-\\[state\\=active\\]\\:shadow[data-state=\"active\"]{
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.data-\\[swipe\\=move\\]\\:transition-none[data-swipe=\"move\"]{
  transition-property: none;
}

.data-\\[state\\=closed\\]\\:duration-300[data-state=\"closed\"]{
  transition-duration: 300ms;
}

.data-\\[state\\=open\\]\\:duration-500[data-state=\"open\"]{
  transition-duration: 500ms;
}

.data-\\[motion\\^\\=from-\\]\\:animate-in[data-motion^=\"from-\"]{
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}

.data-\\[state\\=open\\]\\:animate-in[data-state=\"open\"]{
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}

.data-\\[state\\=visible\\]\\:animate-in[data-state=\"visible\"]{
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}

.data-\\[motion\\^\\=to-\\]\\:animate-out[data-motion^=\"to-\"]{
  animation-name: exit;
  animation-duration: 150ms;
  --tw-exit-opacity: initial;
  --tw-exit-scale: initial;
  --tw-exit-rotate: initial;
  --tw-exit-translate-x: initial;
  --tw-exit-translate-y: initial;
}

.data-\\[state\\=closed\\]\\:animate-out[data-state=\"closed\"]{
  animation-name: exit;
  animation-duration: 150ms;
  --tw-exit-opacity: initial;
  --tw-exit-scale: initial;
  --tw-exit-rotate: initial;
  --tw-exit-translate-x: initial;
  --tw-exit-translate-y: initial;
}

.data-\\[state\\=hidden\\]\\:animate-out[data-state=\"hidden\"]{
  animation-name: exit;
  animation-duration: 150ms;
  --tw-exit-opacity: initial;
  --tw-exit-scale: initial;
  --tw-exit-rotate: initial;
  --tw-exit-translate-x: initial;
  --tw-exit-translate-y: initial;
}

.data-\\[swipe\\=end\\]\\:animate-out[data-swipe=\"end\"]{
  animation-name: exit;
  animation-duration: 150ms;
  --tw-exit-opacity: initial;
  --tw-exit-scale: initial;
  --tw-exit-rotate: initial;
  --tw-exit-translate-x: initial;
  --tw-exit-translate-y: initial;
}

.data-\\[motion\\^\\=from-\\]\\:fade-in[data-motion^=\"from-\"]{
  --tw-enter-opacity: 0;
}

.data-\\[motion\\^\\=to-\\]\\:fade-out[data-motion^=\"to-\"]{
  --tw-exit-opacity: 0;
}

.data-\\[state\\=closed\\]\\:fade-out-0[data-state=\"closed\"]{
  --tw-exit-opacity: 0;
}

.data-\\[state\\=closed\\]\\:fade-out-80[data-state=\"closed\"]{
  --tw-exit-opacity: 0.8;
}

.data-\\[state\\=hidden\\]\\:fade-out[data-state=\"hidden\"]{
  --tw-exit-opacity: 0;
}

.data-\\[state\\=open\\]\\:fade-in-0[data-state=\"open\"]{
  --tw-enter-opacity: 0;
}

.data-\\[state\\=visible\\]\\:fade-in[data-state=\"visible\"]{
  --tw-enter-opacity: 0;
}

.data-\\[state\\=closed\\]\\:zoom-out-95[data-state=\"closed\"]{
  --tw-exit-scale: .95;
}

.data-\\[state\\=open\\]\\:zoom-in-90[data-state=\"open\"]{
  --tw-enter-scale: .9;
}

.data-\\[state\\=open\\]\\:zoom-in-95[data-state=\"open\"]{
  --tw-enter-scale: .95;
}

.data-\\[motion\\=from-end\\]\\:slide-in-from-right-52[data-motion=\"from-end\"]{
  --tw-enter-translate-x: 13rem;
}

.data-\\[motion\\=from-start\\]\\:slide-in-from-left-52[data-motion=\"from-start\"]{
  --tw-enter-translate-x: -13rem;
}

.data-\\[motion\\=to-end\\]\\:slide-out-to-right-52[data-motion=\"to-end\"]{
  --tw-exit-translate-x: 13rem;
}

.data-\\[motion\\=to-start\\]\\:slide-out-to-left-52[data-motion=\"to-start\"]{
  --tw-exit-translate-x: -13rem;
}

.data-\\[side\\=bottom\\]\\:slide-in-from-top-2[data-side=\"bottom\"]{
  --tw-enter-translate-y: -0.5rem;
}

.data-\\[side\\=left\\]\\:slide-in-from-right-2[data-side=\"left\"]{
  --tw-enter-translate-x: 0.5rem;
}

.data-\\[side\\=right\\]\\:slide-in-from-left-2[data-side=\"right\"]{
  --tw-enter-translate-x: -0.5rem;
}

.data-\\[side\\=top\\]\\:slide-in-from-bottom-2[data-side=\"top\"]{
  --tw-enter-translate-y: 0.5rem;
}

.data-\\[state\\=closed\\]\\:slide-out-to-bottom[data-state=\"closed\"]{
  --tw-exit-translate-y: 100%;
}

.data-\\[state\\=closed\\]\\:slide-out-to-left[data-state=\"closed\"]{
  --tw-exit-translate-x: -100%;
}

.data-\\[state\\=closed\\]\\:slide-out-to-left-1\\/2[data-state=\"closed\"]{
  --tw-exit-translate-x: -50%;
}

.data-\\[state\\=closed\\]\\:slide-out-to-right[data-state=\"closed\"]{
  --tw-exit-translate-x: 100%;
}

.data-\\[state\\=closed\\]\\:slide-out-to-right-full[data-state=\"closed\"]{
  --tw-exit-translate-x: 100%;
}

.data-\\[state\\=closed\\]\\:slide-out-to-top[data-state=\"closed\"]{
  --tw-exit-translate-y: -100%;
}

.data-\\[state\\=closed\\]\\:slide-out-to-top-\\[48\\%\\][data-state=\"closed\"]{
  --tw-exit-translate-y: -48%;
}

.data-\\[state\\=open\\]\\:slide-in-from-bottom[data-state=\"open\"]{
  --tw-enter-translate-y: 100%;
}

.data-\\[state\\=open\\]\\:slide-in-from-left[data-state=\"open\"]{
  --tw-enter-translate-x: -100%;
}

.data-\\[state\\=open\\]\\:slide-in-from-left-1\\/2[data-state=\"open\"]{
  --tw-enter-translate-x: -50%;
}

.data-\\[state\\=open\\]\\:slide-in-from-right[data-state=\"open\"]{
  --tw-enter-translate-x: 100%;
}

.data-\\[state\\=open\\]\\:slide-in-from-top[data-state=\"open\"]{
  --tw-enter-translate-y: -100%;
}

.data-\\[state\\=open\\]\\:slide-in-from-top-\\[48\\%\\][data-state=\"open\"]{
  --tw-enter-translate-y: -48%;
}

.data-\\[state\\=open\\]\\:slide-in-from-top-full[data-state=\"open\"]{
  --tw-enter-translate-y: -100%;
}

.data-\\[state\\=closed\\]\\:duration-300[data-state=\"closed\"]{
  animation-duration: 300ms;
}

.data-\\[state\\=open\\]\\:duration-500[data-state=\"open\"]{
  animation-duration: 500ms;
}

.data-\\[panel-group-direction\\=vertical\\]\\:after\\:left-0[data-panel-group-direction=\"vertical\"]::after{
  content: var(--tw-content);
  left: 0px;
}

.data-\\[panel-group-direction\\=vertical\\]\\:after\\:h-1[data-panel-group-direction=\"vertical\"]::after{
  content: var(--tw-content);
  height: 0.25rem;
}

.data-\\[panel-group-direction\\=vertical\\]\\:after\\:w-full[data-panel-group-direction=\"vertical\"]::after{
  content: var(--tw-content);
  width: 100%;
}

.data-\\[panel-group-direction\\=vertical\\]\\:after\\:-translate-y-1\\/2[data-panel-group-direction=\"vertical\"]::after{
  content: var(--tw-content);
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.data-\\[panel-group-direction\\=vertical\\]\\:after\\:translate-x-0[data-panel-group-direction=\"vertical\"]::after{
  content: var(--tw-content);
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.data-\\[state\\=open\\]\\:hover\\:bg-sidebar-accent:hover[data-state=\"open\"]{
  background-color: hsl(var(--sidebar-accent));
}

.data-\\[state\\=open\\]\\:hover\\:text-sidebar-accent-foreground:hover[data-state=\"open\"]{
  color: hsl(var(--sidebar-accent-foreground));
}

.group[data-collapsible=\"offcanvas\"] .group-data-\\[collapsible\\=offcanvas\\]\\:left-\\[calc\\(var\\(--sidebar-width\\)\\*-1\\)\\]{
  left: calc(var(--sidebar-width) * -1);
}

.group[data-collapsible=\"offcanvas\"] .group-data-\\[collapsible\\=offcanvas\\]\\:right-\\[calc\\(var\\(--sidebar-width\\)\\*-1\\)\\]{
  right: calc(var(--sidebar-width) * -1);
}

.group[data-side=\"left\"] .group-data-\\[side\\=left\\]\\:-right-4{
  right: -1rem;
}

.group[data-side=\"right\"] .group-data-\\[side\\=right\\]\\:left-0{
  left: 0px;
}

.group[data-collapsible=\"icon\"] .group-data-\\[collapsible\\=icon\\]\\:-mt-8{
  margin-top: -2rem;
}

.group[data-collapsible=\"icon\"] .group-data-\\[collapsible\\=icon\\]\\:hidden{
  display: none;
}

.group[data-collapsible=\"icon\"] .group-data-\\[collapsible\\=icon\\]\\:\\!size-8{
  width: 2rem !important;
  height: 2rem !important;
}

.group[data-collapsible=\"icon\"] .group-data-\\[collapsible\\=icon\\]\\:w-\\[--sidebar-width-icon\\]{
  width: var(--sidebar-width-icon);
}

.group[data-collapsible=\"icon\"] .group-data-\\[collapsible\\=icon\\]\\:w-\\[calc\\(var\\(--sidebar-width-icon\\)_\\+_theme\\(spacing\\.4\\)\\)\\]{
  width: calc(var(--sidebar-width-icon) + 1rem);
}

.group[data-collapsible=\"icon\"] .group-data-\\[collapsible\\=icon\\]\\:w-\\[calc\\(var\\(--sidebar-width-icon\\)_\\+_theme\\(spacing\\.4\\)_\\+2px\\)\\]{
  width: calc(var(--sidebar-width-icon) + 1rem + 2px);
}

.group[data-collapsible=\"offcanvas\"] .group-data-\\[collapsible\\=offcanvas\\]\\:w-0{
  width: 0px;
}

.group[data-collapsible=\"offcanvas\"] .group-data-\\[collapsible\\=offcanvas\\]\\:translate-x-0{
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group[data-side=\"right\"] .group-data-\\[side\\=right\\]\\:rotate-180{
  --tw-rotate: 180deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:rotate-180{
  --tw-rotate: 180deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group[data-collapsible=\"icon\"] .group-data-\\[collapsible\\=icon\\]\\:overflow-hidden{
  overflow: hidden;
}

.group[data-variant=\"floating\"] .group-data-\\[variant\\=floating\\]\\:rounded-lg{
  border-radius: var(--radius);
}

.group[data-variant=\"floating\"] .group-data-\\[variant\\=floating\\]\\:border{
  border-width: 1px;
}

.group[data-side=\"left\"] .group-data-\\[side\\=left\\]\\:border-r{
  border-right-width: 1px;
}

.group[data-side=\"right\"] .group-data-\\[side\\=right\\]\\:border-l{
  border-left-width: 1px;
}

.group[data-variant=\"floating\"] .group-data-\\[variant\\=floating\\]\\:border-sidebar-border{
  border-color: hsl(var(--sidebar-border));
}

.group[data-collapsible=\"icon\"] .group-data-\\[collapsible\\=icon\\]\\:\\!p-0{
  padding: 0px !important;
}

.group[data-collapsible=\"icon\"] .group-data-\\[collapsible\\=icon\\]\\:\\!p-2{
  padding: 0.5rem !important;
}

.group[data-collapsible=\"icon\"] .group-data-\\[collapsible\\=icon\\]\\:opacity-0{
  opacity: 0;
}

.group[data-variant=\"floating\"] .group-data-\\[variant\\=floating\\]\\:shadow{
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.group[data-collapsible=\"offcanvas\"] .group-data-\\[collapsible\\=offcanvas\\]\\:after\\:left-full::after{
  content: var(--tw-content);
  left: 100%;
}

.group[data-collapsible=\"offcanvas\"] .group-data-\\[collapsible\\=offcanvas\\]\\:hover\\:bg-sidebar:hover{
  background-color: hsl(var(--sidebar-background));
}

.peer\\/menu-button[data-size=\"default\"] ~ .peer-data-\\[size\\=default\\]\\/menu-button\\:top-1\\.5{
  top: 0.375rem;
}

.peer\\/menu-button[data-size=\"lg\"] ~ .peer-data-\\[size\\=lg\\]\\/menu-button\\:top-2\\.5{
  top: 0.625rem;
}

.peer\\/menu-button[data-size=\"sm\"] ~ .peer-data-\\[size\\=sm\\]\\/menu-button\\:top-1{
  top: 0.25rem;
}

.peer[data-variant=\"inset\"] ~ .peer-data-\\[variant\\=inset\\]\\:min-h-\\[calc\\(100svh-theme\\(spacing\\.4\\)\\)\\]{
  min-height: calc(100svh - 1rem);
}

.peer\\/menu-button[data-active=\"true\"] ~ .peer-data-\\[active\\=true\\]\\/menu-button\\:text-sidebar-accent-foreground{
  color: hsl(var(--sidebar-accent-foreground));
}

.dark\\:border-destructive:is(.dark *){
  border-color: hsl(var(--destructive));
}

@media (min-width: 640px){

  .sm\\:bottom-0{
    bottom: 0px;
  }

  .sm\\:bottom-4{
    bottom: 1rem;
  }

  .sm\\:left-4{
    left: 1rem;
  }

  .sm\\:right-0{
    right: 0px;
  }

  .sm\\:right-auto{
    right: auto;
  }

  .sm\\:top-auto{
    top: auto;
  }

  .sm\\:col-span-1{
    grid-column: span 1 / span 1;
  }

  .sm\\:col-span-2{
    grid-column: span 2 / span 2;
  }

  .sm\\:mt-0{
    margin-top: 0px;
  }

  .sm\\:block{
    display: block;
  }

  .sm\\:inline{
    display: inline;
  }

  .sm\\:flex{
    display: flex;
  }

  .sm\\:hidden{
    display: none;
  }

  .sm\\:min-h-\\[82vh\\]{
    min-height: 82vh;
  }

  .sm\\:w-28{
    width: 7rem;
  }

  .sm\\:w-56{
    width: 14rem;
  }

  .sm\\:w-\\[min\\(86vw\\2c 300px\\)\\]{
    width: min(86vw, 300px);
  }

  .sm\\:w-auto{
    width: auto;
  }

  .sm\\:max-w-sm{
    max-width: 24rem;
  }

  .sm\\:flex-none{
    flex: none;
  }

  .sm\\:columns-2{
    -moz-columns: 2;
         columns: 2;
  }

  .sm\\:grid-cols-1{
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .sm\\:grid-cols-2{
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sm\\:grid-cols-3{
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .sm\\:grid-cols-4{
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .sm\\:grid-cols-5{
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .sm\\:flex-row{
    flex-direction: row;
  }

  .sm\\:flex-col{
    flex-direction: column;
  }

  .sm\\:flex-nowrap{
    flex-wrap: nowrap;
  }

  .sm\\:items-end{
    align-items: flex-end;
  }

  .sm\\:items-center{
    align-items: center;
  }

  .sm\\:justify-end{
    justify-content: flex-end;
  }

  .sm\\:justify-between{
    justify-content: space-between;
  }

  .sm\\:gap-2\\.5{
    gap: 0.625rem;
  }

  .sm\\:gap-3{
    gap: 0.75rem;
  }

  .sm\\:gap-6{
    gap: 1.5rem;
  }

  .sm\\:space-x-2 > :not([hidden]) ~ :not([hidden]){
    --tw-space-x-reverse: 0;
    margin-right: calc(0.5rem * var(--tw-space-x-reverse));
    margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
  }

  .sm\\:space-x-4 > :not([hidden]) ~ :not([hidden]){
    --tw-space-x-reverse: 0;
    margin-right: calc(1rem * var(--tw-space-x-reverse));
    margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
  }

  .sm\\:space-y-0 > :not([hidden]) ~ :not([hidden]){
    --tw-space-y-reverse: 0;
    margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0px * var(--tw-space-y-reverse));
  }

  .sm\\:rounded-lg{
    border-radius: var(--radius);
  }

  .sm\\:object-\\[60\\%_center\\]{
    -o-object-position: 60% center;
       object-position: 60% center;
  }

  .sm\\:p-6{
    padding: 1.5rem;
  }

  .sm\\:p-8{
    padding: 2rem;
  }

  .sm\\:px-6{
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .sm\\:px-8{
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .sm\\:text-left{
    text-align: left;
  }

  .sm\\:text-4xl{
    font-size: 2.25rem;
    line-height: 2.5rem;
  }

  .sm\\:text-5xl{
    font-size: 3rem;
    line-height: 1;
  }

  .sm\\:text-6xl{
    font-size: 3.75rem;
    line-height: 1;
  }

  .sm\\:text-\\[10px\\]{
    font-size: 10px;
  }

  .sm\\:text-base{
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .sm\\:text-lg{
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .sm\\:text-sm{
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .sm\\:text-xl{
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  .sm\\:text-xs{
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .data-\\[state\\=open\\]\\:sm\\:slide-in-from-bottom-full[data-state=\"open\"]{
    --tw-enter-translate-y: 100%;
  }
}

@media (min-width: 768px){

  .md\\:absolute{
    position: absolute;
  }

  .md\\:sticky{
    position: sticky;
  }

  .md\\:left-1\\/2{
    left: 50%;
  }

  .md\\:left-6{
    left: 1.5rem;
  }

  .md\\:right-8{
    right: 2rem;
  }

  .md\\:top-24{
    top: 6rem;
  }

  .md\\:order-1{
    order: 1;
  }

  .md\\:order-2{
    order: 2;
  }

  .md\\:order-3{
    order: 3;
  }

  .md\\:col-span-1{
    grid-column: span 1 / span 1;
  }

  .md\\:col-span-2{
    grid-column: span 2 / span 2;
  }

  .md\\:col-span-4{
    grid-column: span 4 / span 4;
  }

  .md\\:mx-0{
    margin-left: 0px;
    margin-right: 0px;
  }

  .md\\:mx-10{
    margin-left: 2.5rem;
    margin-right: 2.5rem;
  }

  .md\\:my-10{
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
  }

  .md\\:mb-10{
    margin-bottom: 2.5rem;
  }

  .md\\:ml-auto{
    margin-left: auto;
  }

  .md\\:block{
    display: block;
  }

  .md\\:inline{
    display: inline;
  }

  .md\\:flex{
    display: flex;
  }

  .md\\:inline-flex{
    display: inline-flex;
  }

  .md\\:grid{
    display: grid;
  }

  .md\\:hidden{
    display: none;
  }

  .md\\:aspect-auto{
    aspect-ratio: auto;
  }

  .md\\:h-11{
    height: 2.75rem;
  }

  .md\\:h-12{
    height: 3rem;
  }

  .md\\:h-16{
    height: 4rem;
  }

  .md\\:h-20{
    height: 5rem;
  }

  .md\\:h-32{
    height: 8rem;
  }

  .md\\:h-40{
    height: 10rem;
  }

  .md\\:h-48{
    height: 12rem;
  }

  .md\\:h-52{
    height: 13rem;
  }

  .md\\:h-64{
    height: 16rem;
  }

  .md\\:h-auto{
    height: auto;
  }

  .md\\:h-full{
    height: 100%;
  }

  .md\\:min-h-\\[500px\\]{
    min-height: 500px;
  }

  .md\\:min-h-\\[75vh\\]{
    min-height: 75vh;
  }

  .md\\:w-11{
    width: 2.75rem;
  }

  .md\\:w-12{
    width: 3rem;
  }

  .md\\:w-16{
    width: 4rem;
  }

  .md\\:w-20{
    width: 5rem;
  }

  .md\\:w-32{
    width: 8rem;
  }

  .md\\:w-40{
    width: 10rem;
  }

  .md\\:w-48{
    width: 12rem;
  }

  .md\\:w-5\\/12{
    width: 41.666667%;
  }

  .md\\:w-52{
    width: 13rem;
  }

  .md\\:w-64{
    width: 16rem;
  }

  .md\\:w-72{
    width: 18rem;
  }

  .md\\:w-80{
    width: 20rem;
  }

  .md\\:w-\\[55\\%\\]{
    width: 55%;
  }

  .md\\:w-\\[var\\(--radix-navigation-menu-viewport-width\\)\\]{
    width: var(--radix-navigation-menu-viewport-width);
  }

  .md\\:w-auto{
    width: auto;
  }

  .md\\:min-w-\\[50vw\\]{
    min-width: 50vw;
  }

  .md\\:max-w-\\[420px\\]{
    max-width: 420px;
  }

  .md\\:max-w-lg{
    max-width: 32rem;
  }

  .md\\:max-w-xs{
    max-width: 20rem;
  }

  .md\\:-translate-x-1\\/2{
    --tw-translate-x: -50%;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .md\\:-translate-y-4{
    --tw-translate-y: -1rem;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .md\\:scale-105{
    --tw-scale-x: 1.05;
    --tw-scale-y: 1.05;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .md\\:transform{
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .md\\:columns-3{
    -moz-columns: 3;
         columns: 3;
  }

  .md\\:grid-cols-10{
    grid-template-columns: repeat(10, minmax(0, 1fr));
  }

  .md\\:grid-cols-2{
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .md\\:grid-cols-3{
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .md\\:grid-cols-4{
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .md\\:grid-cols-5{
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .md\\:grid-cols-6{
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .md\\:grid-cols-7{
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .md\\:grid-cols-8{
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  .md\\:grid-cols-\\[1fr_1\\.4fr\\]{
    grid-template-columns: 1fr 1.4fr;
  }

  .md\\:grid-cols-\\[1fr_280px\\]{
    grid-template-columns: 1fr 280px;
  }

  .md\\:grid-cols-\\[1fr_380px\\]{
    grid-template-columns: 1fr 380px;
  }

  .md\\:grid-cols-\\[1fr_auto\\]{
    grid-template-columns: 1fr auto;
  }

  .md\\:grid-cols-\\[1fr_auto_1fr\\]{
    grid-template-columns: 1fr auto 1fr;
  }

  .md\\:grid-cols-\\[200px_1fr\\]{
    grid-template-columns: 200px 1fr;
  }

  .md\\:grid-cols-\\[220px_1fr\\]{
    grid-template-columns: 220px 1fr;
  }

  .md\\:grid-cols-\\[280px_1fr\\]{
    grid-template-columns: 280px 1fr;
  }

  .md\\:grid-cols-\\[auto_1fr\\]{
    grid-template-columns: auto 1fr;
  }

  .md\\:grid-cols-\\[minmax\\(0\\2c 360px\\)_1fr\\]{
    grid-template-columns: minmax(0,360px) 1fr;
  }

  .md\\:grid-cols-\\[minmax\\(0\\2c 420px\\)_1fr\\]{
    grid-template-columns: minmax(0,420px) 1fr;
  }

  .md\\:flex-row{
    flex-direction: row;
  }

  .md\\:flex-row-reverse{
    flex-direction: row-reverse;
  }

  .md\\:items-center{
    align-items: center;
  }

  .md\\:justify-start{
    justify-content: flex-start;
  }

  .md\\:justify-center{
    justify-content: center;
  }

  .md\\:gap-0{
    gap: 0px;
  }

  .md\\:gap-12{
    gap: 3rem;
  }

  .md\\:gap-14{
    gap: 3.5rem;
  }

  .md\\:gap-16{
    gap: 4rem;
  }

  .md\\:gap-4{
    gap: 1rem;
  }

  .md\\:gap-5{
    gap: 1.25rem;
  }

  .md\\:gap-6{
    gap: 1.5rem;
  }

  .md\\:gap-8{
    gap: 2rem;
  }

  .md\\:self-auto{
    align-self: auto;
  }

  .md\\:rounded-3xl{
    border-radius: 1.5rem;
  }

  .md\\:border-l{
    border-left-width: 1px;
  }

  .md\\:border-t-0{
    border-top-width: 0px;
  }

  .md\\:bg-gradient-to-r{
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
  }

  .md\\:from-transparent{
    --tw-gradient-from: transparent var(--tw-gradient-from-position);
    --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  }

  .md\\:via-transparent{
    --tw-gradient-to: rgb(0 0 0 / 0)  var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), transparent var(--tw-gradient-via-position), var(--tw-gradient-to);
  }

  .md\\:to-background\\/40{
    --tw-gradient-to: hsl(var(--background) / 0.4) var(--tw-gradient-to-position);
  }

  .md\\:p-10{
    padding: 2.5rem;
  }

  .md\\:p-12{
    padding: 3rem;
  }

  .md\\:p-14{
    padding: 3.5rem;
  }

  .md\\:p-5{
    padding: 1.25rem;
  }

  .md\\:p-6{
    padding: 1.5rem;
  }

  .md\\:p-8{
    padding: 2rem;
  }

  .md\\:px-0{
    padding-left: 0px;
    padding-right: 0px;
  }

  .md\\:px-10{
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }

  .md\\:px-12{
    padding-left: 3rem;
    padding-right: 3rem;
  }

  .md\\:px-16{
    padding-left: 4rem;
    padding-right: 4rem;
  }

  .md\\:px-6{
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .md\\:px-8{
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .md\\:py-0{
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .md\\:py-10{
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
  }

  .md\\:py-14{
    padding-top: 3.5rem;
    padding-bottom: 3.5rem;
  }

  .md\\:py-16{
    padding-top: 4rem;
    padding-bottom: 4rem;
  }

  .md\\:py-20{
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .md\\:py-24{
    padding-top: 6rem;
    padding-bottom: 6rem;
  }

  .md\\:py-28{
    padding-top: 7rem;
    padding-bottom: 7rem;
  }

  .md\\:py-32{
    padding-top: 8rem;
    padding-bottom: 8rem;
  }

  .md\\:pb-0{
    padding-bottom: 0px;
  }

  .md\\:pb-16{
    padding-bottom: 4rem;
  }

  .md\\:pb-20{
    padding-bottom: 5rem;
  }

  .md\\:pb-24{
    padding-bottom: 6rem;
  }

  .md\\:pb-28{
    padding-bottom: 7rem;
  }

  .md\\:pl-0{
    padding-left: 0px;
  }

  .md\\:pl-10{
    padding-left: 2.5rem;
  }

  .md\\:pl-20{
    padding-left: 5rem;
  }

  .md\\:pl-4{
    padding-left: 1rem;
  }

  .md\\:pr-10{
    padding-right: 2.5rem;
  }

  .md\\:pr-12{
    padding-right: 3rem;
  }

  .md\\:pt-10{
    padding-top: 2.5rem;
  }

  .md\\:pt-12{
    padding-top: 3rem;
  }

  .md\\:pt-14{
    padding-top: 3.5rem;
  }

  .md\\:pt-36{
    padding-top: 9rem;
  }

  .md\\:text-left{
    text-align: left;
  }

  .md\\:text-right{
    text-align: right;
  }

  .md\\:text-2xl{
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .md\\:text-3xl{
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .md\\:text-4xl{
    font-size: 2.25rem;
    line-height: 2.5rem;
  }

  .md\\:text-5xl{
    font-size: 3rem;
    line-height: 1;
  }

  .md\\:text-6xl{
    font-size: 3.75rem;
    line-height: 1;
  }

  .md\\:text-7xl{
    font-size: 4.5rem;
    line-height: 1;
  }

  .md\\:text-8xl{
    font-size: 6rem;
    line-height: 1;
  }

  .md\\:text-\\[10px\\]{
    font-size: 10px;
  }

  .md\\:text-base{
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .md\\:text-lg{
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .md\\:text-sm{
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .md\\:text-xl{
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  .md\\:text-xs{
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .md\\:text-inherit{
    color: inherit;
  }

  .md\\:opacity-0{
    opacity: 0;
  }

  .md\\:shadow-2xl{
    --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }

  .after\\:md\\:hidden::after{
    content: var(--tw-content);
    display: none;
  }

  .peer[data-variant=\"inset\"] ~ .md\\:peer-data-\\[variant\\=inset\\]\\:m-2{
    margin: 0.5rem;
  }

  .peer[data-state=\"collapsed\"][data-variant=\"inset\"] ~ .md\\:peer-data-\\[state\\=collapsed\\]\\:peer-data-\\[variant\\=inset\\]\\:ml-2{
    margin-left: 0.5rem;
  }

  .peer[data-variant=\"inset\"] ~ .md\\:peer-data-\\[variant\\=inset\\]\\:ml-0{
    margin-left: 0px;
  }

  .peer[data-variant=\"inset\"] ~ .md\\:peer-data-\\[variant\\=inset\\]\\:rounded-xl{
    border-radius: 0.75rem;
  }

  .peer[data-variant=\"inset\"] ~ .md\\:peer-data-\\[variant\\=inset\\]\\:shadow{
    --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
}

@media (min-width: 1024px){

  .lg\\:col-span-1{
    grid-column: span 1 / span 1;
  }

  .lg\\:col-span-2{
    grid-column: span 2 / span 2;
  }

  .lg\\:col-span-3{
    grid-column: span 3 / span 3;
  }

  .lg\\:col-span-4{
    grid-column: span 4 / span 4;
  }

  .lg\\:col-span-5{
    grid-column: span 5 / span 5;
  }

  .lg\\:col-span-8{
    grid-column: span 8 / span 8;
  }

  .lg\\:ml-60{
    margin-left: 15rem;
  }

  .lg\\:block{
    display: block;
  }

  .lg\\:inline{
    display: inline;
  }

  .lg\\:flex{
    display: flex;
  }

  .lg\\:hidden{
    display: none;
  }

  .lg\\:w-96{
    width: 24rem;
  }

  .lg\\:columns-3{
    -moz-columns: 3;
         columns: 3;
  }

  .lg\\:columns-4{
    -moz-columns: 4;
         columns: 4;
  }

  .lg\\:auto-rows-\\[230px\\]{
    grid-auto-rows: 230px;
  }

  .lg\\:grid-cols-12{
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .lg\\:grid-cols-2{
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lg\\:grid-cols-3{
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lg\\:grid-cols-4{
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .lg\\:grid-cols-5{
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .lg\\:grid-cols-7{
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .lg\\:grid-cols-\\[1\\.1fr_0\\.9fr\\]{
    grid-template-columns: 1.1fr 0.9fr;
  }

  .lg\\:flex-row{
    flex-direction: row;
  }

  .lg\\:items-end{
    align-items: flex-end;
  }

  .lg\\:items-center{
    align-items: center;
  }

  .lg\\:justify-end{
    justify-content: flex-end;
  }

  .lg\\:justify-between{
    justify-content: space-between;
  }

  .lg\\:p-7{
    padding: 1.75rem;
  }

  .lg\\:px-10{
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }

  .lg\\:px-24{
    padding-left: 6rem;
    padding-right: 6rem;
  }

  .lg\\:px-8{
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .lg\\:pt-0{
    padding-top: 0px;
  }
}

@media (min-width: 1280px){

  .xl\\:col-span-1{
    grid-column: span 1 / span 1;
  }

  .xl\\:col-span-3{
    grid-column: span 3 / span 3;
  }

  .xl\\:columns-4{
    -moz-columns: 4;
         columns: 4;
  }

  .xl\\:grid-cols-3{
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .xl\\:grid-cols-4{
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .xl\\:grid-cols-5{
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media print{

  .print\\:hidden{
    display: none;
  }
}

.\\[\\&\\:has\\(\\>\\.day-range-end\\)\\]\\:rounded-r-md:has(>.day-range-end){
  border-top-right-radius: calc(var(--radius) - 2px);
  border-bottom-right-radius: calc(var(--radius) - 2px);
}

.\\[\\&\\:has\\(\\>\\.day-range-start\\)\\]\\:rounded-l-md:has(>.day-range-start){
  border-top-left-radius: calc(var(--radius) - 2px);
  border-bottom-left-radius: calc(var(--radius) - 2px);
}

.\\[\\&\\:has\\(\\[aria-selected\\]\\)\\]\\:rounded-md:has([aria-selected]){
  border-radius: calc(var(--radius) - 2px);
}

.\\[\\&\\:has\\(\\[aria-selected\\]\\)\\]\\:bg-accent:has([aria-selected]){
  background-color: hsl(var(--accent));
}

.first\\:\\[\\&\\:has\\(\\[aria-selected\\]\\)\\]\\:rounded-l-md:has([aria-selected]):first-child{
  border-top-left-radius: calc(var(--radius) - 2px);
  border-bottom-left-radius: calc(var(--radius) - 2px);
}

.last\\:\\[\\&\\:has\\(\\[aria-selected\\]\\)\\]\\:rounded-r-md:has([aria-selected]):last-child{
  border-top-right-radius: calc(var(--radius) - 2px);
  border-bottom-right-radius: calc(var(--radius) - 2px);
}

.\\[\\&\\:has\\(\\[aria-selected\\]\\.day-outside\\)\\]\\:bg-accent\\/50:has([aria-selected].day-outside){
  background-color: hsl(var(--accent) / 0.5);
}

.\\[\\&\\:has\\(\\[aria-selected\\]\\.day-range-end\\)\\]\\:rounded-r-md:has([aria-selected].day-range-end){
  border-top-right-radius: calc(var(--radius) - 2px);
  border-bottom-right-radius: calc(var(--radius) - 2px);
}

.\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:pr-0:has([role=checkbox]){
  padding-right: 0px;
}

.\\[\\&\\>\\*\\:first-child\\]\\:mt-0>*:first-child{
  margin-top: 0px;
}

.\\[\\&\\>\\*\\:last-child\\]\\:mb-0>*:last-child{
  margin-bottom: 0px;
}

.\\[\\&\\>\\[role\\=checkbox\\]\\]\\:translate-y-\\[2px\\]>[role=checkbox]{
  --tw-translate-y: 2px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.\\[\\&\\>button\\]\\:hidden>button{
  display: none;
}

.\\[\\&\\>span\\:last-child\\]\\:truncate>span:last-child{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.\\[\\&\\>span\\]\\:line-clamp-1>span{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.\\[\\&\\>svg\\+div\\]\\:translate-y-\\[-3px\\]>svg+div{
  --tw-translate-y: -3px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.\\[\\&\\>svg\\]\\:absolute>svg{
  position: absolute;
}

.\\[\\&\\>svg\\]\\:left-4>svg{
  left: 1rem;
}

.\\[\\&\\>svg\\]\\:top-4>svg{
  top: 1rem;
}

.\\[\\&\\>svg\\]\\:size-4>svg{
  width: 1rem;
  height: 1rem;
}

.\\[\\&\\>svg\\]\\:h-2\\.5>svg{
  height: 0.625rem;
}

.\\[\\&\\>svg\\]\\:h-3>svg{
  height: 0.75rem;
}

.\\[\\&\\>svg\\]\\:h-3\\.5>svg{
  height: 0.875rem;
}

.\\[\\&\\>svg\\]\\:w-2\\.5>svg{
  width: 0.625rem;
}

.\\[\\&\\>svg\\]\\:w-3>svg{
  width: 0.75rem;
}

.\\[\\&\\>svg\\]\\:w-3\\.5>svg{
  width: 0.875rem;
}

.\\[\\&\\>svg\\]\\:shrink-0>svg{
  flex-shrink: 0;
}

.\\[\\&\\>svg\\]\\:text-destructive>svg{
  color: hsl(var(--destructive));
}

.\\[\\&\\>svg\\]\\:text-foreground>svg{
  color: hsl(var(--foreground));
}

.\\[\\&\\>svg\\]\\:text-muted-foreground>svg{
  color: hsl(var(--muted-foreground));
}

.\\[\\&\\>svg\\]\\:text-sidebar-accent-foreground>svg{
  color: hsl(var(--sidebar-accent-foreground));
}

.\\[\\&\\>svg\\~\\*\\]\\:pl-7>svg~*{
  padding-left: 1.75rem;
}

.\\[\\&\\>tr\\]\\:last\\:border-b-0:last-child>tr{
  border-bottom-width: 0px;
}

.\\[\\&\\[data-panel-group-direction\\=vertical\\]\\>div\\]\\:rotate-90[data-panel-group-direction=vertical]>div{
  --tw-rotate: 90deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.\\[\\&\\[data-state\\=open\\]\\>svg\\]\\:rotate-180[data-state=open]>svg{
  --tw-rotate: 180deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.\\[\\&_\\.recharts-cartesian-axis-tick_text\\]\\:fill-muted-foreground .recharts-cartesian-axis-tick text{
  fill: hsl(var(--muted-foreground));
}

.\\[\\&_\\.recharts-cartesian-grid_line\\[stroke\\=\\'\\#ccc\\'\\]\\]\\:stroke-border\\/50 .recharts-cartesian-grid line[stroke='#ccc']{
  stroke: hsl(var(--border) / 0.5);
}

.\\[\\&_\\.recharts-curve\\.recharts-tooltip-cursor\\]\\:stroke-border .recharts-curve.recharts-tooltip-cursor{
  stroke: hsl(var(--border));
}

.\\[\\&_\\.recharts-dot\\[stroke\\=\\'\\#fff\\'\\]\\]\\:stroke-transparent .recharts-dot[stroke='#fff']{
  stroke: transparent;
}

.\\[\\&_\\.recharts-layer\\]\\:outline-none .recharts-layer{
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.\\[\\&_\\.recharts-polar-grid_\\[stroke\\=\\'\\#ccc\\'\\]\\]\\:stroke-border .recharts-polar-grid [stroke='#ccc']{
  stroke: hsl(var(--border));
}

.\\[\\&_\\.recharts-radial-bar-background-sector\\]\\:fill-muted .recharts-radial-bar-background-sector{
  fill: hsl(var(--muted));
}

.\\[\\&_\\.recharts-rectangle\\.recharts-tooltip-cursor\\]\\:fill-muted .recharts-rectangle.recharts-tooltip-cursor{
  fill: hsl(var(--muted));
}

.\\[\\&_\\.recharts-reference-line_\\[stroke\\=\\'\\#ccc\\'\\]\\]\\:stroke-border .recharts-reference-line [stroke='#ccc']{
  stroke: hsl(var(--border));
}

.\\[\\&_\\.recharts-sector\\[stroke\\=\\'\\#fff\\'\\]\\]\\:stroke-transparent .recharts-sector[stroke='#fff']{
  stroke: transparent;
}

.\\[\\&_\\.recharts-sector\\]\\:outline-none .recharts-sector{
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.\\[\\&_\\.recharts-surface\\]\\:outline-none .recharts-surface{
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.\\[\\&_\\[cmdk-group-heading\\]\\]\\:px-2 [cmdk-group-heading]{
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.\\[\\&_\\[cmdk-group-heading\\]\\]\\:py-1\\.5 [cmdk-group-heading]{
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}

.\\[\\&_\\[cmdk-group-heading\\]\\]\\:text-xs [cmdk-group-heading]{
  font-size: 0.75rem;
  line-height: 1rem;
}

.\\[\\&_\\[cmdk-group-heading\\]\\]\\:font-medium [cmdk-group-heading]{
  font-weight: 500;
}

.\\[\\&_\\[cmdk-group-heading\\]\\]\\:text-muted-foreground [cmdk-group-heading]{
  color: hsl(var(--muted-foreground));
}

.\\[\\&_\\[cmdk-group\\]\\:not\\(\\[hidden\\]\\)_\\~\\[cmdk-group\\]\\]\\:pt-0 [cmdk-group]:not([hidden]) ~[cmdk-group]{
  padding-top: 0px;
}

.\\[\\&_\\[cmdk-group\\]\\]\\:px-2 [cmdk-group]{
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.\\[\\&_\\[cmdk-input-wrapper\\]_svg\\]\\:h-5 [cmdk-input-wrapper] svg{
  height: 1.25rem;
}

.\\[\\&_\\[cmdk-input-wrapper\\]_svg\\]\\:w-5 [cmdk-input-wrapper] svg{
  width: 1.25rem;
}

.\\[\\&_\\[cmdk-input\\]\\]\\:h-12 [cmdk-input]{
  height: 3rem;
}

.\\[\\&_\\[cmdk-item\\]\\]\\:px-2 [cmdk-item]{
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.\\[\\&_\\[cmdk-item\\]\\]\\:py-3 [cmdk-item]{
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.\\[\\&_\\[cmdk-item\\]_svg\\]\\:h-5 [cmdk-item] svg{
  height: 1.25rem;
}

.\\[\\&_\\[cmdk-item\\]_svg\\]\\:w-5 [cmdk-item] svg{
  width: 1.25rem;
}

.\\[\\&_p\\]\\:leading-relaxed p{
  line-height: 1.625;
}

.\\[\\&_svg\\]\\:pointer-events-none svg{
  pointer-events: none;
}

.\\[\\&_svg\\]\\:size-4 svg{
  width: 1rem;
  height: 1rem;
}

.\\[\\&_svg\\]\\:shrink-0 svg{
  flex-shrink: 0;
}

.\\[\\&_tr\\:last-child\\]\\:border-0 tr:last-child{
  border-width: 0px;
}

.\\[\\&_tr\\]\\:border-b tr{
  border-bottom-width: 1px;
}

[data-side=left][data-collapsible=offcanvas] .\\[\\[data-side\\=left\\]\\[data-collapsible\\=offcanvas\\]_\\&\\]\\:-right-2{
  right: -0.5rem;
}

[data-side=left][data-state=collapsed] .\\[\\[data-side\\=left\\]\\[data-state\\=collapsed\\]_\\&\\]\\:cursor-e-resize{
  cursor: e-resize;
}

[data-side=left] .\\[\\[data-side\\=left\\]_\\&\\]\\:cursor-w-resize{
  cursor: w-resize;
}

[data-side=right][data-collapsible=offcanvas] .\\[\\[data-side\\=right\\]\\[data-collapsible\\=offcanvas\\]_\\&\\]\\:-left-2{
  left: -0.5rem;
}

[data-side=right][data-state=collapsed] .\\[\\[data-side\\=right\\]\\[data-state\\=collapsed\\]_\\&\\]\\:cursor-w-resize{
  cursor: w-resize;
}

[data-side=right] .\\[\\[data-side\\=right\\]_\\&\\]\\:cursor-e-resize{
  cursor: e-resize;
}</style></head>

  <body>
    <div id=\"root\"><div data-source-location=\"src/components/global/StickySupportBar.jsx:134:6\" data-dynamic-content=\"true\" class=\"fixed bottom-[calc(8.75rem+env(safe-area-inset-bottom))] right-4 z-50 sm:bottom-4\" style=\"opacity: 0; transform: translateY(20px);\"><a data-source-location=\"src/components/global/StickySupportBar.jsx:140:8\" data-dynamic-content=\"false\" href=\"/back-this\"><button data-source-location=\"src/components/global/StickySupportBar.jsx:141:10\" data-dynamic-content=\"false\" class=\"inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase whitespace-nowrap px-5\">Support Now</button></a></div><div data-source-location=\"src/lib/PageNotFound.jsx:25:8\" data-dynamic-content=\"true\" class=\"min-h-screen flex items-center justify-center p-6 bg-background\"><div data-source-location=\"src/lib/PageNotFound.jsx:26:12\" data-dynamic-content=\"true\" class=\"max-w-md w-full\"><div data-source-location=\"src/lib/PageNotFound.jsx:27:16\" data-dynamic-content=\"true\" class=\"text-center space-y-6\"><div data-source-location=\"src/lib/PageNotFound.jsx:28:20\" data-dynamic-content=\"false\" class=\"space-y-2\"><h1 data-source-location=\"src/lib/PageNotFound.jsx:29:24\" data-dynamic-content=\"false\" class=\"text-7xl font-display text-muted-foreground/30\">404</h1><div data-source-location=\"src/lib/PageNotFound.jsx:30:24\" data-dynamic-content=\"false\" class=\"h-px w-16 bg-border mx-auto\"></div></div><div data-source-location=\"src/lib/PageNotFound.jsx:32:20\" data-dynamic-content=\"true\" class=\"space-y-3\"><h2 data-source-location=\"src/lib/PageNotFound.jsx:33:24\" data-dynamic-content=\"false\" class=\"text-2xl font-display text-foreground\">Page Not Found</h2><p data-source-location=\"src/lib/PageNotFound.jsx:34:24\" data-dynamic-content=\"true\" class=\"font-body text-muted-foreground leading-relaxed\">The page <span data-source-location=\"src/lib/PageNotFound.jsx:35:37\" data-dynamic-content=\"true\" class=\"font-medium text-foreground\" data-collection-item-field=\"pageName\">\"login\"</span> could not be found.</p></div><div data-source-location=\"src/lib/PageNotFound.jsx:43:20\" data-dynamic-content=\"true\" class=\"pt-6\"><button data-source-location=\"src/lib/PageNotFound.jsx:44:24\" data-dynamic-content=\"true\" class=\"inline-flex items-center px-6 py-3 text-sm font-body tracking-wider uppercase text-foreground bg-card border border-border/40 rounded-full hover:border-primary/30 hover:text-primary transition-colors\">Go Home</button></div></div></div></div><div data-source-location=\"src/components/ui/toaster.jsx:28:4\" data-dynamic-content=\"true\" class=\"fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] \" style=\"pointer-events: none;\"><div data-source-location=\"src/components/ui/toaster.jsx:43:6\" data-dynamic-content=\"false\" class=\"fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] \" style=\"pointer-events: none;\"></div></div></div>
    <script type=\"text/javascript\" crossorigin=\"anonymous\" src=\"https://us-assets.i.posthog.com/array/phc_yAMDjc6mmR3xRyQhQQQngYB4ZXQ4mY9GoC9QKRwKp8ij/config.js\"></script><script type=\"module\" src=\"/src/main.jsx?t=1788432057339\"></script>
    <script src=\"/node_modules/@base44/vite-plugin/dist/injections/sandbox-mount-observer.js\" type=\"module\"></script>
    <script type=\"module\">if (window.self !== window.top) {
  const mode = new URLSearchParams(location.search).get(\"sandbox-bridge\");
  const url = mode === \"local\"
    ? \"https://localhost:3201/index.mjs\"
    : \"/node_modules/@base44/vite-plugin/dist/statics/index.mjs\";
  import(url)
    .then(mod => {
      if (typeof mod.setupVisualEditAgent === \"function\") mod.setupVisualEditAgent();
    })
    .catch(e => console.error(\"[visual-edit-agent] Failed to load:\", e));
}</script>
  

</body></html>"
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Support Now" [ref=e4] [cursor=pointer]:
    - /url: /back-this
    - button "Support Now" [ref=e5]
  - generic [ref=e8]:
    - heading "404" [level=1] [ref=e10]
    - generic [ref=e12]:
      - heading "Page Not Found" [level=2] [ref=e13]
      - paragraph [ref=e14]:
        - text: The page
        - generic [ref=e15]: "\"login\""
        - text: could not be found.
    - button "Go Home" [ref=e17] [cursor=pointer]
```

# Test source

```ts
  1   | // Route and Click Proof Tests
  2   | // Verifies all key routes load and do not redirect to dashboard fallback.
  3   | import { test, expect } from '@playwright/test';
  4   | 
  5   | const PUBLIC_ROUTES = [
  6   |   { path: '/store', label: 'Verified Boutique Store' },
  7   |   { path: '/store/all', label: 'Legacy Store Redirect' },
  8   |   { path: '/music', label: 'Music' },
  9   |   { path: '/lyrics', label: 'Lyrics' },
  10  |   { path: '/checkout-success', label: 'Checkout Success' },
  11  |   { path: '/checkout-cancel', label: 'Checkout Cancel' },
  12  | ];
  13  | 
  14  | const ADMIN_ROUTES = [
  15  |   { path: '/admin', label: 'Admin Dashboard' },
  16  |   { path: '/admin/orders', label: 'Orders' },
  17  |   { path: '/admin/music-opportunity-bulletin', label: 'Music Opportunity Bulletin' },
  18  |   { path: '/admin/base44-exit-plan', label: 'Base44 Exit Plan' },
  19  |   { path: '/admin/legal-drafts', label: 'Legal Drafts' },
  20  |   { path: '/admin/print-fulfilment', label: 'Print Fulfilment' },
  21  |   { path: '/admin/site-health', label: 'Site Health' },
  22  | ];
  23  | 
  24  | test.describe('Public Routes Load Without 404', () => {
  25  |   for (const route of PUBLIC_ROUTES) {
  26  |     test(`${route.label} — ${route.path}`, async ({ page }) => {
  27  |       await page.goto(route.path);
  28  |       const bodyText = await page.textContent('body');
  29  |       expect(bodyText).not.toContain('Page Not Found');
  30  |       expect(bodyText).not.toContain('404');
  31  |     });
  32  |   }
  33  | });
  34  | 
  35  | test.describe('Admin Routes Load (require admin auth)', () => {
  36  |   for (const route of ADMIN_ROUTES) {
  37  |     test(`${route.label} — ${route.path}`, async ({ page }) => {
  38  |       await page.goto(route.path);
  39  |       const bodyText = await page.textContent('body');
  40  |       // Should not 404 — either loads admin content or redirects to login (not 404)
  41  |       expect(bodyText).not.toContain('Page Not Found');
  42  |     });
  43  |   }
  44  | });
  45  | 
  46  | test.describe('Legacy product URLs fail closed to the verified store', () => {
  47  |   const PRODUCT_SLUGS = [
  48  |     'winter-writing-comfort-bundle',
  49  |     'thankyou-journal-pen-thermos-bundle',
  50  |     'respect-is-earned-wall-poster',
  51  |     'thankyou-respect-is-earned-coffee-mug',
  52  |     'thankyou-respect-is-earned-hoodie-front',
  53  |   ];
  54  | 
  55  |   for (const slug of PRODUCT_SLUGS) {
  56  |     test(`/store/product/${slug} returns to /store`, async ({ page }) => {
  57  |       await page.goto(`/store/product/${slug}`);
  58  |       await expect(page).toHaveURL('/store');
  59  |       await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  60  |     });
  61  |   }
  62  | });
  63  | 
  64  | test.describe('Store card links resolve correctly', () => {
  65  |   test('Store world and verified product cards share the canonical route', async ({ page }) => {
  66  |     await page.goto('/store');
  67  |     await expect(page.locator('[data-testid="locked-storefront-world"]')).toBeVisible();
  68  |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2);
  69  |   });
  70  | 
  71  |   test('Store All redirects to the canonical verified store', async ({ page }) => {
  72  |     await page.goto('/store/all');
  73  |     await expect(page).toHaveURL('/store');
  74  |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible({ timeout: 10000 });
  75  |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2);
  76  |   });
  77  | });
  78  | 
  79  | test.describe('API Keys Not Exposed In Frontend', () => {
  80  |   test('No Stripe secret key exposed in /store page', async ({ page }) => {
  81  |     await page.goto('/store/all');
  82  |     const html = await page.content();
  83  |     expect(html).not.toMatch(/sk_live_[a-zA-Z0-9]{20,}/);
  84  |     expect(html).not.toMatch(/sk_test_[a-zA-Z0-9]{20,}/);
  85  |   });
  86  | 
  87  |   test('No OpenAI key exposed in /store page', async ({ page }) => {
  88  |     await page.goto('/store/all');
  89  |     const html = await page.content();
  90  |     expect(html).not.toMatch(/sk-[a-zA-Z0-9]{20,}/);
  91  |   });
  92  | 
  93  |   test('No print provider API keys exposed in /admin/print-fulfilment', async ({ page }) => {
  94  |     await page.goto('/admin/print-fulfilment');
  95  |     const html = await page.content();
  96  |     // Should show env var names only, not actual keys
> 97  |     expect(html).not.toMatch(/[a-f0-9]{32,}/); // typical API key pattern (32+ hex chars)
      |                      ^ Error: expect(received).not.toMatch(expected)
  98  |     expect(html).toContain('PRINTFUL_API_KEY'); // should show placeholder
  99  |   });
  100 | });
```