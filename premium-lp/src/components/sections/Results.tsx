import { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SplitText } from '../ui/SplitText';
import { Counter } from '../ui/Counter';
import { results } from '../../data/content';

/**
 * Results section — headline metrics count up from 0 (requirement #11), and
 * the Before/After panel reveals via a clip-path "wipe" (requirement #9).
 */
export function Results() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      // Stagger the stat blocks.
      gsap.from('[data-stat]', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-stats]', start: 'top 80%', once: true },
      });

      // Clip-path reveal of the before/after panel (mask opens left→right).
      gsap.fromTo(
        '[data-reveal]',
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.3,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '[data-reveal]', start: 'top 78%', once: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const ba = results.beforeAfter;

  return (
    <section id="results" className="relative bg-ink py-28 text-ivory md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-50" />
      <div ref={root} className="section-shell relative">
        <div className="max-w-2xl">
          <span className="eyebrow !text-ivory/50">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            {results.eyebrow}
          </span>
          <SplitText
            as="h2"
            lines={[results.title]}
            className="mt-5 text-3xl font-semibold leading-tight tracking-tightest sm:text-4xl"
          />
          <p className="mt-5 text-base leading-relaxed text-ivory/55 sm:text-lg">{results.subtitle}</p>
        </div>

        {/* Counter grid */}
        <div data-stats className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {results.stats.map((s) => (
            <div key={s.label} data-stat className="border-l border-ivory/15 pl-6">
              <div className="text-4xl font-semibold tracking-tightest text-gradient sm:text-5xl">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="mt-3 text-sm text-ivory/55">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Before / After reveal panel */}
        <div
          data-reveal
          className="mt-16 grid items-stretch gap-px overflow-hidden rounded-3xl border border-ivory/10 bg-ivory/5 sm:grid-cols-2"
        >
          <div className="p-10">
            <span className="text-xs uppercase tracking-[0.25em] text-ivory/40">{ba.before.label}</span>
            <div className="mt-6 text-5xl font-semibold tracking-tightest text-ivory/70">
              {ba.before.value}
            </div>
            <p className="mt-3 text-sm text-ivory/50">{ba.before.caption}</p>
          </div>
          <div className="relative bg-gradient-to-br from-violet/20 via-ocean/10 to-cyan/10 p-10">
            <span className="text-xs uppercase tracking-[0.25em] text-cyan">{ba.after.label}</span>
            <div className="mt-6 text-5xl font-semibold tracking-tightest text-gradient">
              {ba.after.value}
            </div>
            <p className="mt-3 text-sm text-ivory/60">{ba.after.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
