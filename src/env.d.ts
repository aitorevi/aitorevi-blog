/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    dataLayer: any[];
    /** Lazily injects /retro.css once; exposed by the inline head script in Layout.astro. */
    __loadRetroCss?: () => void;
  }
  function gtag(...args: any[]): void;
}
