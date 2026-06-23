import { useEffect, useState } from 'react';
import { brand, nav } from '../../data/content';

/**
 * Sticky top navigation. Goes from transparent (over the hero) to a frosted
 * glass bar once the user scrolls — a clean, Linear-like behaviour.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth ${
        scrolled ? 'border-b border-ink/5 bg-ivory/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="section-shell flex h-16 items-center justify-between">
        <a href="#top" className="text-lg font-semibold tracking-tightest">
          {brand.name}
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-violet align-middle" />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-ink/60 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={nav.cta.href}
          className="hidden rounded-full bg-ink px-5 py-2 text-sm font-medium text-ivory transition-transform duration-300 hover:-translate-y-0.5 md:inline-block"
        >
          {nav.cta.label}
        </a>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="メニュー"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? 'top-2 rotate-45' : 'top-0'}`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? 'top-2 -rotate-45' : 'top-4'}`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-ink/5 bg-ivory/95 backdrop-blur-xl transition-all duration-500 ease-smooth md:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="section-shell flex flex-col gap-1 py-4">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base text-ink/80"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={nav.cta.href}
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-ink py-3 text-center text-base font-medium text-ivory"
            >
              {nav.cta.label}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
