import type { BrewSpec } from '../../data/hero';

type Props = {
  spec: BrewSpec[];
};

/**
 * The house recipe, as the neon label the brand board sticks on everything:
 * an acid rectangle, off-square, the figures written on by hand.
 *
 * Not a card. It is a sheet of paper put on the photograph by hand — stuck
 * along its top edge, lifting at the bottom, with the tooth and the cast
 * shadow that go with that. All of it lives in `hero.css`; this component
 * supplies the figures and the one filter that keeps the paper off the grid.
 *
 * Only the figures are drawn, the way the board writes them. The keys stay in
 * the markup for anyone listening rather than looking, so the label reads as
 * "Dose, 18 g" instead of a bare number.
 */
export function HeroTechnicalData({ spec }: Props) {
  return (
    <div className="note">
      {/* No sheet of paper has a straight edge. The turbulence displaces the
          paper layer — fill, raking light, tooth and cast shadow together —
          so the outline bows and wanders the way a cut edge does. It is
          declared here rather than in `HeroVisual`, whose `#mg-rough` twin
          only exists on the days the photograph is missing. */}
      <svg className="note__defs" aria-hidden="true" focusable="false">
        <filter
          id="mg-paper"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          filterUnits="objectBoundingBox"
        >
          {/* Different frequency across and down: paper buckles along its
              grain, it does not ripple evenly like water. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013 0.02"
            numOctaves="2"
            seed="11"
            result="paper"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="paper"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

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
