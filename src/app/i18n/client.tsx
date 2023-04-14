import i18next, { TOptionsBase } from "i18next";
import 'intl-pluralrules';
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import { getOptions } from "./settings";
import { useEffect, useState } from "react";

i18next
  .use(initReactI18next)
  .init(getOptions());

function useCustomT(namespaces: string[] = ["common"], options: any = {}) {
    const { t } = useTranslationOrg(namespaces, options);

    // eslint-disable-next-line react/display-name
    return (key: string = '', options: TOptionsBase) => {
        const value = t(key, options);

        if((value === key || !value) && process.env.NODE_ENV === "development") {
            return (<span style={{color: 'red'}}>{key}</span>);
        }

        return value;
    }
}

export function useTranslation(language: string = "en", namespaces: string[] = ["common"], options: any = {}) {
    const [dict, setDict] = useState({});

    useEffect(() => {
        async function loadLocales() {
            const locales: any = {};

            for(let i=0; i<namespaces.length; i++) {
                const namespace = namespaces[i];
                const locale = await import(`./locales/${language}/${namespace}`);
                locales[namespace] = locale.default;

                i18next.addResourceBundle(language, namespace, locale.default);
            }

            setDict(locales);
        }

        loadLocales();
    }, []);

    if (i18next.resolvedLanguage !== language) i18next.changeLanguage(language);
    // return useTranslationOrg(namespaces, options);
    return useCustomT(namespaces, options);
}