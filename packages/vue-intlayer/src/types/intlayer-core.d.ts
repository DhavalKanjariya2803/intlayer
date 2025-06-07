declare module '@intlayer/core' {
  export interface Dictionary {
    [key: string]: any;
  }

  export interface ContentValue {
    type: string;
    value: any;
  }

  export interface DictionaryContent {
    [key: string]: ContentValue | DictionaryContent;
  }

  export function getDictionary<T extends Dictionary>(
    dictionary: T,
    locale: string
  ): T;

  export function getIntlayer<T = any>(
    key: string,
    locale?: string
  ): T | undefined;
}
