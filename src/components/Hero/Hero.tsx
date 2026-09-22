import { useRef } from 'react';

import {
  brewSpec as defaultSpec,
  heroContent,
  navLinks as defaultNav,
  type BrewSpec,
  type CtaLink,
  type NavLink,
} from '../../data/hero';
import { useHeroMotion } from '../../hooks/useHeroMotion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { HeroAnnotation } from './HeroAnnotation';
import { HeroTechnicalData } from './HeroTechnicalData';
import { HeroVisual } from './HeroVisual';
import { Arrow } from './icons';
import './hero.css';

export type HeroProps = {
  eyebrow?: string;
  title?: [string, string];
  description?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  annotation?: string[];
  nav?: NavLink[];
  spec?: BrewSpec[];
  /**
   * The Hero photograph — a pour in progress, shot dark. Without one the
   * object is drawn instead; see HeroVisual.
   */
  image?: string;
  /**
   * Candidate widths for the same photograph. The plate is full-bleed, so a
   * phone has no business fetching the widest one; `sizes` stays `100vw`
   * unless the composition stops spanning the viewport.
   */
  imageSrcSet?: string;
  imageSizes?: string;
  imageAlt?: string;
};

export function Hero({
  eyebrow = heroContent.eyebrow,
  title = heroContent.title,
  description = heroContent.description,
  primaryCta = heroContent.primaryCta,
  secondaryCta = heroContent.secondaryCta,
  annotation = heroContent.annotation,
  nav = defaultNav,
  spec = defaultSpec,
  image,
  imageSrcSet,
  imageSizes = '100vw',
  imageAlt = '',
}: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  useHeroMotion({ bounds: ref, target: stageRef, enabled: !reduced });

  return (
    <section
      className={image ? 'hero hero--photo' : 'hero'}
      ref={ref}
      aria-labelledby="hero-title"
    >
      <div className="hero__media" ref={stageRef}>
        {image ? (
          <img
            className="hero__photo"
            src={image}
            srcSet={imageSrcSet}
            sizes={imageSrcSet ? imageSizes : undefined}
            alt={imageAlt}
            // It is the largest thing on the page and the first thing seen.
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <HeroVisual />
        )}
        {image ? <div className="hero__scrim" aria-hidden="true" /> : null}
      </div>

      <div className="hero__body">
        {/* The whole of the Hero's navigation. There is no masthead above it:
            the index of the shop is set quietly in the margin and nowhere
            else, so it has to carry at every width rather than appear once
            the poster does. */}
        <nav className="rail" aria-label="Sections">
          <ul>
            {nav.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="hero__eyebrow">{eyebrow}</p>

        <h1 className="hero__title" id="hero-title">
          {title.map((line, index) => (
            <span className="hero__title-line" key={index}>
              <span className="hero__title-word">{line}</span>
            </span>
          ))}
        </h1>

        <HeroAnnotation lines={annotation} tilt={-3} />

        <HeroTechnicalData spec={spec} />

        <div className="hero__copy">
          <p className="hero__description">{description}</p>
        </div>

        <div className="hero__actions">
          <a className="cta cta--primary" href={primaryCta.href}>
            {primaryCta.label}
            <Arrow className="cta__arrow" />
          </a>
          <a className="cta cta--secondary" href={secondaryCta.href}>
            {secondaryCta.label}
            <Arrow className="cta__arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
