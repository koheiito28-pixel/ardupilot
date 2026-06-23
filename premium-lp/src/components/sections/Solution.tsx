import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ProductScene } from '../three/ProductScene';
import { Counter } from '../ui/Counter';
import { SplitText } from '../../components/ui/SplitText';
import { solution } from '../../data/content';

/**
 * Solution section — Apple-style "product is pinned, copy advances"
 * (requirements #4 & #5). The 3D product column is pinned while the right
 * column scrolls through each step; the active step cross-fades and the
 * product subtly rotates / scales per step.
 */
export function Solution() {
  const root = useRef<HTMLDivElement>(null);
  const sceneCol = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const steps = solution.steps;

  useIsomorphicLayoutEffect(() => {
    if (!root.current || !sceneCol.current) return;

    // Skip pinning on small screens (stacked layout) and for reduced motion.
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      if (reduced) return;
      const ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>('[data-step]');

        // Pin the product column for the full scroll of the section.
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: sceneCol.current,
          pinSpacing: false,
        });

        // Each step panel fades/slides as it enters; product reacts per step.
        panels.forEach((panel, i) => {
          gsap.fromTo(
            panel,
            { opacity: 0.15, y: 30 },
            {
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 70%',
                end: 'bottom 60%',
                scrub: true,
              },
            }
          );

          // Drive the product scale subtly as each step becomes active.
          ScrollTrigger.create({
            trigger: panel,
            start: 'top 60%',
            end: 'bottom 60%',
            onToggle: (self) => {
              if (self.isActive) {
                gsap.to('[data-solution-product]', {
                  scale: 1 + i * 0.03,
                  duration: 0.8,
                  ease: 'power2.out',
                });
              }
            },
          });
        });
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <section id="solution" className="relative overflow-hidden bg-ink text-ivory">
      {/* faint dark grid for depth */}
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-60" />

      <div ref={root} className="section-shell relative grid gap-10 py-24 md:grid-cols-2 md:gap-16 md:py-0">
        {/* Pinned product column */}
        <div
          ref={sceneCol}
          className="flex h-[60vh] items-center justify-center md:h-screen"
        >
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-violet/30 via-ocean/20 to-cyan/20 blur-3xl" />
            <div data-solution-product className="aspect-square">
              <ProductScene className="h-full w-full" />
            </div>
            <div className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-ivory/40">
              drag to rotate
            </div>
          </div>
        </div>

        {/* Scrolling copy column */}
        <div className="flex flex-col justify-center md:py-[12vh]">
          <span className="eyebrow !text-ivory/50">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            {solution.eyebrow}
          </span>
          <SplitText
            as="h2"
            lines={[solution.title]}
            className="mt-5 max-w-md text-3xl font-semibold leading-tight tracking-tightest sm:text-4xl"
          />

          <div className="mt-10 flex flex-col gap-[18vh] md:mt-16">
            {steps.map((s) => (
              <div key={s.tag} data-step className="max-w-md">
                <span className="inline-flex rounded-full border border-ivory/15 px-3 py-1 text-xs font-medium uppercase tracking-widest text-cyan">
                  {s.tag}
                </span>
                <h3 className="mt-5 text-2xl font-semibold leading-snug sm:text-3xl">{s.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-ivory/60">{s.body}</p>
                <div className="mt-7 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tightest text-gradient">
                    <Counter value={s.metric.value} suffix={s.metric.suffix} decimals={s.metric.value % 1 !== 0 ? (s.metric.value < 1 ? 2 : 1) : 0} />
                  </span>
                  <span className="text-sm text-ivory/50">{s.metric.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
