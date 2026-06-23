import { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

/**
 * Counts up from 0 → value when scrolled into view (requirement #11).
 * Uses a GSAP tween on a proxy object and writes formatted text each frame.
 */
export function Counter({ value, suffix = '', prefix = '', decimals = 0, className = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (n: number) =>
      `${prefix}${n.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    if (reduced) {
      el.textContent = format(value);
      return;
    }

    const counter = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        n: value,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = format(counter.n);
        },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    }, ref);

    el.textContent = format(0);
    return () => ctx.revert();
  }, [value, suffix, prefix, decimals, reduced]);

  return <span ref={ref} className={className} />;
}
