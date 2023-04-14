import { DEFAULT_LANGUAGE } from "@/app/i18n/settings";

export function getURL(path: string, language: string) {
    if(!language) return path;

    if(language === DEFAULT_LANGUAGE) {
        return path.replace(`/${DEFAULT_LANGUAGE}`, '');
    }

    return `/${language}/${path}`.replace(/\/\//g, '/');
}