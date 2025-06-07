import configuration from '@intlayer/config/built';
import type { LocalesValues } from '@intlayer/config/client';
import { computed, inject, ref } from 'vue';

// Simple implementation of useChangedContent
const useChangedContent = <T = any>() => {
  const changedContent = ref<Record<string, T> | null>(null);

  const setChangedContent = (content: Record<string, T> | null) => {
    changedContent.value = content;
  };

  return {
    changedContent,
    setChangedContent,
  };
};

// Type for the dictionary content
type DeepTransformContent<T> = T extends object
  ? { [K in keyof T]: DeepTransformContent<T[K]> }
  : T;

// Type for the dictionary keys
type DictionaryKeys = string;

// Type for the dictionary types connector
type IntlayerDictionaryTypesConnector = Record<string, { content: any }>;

import { getDictionary } from './getDictionary';
import { getIntlayer } from './getIntlayer';
import { IntlayerClientKey } from './IntlayerProvider';

/**
 * Composable that picks one dictionary by its key and returns the content
 *
 * @param key - The dictionary key
 * @param locale - The target locale (optional, defaults to current locale from context)
 * @returns The transformed dictionary content for the specified key and locale
 */
export const useIntlayer = <T extends DictionaryKeys>(
  key: T,
  locale?: LocalesValues
): DeepTransformContent<IntlayerDictionaryTypesConnector[T]['content']> => {
  const context = inject(IntlayerClientKey, {
    locale: (configuration?.internationalization?.defaultLocale ||
      'en') as LocalesValues,
    setLocale: (() => {}) as (locale: LocalesValues) => void,
    disableEditor: false,
  });

  const { changedContent } = useChangedContent();
  const localeTarget = locale ?? context.locale;

  return computed(() => {
    const content = changedContent.value?.[key];
    if (content) {
      // @ts-ignore fix instantiation is excessively deep and possibly infinite
      return getDictionary(content, localeTarget);
    }

    return getIntlayer(key, localeTarget);
  });
};

export default useIntlayer;
