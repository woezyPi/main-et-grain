import { useEffect, type RefObject } from 'react';

/**
 * Feeds three normalised values into the Hero as CSS custom properties:
 *
 *   --px      pointer X within the hero,  -1 .. 1
 *   --py      pointer Y within the hero,  -1 .. 1
 *   --scroll  how far the hero has been scrolled past, 0 .. 1
 *
 * Everything that reacts to them does so in CSS, so a single rAF write per
 * frame drives the whole composition. No layout is read during scroll — the
 * hero's box is measured on resize and cached.
 *
 * Pointer tracking is fine-pointer only; scroll tracking pauses while the hero
 * is off-screen. Both are skipped entirely when `enabled` is false, which is
 * how `prefers-reduced-motion: reduce` is honoured.
 */
export function useHeroMotion(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let frame = 0;
    let px = 0;
    let py = 0;
    let scroll = 0;
    let box: DOMRect | null = null;
    let visible = true;

    const commit = () => {
      frame = 0;
      el.style.setProperty('--px', px.toFixed(4));
      el.style.setProperty('--py', py.toFixed(4));
      el.style.setProperty('--scroll', scroll.toFixed(4));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(commit);
    };

    const measure = () => {
      box = el.getBoundingClientRect();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      if (!box) measure();
      if (!box || !box.width || !box.height) return;
      // Clamped so a pointer that leaves the hero never overshoots the range.
      px = Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1));
      py = Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height) * 2 - 1));
      schedule();
    };

    const onPointerLeave = () => {
      px = 0;
      py = 0;
      schedule();
    };

    const onScroll = () => {
      if (!visible) return;
      const travel = el.offsetHeight || 1;
      scroll = Math.max(0, Math.min(1, window.scrollY / travel));
      schedule();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          measure();
          onScroll();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);

    measure();
    onScroll();

    if (finePointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      el.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      if (finePointer) {
        window.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerleave', onPointerLeave);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      el.style.removeProperty('--px');
      el.style.removeProperty('--py');
      el.style.removeProperty('--scroll');
    };
  }, [ref, enabled]);
}
