import i18next, { TOptionsBase } from "i18next";
import 'intl-pluralrules';
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import { DEFAULT_LANGUAGE, LANGUAGES, getOptions } from "./settings";
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

    if(!LANGUAGES.includes(language)) {
        language = DEFAULT_LANGUAGE;
    }

    useEffect(() => {
        async function loadLocales() {

            // Remove previously loaded languages
            const previouslyLoadedLanguages = i18next.services.resourceStore.data;

            for(let lang in previouslyLoadedLanguages) {
                if(lang !== language) {
                    for(let ns in previouslyLoadedLanguages[lang]) {
                        i18next.removeResourceBundle(lang, ns);
                    }
                }
            }

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