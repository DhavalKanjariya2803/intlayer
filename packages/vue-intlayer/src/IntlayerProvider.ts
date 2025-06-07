import configuration from '@intlayer/config/built';
import type { LocalesValues } from '@intlayer/config/client';
import { inject, provide, ref, type InjectionKey, type Ref } from 'vue';
import { localeCookie, setLocaleCookie } from './useLocaleCookie';

// Simple locale resolver function
const resolveLocale = (
  locale: string,
  availableLocales: string[] = []
): string => {
  if (availableLocales.includes(locale)) {
    return locale;
  }

  // Try to find a matching locale (e.g., 'en-US' -> 'en')
  const language = locale.split('-')[0];
  if (availableLocales.includes(language)) {
    return language;
  }

  // Fallback to the first available locale or 'en'
  return availableLocales[0] || 'en';
};

// Simple cross-frame state implementation for Vue
const useCrossFrameState = <T>(
  key: string,
  initialValue: T
): [Ref<T>, (value: T) => void] => {
  const state = ref<T>(initialValue) as Ref<T>;

  const setState = (value: T) => {
    state.value = value;
    // In a real implementation, you would sync this across frames
  };

  return [state, setState];
};

type IntlayerValue = {
  locale: LocalesValues;
  setLocale: (newLocale: LocalesValues) => void;
  disableEditor?: boolean;
};

export const IntlayerClientKey: InjectionKey<IntlayerValue> =
  Symbol('IntlayerClient');

export const useIntlayerContext = () => {
  const context = inject(IntlayerClientKey);
  if (!context) {
    throw new Error(
      'useIntlayerContext must be used within an IntlayerProvider'
    );
  }
  return context;
};

export type IntlayerProviderProps = {
  locale?: LocalesValues;
  defaultLocale?: LocalesValues;
  setLocale?: (locale: LocalesValues) => void;
  disableEditor?: boolean;
};

export const createIntlayerProvider = (props: IntlayerProviderProps) => {
  const { internationalization } = configuration ?? {};
  const { defaultLocale: defaultLocaleConfig } = internationalization ?? {};
  const availableLocales = internationalization?.locales ?? [];

  const defaultLocale =
    props.locale ??
    localeCookie ??
    props.defaultLocale ??
    defaultLocaleConfig ??
    'en';

  const [currentLocale, setCurrentLocale] = useCrossFrameState<LocalesValues>(
    'INTLAYER_CURRENT_LOCALE',
    defaultLocale as LocalesValues
  );

  const setLocaleBase = (newLocale: LocalesValues) => {
    if (currentLocale.value.toString() === newLocale.toString()) return;

    if (availableLocales.length > 0 && !availableLocales.includes(newLocale)) {
      console.error(`Locale ${newLocale} is not available`);
      return;
    }

    setCurrentLocale(newLocale);
    setLocaleCookie(newLocale);
    if (props.setLocale) {
      props.setLocale(newLocale);
    }
  };

  const setLocale = props.setLocale ?? setLocaleBase;
  const localeToResolve = props.locale ?? currentLocale.value;
  const resolvedLocale = resolveLocale(localeToResolve, availableLocales);

  return {
    locale: resolvedLocale as LocalesValues,
    setLocale,
    disableEditor: props.disableEditor,
  };
};

export const IntlayerProvider = {
  name: 'IntlayerProvider',
  props: {
    locale: {
      type: String,
      default: undefined,
    },
    defaultLocale: {
      type: String,
      default: undefined,
    },
    setLocale: {
      type: Function,
      default: undefined,
    },
    disableEditor: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: IntlayerProviderProps, { slots }: { slots: any }) {
    const intlayerValue = createIntlayerProvider(props);
    provide(IntlayerClientKey, intlayerValue);

    return () => slots.default?.();
  },
} as any;

export default IntlayerProvider;
