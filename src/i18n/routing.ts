import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['th', 'en', 'ko'],
  defaultLocale: 'th',
});

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
