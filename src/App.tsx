import { Browse } from './components/Browse/Browse';
import { Hero } from './components/Hero/Hero';

/**
 * MAIN & GRAIN.
 *
 * Two surfaces so far. The Hero is the night — a full-bleed photograph with
 * the type reversed out of it. Everything below is paper, starting with
 * "Tu cherches quoi ?". No catalogue, bag, checkout or finder yet.
 *
 * The Hero is designed around a photograph: a pour in progress, the cluster
 * right of centre so the headline has the left half to itself. Name the file
 * here; without one the object is drawn instead — see HeroVisual.
 */
const HERO_IMAGE: string | undefined = '/hero-1672.webp';

/**
 * The same frame at three widths. The plate is full-bleed, so a phone would
 * otherwise pull the widest one for nothing.
 */
const HERO_SRCSET = [
  '/hero-768.webp 768w',
  '/hero-1100.webp 1100w',
  '/hero-1672.webp 1672w',
].join(', ');

export default function App() {
  return (
    <>
      <Hero
        image={HERO_IMAGE}
        imageSrcSet={HERO_SRCSET}
        imageAlt="A hand tips a gooseneck kettle into a V60 cone, the water falling in a thin stream and the coffee bed blooming under it. Steam rises past a glass server half full. A tin of beans, its lid and a scatter of beans sit on the wooden bench; window light rakes across the wall behind."
      />
      <Browse />
    </>
  );
}
