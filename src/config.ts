/**
 * Represents a locale type.
 * @typedef {typeof locales[number]} Locale
 */
export type Locale = (typeof locales)[number];

export const locales = ["en", "es"] as const;
export const defaultLocale: Locale = "en";