---
name: Next route-group cache corruption
description: Stale .next after route restructure causes MODULE_NOT_FOUND chunk errors
---

After moving pages between route groups or restructuring `app/`, the dev server can throw `Error: Cannot find module './NNNN.js'` (MODULE_NOT_FOUND) for webpack chunks, leaving pages stuck on a spinner with 500s on `/_next/static/...` and `/sw.js`.

**Why:** The `.next` build cache references chunk files that no longer exist after the restructure. Also, `.next/types/**` can hold stale generated route types that make `tsc --noEmit` report phantom "Cannot find module ...page.js" errors.

**How to apply:** Clear the whole `.next` dir (`rm -rf .next`) and restart the workflow to rebuild from scratch. For phantom tsc errors specifically, `rm -rf .next/types` then re-hit the routes (or restart) so types regenerate. Note: `/tmp/logs/*.log` snapshots are written by refresh_all_logs, NOT by restart_workflow — after a restart, call refresh_all_logs to see the real current state instead of reading a stale snapshot.
