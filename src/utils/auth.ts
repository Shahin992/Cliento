const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
export const AUTH_TOKEN_COOKIE_NAME = 'cliento_token_b64';

export const encodeBase64 = (value: string) => {
  const encoded = encodeURIComponent(value);
  return btoa(encoded);
};

export const decodeBase64 = (value: string) => {
  const decoded = atob(value);
  return decodeURIComponent(decoded);
};

type CookieOptions = {
  expiresAt?: Date;
  maxAgeMs?: number;
  path?: string;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
};

export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
  const expires = options.expiresAt
    ? options.expiresAt.toUTCString()
    : new Date(Date.now() + (options.maxAgeMs ?? TWO_DAYS_IN_MS)).toUTCString();

  const path = options.path ?? '/';
  const secure = options.secure ? '; Secure' : '';
  const sameSite = options.sameSite ? `; SameSite=${options.sameSite}` : '; SameSite=Lax';

  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=${path}${secure}${sameSite}`;
};

export const removeCookie = (name: string, path = '/') => {
  document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}`;
};

export const getCookie = (name: string) => {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const prefix = `${name}=`;
  for (const cookie of cookies) {
    if (cookie.startsWith(prefix)) {
      return decodeURIComponent(cookie.slice(prefix.length));
    }
  }
  return null;
};

export const setAuthTokenCookie = (token: string, options: CookieOptions = {}) => {
  setCookie(AUTH_TOKEN_COOKIE_NAME, encodeBase64(token), {
    maxAgeMs: SEVEN_DAYS_IN_MS,
    ...options,
  });
};

export const getAuthTokenFromCookie = () => {
  const encodedToken = getCookie(AUTH_TOKEN_COOKIE_NAME);
  if (!encodedToken) {
    return null;
  }

  try {
    return decodeBase64(encodedToken);
  } catch {
    return null;
  }
};

export const clearAuthTokenCookie = (path = '/') => {
  removeCookie(AUTH_TOKEN_COOKIE_NAME, path);
};
