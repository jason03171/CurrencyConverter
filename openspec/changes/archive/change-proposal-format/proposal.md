# Proposal: Standardize change proposal directory format

## Why

We want consistent, reviewable change proposals. Creating a dedicated directory per proposal (instead of a single file) makes it easy to store the narrative, the actionable tasks, and the spec diffs together.

## What Changes

- Add a new change directory template under `openspec/changes/` named `change-proposal-format` containing:
  - `proposal.md` — explains Why, What Changes, Impact
  - `tasks.md` — actionable checklist in checkbox format
  - `specs/` — subdirectory for spec diffs affected by the change
- Update process: when creating a proposal, generate a new `openspec/changes/[proposal-name]/` folder using this template.

## Impact

- Affects how proposals are authored and stored (single-folder-per-change).
- Makes reviews and archival cleaner (move completed folders to `openspec/changes/archive/`).
- Minimal code impact — docs and tooling may be updated to follow the new layout.

