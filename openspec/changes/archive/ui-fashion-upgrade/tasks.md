# Tasks: UI Refresh — Modern, Accessible Styling (rewrite)

## Task 1: Add design tokens

**Status:** ✅ Completed

### Steps performed
- Added CSS variables (colors, spacing, radii, shadows, typography) to `src/style.css`.
- Documented tokens in `openspec/changes/ui-fashion-upgrade/specs/design-tokens.md`.

### Verification
- [x] Tokens defined and exported via `:root` CSS variables

---

## Task 2: Apply token-based styles to App

**Status:** ✅ Completed

### Steps performed
- Applied token styles to container, controls, and inputs in `src/App.vue`.
- Introduced `.card` container and header with theme toggle.

### Verification
- [x] UI updated to use tokens, no functional regressions observed

---

## Task 3: Theme toggle and persistence

**Status:** ✅ Completed

### Steps performed
- Added theme toggle and persisted selection to `localStorage`.
- Restored theme on app mount.

### Verification
- [x] Theme persists across reloads

---

## Task 4: Visual QA & Documentation

**Status:** ✅ Completed (basic)

### Steps performed
- Performed local visual checks; updated `README.md` notes.

### Verification
- [x] Basic QA performed; accessibility considerations added to spec

---

**Notes:** This rewrite consolidates the tasks and marks work already applied in the repository. If you want a staged PR approach instead of direct edits, I can revert and produce incremental change folders.