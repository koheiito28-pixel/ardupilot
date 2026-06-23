import { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SplitText } from '../ui/SplitText';
import { process } from '../../data/content';

/**
 * Process section — the connecting line is "drawn" with an SVG stroke-dash
 * animation (requirement #12) and a glowing data packet travels along that
 * exact path using MotionPathPlugin (requirement #13). Steps stagger in.
 */
export function Process() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!root.current || reduced) return;

    const ctx = gsap.context(() => {
      const path = root.current!.querySelector<SVGPathElement>('#process-path');
      const packet = root.current!.querySelector<SVGCircleElement>('#process-packet');

      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        // Draw the line as the section enters view.
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        });
      }

      // Send a data packet repeatedly along the path (future-tech flow).
      if (path && packet) {
        gsap.to(packet, {
          duration: 4,
          repeat: -1,
          ease: 'none',
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
        });
      }

      // Stagger the step cards.
      gsap.from('[data-process-step]', {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: { trigger: root.current, start: 'top 65%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="process" className="relative overflow-hidden bg-ivory py-28 md:py-36">
      <div ref={root} className="section-shell">
        <div className="max-w-2xl">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            {process.eyebrow}
          </span>
          <SplitText
            as="h2"
            lines={[process.title]}
            className="mt-5 text-3xl font-semibold leading-tight tracking-tightest sm:text-4xl"
          />
          <p className="mt-5 text-base leading-relaxed text-ink/55 sm:text-lg">{process.subtitle}</p>
        </div>

        {/* SVG connector line drawn behind the steps (desktop). */}
        <div className="relative mt-20">
          <svg
            className="pointer-events-none absolute inset-x-0 top-10 hidden h-24 w-full md:block"
            viewBox="0 0 1000 100"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="process-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1f4fff" />
                <stop offset="50%" stopColor="#6d4aff" />
                <stop offset="100%" stopColor="#27d3e0" />
              </linearGradient>
            </defs>
            <path
              id="process-path"
              d="M 125 50 C 290 10, 380 90, 500 50 S 710 10, 875 50"
              stroke="url(#process-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* glowing data packet that rides the path */}
            <circle id="process-packet" r="6" fill="#27d3e0">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </svg>

          <ol className="relative grid gap-8 md:grid-cols-4 md:gap-5">
            {process.steps.map((s) => (
              <li
                key={s.no}
                data-process-step
                className="glass relative flex flex-col p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-sm font-semibold text-ivory">
                  {s.no}
                </span>
                <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
