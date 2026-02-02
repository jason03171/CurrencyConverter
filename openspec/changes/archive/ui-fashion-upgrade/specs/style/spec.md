## ADDED Requirements

### Requirement: Provide CSS design tokens
The implementation MUST provide a set of CSS variables (design tokens) that define color, spacing, radii, shadows and typography for the application. Tokens MUST be documented in `openspec/changes/ui-fashion-upgrade/specs/design-tokens.md`.

#### Scenario: Tokens exposed on :root
- Given the application is loaded
- When a developer inspects the computed CSS variables
- Then the following tokens MUST be present under `:root`:
  - `--color-bg`
  - `--color-card`
  - `--color-primary`
  - `--space-sm`
  - `--radius-md`
  - `--shadow-subtle`

#### Scenario: Light theme tokens available
- Given the application is loaded with `data-theme="light"` on the document root
- When a developer inspects computed CSS variables
- Then light-theme overrides for `--color-bg`, `--color-card`, and `--color-text` MUST be present

### Requirement: Provide theme toggle persistence
The implementation MUST include a small theme toggle and MUST persist the selected theme to `localStorage`.

#### Scenario: Theme toggle persists
- Given a user toggles the theme to `light`
- When the user reloads the page
- Then the application MUST restore the `light` theme from `localStorage` and apply the corresponding token set


## MODIFIED Requirements

### Requirement: Update component styles to use tokens
`src/App.vue` and base styles MUST be updated to read visual properties from the new design tokens instead of hard-coded colors and spacing. Changes MUST not alter application behavior.

#### Scenario: Components use tokens
- Given the application styles are loaded
- When inspecting the converter container and controls
- Then key visual properties (background, padding, border-radius, primary color) MUST be derived from the design tokens
