/**
 * Returns the browser window object if available, otherwise null.
 * Use this to guard all code that must only run in the browser (never SSR).
 */
// PUBLIC_INTERFACE
export function getBrowser(): Window | null {
  try {
    // eslint-disable-next-line no-undef
    return typeof window !== 'undefined' ? window : null;
  } catch {
    return null;
  }
}
