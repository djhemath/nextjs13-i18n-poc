import { NextRequest, NextResponse } from "next/server";

import acceptLanguage from 'accept-language'

import { ALL_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGES } from "./app/i18n/settings";

acceptLanguage.languages(LANGUAGES);

String.prototype.count = function(character: string) {
  return this.split(character).length - 1;
}

function doesURLContainsLangParam(url: string) {
  let isIndex = url.count('/') === 1;
  return ALL_LANGUAGES.some((language) => isIndex ? url === `/${language}` : url.startsWith(`/${language}/`));
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

  let lang = detectLanguage(request);

  if(!LANGUAGES.includes(lang)) {
    lang = DEFAULT_LANGUAGE;
  }

  let res: (NextResponse | null) = null;

  let setCookie = true;

  if(lang === DEFAULT_LANGUAGE) {
    let destination;
    if(!doesURLContainsLangParam(pathname)) {
      destination = `/${DEFAULT_LANGUAGE}/${pathname}`.replace(/\/\//g, '/');
      res = NextResponse.rewrite(
        new URL(destination, request.url)
      );
    } else {
      const frags = pathname.split('/');
      delete frags[1];
      destination = `${frags.join('/')}`.replace(/\/\//g, '/');
      res = NextResponse.redirect(
        new URL(destination, request.url)
      );

      // Here the `lang` will be `en`. If cookie is set, it'll rewrite the existing value.
      setCookie = false;
    }
  } else {
    if(!doesURLContainsLangParam(pathname)) {
      const destination = `/${lang}/${pathname}`.replace(/\/\//g, '/');
      res = NextResponse.redirect(
        new URL(destination, request.url)
      );
    }
  }

  if(!res) {
    res = NextResponse.next();
  }

  if(setCookie) {
    res.cookies.set('preferred-language', lang, {
      path: '/',
      httpOnly: true,
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
