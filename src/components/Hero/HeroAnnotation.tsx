import type { CSSProperties } from 'react';

import { Arrow } from './icons';

type Props = {
  children: string;
  /** Degrees. Kept small — an annotation is written quickly, not thrown on. */
  tilt?: number;
};

/**
 * A pencilled note in the margin. Hand face plus the house arrow, tilted just
 * enough to read as written rather than typeset.
 */
export function HeroAnnotation({ children, tilt = -5 }: Props) {
  return (
    <p className="annotation" style={{ '--tilt': `${tilt}deg` } as CSSProperties}>
      <span className="annotation__inner">
        {children}
        <Arrow className="annotation__arrow" />
      </span>
    </p>
  );
}
