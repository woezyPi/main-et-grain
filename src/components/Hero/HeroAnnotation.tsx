import type { CSSProperties } from 'react';

type Props = {
  /** One entry per written line. They are set as written, not as typeset. */
  lines: string[];
  /** Degrees. Kept small — an annotation is written quickly, not thrown on. */
  tilt?: number;
};

/**
 * A pencilled note in the margin: a few words in the hand face, stacked the
 * way they would be written into a corner rather than set as a line of type.
 *
 * Each line carries its own `--n`, which `hero.css` turns into a slightly
 * different indent and angle. Writing by hand does not produce a flush left
 * edge, and three lines sharing one is the tell that a machine set them.
 */
export function HeroAnnotation({ lines, tilt = -3 }: Props) {
  return (
    <p className="annotation" style={{ '--tilt': `${tilt}deg` } as CSSProperties}>
      {lines.map((line, index) => (
        <span
          className="annotation__line"
          key={line}
          style={{ '--n': index } as CSSProperties}
        >
          {line}
        </span>
      ))}
    </p>
  );
}
