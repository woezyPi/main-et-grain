import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { brand, type NavLink } from '../../data/hero';
import { Arrow, Bag, Search } from './icons';

const FOCUSABLE = 'a[href], button:not([disabled])';

type Props = {
  links: NavLink[];
  /** Items currently in the bag. */
  bagCount?: number;
};

/**
 * The Hero's masthead — it sits on the photograph rather than above it.
 *
 * Below the masthead breakpoint the four links collapse into a sheet, which
 * behaves like one: the page behind is made inert and unreachable by both
 * pointer and screen reader, Tab cycles inside the sheet, Escape closes it,
 * and focus returns to the button that opened it.
 */
export function HeroNav({ links, bagCount = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const titleId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const toggle = toggleRef.current;
    const root = document.getElementById('root');
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    root?.setAttribute('inert', '');

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const sheet = sheetRef.current;
      if (!sheet) return;
      const items = sheet.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const outside = !sheet.contains(active);

      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    // The sheet exists only for as long as the toggle does, and CSS owns the
    // width at which that stops being true. Rather than repeating the
    // breakpoint here — two copies of a number drift apart — watch the button
    // itself: once a widening viewport takes it away, the page must not stay
    // locked behind a panel CSS has already hidden.
    const watchToggle = new ResizeObserver(() => {
      if (toggle && toggle.offsetParent === null) setOpen(false);
    });
    if (toggle) watchToggle.observe(toggle);

    return () => {
      watchToggle.disconnect();
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      root?.removeAttribute('inert');
      // Only on close, not on unmount: focusing a detaching tree strands it.
      if (toggle?.isConnected) toggle.focus();
    };
  }, [open]);

  const bag = (
    <a className="nav__bag" href="/bag">
      <Bag className="nav__glyph" />
      <span className="nav__badge">{bagCount}</span>
      <span className="visually-hidden">items in bag</span>
    </a>
  );

  return (
    <header className="nav">
      <a className="wordmark" href="/" aria-label={`${brand.name} — home`}>
        {brand.name}
      </a>

      <nav className="nav__links" aria-label="Primary">
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>
                {link.label}
                <Arrow className="nav__arrow" />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav__actions">
        <a className="nav__action" href="/search" aria-label="Search">
          <Search className="nav__glyph" />
        </a>
        {bag}
      </div>

      <div className="nav__compact">
        {bag}
        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls={open ? sheetId : undefined}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          Menu
        </button>
      </div>

      {/* Portalled to the body: the masthead is a transformed element, which
          would make it the containing block for a fixed child and shrink the
          sheet down to the width of the bar. */}
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id={sheetId}
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            ref={sheetRef}
          >
            <div className="sheet__bar">
              <span className="wordmark" id={titleId}>
                {brand.name}
              </span>
              <button
                ref={closeRef}
                type="button"
                className="nav__toggle"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <nav className="sheet__links" aria-label="Primary, expanded">
              <ul>
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} onClick={() => setOpen(false)}>
                      {link.label}
                      <Arrow className="sheet__arrow" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="sheet__foot">
              <a href="/search">Search</a>
              <a href="/bag">Bag ({bagCount})</a>
              <p className="sheet__coords">{brand.coordinates}</p>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
