# Design Tokens for UI Refresh

## CSS Variables (recommended)

:root {
  /* Colors */
  --color-bg: #0f1724; /* dark slate background */
  --color-surface: #0f1724;
  --color-card: #111827; /* slightly lighter */
  --color-primary: #4CAF50; /* accent */
  --color-primary-600: #45a049;
  --color-muted: #9CA3AF;
  --color-text: #E5E7EB;
  --color-error: #EF4444;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 20px;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-subtle: 0 4px 12px rgba(2,6,23,0.6);

  /* Typography */
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 18px;
}

## Light theme suggestions

:root[data-theme="light"] {
  --color-bg: #f7fafc;
  --color-card: #ffffff;
  --color-primary: #0b6f44;
  --color-text: #0f1724;
  --color-muted: #6b7280;
}

## Usage
- Use `--color-primary` for primary buttons and accents
- Use `--radius-md` for main container borders
- Use `--shadow-subtle` for card elevation

