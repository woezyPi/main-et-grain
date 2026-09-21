import type { BrewSpec } from '../../data/hero';

type Props = {
  spec: BrewSpec[];
};

/**
 * The house recipe, as the neon label the brand board sticks on everything:
 * a flat acid rectangle, off-square, the figures written on by hand. Not a
 * card — no radius, no shadow, no rules.
 *
 * Only the figures are drawn, the way the board writes them. The keys stay in
 * the markup for anyone listening rather than looking, so the label reads as
 * "Dose, 18 g" instead of a bare number.
 */
export function HeroTechnicalData({ spec }: Props) {
  return (
    <div className="note">
      <dl className="note__inner">
        {spec.map((row) => (
          <div className="note__row" key={row.key}>
            <dt className="visually-hidden">{row.key}</dt>
            <dd>
              {row.value}
              {row.unit ? <span className="note__unit">{row.unit}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
