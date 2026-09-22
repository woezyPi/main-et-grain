import {
  browseContent,
  browseRoutes,
  finderContent,
  type BrowseRoute,
} from '../../data/browse';
import { Arrow } from '../Hero/icons';
import './browse.css';

export type BrowseProps = {
  heading?: string;
  routes?: BrowseRoute[];
};

/**
 * "Tu cherches quoi ?" — the first section below the Hero, and the page's
 * first **paper** surface. Everything above is the night; from here down the
 * board's ink and line-work take over, which is why `--paper`, `--ink`,
 * `--cobalt` and `--orange` finally have somewhere to live.
 *
 * Three ways in for anyone who knows what they want, and a fourth panel
 * beside them for anyone who does not. The whole card is the link — frame,
 * tag and caption — so the target is the size of the block rather than of
 * one word, and the tag and the arrow read as a single affordance.
 */
export function Browse({
  heading = browseContent.heading,
  routes = browseRoutes,
}: BrowseProps) {
  return (
    <section className="browse" aria-labelledby="browse-title">
      <div className="browse__inner">
        <div className="browse__routes">
          <h2 className="browse__heading" id="browse-title">
            {heading}
            <Arrow className="browse__heading-arrow" aria-hidden="true" />
          </h2>

          <ul className="browse__list">
            {routes.map((route) => (
              <li className={`card card--${route.tone}`} key={route.href}>
                <a className="card__link" href={route.href}>
                  <span className="card__frame">
                    {route.image ? (
                      <img
                        className="card__photo"
                        src={route.image}
                        alt={route.imageAlt ?? ''}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      /* No photograph yet. The frame keeps its proportion and
                         says so quietly rather than collapsing the row. */
                      <span className="card__blank" aria-hidden="true" />
                    )}
                    <span className="card__tag">
                      {route.label}
                      <Arrow className="card__arrow" />
                    </span>
                  </span>
                  <span className="card__caption">{route.caption}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Separated by a rule rather than a box: the board draws lines, it
            does not build panels. */}
        <div className="finder">
          <p className="finder__question">
            {finderContent.question.map((line) => (
              <span className="finder__question-line" key={line}>
                {line}
              </span>
            ))}
          </p>

          <p className="finder__aside">{finderContent.aside}</p>

          <ul className="finder__reassurance">
            {finderContent.reassurance.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <a className="finder__cta" href={finderContent.cta.href}>
            {finderContent.cta.label}
            <Arrow className="finder__arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
