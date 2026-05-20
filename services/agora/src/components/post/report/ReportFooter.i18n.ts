import type { SupportedDisplayLanguageCodes } from "src/shared/languages";

export interface ReportFooterTranslations {
  generatedOn: string;
  poweredBy: string;
}

export const reportFooterTranslations: Record<
  SupportedDisplayLanguageCodes,
  ReportFooterTranslations
> = {
  en: {
    generatedOn: "Report generated on",
    poweredBy: "Powered by Taraaz Deliberation",
  },
  ar: {
    generatedOn: "تم إنشاء التقرير في",
    poweredBy: "مدعوم من Taraaz Deliberation",
  },
  es: {
    generatedOn: "Informe generado el",
    poweredBy: "Desarrollado por Taraaz Deliberation",
  },
  fa: { generatedOn: "گزارش تولید شده در", poweredBy: "ارائه شده توسط Agora Citizen Network" },
  fr: {
    generatedOn: "Rapport généré le",
    poweredBy: "Propulsé par Taraaz Deliberation",
  },
  "zh-Hans": {
    generatedOn: "报告生成于",
    poweredBy: "由 Taraaz Deliberation 提供支持",
  },
  "zh-Hant": {
    generatedOn: "報告生成於",
    poweredBy: "由 Taraaz Deliberation 提供支持",
  },
  he: { generatedOn: "הדיווח נוצר ב", poweredBy: "מופעל על ידי Agora Citizen Network" },
  ja: {
    generatedOn: "レポート生成日",
    poweredBy: "Taraaz Deliberation 提供",
  },
  ky: {
    generatedOn: "Отчёт түзүлгөн күн",
    poweredBy: "Taraaz Deliberation тарабынан иштетилет",
  },
  ru: {
    generatedOn: "Отчёт сформирован",
    poweredBy: "Работает на Taraaz Deliberation",
  },
  fa: {
    generatedOn: "گزارش تولید شده در",
    poweredBy: "با پشتیبانی Taraaz Deliberation",
  },
};
