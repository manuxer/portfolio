# manuxer — portfolio

A rebuild of [manuxer.com](https://manuxer.com) (source: `manuxer/manuxer`) with the same pages, content, and
assets, redesigned around Apple-style motion and a glass material system.

**Stack:** Vite 7 · React 19 · TypeScript · Tailwind CSS 4 · Motion 12 · React Router 7 · vite-imagetools

## Structure

Same information architecture as the original site:

| Route | Page |
| --- | --- |
| `/` | Hero, featured projects, about preview, contact |
| `/projects` | Work grid |
| `/projects/:id` | Case studies 8, 9, 10, 11; legacy projects 1–7 |
| `/about` | Story, portrait, quote |
| `/resume` | Experience, education, skills, PDF download |

```
src/
  assets/            original images, untouched
  data/              project list + one module per case study (lazy-loaded)
  components/        Navbar, ProjectCard, Lightbox, Gallery, SectionDock, Aurora, …
  pages/             route modules
  styles/index.css   design tokens, glass material, view-transition choreography
```

## Motion & material

- **Shared-element transitions.** A project card's image morphs into the case-study hero, using the
  View Transitions API through React Router's `viewTransition` links.
- **Glass.** Backdrop blur + saturation, a specular rim, and a pointer-tracked sheen (`.glass`, `.glass-rim`,
  `.specular`), lit from behind by a slow brand-coloured aurora sampled from the logo.
- **Navigation.** A floating capsule that compacts on scroll. Active and hover states are springs that
  slide between links.
- **Lightbox.** iOS Photos-style: the image grows out of its thumbnail, swipes between slides with momentum,
  drags down to dismiss, and lands back on the right thumbnail.
- **Micro-interactions.** Word-by-word headline reveals, tvOS-style card tilt and glare, count-ups, drawn
  checkmarks, a scroll-linked quote, a filling resume timeline, a reading-progress section dock,
  copy-email feedback, and a circular theme reveal from the toggle.
- **Accessibility.** Everything respects `prefers-reduced-motion`. The site includes a skip link, focus
  rings, keyboard-operable dialogs with focus return, and system light/dark mode with a manual override.

## Images

Originals stay in `src/assets`. Importing with `?responsive` makes the build emit WebP versions at 640, 1280,
1920, and 2560px (never upscaled), plus intrinsic dimensions so images don't shift the layout. A 6 MB slide
ships as roughly 100–250 KB.

Legacy projects (USPS, MBTA, experiments, UserWorks, artwork) and the About portrait still load from
`manupeethambar.github.io`, exactly as the original site does.

## Develop

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # typecheck + production build into dist/
npm run preview
npm run lint
```

## Deploy

`.github/workflows/deploy.yml` builds every pull request and deploys `main` to GitHub Pages. It resolves the
base path automatically, and the build writes a `404.html` copy of the app so deep links work.

1. **Settings → Pages → Source: GitHub Actions.**
2. To serve it from `manuxer.com` instead of `manuxer.github.io/portfolio`, add `public/CNAME` containing
   `manuxer.com`, after removing the domain from the old repository.
