/* eslint-disable import/no-named-as-default-member */
import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n.use(initReactI18next)
    .use(HttpApi)
    .init({
        fallbackLng: 'en',
        returnEmptyString: false,
        debug: true,
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: './locales/{{lng}}/{{ns}}.json',
            cache: false
        }
    } as InitOptions);

export default i18n;
