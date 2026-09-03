# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: route-click-proof.spec.js >> API Keys Not Exposed In Frontend >> Signed-out visitors cannot inspect print-provider configuration
- Location: src/gannonwaye-playwright-pack/tests/route-click-proof.spec.js:93:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> /root/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --host-rules=MAP tracker.metricool.com ~NOTFOUND, MAP *.posthog.com ~NOTFOUND, MAP *.youtube.com ~NOTFOUND, MAP *.youtube-nocookie.com ~NOTFOUND, MAP *.doubleclick.net ~NOTFOUND, MAP *.spotify.com ~NOTFOUND, MAP *.google-analytics.com ~NOTFOUND, MAP *.googletagmanager.com ~NOTFOUND --user-data-dir=/tmp/playwright_chromiumdev_profile-1k94Kw --remote-debugging-pipe --no-startup-window
<launched> pid=2871
[pid=2871][err] /root/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell: error while loading shared libraries: libglib-2.0.so.0: cannot open shared object file: No such file or directory
Call log:
  - <launching> /root/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --host-rules=MAP tracker.metricool.com ~NOTFOUND, MAP *.posthog.com ~NOTFOUND, MAP *.youtube.com ~NOTFOUND, MAP *.youtube-nocookie.com ~NOTFOUND, MAP *.doubleclick.net ~NOTFOUND, MAP *.spotify.com ~NOTFOUND, MAP *.google-analytics.com ~NOTFOUND, MAP *.googletagmanager.com ~NOTFOUND --user-data-dir=/tmp/playwright_chromiumdev_profile-1k94Kw --remote-debugging-pipe --no-startup-window
  - <launched> pid=2871
  - [pid=2871][err] /root/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell: error while loading shared libraries: libglib-2.0.so.0: cannot open shared object file: No such file or directory
  - [pid=2871] <gracefully close start>
  - [pid=2871] <kill>
  - [pid=2871] <will force kill>
  - [pid=2871] exception while trying to kill process: Error: kill ESRCH
  - [pid=2871] <process did exit: exitCode=127, signal=null>
  - [pid=2871] starting temporary directories cleanup
  - [pid=2871] finished temporary directories cleanup
  - [pid=2871] <gracefully close end>

```