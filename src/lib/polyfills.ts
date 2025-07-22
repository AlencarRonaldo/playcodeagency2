// Global polyfill for CommonJS compatibility in browser
if (typeof window !== 'undefined' && typeof exports === 'undefined') {
  (window as any).exports = {};
  (window as any).module = { exports: {} };
}