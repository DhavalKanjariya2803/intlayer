import type { LocalesValues, Plugins } from '@intlayer/core';
import type { IntlayerDictionaryTypesConnector } from '@intlayer/core/types/dictionary';
import {
  type DeepTransformContent,
  intlayerNodePlugins,
  markdownPlugin,
  vueNodePlugins,
} from './plugins';

// Extract DictionaryKeys from IntlayerDictionaryTypesConnector
type DictionaryKeys = keyof IntlayerDictionaryTypesConnector extends never
  ? string
  : keyof IntlayerDictionaryTypesConnector;

const { getIntlayer: getIntlayerCore } = require('@intlayer/core');

/**
 * Get content from the intlayer dictionary by key for the specified locale
 *
 * @param key - The dictionary key
 * @param locale - The target locale (optional)
 * @param additionalPlugins - Additional plugins to apply (optional)
 * @returns The transformed content for the specified key and locale
 */
export const getIntlayer = <T extends DictionaryKeys, L extends LocalesValues>(
  key: T,
  locale?: L,
  additionalPlugins: Plugins[] = []
) => {
  const plugins: Plugins[] = [
    intlayerNodePlugins,
    vueNodePlugins,
    markdownPlugin,
    ...additionalPlugins,
  ];

  // Create a config object with locale and plugins
  const config = {
    locale,
    plugins,
  };

  return getIntlayerCore(key, config) as any as DeepTransformContent<
    IntlayerDictionaryTypesConnector[T] extends { content: infer C } ? C : any
  >;
};

export default getIntlayer;
