// Core exports
export * from './getDictionary';
export * from './getIntlayer';
export * from './IntlayerProvider';
export * from './useDictionary';
export * from './useIntlayer';
export * from './useLocale';

// Types
export * from './plugins';

// Default export for better import experience
import { getDictionary } from './getDictionary';
import { getIntlayer } from './getIntlayer';
import { IntlayerProvider } from './IntlayerProvider';
import { useDictionary } from './useDictionary';
import { useIntlayer } from './useIntlayer';
import { useLocale } from './useLocale';

export default {
  IntlayerProvider,
  useLocale,
  useDictionary,
  useIntlayer,
  getDictionary,
  getIntlayer,
};
