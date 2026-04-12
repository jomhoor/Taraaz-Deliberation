// Import English and Farsi translations for initial load
import { Quasar } from "quasar";
import en from "src/i18n/en";
import fa from "src/i18n/fa";
import type { SupportedDisplayLanguageCodes } from "src/shared/languages";
import { nextTick } from "vue";
import type { I18n } from "vue-i18n";
import { createI18n } from "vue-i18n
import { defineBoot } from "#q-app/wrappers";

const RTL_LANGUAGES = new Set(["fa", "ar", "he"]);

export type MessageLanguages = SupportedDisplayLanguageCodes;
// Type-define 'en' as the master schema for the resource
export type MessageSchema = typeof en;

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module "vue-i18n" {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

// Global i18n instance reference
let i18nInstance: I18n<
  { message: MessageSchema },
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {},
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {},
  MessageLanguages,
  false
> | null = null;

/**
 * Set the i18n language, update HTML lang/dir attributes, and sync Quasar lang pack
 */
export async function setI18nLanguage(locale: MessageLanguages): Promise<void> {
  if (!i18nInstance) return;

  // @ts-expect-error: locale type issue with lazy loading
  i18nInstance.global.locale.value = locale;

  const el = document.documentElement;
  const isRtl = RTL_LANGUAGES.has(locale);
  el.setAttribute("lang", locale);
  el.setAttribute("dir", isRtl ? "rtl" : "ltr");

  // Sync Quasar language pack so Quasar components (drawers, tabs, etc.) respect RTL
  try {
    const quasarLangModule = isRtl
      ? await import(`../../node_modules/quasar/lang/fa-IR.js`)
      : await import(`../../node_modules/quasar/lang/en-US.js`);
    Quasar.lang.set(quasarLangModule.default);
  } catch {
    // Quasar lang pack loading is non-critical; HTML dir attribute is the important fix
  }
}

/**
 * Load locale messages dynamically using dynamic imports
 */
export async function loadLocaleMessages(
  locale: MessageLanguages
): Promise<void> {
  if (!i18nInstance) return;

  // Check if already loaded
  // @ts-expect-error: availableLocales type issue with lazy loading
  if (i18nInstance.global.availableLocales.includes(locale)) {
    return;
  }

  // Retry up to 3 times with delay — dynamic imports can fail after deployments
  // when old chunk filenames no longer exist on the server
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const messages = await import(
        /* webpackChunkName: "locale-[request]" */
        /* vite-chunk-name: "locale-[request]" */
        `../i18n/${locale}/index.ts`
      );

      i18nInstance.global.setLocaleMessage(locale, messages.default);
      return nextTick();
    } catch (error) {
      lastError = error;
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  console.error(
    `[i18n] Failed to load locale "${locale}" after 3 attempts, falling back to English`,
    lastError
  );
  void setI18nLanguage("en");
}

/**
 * Get the i18n instance (for use in stores and composables)
 */
export function getI18nInstance(): I18n<
  { message: MessageSchema },
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {},
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {},
  MessageLanguages,
  false
> | null {
  return i18nInstance;
}

export default defineBoot(({ app }) => {
  // Get stored language preference or detect from browser, default to Farsi
  const storedLocale = localStorage.getItem("displayLanguage");
  const defaultLocale =
    (storedLocale as MessageLanguages) || "fa";

  const fallbackLocale = {
    "zh-Hant": ["zh-Hans", "en"],
    "zh-Hans": ["zh-Hant", "en"],
    ky: ["ru", "en"],
    ru: ["en"],
    default: ["en"],
  };

  // Create i18n instance with English and Farsi loaded initially
  const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
    locale: defaultLocale,
    fallbackLocale,
    legacy: false,
    // @ts-expect-error: Only English and Farsi loaded initially, others loaded lazily
    messages: {
      en,
      fa,
    },
  });

  // Store reference for helper functions
  // @ts-expect-error: Type inference issue with lazy loading
  i18nInstance = i18n;

  // Load the initial locale if it's not pre-loaded (en or fa)
  if (defaultLocale !== "en" && defaultLocale !== "fa") {
    void loadLocaleMessages(defaultLocale)
      .then(() => {
        void setI18nLanguage(defaultLocale);
      })
      .catch((error) => {
        console.error(
          "[i18n] Failed to load initial locale, using English",
          error
        );
        void setI18nLanguage("en");
      });
  } else {
    void setI18nLanguage(defaultLocale);
  }

  // Set i18n instance on app
  app.use(i18n);
});
