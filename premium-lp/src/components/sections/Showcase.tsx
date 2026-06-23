import { useRef } from 'react';
import { gsap, ScrollTrigger, Observer } from '../../lib/gsap';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ProductScene } from '../three/ProductScene';
import { showcase } from '../../data/content';

const toneMap: Record<string, string> = {
  ocean: 'from-ocean/25 to-ocean/0',
  violet: 'from-violet/25 to-violet/0',
  emerald: 'from-emerald/25 to-emerald/0',
  cyan: 'from-cyan/30 to-cyan/0',
};

/**
 * Showcase section — the product lineup scrolls HORIZONTALLY as the user
 * scrolls vertically (requirement #16), driven by a pinned ScrollTrigger.
 * An Observer adds a velocity-based skew for inertial, iPhone-like feel
 * (requirement #17), and the first tile is a live 360° 3D product
 * (requirement #1). Cards parallax slightly for depth (requirement #15).
 */
export function Showcase() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!root.current || !track.current) return;

    const mm = gsap.matchMedia();

    // Desktop & tablet: pinned vertical→horizontal scroll.
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const trackEl = track.current!;
        const getScrollAmount = () => trackEl.scrollWidth - window.innerWidth;

        const tween = gsap.to(trackEl, {
          x: () => -getScrollAmount(),
          ease: 'none',
        });

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1, // smoothing → buttery, slightly inertial
          animation: tween,
          invalidateOnRefresh: true,
        });

        // Velocity-driven skew for an inertial, weighty feel.
        const skewSetter = gsap.quickTo(trackEl, 'skewX', { duration: 0.4, ease: 'power3' });
        const obs = Observer.create({
          target: window,
          type: 'wheel,touch',
          onChangeY: (self) => {
            const v = gsap.utils.clamp(-8, 8, self.velocityY / 300);
            skewSetter(v);
            gsap.to(trackEl, { skewX: 0, duration: 0.8, ease: 'power3', overwrite: 'auto' });
          },
        });

        return () => {
          st.kill();
          obs.kill();
        };
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <section id="showcase" ref={root} className="relative overflow-hidden bg-ivory">
      {/* Header overlay (stays put while track scrolls on desktop). */}
      <div className="section-shell pt-24 md:absolute md:left-1/2 md:top-12 md:z-20 md:-translate-x-1/2 md:pt-0">
        <div className="text-center md:text-left">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" />
            {showcase.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tightest sm:text-4xl">
            {showcase.title}
          </h2>
        </div>
      </div>

      {/* Horizontal track. On mobile it falls back to a native scroll-snap rail. */}
      <div
        ref={track}
        className="snap-x-rail flex items-center gap-6 overflow-x-auto px-6 py-24 will-change-transform md:overflow-visible md:px-[12vw] md:py-40"
      >
        {/* Tile 0 — live 360° 3D product */}
        <div className="snap-item relative flex h-[26rem] w-[20rem] shrink-0 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_8px_40px_-12px_rgba(10,12,16,0.12)] backdrop-blur-xl sm:w-[24rem]">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet">
            360° Interactive
          </span>
          <div className="relative flex-1">
            <ProductScene className="h-full w-full" />
          </div>
          <p className="text-center text-xs text-ink/40">ドラッグ / スワイプで回転</p>
        </div>

        {/* Lineup tiles */}
        {showcase.items.map((item) => (
          <article
            key={item.name}
            className="snap-item group relative flex h-[26rem] w-[20rem] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/60 bg-white p-8 shadow-[0_8px_40px_-12px_rgba(10,12,16,0.12)] sm:w-[24rem]"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b ${toneMap[item.tone]} opacity-70`}
            />
            <div className="relative">
              <span className="inline-flex rounded-full bg-ink/5 px-3 py-1 text-xs font-medium tracking-wide text-ink/60">
                {item.tag}
              </span>
            </div>
            {/* placeholder "product" visual — swap for a real <img> */}
            <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white to-mist shadow-inner" />
              <div className="relative h-20 w-20 rounded-2xl bg-ink/90 shadow-lg transition-transform duration-700 ease-smooth group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <div className="relative">
              <h3 className="text-2xl font-semibold tracking-tightest">{item.name}</h3>
              <p className="mt-2 text-sm text-ink/55">{item.spec}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
