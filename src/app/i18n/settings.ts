export const DEFAULT_LANGUAGE = "en";
export const LANGUAGES = [DEFAULT_LANGUAGE, "fr"];

export const DEFAULT_NAMESPACE = 'common'

export function getOptions (lng = DEFAULT_LANGUAGE, ns = DEFAULT_NAMESPACE) {
  return {
    // debug: true,
    supportedLngs: LANGUAGES,
    fallbackLng: DEFAULT_LANGUAGE,
    lng,
    fallbackNS: DEFAULT_NAMESPACE,
    defaultNS: DEFAULT_NAMESPACE,
    ns
  }
}