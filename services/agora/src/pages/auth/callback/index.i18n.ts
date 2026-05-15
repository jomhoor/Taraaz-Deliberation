import type { SupportedDisplayLanguageCodes } from "src/shared/languages";

export interface SsoCallbackTranslations {
  loadingTitle: string;
  loadingDescription: string;
  errorTitle: string;
  errorMissingCode: string;
  errorMissingVerifier: string;
  errorStateMismatch: string;
  errorInvalidCode: string;
  errorAssociatedWithAnotherUser: string;
  errorGeneric: string;
  retryButton: string;
}

export const ssoCallbackTranslations: Record<
  SupportedDisplayLanguageCodes,
  SsoCallbackTranslations
> = {
  en: {
    loadingTitle: "Signing you in…",
    loadingDescription: "Completing sign-in with Jomhoor. Please wait.",
    errorTitle: "Sign-in failed",
    errorMissingCode: "No authorization code received from Jomhoor. Please try again.",
    errorMissingVerifier: "Session data missing. Please try again.",
    errorStateMismatch: "Security check failed. Please try again.",
    errorInvalidCode: "The authorization code has expired or is invalid. Please try again.",
    errorAssociatedWithAnotherUser:
      "This Jomhoor account is already linked to a different Taraaz account.",
    errorGeneric: "Sign-in failed. Please try again.",
    retryButton: "Try again",
  },
  ar: {
    loadingTitle: "جارٍ تسجيل الدخول…",
    loadingDescription: "إتمام تسجيل الدخول باستخدام جمهور. يُرجى الانتظار.",
    errorTitle: "فشل تسجيل الدخول",
    errorMissingCode: "لم يتم استلام رمز التفويض من جمهور. يُرجى المحاولة مجدداً.",
    errorMissingVerifier: "بيانات الجلسة مفقودة. يُرجى المحاولة مجدداً.",
    errorStateMismatch: "فشل التحقق الأمني. يُرجى المحاولة مجدداً.",
    errorInvalidCode: "انتهت صلاحية رمز التفويض أو أنه غير صالح. يُرجى المحاولة مجدداً.",
    errorAssociatedWithAnotherUser:
      "حساب جمهور هذا مرتبط بالفعل بحساب تراز مختلف.",
    errorGeneric: "فشل تسجيل الدخول. يُرجى المحاولة مجدداً.",
    retryButton: "حاول مجدداً",
  },
  es: {
    loadingTitle: "Iniciando sesión…",
    loadingDescription: "Completando el inicio de sesión con Jomhoor. Por favor, espere.",
    errorTitle: "Error al iniciar sesión",
    errorMissingCode:
      "No se recibió ningún código de autorización de Jomhoor. Por favor, inténtelo de nuevo.",
    errorMissingVerifier: "Datos de sesión faltantes. Por favor, inténtelo de nuevo.",
    errorStateMismatch: "Falló la comprobación de seguridad. Por favor, inténtelo de nuevo.",
    errorInvalidCode:
      "El código de autorización ha caducado o no es válido. Por favor, inténtelo de nuevo.",
    errorAssociatedWithAnotherUser:
      "Esta cuenta de Jomhoor ya está vinculada a una cuenta de Taraaz diferente.",
    errorGeneric: "Error al iniciar sesión. Por favor, inténtelo de nuevo.",
    retryButton: "Intentar de nuevo",
  },
  fr: {
    loadingTitle: "Connexion en cours…",
    loadingDescription:
      "Finalisation de la connexion avec Jomhoor. Veuillez patienter.",
    errorTitle: "Échec de la connexion",
    errorMissingCode:
      "Aucun code d'autorisation reçu de Jomhoor. Veuillez réessayer.",
    errorMissingVerifier: "Données de session manquantes. Veuillez réessayer.",
    errorStateMismatch: "Échec de la vérification de sécurité. Veuillez réessayer.",
    errorInvalidCode:
      "Le code d'autorisation a expiré ou est invalide. Veuillez réessayer.",
    errorAssociatedWithAnotherUser:
      "Ce compte Jomhoor est déjà lié à un autre compte Taraaz.",
    errorGeneric: "Échec de la connexion. Veuillez réessayer.",
    retryButton: "Réessayer",
  },
  fa: {
    loadingTitle: "در حال ورود…",
    loadingDescription: "تکمیل ورود با جمهور. لطفاً صبر کنید.",
    errorTitle: "ورود ناموفق بود",
    errorMissingCode: "کدی از جمهور دریافت نشد. لطفاً دوباره امتحان کنید.",
    errorMissingVerifier: "اطلاعات جلسه یافت نشد. لطفاً دوباره امتحان کنید.",
    errorStateMismatch: "بررسی امنیتی ناموفق بود. لطفاً دوباره امتحان کنید.",
    errorInvalidCode: "کد تأیید منقضی شده یا نامعتبر است. لطفاً دوباره امتحان کنید.",
    errorAssociatedWithAnotherUser:
      "این حساب جمهور قبلاً به حساب تراز دیگری متصل شده است.",
    errorGeneric: "ورود ناموفق بود. لطفاً دوباره امتحان کنید.",
    retryButton: "تلاش مجدد",
  },
  ru: {
    loadingTitle: "Выполняется вход…",
    loadingDescription: "Завершение входа через Jomhoor. Пожалуйста, подождите.",
    errorTitle: "Ошибка входа",
    errorMissingCode:
      "Код авторизации от Jomhoor не получен. Пожалуйста, попробуйте снова.",
    errorMissingVerifier: "Данные сессии отсутствуют. Пожалуйста, попробуйте снова.",
    errorStateMismatch: "Проверка безопасности не пройдена. Пожалуйста, попробуйте снова.",
    errorInvalidCode:
      "Код авторизации истёк или недействителен. Пожалуйста, попробуйте снова.",
    errorAssociatedWithAnotherUser:
      "Этот аккаунт Jomhoor уже привязан к другому аккаунту Taraaz.",
    errorGeneric: "Ошибка входа. Пожалуйста, попробуйте снова.",
    retryButton: "Попробовать снова",
  },
};
