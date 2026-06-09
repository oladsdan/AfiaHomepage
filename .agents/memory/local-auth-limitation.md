---
name: Local auth limitation
description: Why signed-in app pages can't be visually verified in the local preview
---

Signed-in pages (anything under the `(app)` route group guarded by ProtectedRoute) cannot be screenshot-verified in the local Replit preview.

**Why:** Auth runs against a remote backend (`afia-mobile--zokulabs.replit.app`) whose `/api/auth/refresh` is CORS-blocked from `localhost:5000`. ProtectedRoute fails to authenticate locally and redirects to `/login`, so screenshots of `/dashboard`, `/ai-chat`, `/settings`, etc. always show the login split-screen.

**How to apply:** When changing a signed-in page, don't rely on `screenshot` to confirm the redesign. Verify with: `npx tsc --noEmit` clean, the route returning HTTP 200 (curl), clean workflow logs, and a code review. Public pages (`/login`, `/`, `/privacy-policy`) DO render and can be screenshotted.
