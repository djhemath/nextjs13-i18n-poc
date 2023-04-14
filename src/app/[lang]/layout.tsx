'use client'

import { Flex, Select } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import cookieCutter from 'cookie-cutter';
import { DEFAULT_LANGUAGE, LANGUAGES } from "../i18n/settings";

export default function Layout({children, params}: {children: React.ReactNode, params: any}) {
    return (
        <div>
            <Header lang={params.lang} />
            {children}
        </div>
    );
}

function Header(props: any) {
    const router = useRouter();
    const pathname = usePathname();
    const [ lang, setLang ] = useState(props.lang);
  
    useEffect(() => {
      const langCookie = cookieCutter.get('preferred-language');
      setLang(langCookie);
    }, []);
  
    const onLanguageChange = (e: any) => {
      const language = e.target.value;
      setLang(language);
      cookieCutter.set('preferred-language', language, {path: '/'});
  
      const frags = pathname!.split('/');
      // 0th index is empty quotes, 1st index is the actual locale

      if(LANGUAGES.includes(frags[1])) {
        frags[1] = language;
      } else {
        frags.splice(1, 0, language);
      }

      const url = frags.join('/')
                    .replace(`/${DEFAULT_LANGUAGE}`, ''); // Removing /en if it's selected
  
      router.replace(url);
    }
  
    return (
      <Flex padding={5} justifyContent='space-between'>
        <div>Logo</div>
  
        <div>
          <Select onChange={onLanguageChange} value={lang}>
            <option value="en">English</option>
            <option value="fr">French</option>
          </Select>
        </div>
      </Flex>
    );
  }