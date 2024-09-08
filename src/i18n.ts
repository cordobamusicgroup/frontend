import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

/**
 * Retrieves the request configuration for internationalization.
 * @returns {Promise<{ locale: string, messages: any }>} The request configuration object containing the locale and messages.
 */
export default getRequestConfig(async () => {
  const locale = cookies().get("user_locale")?.value || "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
