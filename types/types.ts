export interface EmailLink {
    email: string
}

declare global {
  interface Window {
    dataLayer: any[];
  }
  function gtag(...args: any[]): void;
}

export {};  // Esto asegura que TypeScript trate este archivo como un módulo global

