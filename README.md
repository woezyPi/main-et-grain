# MAIN & GRAIN

Specialty coffee, manual brewing, and the tools for it. Paris, est. 2025.

Only the **Hero** is built at this stage. No catalogue, bag, checkout, finder or
backend — those come later, and nothing here should be shaped around guesses
about them.

## Running it

```bash
npm install
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run preview  # serve the production build
npm run lint     # oxlint
```

## Art direction

The Hero is a **night surface**: a full-bleed photograph of a pour with the
type reversed out of it, as the homepage moodboard sets it. The rest of the
site is the paper surface from the brand board.

- **The photograph is the Hero.** It is named in `App.tsx` (`HERO_IMAGE`) and
  currently `public/hero.jpeg`. Swapping it is one line. A legibility scrim is
  applied automatically whenever an image is present, and the concrete texture
  steps aside — the photograph brings its own matter.
  The current file is **1024×572**, which a 1440 viewport upscales 1.6× and a
  1920 one 2.2×: it will look soft on a large display. A source of 2400px or
  wider, plus a `srcset`, is the next thing this needs.
  `object-position` is set twice, because a 16:9 photograph cropped to a phone
  keeps only whichever object it is anchored on: 36% on the poster so the
  kettle clears the headline, 54% below 900px so the V60 survives the crop.
- **Without a photograph the object is drawn** — see `HeroVisual`. Same
  geometry as the brand board's line-work, reversed out of the night instead
  of inked on paper, cropped by the frame the way a photograph would be. It is
  a stand-in, not the design.
- **Neon `--acid` (#b7d900) is the only signal colour.** It appears three
  times: the recipe label, the bag count, and the underline under the primary
  call to action.
- **The surface has matter.** A coarse mottle reading as concrete, with film
  grain over it — two layers at 16% together, never a filter laid over the
  page. No gradients anywhere except the scrim, which is there for contrast.
- Cobalt is the paper surface's line-work colour and stays out of the Hero;
  on the night it neither reads nor passes contrast.

## Layout

| Width      | Composition                                                       |
| ---------- | ----------------------------------------------------------------- |
| `< 900px`  | One column over the media: masthead, headline, label, copy, actions |
| `≥ 900px`  | Masthead opens up, the section rail appears in the left margin, and the poster assembles: headline left, pencilled note and neon label right, copy bottom-left, actions bottom-right |

The Hero is exactly `100svh` from 900px up. Reading order follows the visual
order at every width; nothing is reordered by CSS.

## Motion

`useHeroMotion` writes three normalised numbers onto the Hero element as custom
properties — `--px`, `--py` (pointer, −1..1) and `--scroll` (0..1) — in one
`requestAnimationFrame` write per frame. Everything that reacts to them does so
in CSS, so there is one JS writer and no per-element JS animation. Pointer
tracking is fine-pointer only and scroll tracking pauses off-screen.

They are written to the plate, not to the Hero: they are inherited custom
properties, so writing them at the top of the tree would invalidate the
computed style of every descendant three times a frame.

Smoothing is a lerp inside that same frame rather than a CSS transition. A
transition retargeted every frame never converges and lags the pointer by about
a third of a second.

`usePrefersReducedMotion` gates the whole hook, and both `global.css` and
`hero.css` switch off animation and transition under
`prefers-reduced-motion: reduce`.

The load sequence is pure CSS, written as transitions out of `@starting-style`
rather than as animations. The base state is the finished page — a renderer
that never runs the reveal still shows everything, and no text waits on it.
Each element carries an `--i` step and delays itself by
`calc(var(--i) * var(--dur-stagger))`.

## Files

```
src/
├── components/Hero/
│   ├── Hero.tsx               composition + props API
│   ├── HeroNav.tsx            masthead and the mobile sheet
│   ├── HeroVisual.tsx         stand-in for the photograph, drawn in SVG
│   ├── HeroTechnicalData.tsx  the neon recipe label
│   ├── HeroAnnotation.tsx     pencilled marginalia
│   ├── icons.tsx              house glyphs
│   └── hero.css
├── data/hero.ts               all copy, links and the recipe
├── hooks/
├── styles/                    tokens, self-hosted faces, reset
└── App.tsx
```

Copy and data live in `src/data/hero.ts`, never in a component, so they can move
to a CMS without touching the presentation. `<Hero>` takes every one of them as
an optional prop and falls back to that file.

## Type

Archivo (display), IBM Plex Mono (technical labels and body copy), Caveat
(annotations and the figures on the neon label) — self-hosted woff2 in `public/fonts`, so the
page makes no third-party connection at runtime. Archivo and Plex Mono ship as
Google's latin and latin-ext subsets; Caveat is instanced to a single weight
(600) and cut to latin, which takes it from 150KB across two files to 48KB
across one. Archivo and Plex Mono 500 are preloaded — between them they set
every word above the fold.

## Accessibility

The mobile sheet is a modal dialog and behaves like one: `role="dialog"`,
`aria-modal`, `#root` made `inert` while it is open, Tab cycling inside it,
Escape to close, and focus returned to the button that opened it.

Cream steps are named by what they are allowed to carry rather than by how
light they look. On the night surface cream needs alpha 0.52 to clear 4.5:1
and 0.38 to clear 3:1, so `--cream-quiet` is the lightest step that may carry
text and `--cream-edge` the lightest that may carry an affordance.
`--cream-line` is decorative hairlines and drawn line-work only.

The focus ring is neon rather than cobalt: it has to read on the night surface
and on the paper one, and cobalt only does the second.
