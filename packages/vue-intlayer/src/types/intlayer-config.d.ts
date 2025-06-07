declare module '@intlayer/config/built' {
  export interface MiddlewareConfig {
    cookieName?: string;
  }

  export interface InternationalizationConfig {
    defaultLocale: string;
    locales: string[];
  }

  export interface Config {
    internationalization: InternationalizationConfig;
    middleware?: MiddlewareConfig;
  }

  const config: Config;
  export default config;
}

declare module '@intlayer/config/client' {
  import type {
    InternationalizationConfig,
    MiddlewareConfig,
  } from '@intlayer/config/built';

  export type LocalesValues = string;

  export const configuration: {
    internationalization: InternationalizationConfig;
    middleware?: MiddlewareConfig;
  };
}
