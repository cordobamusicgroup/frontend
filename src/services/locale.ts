"use server";

import { defaultLocale, Locale } from "@/config";
import { cookies } from "next/headers";

const COOKIE_NAME = "user_locale";

/**
 * Retrieves the user's locale from the cookie or returns the default locale if the cookie does not exist.
 * @returns A Promise that resolves to a string representing the user's locale.
 */
export async function getUserLocale(): Promise<string> {
  return cookies().get(COOKIE_NAME)?.value || defaultLocale;
}

/**
 * Sets the user's locale.
 * @param locale The locale to set.
 * @returns A promise that resolves when the locale is set.
 */
export async function setUserLocale(locale: Locale): Promise<void> {
  cookies().set(COOKIE_NAME, locale);
}
