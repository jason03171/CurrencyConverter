# Proposal: UI Refresh — Modern, Accessible Styling (rewrite)

## Summary
Small, incremental visual refresh to improve usability and polish without changing business logic. Deliverables: CSS design tokens, token-driven component styles, a lightweight theme toggle, and accessibility checks.

## Goals
- Introduce reusable CSS design tokens (colors, spacing, radii, shadows, typography).
- Apply tokens to key UI surfaces (`src/App.vue`, `src/style.css`) with minimal template changes.
- Add a persistent light/dark theme toggle.
- Maintain or improve accessibility (contrast, keyboard focus).

## Non-goals
- No JavaScript framework or routing changes.
- No asset-heavy redesigns or image asset additions.

## Implementation Plan (high level)
1. Add tokens to `src/style.css` and document them under `openspec/changes/ui-fashion-upgrade/specs/`.
2. Apply token-based styles to the converter container, controls, and header; add a small theme toggle.
3. Validate visual correctness and accessibility; iterate based on findings.
4. Archive the change when visual QA is complete.

## Success Criteria
- Tokens live in `src/style.css` and documented in `openspec`.
- Theme toggle persists via `localStorage`.
- Visual QA passes on desktop/mobile and basic contrast checks.
- No functional regressions; unit/manual verification completed.

## Files Touched (examples)
- `src/style.css` (tokens + overrides)
- `src/App.vue` (small template + scoped style updates)
- `openspec/changes/ui-fashion-upgrade/specs/style/spec.md` (requirements/deltas)

---
This rewrite clarifies scope and provides a compact implementation plan for fast iteration.

