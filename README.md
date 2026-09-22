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
  currently `public/hero-1375.webp`. Swapping it is one line. A legibility scrim is
  applied automatically whenever an image is present, and the concrete texture
  steps aside — the photograph brings its own matter.
  The source is **1375×768**, served as WebP at three widths (768 / 1100 /
  1375) through a `srcset` with `sizes="100vw"`.

  Measure the upscale in **device** pixels, not CSS ones — `naturalWidth` on
  an image chosen from a `w`-descriptor `srcset` reports the density-corrected
  size and will flatter you by half:

  | | 1× laptop | 1920 desktop | 1440 HiDPI | tablet 2× | phone 2× |
  | --- | --- | --- | --- | --- | --- |
  | now | 1.08× | 1.46× | 2.44× | 2.77× | 2.86× |
  | before | 1.46× | 1.96× | 3.27× | 3.73× | 3.07× |

  So 1× displays are effectively resolved and 2× ones are merely better. The
  binding constraint is **height**: 768px of source has to cover a `100svh`
  hero, which on a retina laptop is 1800 device pixels. More width alone will
  not fix a phone — at 390×844 it wants a portrait frame, which is art
  direction (`<picture>`), not another `srcset` entry. A ~2400×1340 source
  would bring HiDPI to about 1.4×.
  `object-position` is set twice, because a 16:9 photograph cropped to a phone
  keeps only whichever object it is anchored on: 36% on the poster so the
  kettle clears the headline, 54% below 900px so the V60 survives the crop.
- **Without a photograph the object is drawn** — see `HeroVisual`. Same
  geometry as the brand board's line-work, reversed out of the night instead
  of inked on paper, cropped by the frame the way a photograph would be. It is
  a stand-in, not the design.
- **Neon `--acid` (#b7d900) is the only signal colour.** It appears twice now
  that the masthead is gone: the recipe label, and the underline under the
  primary call to action.
- **The surface has matter.** A coarse mottle reading as concrete, with film
  grain over it — two layers at 16% together, never a filter laid over the
  page.
- **The recipe label is a sheet of paper, not a swatch.** Stuck on by hand and
  left crooked, glued along the top so the bottom lifts, with paper tooth at
  two scales, a cast shadow, and corners each cut slightly differently — a
  perfect rectangle is the tell that gives a drawn one away.

  The edges are not straight either, which rounded corners alone never fixed:
  a `feTurbulence` + `feDisplacementMap` (`#mg-paper`, declared in
  `HeroTechnicalData`) bows them. It is applied to two pseudo-elements that
  carry the whole sheet — fill, raking light, tooth and cast shadow — and not
  to the element itself, so the figures written on the paper stay crisp. Both
  share one filter and one seed, or their outlines drift apart and the
  straight edge shows along whichever layer went unfiltered.
- Gradients are rationed and never decorative: the scrim (contrast), the
  label's raking light and its tooth. Nothing else on the page has one.
- Cobalt is the paper surface's line-work colour and stays out of the Hero;
  on the night it neither reads nor passes contrast.

## Layout

**There is no masthead.** No wordmark bar, no horizontal link row, no search
or bag: the Hero's whole navigation is the lowercase rail that opens the left
column, above the headline and on its left edge. Because it is the only way
out of the page, it is never hidden — a rail that appeared at 900px would
leave a phone with no navigation at all.

One threshold left:

| Width      | Composition                                                       |
| ---------- | ----------------------------------------------------------------- |
| `< 900px`  | One column over the media: rail, label, headline, annotation, neon label, copy, actions |
| `≥ 900px`  | The poster assembles — rail and annotation across the top, headline left, neon label right, copy bottom-left, actions bottom-right |

The Hero is exactly `100svh` at every width, which is a constraint and not a
description: the three-line annotation costs two lines more than the single
one it replaced, and on a 375px phone that height has to be given back
somewhere. It comes out of the annotation and the label, never the headline.

Reading order follows the visual order throughout; nothing is reordered by
CSS.

Measured at 375 / 768 / 900 / 1280 / 1440 / 1920: no horizontal overflow, no
overlapping blocks, the rail legible and reachable, and the Hero exactly one
viewport tall at each.

## Motion

**The Hero does not answer the pointer.** The photograph moves of its own
accord and with the page, never with the cursor.

The photograph drifts — `hero-drift`, a slow push across the bench, playing
`alternate` so it never resets with a jump. It overscales so the frame edges
stay out of view and travels a fraction of that headroom. The duration
(`--dur-drift`) is the real control: below roughly 2px/s of travel the eye
stops reading it as movement at all, which at this frame size puts the useful
range around 20s per sweep, not 35.

Note the cost: the drift's `scale(1.13)` compounds with the `object-fit:
cover` upscale, so at the far end of the sweep the source is shown about 13%
larger again than the figures in the table above. The drift is a reason to
want a bigger photograph, not a substitute for one.

`useHeroMotion` writes one normalised number onto the plate as a custom
property — `--scroll` (0..1) — in one `requestAnimationFrame` write per frame.
Everything that reacts to it does so in CSS, so there is one JS writer and no
per-element JS animation. Scroll tracking pauses off-screen.

It is written to the plate, not to the Hero: it is an inherited custom
property, so writing it at the top of the tree would invalidate the computed
style of every descendant once a frame.

Scroll needs no smoothing — the scroll position is already the reader's own
input, and a lerp over it would only add lag.

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
│   ├── HeroNav.tsx            UNUSED — the removed masthead and its sheet
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

Navigation is four links in the rail and the two calls to action. There is no
dialog left to trap focus in — the mobile sheet went with the masthead, and
`HeroNav.tsx` is kept only so that work is not lost. Nothing renders it.

Cream steps are named by what they are allowed to carry rather than by how
light they look. On the night surface cream needs alpha 0.52 to clear 4.5:1
and 0.38 to clear 3:1, so `--cream-quiet` is the lightest step that may carry
text and `--cream-edge` the lightest that may carry an affordance.
`--cream-line` is decorative hairlines and drawn line-work only.

The focus ring is neon rather than cobalt: it has to read on the night surface
and on the paper one, and cobalt only does the second.
