import { useEffect, useRef } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface LottiePlayerProps {
  /** Path to a Lottie JSON file (placeholder lives in /public/lottie). */
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Thin wrapper around lottie-web (requirement #18).
 *
 * To swap the animation: drop a new After Effects export into
 * /public/lottie/ and pass its path as `src`. The bundled placeholder
 * (processing.json) is a simple, license-free loader generated for this demo.
 */
export function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  className = '',
  ariaLabel = 'animation',
}: LottiePlayerProps) {
  const container = useRef<HTMLDivElement>(null);
  const anim = useRef<AnimationItem | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!container.current) return;

    anim.current = lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop,
      autoplay: autoplay && !reduced, // honor reduced-motion: render first frame only
      path: src,
    });

    // For reduced motion, jump to a representative frame and stop.
    if (reduced) {
      anim.current.addEventListener('DOMLoaded', () => anim.current?.goToAndStop(30, true));
    }

    return () => {
      anim.current?.destroy();
      anim.current = null;
    };
  }, [src, loop, autoplay, reduced]);

  return <div ref={container} className={className} role="img" aria-label={ariaLabel} />;
}
