import { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ProductScene } from '../three/ProductScene';
import { LottiePlayer } from '../ui/LottiePlayer';
import { cta } from '../../data/content';

/**
 * Final CTA — a dark, premium close. The Three.js scene (with its scroll-
 * driven PointLights) sits faintly behind the copy for the "UVC glow", a
 * small Lottie animation signals "system ready" (requirement #18), and the
 * buttons carry a refined hover.
 */
export function CTA() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-cta-el]', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="cta"
      ref={root}
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-ink text-ivory"
    >
      {/* WebGL PointLight glow behind the copy (subtle, blurred). */}
      <div className="pointer-events-none absolute inset-0 opacity-50 blur-[2px]">
        <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2">
          <ProductScene className="h-full w-full" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-40" />
      {/* radial vignette to keep text legible over the scene */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(10,12,16,0.85)_80%)]" />

      <div className="section-shell relative z-10 text-center">
        <div data-cta-el className="mx-auto mb-6 h-16 w-16">
          {/* Placeholder Lottie — swap /public/lottie/processing.json freely. */}
          <LottiePlayer src="/lottie/processing.json" ariaLabel="システム稼働中" />
        </div>

        <span data-cta-el className="eyebrow !text-ivory/50">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
          {cta.eyebrow}
        </span>

        <h2
          data-cta-el
          className="mx-auto mt-6 max-w-3xl whitespace-pre-line text-4xl font-semibold leading-[1.1] tracking-tightest sm:text-6xl"
        >
          {cta.title}
        </h2>

        <p data-cta-el className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-ivory/60 sm:text-lg">
          {cta.subtitle}
        </p>

        <div data-cta-el className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={cta.primary.href}
            className="group relative overflow-hidden rounded-full bg-ivory px-9 py-4 text-sm font-semibold text-ink transition-all duration-500 ease-smooth hover:-translate-y-0.5"
          >
            {/* sliding gradient sheen on hover */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-ocean/0 via-violet/30 to-cyan/0 transition-transform duration-700 ease-smooth group-hover:translate-x-full" />
            <span className="relative flex items-center gap-2">
              {cta.primary.label}
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </span>
          </a>
          <a
            href={cta.secondary.href}
            className="rounded-full border border-ivory/25 px-9 py-4 text-sm font-medium text-ivory/90 transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:border-ivory/60"
          >
            {cta.secondary.label}
          </a>
        </div>
      </div>
    </section>
  );
}
