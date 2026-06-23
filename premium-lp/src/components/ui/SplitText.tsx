import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SplitTextProps {
  /** Lines of text; each line is split into words that fade-up in sequence. */
  lines: string[];
  className?: string;
  /** Element tag to render as the heading. */
  as?: keyof JSX.IntrinsicElements;
  /** When true, animates on scroll into view; otherwise animates immediately. */
  onScroll?: boolean;
  /** Stagger delay between words (seconds). */
  stagger?: number;
  /** Initial delay before the animation starts (seconds). */
  delay?: number;
}

/**
 * Word-by-word "fade up" reveal — the premium, non-typewriter text animation
 * used for headings throughout the page (requirement #10).
 *
 * We deliberately split on words (not characters) to keep it elegant and
 * performant, and we wrap each line so long headings break naturally.
 */
export function SplitText({
  lines,
  className = '',
  as = 'h2',
  onScroll = true,
  stagger = 0.08,
  delay = 0,
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const Tag = as as 'h2';

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const words = ref.current.querySelectorAll<HTMLElement>('[data-word]');

    if (reduced) {
      gsap.set(words, { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(words, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger,
        delay,
        scrollTrigger: onScroll
          ? { trigger: ref.current, start: 'top 82%', once: true }
          : undefined,
      });
    }, ref);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced, onScroll, stagger, delay]);

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden">
          {line.split(' ').map((word, wi) => (
            <span key={wi} className="inline-block overflow-hidden align-bottom">
              <span data-word className="inline-block will-change-transform">
                {word}
                {/* keep the trailing space inside the animated span */}
                {wi < line.split(' ').length - 1 ? ' ' : ''}
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
