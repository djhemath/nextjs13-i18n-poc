import { NextRequest, NextResponse } from "next/server";

import acceptLanguage from 'accept-language'

import { DEFAULT_LANGUAGE, LANGUAGES } from "./app/i18n/settings";

acceptLanguage.languages(LANGUAGES);

String.prototype.count = function(character: string) {
  return this.split(character).length - 1;
}

function doesURLContainsLangParam(url: string) {
  let isIndex = url.count('/') === 1;
  return LANGUAGES.some((language) => isIndex ? url === `/${language}` : url.startsWith(`/${language}/`));
}

function detectLanguage(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if(doesURLContainsLangParam(pathname)) {
    return pathname.split("/")[1];
  }

  const langCookie = request.cookies.get('preferred-language');
  if(langCookie && langCookie.value && LANGUAGES.includes(langCookie.value)) {
    return langCookie.value;
  }

  const language = acceptLanguage.get(request.headers.get('Accept-Language'));
  if(language !== null) {
    return language;
  }

  return DEFAULT_LANGUAGE;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const lang = detectLanguage(request);

  if(lang === DEFAULT_LANGUAGE) {
    if(!doesURLContainsLangParam(pathname)) {
      const destination = `/${DEFAULT_LANGUAGE}/${pathname}`.replace(/\/\//g, '/');

      return NextResponse.rewrite(
        new URL(destination, request.url)
      );
    }
  } else {
    if(!doesURLContainsLangParam(pathname)) {
      const destination = `/${lang}/${pathname}`.replace(/\/\//g, '/');
      return NextResponse.redirect(
        new URL(destination, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
