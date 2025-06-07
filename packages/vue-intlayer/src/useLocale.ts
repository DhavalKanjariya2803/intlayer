import configuration from '@intlayer/config/built';
import type { LocalesValues } from '@intlayer/config/client';
import { computed, inject } from 'vue';
import { IntlayerClientKey } from './IntlayerProvider';
import { useLocaleCookie } from './useLocaleCookie';

// Default list of locales if not provided by the config
const defaultLocaleList: LocalesValues[] = [
  'en',
  'fr',
  'es',
  'de',
  'ja',
  'zh',
  'ko',
  'ru',
];

type UseLocaleProps = {
  onLocaleChange?: (locale: LocalesValues) => void;
};

/**
 * Composable to get the current locale and all related fields
 */
export const useLocale = ({ onLocaleChange }: UseLocaleProps = {}) => {
  const { defaultLocale } = configuration?.internationalization ?? {};
  const availableLocales =
    configuration?.internationalization?.locales ?? defaultLocaleList;

  const context = inject(IntlayerClientKey, {
    locale: (defaultLocale || 'en') as LocalesValues,
    setLocale: (() => {}) as (locale: LocalesValues) => void,
    disableEditor: false,
  });

  const currentLocale = computed(() => context.locale);
  const setLocaleState = context.setLocale;

  const { setLocaleCookie } = useLocaleCookie();

  const setLocale = (newLocale: LocalesValues) => {
    if (!availableLocales?.map(String).includes(newLocale)) {
      console.error(`Locale ${newLocale} is not available`);
      return;
    }

    setLocaleState(newLocale);
    setLocaleCookie(newLocale);
    onLocaleChange?.(newLocale);
  };

  return {
    locale: currentLocale.value,
    defaultLocale: defaultLocale || 'en',
    availableLocales,
    localeList: availableLocales,
    setLocale,
  };
};

export default useLocale;
