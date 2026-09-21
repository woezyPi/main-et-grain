import { Hero } from './components/Hero/Hero';

/**
 * MAIN & GRAIN.
 *
 * Only the Hero is in scope for this stage — no catalogue, bag or finder.
 *
 * The Hero is designed around a photograph: a V60 setup shot on a bench, the
 * cluster right of centre so the headline has the left half to itself. Name
 * the file here; without one the object is drawn instead — see HeroVisual.
 */
const HERO_IMAGE: string | undefined = '/hero.jpeg';

export default function App() {
  return (
    <Hero
      image={HERO_IMAGE}
      imageAlt="A V60 brewing on a scale beside a gooseneck kettle, a bean tin and a linen cloth, on a wooden bench in window light."
    />
  );
}
