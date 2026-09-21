import { useEffect, type RefObject } from 'react';

/** Below this, the pointer reading has converged and the loop can stop. */
const EPSILON = 0.0008;
/** Per-frame approach rate. Lower is heavier. */
const DAMPING = 0.12;

type Options = {
  /** The element whose box defines the pointer field and the scroll travel. */
  bounds: RefObject<HTMLElement | null>;
  /** The element the custom properties are written to. */
  target: RefObject<HTMLElement | null>;
  enabled: boolean;
};

/**
 * Feeds three normalised values into the Hero as CSS custom properties:
 *
 *   --px      pointer X within the hero,  -1 .. 1
 *   --py      pointer Y within the hero,  -1 .. 1
 *   --scroll  how far the hero has been scrolled, 0 .. 1
 *
 * Everything that reacts to them does so in CSS, so a single rAF write per
 * frame drives the whole composition. No layout is read during scroll — the
 * hero's box is measured on resize and cached.
 *
 * The values are written to `target`, not to the hero, because they are
 * inherited custom properties: writing them high in the tree would invalidate
 * the computed style of every descendant three times a frame, and only the
 * plate and the things pinned to it read them.
 *
 * Smoothing happens here rather than through a CSS transition. A transition
 * retargeted every frame never converges and lags the pointer by a third of a
 * second; an explicit lerp is interruptible and stops when it arrives.
 *
 * Pointer tracking is fine-pointer only and follows the device if that
 * changes; scroll tracking pauses while the hero is off-screen. Everything is
 * skipped when `enabled` is false, which is how `prefers-reduced-motion` is
 * honoured.
 */
export function useHeroMotion({ bounds, target, enabled }: Options): void {
  useEffect(() => {
    const el = bounds.current;
    const out = target.current;
    if (!el || !out || !enabled) return;

    let frame = 0;
    let px = 0;
    let py = 0;
    let toX = 0;
    let toY = 0;
    let scroll = 0;
    let written = { x: NaN, y: NaN, s: NaN };

    // Document-relative, so a page that has been scrolled does not skew the
    // pointer reading: the viewport-relative top is `docTop - scrollY`.
    let docTop = 0;
    let left = 0;
    let width = 0;
    let height = 0;
    let visible = true;

    const write = () => {
      if (px !== written.x) out.style.setProperty('--px', px.toFixed(4));
      if (py !== written.y) out.style.setProperty('--py', py.toFixed(4));
      if (scroll !== written.s) {
        out.style.setProperty('--scroll', scroll.toFixed(4));
      }
      written = { x: px, y: py, s: scroll };
    };

    const tick = () => {
      px += (toX - px) * DAMPING;
      py += (toY - py) * DAMPING;
      const settled =
        Math.abs(toX - px) < EPSILON && Math.abs(toY - py) < EPSILON;
      if (settled) {
        px = toX;
        py = toY;
      }
      write();
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const measure = () => {
      const box = el.getBoundingClientRect();
      docTop = box.top + window.scrollY;
      left = box.left;
      width = box.width;
      height = box.height;
    };

    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      if (!width || !height) return;
      const top = docTop - window.scrollY;
      const x = (event.clientX - left) / width;
      const y = (event.clientY - top) / height;
      // Outside the hero the field rests rather than pinning to a corner.
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      toX = inside ? x * 2 - 1 : 0;
      toY = inside ? y * 2 - 1 : 0;
      schedule();
    };

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

    const fine = window.matchMedia('(pointer: fine)');
    const bindPointer = () => {
      if (fine.matches) {
        window.addEventListener('pointermove', onPointerMove, {
          passive: true,
        });
      } else {
        window.removeEventListener('pointermove', onPointerMove);
        toX = 0;
        toY = 0;
        schedule();
      }
    };

    measure();
    onScroll();
    bindPointer();
    fine.addEventListener('change', bindPointer);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
      fine.removeEventListener('change', bindPointer);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      out.style.removeProperty('--px');
      out.style.removeProperty('--py');
      out.style.removeProperty('--scroll');
    };
  }, [bounds, target, enabled]);
}
