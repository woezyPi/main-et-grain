/**
 * House icons. Drawn rather than typed: the arrow appears everywhere in the
 * brand and the font subsets don't ship U+2192, so a glyph would silently fall
 * back to a system face and break the line weight.
 */

type IconProps = {
  className?: string;
};

/** Long-tailed arrow. Sized in `em` so it tracks the type it sits beside. */
export function Arrow({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 34 10"
      width="2.42em"
      height="0.71em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0.6 5h31.4" />
      <path d="M27.4 1.2 32 5l-4.6 3.8" />
    </svg>
  );
}

/** Downward arrow for the scroll cue. */
export function ArrowDown({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 10 28"
      width="0.71em"
      height="2em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 0.6v25.6" />
      <path d="M1.2 21.8 5 26.4l3.8-4.6" />
    </svg>
  );
}

export function Search({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="7" cy="7" r="5.1" />
      <path d="M10.8 10.8 14.6 14.6" />
    </svg>
  );
}

/** The dripper mark from the emblem, reduced to a nav-scale glyph. */
export function DripperMark({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 22 24"
      width="1.38em"
      height="1.5em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.4 6.2h17.2L11 16.4 2.4 6.2Z" />
      <path d="M2.4 6.2C5 4.9 8 4.3 11 4.3s6 .6 8.6 1.9" />
      <path d="M11 16.4v2.2" />
      <path d="M5.6 19.2h10.8c0 2.1-1.7 3.4-5.4 3.4s-5.4-1.3-5.4-3.4Z" />
      <path d="M8.6 1.6c.6.7.6 1.3 0 2M13.4 1.6c.6.7.6 1.3 0 2" />
    </svg>
  );
}

export function Bag({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.6 4.7h10.8l.9 9.7H1.7l.9-9.7Z" />
      <path d="M5.6 6.8V4.3a2.4 2.4 0 0 1 4.8 0v2.5" />
    </svg>
  );
}
