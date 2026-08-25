# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation-scroll.spec.js >> Scroll-to-top on route change >> navigating from Store to Home resets scroll to top
- Location: src/gannonwaye-playwright-pack/tests/navigation-scroll.spec.js:10:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> /root/.cache/ms-playwright/webkit-2287/pw_run.sh --inspector-pipe --headless --no-startup-window --host-rules=MAP tracker.metricool.com ~NOTFOUND, MAP *.posthog.com ~NOTFOUND, MAP *.youtube.com ~NOTFOUND, MAP *.youtube-nocookie.com ~NOTFOUND, MAP *.doubleclick.net ~NOTFOUND, MAP *.spotify.com ~NOTFOUND, MAP *.google-analytics.com ~NOTFOUND, MAP *.googletagmanager.com ~NOTFOUND
<launched> pid=9615
[pid=9615][err] Cannot parse arguments: Unknown option --host-rules=MAP tracker.metricool.com ~NOTFOUND, MAP *.posthog.com ~NOTFOUND, MAP *.youtube.com ~NOTFOUND, MAP *.youtube-nocookie.com ~NOTFOUND, MAP *.doubleclick.net ~NOTFOUND, MAP *.spotify.com ~NOTFOUND, MAP *.google-analytics.com ~NOTFOUND, MAP *.googletagmanager.com ~NOTFOUND
Call log:
  - <launching> /root/.cache/ms-playwright/webkit-2287/pw_run.sh --inspector-pipe --headless --no-startup-window --host-rules=MAP tracker.metricool.com ~NOTFOUND, MAP *.posthog.com ~NOTFOUND, MAP *.youtube.com ~NOTFOUND, MAP *.youtube-nocookie.com ~NOTFOUND, MAP *.doubleclick.net ~NOTFOUND, MAP *.spotify.com ~NOTFOUND, MAP *.google-analytics.com ~NOTFOUND, MAP *.googletagmanager.com ~NOTFOUND
  - <launched> pid=9615
  - [pid=9615][err] Cannot parse arguments: Unknown option --host-rules=MAP tracker.metricool.com ~NOTFOUND, MAP *.posthog.com ~NOTFOUND, MAP *.youtube.com ~NOTFOUND, MAP *.youtube-nocookie.com ~NOTFOUND, MAP *.doubleclick.net ~NOTFOUND, MAP *.spotify.com ~NOTFOUND, MAP *.google-analytics.com ~NOTFOUND, MAP *.googletagmanager.com ~NOTFOUND
  - [pid=9615] <gracefully close start>
  - [pid=9615] <kill>
  - [pid=9615] <will force kill>
  - [pid=9615] <process did exit: exitCode=1, signal=null>
  - [pid=9615] starting temporary directories cleanup
  - [pid=9615] finished temporary directories cleanup
  - [pid=9615] <gracefully close end>

```