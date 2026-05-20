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
  he: {
    loadingTitle: "מתחבר…",
    loadingDescription: "מסיים כניסה עם Jomhoor. אנא המתן.",
    errorTitle: "הכניסה נכשלה",
    errorMissingCode: "לא התקבל קוד הרשאה מאת Jomhoor. אנא נסה שנית.",
    errorMissingVerifier: "נתוני הסשן חסרים. אנא נסה שנית.",
    errorStateMismatch: "בדיקת האבטחה נכשלה. אנא נסה שנית.",
    errorInvalidCode: "קוד ההרשאה פג תוקף או אינו תקין. אנא נסה שנית.",
    errorAssociatedWithAnotherUser:
      "חשבון Jomhoor זה כבר מקושר לחשבון Taraaz אחר.",
    errorGeneric: "הכניסה נכשלה. אנא נסה שנית.",
    retryButton: "נסה שנית",
  },
  ja: {
    loadingTitle: "サインイン中…",
    loadingDescription: "Jomhoorでのサインインを完了しています。お待ちください。",
    errorTitle: "サインインに失敗しました",
    errorMissingCode: "Jomhoorから認証コードが受信されませんでした。再試行してください。",
    errorMissingVerifier: "セッションデータがありません。再試行してください。",
    errorStateMismatch: "セキュリティチェックに失敗しました。再試行してください。",
    errorInvalidCode: "認証コードの有効期限が切れたか無効です。再試行してください。",
    errorAssociatedWithAnotherUser:
      "このJomhoorアカウントはすでに別のTaraazアカウントにリンクされています。",
    errorGeneric: "サインインに失敗しました。再試行してください。",
    retryButton: "再試行",
  },
  ky: {
    loadingTitle: "Кирүү жүрүүдө…",
    loadingDescription: "Jomhoor аркылуу кирүүнү аяктоо. Күтүңүз.",
    errorTitle: "Кирүү ишке ашкан жок",
    errorMissingCode: "Jomhoorдон авторизация коду алынган жок. Кайра аракет кылыңыз.",
    errorMissingVerifier: "Сессия маалыматтары жок. Кайра аракет кылыңыз.",
    errorStateMismatch: "Коопсуздук текшерүүсү ишке ашкан жок. Кайра аракет кылыңыз.",
    errorInvalidCode: "Авторизация кодунун мөөнөтү бүттү же жараксыз. Кайра аракет кылыңыз.",
    errorAssociatedWithAnotherUser:
      "Бул Jomhoor аккаунту башка Taraaz аккаунтуна байланышкан.",
    errorGeneric: "Кирүү ишке ашкан жок. Кайра аракет кылыңыз.",
    retryButton: "Кайра аракет кылуу",
  },
  "zh-Hans": {
    loadingTitle: "正在登录…",
    loadingDescription: "正在完成通过 Jomhoor 登录。请稍候。",
    errorTitle: "登录失败",
    errorMissingCode: "未收到来自 Jomhoor 的授权码。请重试。",
    errorMissingVerifier: "会话数据丢失。请重试。",
    errorStateMismatch: "安全检查失败。请重试。",
    errorInvalidCode: "授权码已过期或无效。请重试。",
    errorAssociatedWithAnotherUser:
      "此 Jomhoor 帐户已与另一个 Taraaz 帐户关联。",
    errorGeneric: "登录失败。请重试。",
    retryButton: "重试",
  },
  "zh-Hant": {
    loadingTitle: "正在登入…",
    loadingDescription: "正在完成透過 Jomhoor 登入。請稍候。",
    errorTitle: "登入失敗",
    errorMissingCode: "未收到來自 Jomhoor 的授權碼。請重試。",
    errorMissingVerifier: "工作階段資料遺失。請重試。",
    errorStateMismatch: "安全檢查失敗。請重試。",
    errorInvalidCode: "授權碼已過期或無效。請重試。",
    errorAssociatedWithAnotherUser:
      "此 Jomhoor 帳戶已與另一個 Taraaz 帳戶關聯。",
    errorGeneric: "登入失敗。請重試。",
    retryButton: "重試",
  },
};
