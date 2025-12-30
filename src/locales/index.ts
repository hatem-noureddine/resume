import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { ar } from './ar';

export const locales = {
    en,
    fr,
    es,
    ar,
};

export type SupportedLanguage = keyof typeof locales;
export const defaultLanguage: SupportedLanguage = 'en';

export const localeMetadata = {
    en: { name: "English", flag: "🇬🇧", resume: "/files/resume_en.pdf" },
    fr: { name: "Français", flag: "🇫🇷", resume: "/files/resume_fr.pdf" },
    es: { name: "Español", flag: "🇪🇸", resume: "/files/resume_es.pdf" },
    ar: { name: "العربية", flag: "🇸🇦", resume: "/files/resume_ar.pdf" }
};
