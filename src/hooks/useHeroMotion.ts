import { useEffect, type RefObject } from 'react';

type Options = {
  /** The element whose box defines the scroll travel. */
  bounds: RefObject<HTMLElement | null>;
  /** The element the custom property is written to. */
  target: RefObject<HTMLElement | null>;
  enabled: boolean;
};

/**
 * Feeds one normalised value into the Hero as a CSS custom property:
 *
 *   --scroll  how far the hero has been scrolled, 0 .. 1
 *
 * Everything that reacts to it does so in CSS, so a single rAF write per
 * frame drives the whole composition. No layout is read during scroll — the
 * hero's box is measured on resize and cached.
 *
 * The value is written to `target`, not to the hero, because it is an
 * inherited custom property: writing it high in the tree would invalidate the
 * computed style of every descendant once a frame, and only the plate reads
 * it.
 *
 * The Hero does not answer the pointer. The photograph holds still under the
 * cursor and moves only with the page, so the one thing that moves is the one
 * thing the reader asked for.
 *
 * Scroll tracking pauses while the hero is off-screen, and the whole hook is
 * skipped when `enabled` is false, which is how `prefers-reduced-motion` is
 * honoured.
 */
export function useHeroMotion({ bounds, target, enabled }: Options): void {
  useEffect(() => {
    const el = bounds.current;
    const out = target.current;
    if (!el || !out || !enabled) return;

    let frame = 0;
    let scroll = 0;
    let written = NaN;

    // Document-relative, so the cached box does not go stale the moment the
    // page is scrolled: the viewport-relative top is `docTop - scrollY`.
    let docTop = 0;
    let height = 0;
    let visible = true;

    // Scroll fires faster than the compositor paints, so the readings are
    // coalesced into one write per frame rather than one per event.
    const write = () => {
      frame = 0;
      if (scroll === written) return;
      out.style.setProperty('--scroll', scroll.toFixed(4));
      written = scroll;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };

    const measure = () => {
      const box = el.getBoundingClientRect();
      docTop = box.top + window.scrollY;
      height = box.height;
    };

    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

    const onScroll = () => {
      if (!visible) return;
      // Progress over one viewport of travel: the hero is as tall as the
      // viewport, so its own height would make this permanently zero until a
      // section exists below it.
      const travel = Math.max(1, Math.min(height, window.innerHeight));
      scroll = clamp01((window.scrollY - docTop) / travel);
      schedule();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          measure();
          onScroll();
          return;
        }
        // Settle at whichever end it left by, rather than freezing mid-value.
        scroll = entry.boundingClientRect.top < 0 ? 1 : 0;
        schedule();
      },
      { threshold: 0 },
    );
    observer.observe(el);

    // Fonts land after first paint and reflow the headline, which changes the
    // hero's height without firing a resize.
    const resizeObserver = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    resizeObserver.observe(el);

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      out.style.removeProperty('--scroll');
    };
  }, [bounds, target, enabled]);
}
