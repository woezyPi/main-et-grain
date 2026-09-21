/**
 * Hero content. Kept apart from the presentation so copy, recipe and links can
 * move to a CMS later without touching a component.
 */

export type CtaLink = {
  label: string;
  href: string;
};

export type NavLink = {
  label: string;
  href: string;
};

/** One row of the brewing recipe pinned to the composition. */
export type BrewSpec = {
  /** Micro-label, e.g. "DOSE". */
  key: string;
  /** Figure, e.g. "18". */
  value: string;
  /** Unit, e.g. "G". Omit for values that carry their own, like "02:45". */
  unit?: string;
};

export const heroContent = {
  eyebrow: 'Specialty coffee / Manual brewing',
  title: ['COFFEE', 'BY HAND.'] as [string, string],
  description: 'Coffee worth slowing down for.',
  primaryCta: { label: 'Shop coffee', href: '/coffee' } satisfies CtaLink,
  secondaryCta: { label: 'Build your setup', href: '/setup' } satisfies CtaLink,
  annotation: 'Pour slowly',
};

export const navLinks: NavLink[] = [
  { label: 'Grain', href: '/grain' },
  { label: 'Brew', href: '/brew' },
  { label: 'Tools', href: '/tools' },
  { label: 'Culture', href: '/culture' },
];

/** The house V60 recipe — the same one printed on the brand board. */
export const brewSpec: BrewSpec[] = [
  { key: 'Dose', value: '18', unit: 'g' },
  { key: 'Water', value: '300', unit: 'g' },
  { key: 'Temp', value: '92', unit: '°C' },
  { key: 'Time', value: '02:45' },
];

/** Caption for the drawn plate — it is a figure, so it is numbered like one. */
export const heroFigure = {
  number: 'Fig. 01',
  caption: 'V60 pour-over / one cup',
  /**
   * Read out in place of the drawing. It states the figures rather than
   * mentioning that annotations exist, because `role="img"` hides the
   * drawing's own labels and narrow screens drop them altogether.
   */
  alt:
    'Line drawing of a gooseneck kettle pouring into a V60 cone, ' +
    '116 mm across and cut at 60 degrees, standing on a 600 ml glass ' +
    'server. The coffee bed is blooming.',
};

export const brand = {
  name: 'Main & Grain',
  since: 'Est. 2025',
  city: 'Paris',
  /** Paris, as printed on the brand board. */
  coordinates: '48.8566° N / 2.3522° E',
  strapline: 'Slow coffee / Better days',
  /** The lock-up's second line on the brand board. */
  descriptor: 'Café manuel',
};
