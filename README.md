# Toolsy

Small, fast, privacy‑friendly online utilities built with React and Tailwind CSS.

## Tools
- JSON Formatter
  - Format / Minify JSON, sort keys, choose indentation (2/4), copy, paste, download, shortcuts (Ctrl/⌘+Enter, Ctrl/⌘+B)
- Base64 Encode / Decode
  - Convert text to/from Base64, copy, clear
- CSV ↔ JSON
  - CSV → JSON / JSON → CSV, autodetect delimiter (comma/semicolon/TAB), header row toggle, pretty JSON, copy, download
- UUID Generator
  - Generate one or many UUID v4 values, options: uppercase and with/without hyphens, copy, clear
- Hash Tool
  - Compute SHA‑1 / SHA‑256 / SHA‑384 / SHA‑512
  - Modes: Text or File (drag & drop or click to select)
  - Copy and clear; runs with Web Crypto in your browser

## Internationalization
- Languages: English and Español
- Language switcher in the header; choice persists in localStorage

## Tech Stack
- React 19 + Vite
- Tailwind CSS v4
- React Router
- Helmet (SEO) and Open Graph tags
- Plausible analytics (privacy‑friendly)

## Development
From the `frontend/` folder:

```
npm install
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

---

© 2025 Toolsy
