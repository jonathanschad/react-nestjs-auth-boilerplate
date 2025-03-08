import { useTranslation } from 'react-i18next';

import { Typography, TypographyElement, TypographyProps } from '@/components/ui/typography';

interface TranslationProps<T extends TypographyElement, U extends Record<string, unknown>> extends TypographyProps<T> {
    children: string;
    namespace?: string;
    translationParams?: U | undefined;
}

export const Translation = <T extends TypographyElement, U extends Record<string, unknown>>({
    children,
    namespace,
    translationParams,
    ...props
}: TranslationProps<T, U>) => {
    const { t } = useTranslation(namespace ?? 'common');

    return props.as || props.element ? (
        <Typography {...props}>{t(children, translationParams)}</Typography>
    ) : (
        t(children, translationParams)
    );
};
