import type { LocalesValues } from '@intlayer/config';
import { Locales } from '@intlayer/config';
import configuration from '@intlayer/config/built';
import type { Dictionary } from '@intlayer/core';
import { computed, inject } from 'vue';
import { getDictionary } from './getDictionary';
import { IntlayerClientKey } from './IntlayerProvider';

/**
 * Composable that transforms a dictionary and returns the content
 *
 * @param dictionary - The dictionary to transform
 * @param locale - The target locale (optional, defaults to current locale from context)
 * @returns The transformed dictionary content for the specified locale
 */
export const useDictionary = <T extends Dictionary>(
  dictionary: T,
  locale?: LocalesValues
) => {
  const context = inject(IntlayerClientKey, {
    locale:
      configuration?.internationalization?.defaultLocale || Locales.ENGLISH, // or any other valid locale from the Locales enum
    setLocale: () => {},
    disableEditor: false,
  });

  const currentLocale = context.locale as LocalesValues;
  const localeTarget: LocalesValues = (locale ??
    currentLocale) as LocalesValues;

  return computed(() =>
    getDictionary<T, LocalesValues>(dictionary, localeTarget)
  );
};

export default useDictionary;
