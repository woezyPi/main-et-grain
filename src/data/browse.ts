/**
 * "Tu cherches quoi ?" — the first section under the Hero, and the first
 * real way into the shop.
 *
 * Kept apart from the presentation for the same reason the Hero's copy is:
 * this is the content most likely to move to a CMS first, because it is the
 * content a shopkeeper changes.
 */

export type BrowseRoute = {
  /** The tag knocked into the signal colour. One word. */
  label: string;
  /** The line under the frame. A caption, not a pitch. */
  caption: string;
  href: string;
  /**
   * Which signal colour carries the tag. The board gives each entry its own
   * and never repeats one in a row.
   *
   * Paper on orange only reaches 2.6:1, so that tag takes ink instead — see
   * the note in `browse.css`.
   */
  tone: 'acid' | 'cobalt' | 'orange';
  /** The photograph in the frame. Without one the frame is drawn instead. */
  image?: string;
  imageAlt?: string;
};

export const browseContent = {
  /** Hand-written, as on the board, with the house arrow after it. */
  heading: 'Tu cherches quoi ?',
};

export const browseRoutes: BrowseRoute[] = [
  {
    label: 'Café',
    caption: 'Grains fraîchement torréfiés.',
    // Points at the rail's route rather than inventing a second one for the
    // same destination — the two names for this section are a live question,
    // see the README.
    href: '/grain',
    tone: 'acid',
  },
  {
    label: 'Matériel',
    caption: 'Moulins, V60, balances, accessoires.',
    href: '/tools',
    tone: 'cobalt',
  },
  {
    label: 'Brew',
    caption: 'Guides, recettes, conseils.',
    href: '/brew',
    tone: 'orange',
  },
];

/** The panel beside the three ways in, for anyone who has none of them. */
export const finderContent = {
  question: ['Don’t know', 'where to start ?'] as [string, string],
  /** Set as separate lines, because that is how the board sets them. */
  reassurance: [
    '3 questions.',
    '30 seconds.',
    'No coffee knowledge required.',
  ],
  aside: 'It’s easier than you think.',
  cta: { label: 'Find your coffee', href: '/finder' },
};
