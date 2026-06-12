# Codex Route Integration Task

Use this as the next immediate coding task.

Repository: `ganozwaye-stack/gannon-waye-music`
Branch: `upgrade/gwm-command-centre-v2`
Issue: `#24`

## Goal
Wire the newly created priority sprint pages into the app routes and protect Sonia tribute routes.

## Files already created

- `src/pages/admin/GannonScheduler.jsx`
- `src/pages/family/SoniaUpload.jsx`
- `src/pages/admin/FamilyUploads.jsx`
- `src/pages/admin/MumTributeStudio.jsx`
- `src/pages/admin/SoniaMemoryChatAdmin.jsx`
- `docs/codex-antigravity-priority-build-pack.md`

## Route changes required in `src/App.jsx`

### Import these pages

```jsx
import GannonScheduler from '@/pages/admin/GannonScheduler';
import SoniaUpload from '@/pages/family/SoniaUpload';
import FamilyUploads from '@/pages/admin/FamilyUploads';
import MumTributeStudio from '@/pages/admin/MumTributeStudio';
import SoniaMemoryChatAdmin from '@/pages/admin/SoniaMemoryChatAdmin';
```

### Change public Mum routes

Replace the current public routes:

```jsx
<Route path="/mum" element={<MumTribute />} />
<Route path="/without-you-here" element={<MumTribute />} />
```

With:

```jsx
<Route path="/mum" element={<Navigate to="/" replace />} />
<Route path="/without-you-here" element={<Navigate to="/" replace />} />
```

### Add public family upload route

Inside the public layout route group, add:

```jsx
<Route path="/family/sonia-upload" element={<SoniaUpload />} />
```

### Add admin routes

Inside the admin layout route group, add:

```jsx
<Route path="/admin/scheduler" element={<GannonScheduler />} />
<Route path="/admin/today" element={<GannonScheduler />} />
<Route path="/admin/action-centre" element={<GannonScheduler />} />
<Route path="/admin/family-uploads" element={<FamilyUploads />} />
<Route path="/admin/mum" element={<MumTribute />} />
<Route path="/admin/mum-tribute" element={<MumTribute />} />
<Route path="/admin/without-you-here" element={<MumTribute />} />
<Route path="/admin/mum-tribute-studio" element={<MumTributeStudio />} />
<Route path="/admin/sonia-memory-chat" element={<SoniaMemoryChatAdmin />} />
```

## Acceptance checks

- `/mum` no longer shows Sonia tribute publicly.
- `/without-you-here` no longer shows Sonia tribute publicly.
- `/family/sonia-upload` loads family upload form.
- `/admin/scheduler` loads task scheduler.
- `/admin/today` loads task scheduler.
- `/admin/action-centre` loads task scheduler.
- `/admin/family-uploads` loads upload review page.
- `/admin/mum` loads current MumTribute for admin.
- `/admin/mum-tribute-studio` loads tribute studio.
- `/admin/sonia-memory-chat` loads memory chat shell.

## Test instruction

Run the existing build and route tests. Do not change Stripe, checkout, cart, orders, webhooks, promo codes, inventory, legal pages, admin auth, approval queue, Metricool safety, or agent safety.
