# SUMMARY: 6-language i18n integration

Work completed on branch `feat/i18n-6lang` (pushed to origin, no PR created).

## What Was Done
1. Implemented site-wide, JavaScript-driven i18n for 6 languages:
   - English (`en`), Japanese (`ja`), Simplified Chinese (`zh-CN`), Korean (`ko`), French (`fr`), Spanish (`es`).
2. Kept a single HTML per page (no per-language copies) and preserved all URLs.
3. Added a persistent language switcher to every page.
4. Language preference is stored in `localStorage` under key `i18n_lang`.
5. On first visit, the language defaults to the browser’s language if supported; otherwise falls back to English.
6. Wired up shared assets used by all pages:
   - `assets/i18n.js` (runtime: detection, persistence, translation application, UI switcher)
   - `assets/i18n.css` (styling for the language switcher)

## Pages Converted
- `index.html`
  - Added `<link rel="stylesheet" href="assets/i18n.css">` and `<script src="assets/i18n.js" defer></script>`.
  - Marked translatable nodes with `data-i18n`:
    - `<title data-i18n="page_removed_title">…</title>`
    - `<h1 data-i18n="page_removed_title">…</h1>`
    - `<p data-i18n="site_removed_text">…</p>`
  - Existing visual/animation code preserved.

- `404.html`
  - Added `<link rel="stylesheet" href="assets/i18n.css">` and `<script src="assets/i18n.js" defer></script>`.
  - Marked translatable nodes with `data-i18n`:
    - `<title data-i18n="page_removed_title">…</title>`
    - `<h1 data-i18n="page_removed_title">…</h1>`
    - `<p data-i18n="site_removed_text">…</p>`

## Translations Included
Keys used across pages and their translations (in `assets/i18n.js`):
- `page_removed_title`: "Page removed" and equivalents in ja/zh-CN/ko/fr/es
- `site_removed_text`: "This site has been removed." and equivalents in ja/zh-CN/ko/fr/es
- Language labels for the switcher: `lang_en`, `lang_ja`, `lang_zh`, `lang_ko`, `lang_fr`, `lang_es`

## How It Works
- Elements with `data-i18n` are replaced at runtime based on the active language.
- `<html lang>` is updated to the active language.
- The floating switcher (top-right) updates the preference in `localStorage` and re-renders texts immediately.
- No query params or path changes are used; the URL remains unchanged.

## Security/Privacy Review (Codes)
- Scanned updated pages for key numbers, lock codes, keybox codes, or access codes.
- None present in source; nothing needed to be removed or redacted.

## Maintenance Notes
- To translate additional text, add a `data-i18n="your_key"` attribute to the element and supply translations under that key in `assets/i18n.js`.
- Additional pages can opt in by including `assets/i18n.css` and `assets/i18n.js`, then marking strings with `data-i18n`.
