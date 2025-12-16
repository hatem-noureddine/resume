import { en } from './en';
import { fr } from './fr';
import { es } from './es';

export const locales = {
    en,
    fr,
    es,
};

export type SupportedLanguage = keyof typeof locales;
export const defaultLanguage: SupportedLanguage = 'en';

export const localeMetadata = {
    en: { name: "English", flag: "🇬🇧", resume: "/files/resume_en.pdf" },
    fr: { name: "Français", flag: "🇫🇷", resume: "/files/resume_fr.pdf" },
    es: { name: "Español", flag: "🇪🇸", resume: "/files/resume_es.pdf" }
};
