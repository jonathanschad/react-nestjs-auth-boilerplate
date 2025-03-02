import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from '@client/i18n/de';
import en from '@client/i18n/en';

const AVAILABLE_LANGUAGES = ['en', 'de'] as const;
const getUserLanguage = () => {
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
            en,
            de,
        },
        lng: getUserLanguage(), // if you're using a language detector, do not define the lng option
        fallbackLng: 'en',

        interpolation: {
            escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        },
    });

export default i18n;
