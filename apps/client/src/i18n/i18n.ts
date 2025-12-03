import { LanguageDTOEnum } from '@darts/types/entities/user';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from '@/i18n/de';
import en from '@/i18n/en';

const AVAILABLE_LANGUAGES = [LanguageDTOEnum.EN, LanguageDTOEnum.DE] as const;
const LANGUAGE_STORAGE_KEY = 'user-language';

const getUserLanguage = () => {
    // First, check if we have a stored language preference
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && AVAILABLE_LANGUAGES.includes(storedLanguage as (typeof AVAILABLE_LANGUAGES)[number])) {
        return storedLanguage;
    }

    // Otherwise, try to detect from browser
    const userLang = navigator.language;

    for (const lang of AVAILABLE_LANGUAGES) {
        if (userLang.toLocaleLowerCase().startsWith(lang.toLocaleLowerCase())) {
            return lang;
        }
    }
    return 'en';
};

await i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            [LanguageDTOEnum.EN]: en,
            [LanguageDTOEnum.DE]: de,
        },
        lng: getUserLanguage(), // if you're using a language detector, do not define the lng option
        fallbackLng: LanguageDTOEnum.EN,

        interpolation: {
            escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        },
    });

// Listen for language changes and store them in localStorage
i18n.on('languageChanged', (lng: LanguageDTOEnum) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
});

export default i18n;
