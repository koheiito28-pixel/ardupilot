import { useRef, useState } from 'react';
import { Flip } from '../../lib/gsap';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SplitText } from '../ui/SplitText';
import { features } from '../../data/content';

const accentMap: Record<string, string> = {
  ocean: 'from-ocean/15 to-ocean/0 text-ocean',
  violet: 'from-violet/15 to-violet/0 text-violet',
  emerald: 'from-emerald/15 to-emerald/0 text-emerald',
  cyan: 'from-cyan/20 to-cyan/0 text-cyan',
};

/**
 * Feature section — a buttery horizontal scroll-snap rail (requirement #3).
 * Clicking a card FLIP-expands it into a centered detail panel and back again
 * (requirement #14), for an app-like feel.
 */
export function Features() {
  const [openId, setOpenId] = useState<string | null>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const reduced = useReducedMotion();

  const toggle = (id: string) => {
    // Capture geometry of all cards BEFORE the layout changes, then flip.
    flipState.current = Flip.getState('[data-fcard]', { props: 'borderRadius' });
    setOpenId((prev) => (prev === id ? null : id));
  };

  useIsomorphicLayoutEffect(() => {
    if (!flipState.current || reduced) return;
    Flip.from(flipState.current, {
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      scale: false,
    });
  }, [openId, reduced]);

  return (
    <section id="features" className="relative bg-ivory py-28 md:py-36">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-ocean" />
              {features.eyebrow}
            </span>
            <SplitText
              as="h2"
              lines={[features.title]}
              className="mt-5 text-3xl font-semibold leading-tight tracking-tightest sm:text-4xl"
            />
          </div>
          <p className="text-sm text-ink/40">← 横にスクロール / カードをタップで詳細 →</p>
        </div>
      </div>

      {/* Horizontal scroll-snap rail */}
      <div className="snap-x-rail mt-12 flex gap-5 overflow-x-auto px-6 pb-6 md:px-10">
        {/* leading spacer keeps first card off the edge */}
        <div className="shrink-0" aria-hidden />
        {features.cards.map((c) => {
          const open = openId === c.id;
          return (
            <article
              key={c.id}
              data-fcard
              data-flip-id={c.id}
              className={
                open
                  ? // expanded: centered fixed overlay
                    'fixed inset-x-4 top-1/2 z-50 mx-auto max-w-2xl -translate-y-1/2 rounded-3xl border border-white/60 bg-white p-8 shadow-2xl sm:p-12'
                  : // rail card
                    'snap-item relative flex h-80 w-72 shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-7 shadow-[0_8px_40px_-12px_rgba(10,12,16,0.12)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_18px_50px_-16px_rgba(31,79,255,0.25)] sm:w-80'
              }
              onClick={() => !open && toggle(c.id)}
            >
              {/* accent gradient wash */}
              <div
                className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${accentMap[c.accent]} opacity-60`}
              />

              <div>
                <span
                  className={`inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide ${accentMap[c.accent].split(' ').pop()}`}
                >
                  {c.summary}
                </span>
                <h3 className={`mt-6 font-semibold leading-snug ${open ? 'text-3xl' : 'text-xl'}`}>
                  {c.title}
                </h3>
              </div>

              {open ? (
                <>
                  <p className="mt-5 text-base leading-relaxed text-ink/65">{c.detail}</p>
                  <button
                    onClick={() => toggle(c.id)}
                    className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-ivory transition-transform hover:-translate-y-0.5"
                  >
                    閉じる ✕
                  </button>
                </>
              ) : (
                <span className="text-sm font-medium text-ink/40">詳しく見る →</span>
              )}
            </article>
          );
        })}
        <div className="w-2 shrink-0" aria-hidden />
      </div>

      {/* Backdrop when a card is expanded */}
      {openId && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm animate-fade-in"
          onClick={() => toggle(openId)}
        />
      )}
    </section>
  );
}
