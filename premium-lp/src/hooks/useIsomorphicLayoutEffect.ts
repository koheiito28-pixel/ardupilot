import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect that safely falls back to useEffect on the server, avoiding
 * React's SSR warning. GSAP setup belongs in a layout effect so the DOM is
 * measured before paint.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
