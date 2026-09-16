# ARCHIVED AND LOCKED — Mum's Garden pages

Locked on 16 September 2026 by owner request. Mum's Garden and Sonia's Garden
were removed from the live site and locked in this archive so they cannot be
reopened by mistake.

These files must NOT be moved back to src/pages, and their routes must NOT be
restored, unless the owner explicitly asks to unlock Mum's Garden and make it
public again.

Why reverting an earlier edit cannot silently reopen them: the live routes in
src/App.jsx pointed to @/pages/MumsGarden and @/pages/SoniasGarden. Those files
no longer exist at those paths, so restoring an older version of App.jsx breaks
the build instead of reopening the pages. The garden stays closed until the
unlock procedure below is followed on the owner's explicit instruction.

Routes currently in place (safe redirects, no pages):
- /mums-garden -> home
- /sonias-garden -> home
- /mum and /mums -> home
- /admin/mums-garden -> admin dashboard

Unlock procedure (only on the owner's explicit request):
1. Move MumsGarden.jsx and SoniasGarden.jsx from this archive back to src/pages/.
2. Restore the /mums-garden and /sonias-garden routes in src/App.jsx.
3. Restore the "Mum's Garden" link in the public navbar and the admin sidebar.