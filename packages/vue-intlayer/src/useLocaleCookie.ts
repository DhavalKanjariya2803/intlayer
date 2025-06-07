import configuration from '@intlayer/config/built';
import type { LocalesValues } from '@intlayer/config/client';
import Cookies from 'js-cookie';

// Default cookie name if not configured
const DEFAULT_COOKIE_NAME = 'intlayer-locale';
const cookieName = configuration?.middleware?.cookieName || DEFAULT_COOKIE_NAME;

const cookieAttributes: Cookies.CookieAttributes = {
  path: '/',
  expires: undefined,
  domain: undefined,
  secure: false,
  sameSite: 'strict',
};

/**
 * Get the locale cookie
 */
export const localeCookie = Cookies.get(cookieName) as unknown as
  | LocalesValues
  | undefined;

/**
 * Set the locale cookie
 */
export const setLocaleCookie = (locale: LocalesValues) => {
  Cookies.set(cookieName, locale, cookieAttributes);
};

/**
 * Composable that provides the locale cookie and a function to set it
 */
export const useLocaleCookie = () => ({
  localeCookie,
  setLocaleCookie,
});

export default useLocaleCookie;
