import { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ProductScene } from '../three/ProductScene';
import { hero } from '../../data/content';

/**
 * Hero — cinematic intro choreographed with a single GSAP Timeline
 * (requirement #6): eyebrow → title → subtitle → 3D product → light → CTAs.
 * Background combines a faint dotted grid, soft gradient blooms and the
 * Three.js scene with its scroll-driven PointLight.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const scope = root.current;

    const ctx = gsap.context(() => {
      const els = {
        eyebrow: scope.querySelector('[data-hero="eyebrow"]'),
        title: scope.querySelectorAll('[data-hero="title-word"]'),
        sub: scope.querySelector('[data-hero="sub"]'),
        scene: scope.querySelector('[data-hero="scene"]'),
        glow: scope.querySelector('[data-hero="glow"]'),
        cta: scope.querySelectorAll('[data-hero="cta"]'),
        hint: scope.querySelector('[data-hero="hint"]'),
      };

      if (reduced) {
        gsap.set(Object.values(els).flat() as Element[], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // The master intro timeline — reads like a short film.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 });

      tl.from(els.eyebrow, { y: 20, opacity: 0, duration: 0.8 })
        .from(
          els.title,
          { yPercent: 120, opacity: 0, duration: 1, stagger: 0.12 },
          '-=0.4'
        )
        .from(els.sub, { y: 24, opacity: 0, duration: 0.9 }, '-=0.6')
        // 3D product scales + fades in like a hero shot.
        .from(els.scene, { scale: 0.82, opacity: 0, duration: 1.4, ease: 'power2.out' }, '-=0.8')
        // Light bloom blossoms behind the product.
        .from(els.glow, { scale: 0.4, opacity: 0, duration: 1.6, ease: 'power2.out' }, '<')
        .from(els.cta, { y: 20, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.9')
        .from(els.hint, { opacity: 0, duration: 0.8 }, '-=0.3');
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ivory pt-16"
    >
      {/* Background layers: dotted grid + soft gradient blooms (no flat fill). */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <div
        data-hero="glow"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(109,74,255,0.18), rgba(39,211,224,0.10) 40%, transparent 70%)',
        }}
      />

      <div className="section-shell relative z-10 grid items-center gap-10 py-12 md:grid-cols-2 md:gap-6">
        {/* Copy column */}
        <div className="order-2 md:order-1">
          <span data-hero="eyebrow" className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" />
            {hero.eyebrow}
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tightest sm:text-5xl lg:text-6xl">
            {hero.titleLines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                {line.split(' ').map((w, j) => (
                  <span key={j} className="inline-block overflow-hidden align-bottom">
                    <span data-hero="title-word" className="inline-block">
                      {w}{' '}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p
            data-hero="sub"
            className="mt-6 max-w-md text-base leading-relaxed text-ink/60 sm:text-lg"
          >
            {hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              data-hero="cta"
              href={hero.primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-ivory shadow-[0_12px_32px_-12px_rgba(31,79,255,0.5)] transition-all duration-500 ease-smooth hover:-translate-y-0.5"
            >
              {hero.primaryCta.label}
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </a>
            <a
              data-hero="cta"
              href={hero.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-sm font-medium text-ink/80 transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:border-ink/40"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* 3D product column */}
        <div className="order-1 md:order-2">
          <div
            data-hero="scene"
            className="relative mx-auto aspect-square w-full max-w-[34rem]"
          >
            <ProductScene className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        data-hero="hint"
        className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 text-center"
      >
        <div className="mx-auto flex h-9 w-5 items-start justify-center rounded-full border border-ink/20 p-1">
          <span className="h-2 w-1 animate-float rounded-full bg-ink/40" />
        </div>
        <span className="mt-2 block text-[10px] uppercase tracking-[0.25em] text-ink/40">Scroll</span>
      </div>
    </section>
  );
}
