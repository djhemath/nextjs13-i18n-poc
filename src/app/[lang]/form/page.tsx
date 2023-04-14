'use client'

import { useTranslation } from "@/app/i18n/client";
import { getURL } from "@/utils/i18n";
import { FormControl, FormLabel, Input, FormHelperText, Box, Button, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function Page(props: any) {
    const lang = props.params.lang;
    const t = useTranslation(lang, ["common", "form"]);

    return (
        <>
        <div style={{maxWidth: 500, margin: 'auto'}}>
          <p>Language: <b>{lang}</b></p>
          <FormControl>
            <FormLabel>{t('labels.email', {ns: 'form'})}</FormLabel>
            <Input type='email' />
            <FormHelperText>{t('helpers.email', {ns: 'form'})}</FormHelperText>
          </FormControl>
  
          <FormControl mt={10}>
            <FormLabel>{t('labels.phone', {ns: 'form'})}</FormLabel>
            <Input type='tel' />
            <FormHelperText>{t('helpers.phone', {ns: 'form'})}</FormHelperText>
          </FormControl>
  
          {/* <Box mt={4}>
            <Link href={getURL('/url', lang)}>
              <Text color='blue' textDecoration='underline'>Test URL</Text>
            </Link>
          </Box> */}
  
          <Box mt={5}>
            <Button colorScheme='blue'>{t('buttons.submit', {ns: 'common'})}</Button>
          </Box>
  
          <Box mt={5}>
            <Text>{t('checkout_awesome', {ns: 'common'})} <Link style={{color: 'blue', textDecoration: 'underline'}} href={getURL('/counter', lang)}>counter</Link> 🔥</Text>
          </Box>
        </div>
      </>
    );
}