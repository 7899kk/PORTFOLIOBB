# Reference portfolio

React + TypeScript + Vite, with Tailwind CSS and GSAP ScrollTrigger. Built from the supplied tech stack PDF and the visible sections of the 19-second reference video.

## Development

Use Node.js 24 and npm 11 (verified: Node 24.19.0, npm 11.9.0).

```sh
cd /workspace/PORTFOLIOBB
npm ci --cache /tmp/portfolio-npm-cache --no-audit --no-fund
npm run dev -- --port 5173
```

`npm run build` type-checks and creates the production bundle in `dist/`.
`npm run preview -- --port 4173` serves that bundle locally.

## Browser checks

```sh
# This cloud machine already has Chromium:
CHROMIUM_PATH=/usr/bin/chromium npm test
# On a machine without Chromium, install Playwright's browser once:
npx playwright install chromium
npm test
```

The checks exercise the scroll timeline, section navigation, project dialogs, contact validation and draft, mobile menu, narrow-screen overflow, and reduced-motion behavior. The test runner starts Vite if necessary.

## Personalization and remaining assets

Edit `src/content.ts` for the owner's name, biography, technologies, projects, and email address. The reference name and project copy are temporary reference content, not verified accomplishments of the owner. No private credentials are required for this static site.

- Set `profile.portrait` to an owner-provided image path under `public/` (for example `/images/portrait.webp`). A transparent portrait works best against the hero's grey glow.
- For the reference's real rotation, supply an ordered full-turn portrait image sequence and list its URLs in `profile.heroFrames`. A single portrait cannot provide the missing side and rear views. The placeholder currently uses a small perspective turn, not a fabricated 360-degree portrait.
- Certification details and repository URLs were not supplied. The navigation opens a pending-content dialog for certifications; project buttons open reference details rather than fabricated source links.
- Until `profile.email` is set, the form validates input and opens a copyable message draft. No messages are delivered. Setting an email opens the visitor's email client with the filled-in draft; there is no backend delivery service.

The implementation follows the visible dark layout, portrait stage, scroll-scrubbed heading, profile card, technology cloud, expertise cards, projects, contact composition, and oversized footer. Exact fonts, hidden sections, and every transition cannot be recovered from an oblique, low-resolution video; they need the original design/source assets for an exact match. Owner photos remain placeholders as requested.

## Cloud task startup

Use this existing checkout; each cloud task is isolated, so do not create a Git worktree unless explicitly requested. Retained dependencies and the production build survive a filesystem snapshot, but running servers do not. Restart Vite with the development command above when needed.
