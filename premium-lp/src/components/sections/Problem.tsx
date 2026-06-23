import { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SplitText } from '../ui/SplitText';
import { problem } from '../../data/content';

/**
 * Problem section — challenge cards revealed with a staggered fade/slide
 * (requirements #7 & #8). Restrained motion: cards lift gently into place.
 */
export function Problem() {
  const grid = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!grid.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-problem-card]', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: grid.current, start: 'top 78%', once: true },
      });
    }, grid);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="problem" className="relative bg-ivory py-28 md:py-36">
      <div className="section-shell">
        <div className="max-w-2xl">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            {problem.eyebrow}
          </span>
          <SplitText
            as="h2"
            lines={[problem.title]}
            className="mt-5 text-3xl font-semibold leading-tight tracking-tightest sm:text-4xl"
          />
          <p className="mt-5 text-base leading-relaxed text-ink/55 sm:text-lg">{problem.subtitle}</p>
        </div>

        <div ref={grid} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problem.cards.map((c) => (
            <article
              key={c.icon}
              data-problem-card
              className="group glass flex flex-col p-7 transition-transform duration-500 ease-smooth hover:-translate-y-1"
            >
              <span className="text-sm font-medium tracking-widest text-ink/30">{c.icon}</span>
              <h3 className="mt-6 text-lg font-semibold leading-snug">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/55">{c.body}</p>
              <span className="mt-6 h-px w-10 bg-gradient-to-r from-violet to-cyan transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
