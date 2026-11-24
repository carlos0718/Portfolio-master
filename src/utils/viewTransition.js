import { flushSync } from 'react-dom';

/**
 * Progressive-enhancement wrapper for the native View Transitions API
 * (Modern Web Guidance 1.0). Respects `prefers-reduced-motion` and falls back
 * seamlessly in browsers without `document.startViewTransition`.
 */
export function runViewTransition(updateFn) {
  if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function') {
    updateFn();
    return;
  }

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    updateFn();
    return;
  }

  document.startViewTransition(() => {
    flushSync(() => {
      updateFn();
    });
  });
}
