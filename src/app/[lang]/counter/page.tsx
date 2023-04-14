'use client'

import { useTranslation } from "@/app/i18n/client";
import { getURL } from "@/utils/i18n";
import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function CounterPage(props: any) {
    const lang = props.params.lang;
    const t = useTranslation(lang, ["common", "counter"]);

    const [ apples, setApples ] = useState(0);

    return (
        <Flex width='100vw' height='calc(100vh - 80px)' justifyContent='center' alignItems='center'>
            <Box>
                <h1>Counter</h1>
                <Button onClick={() => setApples(apples - 1)}>-</Button>
                <Box display='inline-block' mx={3}>{apples}</Box>
                <Button onClick={() => setApples(apples + 1)}>+</Button>
                <p>You got {t('apple', {ns: 'counter', count: apples})}</p>

                <Box mt={5}>
                    <Text>{t('checkout_stunning', {ns: 'common'})} <Link style={{color: 'blue', textDecoration: 'underline'}} href={getURL('/form', lang)}>form</Link> 🔥</Text>
                </Box>
            </Box>

        </Flex>
    );
}