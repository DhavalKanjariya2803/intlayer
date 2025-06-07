import type { Locales, LocalesValues } from '@intlayer/config';
import type { Dictionary, Plugins } from '@intlayer/core';
import { getDictionary as getDictionaryCore } from '@intlayer/core';
import {
  type DeepTransformContent,
  intlayerNodePlugins,
  markdownPlugin,
  vueNodePlugins,
} from './plugins';

// Re-export the types for consistency
export type { Locales, LocalesValues };

/**
 * Get a dictionary with content transformed for the specified locale
 *
 * @param dictionary - The dictionary to transform
 * @param locale - The target locale (optional)
 * @param additionalPlugins - Additional plugins to apply (optional)
 * @returns The transformed dictionary content
 */
export const getDictionary = <
  T extends Dictionary,
  L extends LocalesValues = Locales,
>(
  dictionary: T,
  locale?: L,
  additionalPlugins: Plugins[] = []
) => {
  const plugins: Plugins[] = [
    intlayerNodePlugins,
    vueNodePlugins,
    markdownPlugin,
    ...additionalPlugins,
  ];

  // Create config object with locale and plugins
  const config = {
    locale,
    plugins,
  };

  // Create a wrapper function that matches the expected signature
  const getDictionaryWrapper = getDictionaryCore as <T extends Dictionary>(
    dictionary: T,
    locale?: LocalesValues,
    plugins?: Plugins[]
  ) => any;

  return getDictionaryWrapper(
    dictionary,
    locale,
    plugins
  ) as any as DeepTransformContent<T['content']>;
};

export default getDictionary;
