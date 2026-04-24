/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    dataLayer: any[];
  }
  function gtag(...args: any[]): void;
}
