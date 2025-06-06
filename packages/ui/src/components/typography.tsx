import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@boilerplate/ui/lib/utils';
const variants = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    h6: 'scroll-m-20 text-base font-semibold tracking-tight',
    p: 'leading-7 [&:not(:first-child)]:mt-6',
    blockquote: 'mt-6 border-l-2 pl-6 italic',
    ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
    inlineCode: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    lead: 'text-xl text-muted-foreground',
    largeText: 'text-lg font-semibold',
    normalText: 'text-base font-normal',
    smallText: 'text-sm font-medium leading-none',
    mutedText: 'text-sm text-muted-foreground',
    bold: 'font-semibold text-sm',
};
const typographyVariants = cva('text-foreground', {
    variants: {
        as: variants,
    },
});

export type TypographyElement = keyof JSX.IntrinsicElements;

export type TypographyProps<T extends TypographyElement> = {
    element?: T;
} & VariantProps<typeof typographyVariants> &
    React.HTMLAttributes<HTMLElement>;

export const Typography = <T extends TypographyElement>({ className, element, as, ...props }: TypographyProps<T>) => {
    const Component = element ?? 'div';

    const asMapped = as ?? (element && element in variants ? (element as keyof typeof variants) : undefined);

    const componentProps = {
        className: cn(typographyVariants({ as: asMapped, className })),
        style: { wordBreak: 'break-word' },
        ...props,
    };

    return React.createElement(Component, componentProps);
};
