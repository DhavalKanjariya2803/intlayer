/// <reference types="vite/client" />

// Vue files
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Environment variables
declare module '*.env' {
  export const VITE_APP_TITLE: string;
  // Add other environment variables here
}
