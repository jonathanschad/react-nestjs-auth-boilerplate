import type { TReaderDocument } from '@usewaypoint/email-builder';

import { generateSocials } from '@/mail/templates/generate-socials';

export const EMAIL_TEXT_PRIMARY_COLOR = '#FAFAFA';
export const EMAIL_TEXT_DISABLED_COLOR = '#A3A3A3';
export const EMAIL_TEXT_SECONDARY_COLOR = '#262626';
export const EMAIL_ACCENT_COLOR = '#2563EB';
export const EMAIL_BACKGROUND_COLOR = '#F5F5F5';
export const EMAIL_BORDER_COLOR = '#D4D4D4';

type TEmailTemplateFactory = {
    headline: string;
    contactHeadline: string;
    contact1: string;
    contact2: string;
    contact3: string;
    contact4: string;
    copyRight: string;
    iconUrl: string;
    socials: { name: string; url: string }[];
};

export const defaultEmailTemplateFactory = (translations: TEmailTemplateFactory): TReaderDocument => ({
    root: {
        type: 'EmailLayout',
        data: {
            backdropColor: EMAIL_BACKGROUND_COLOR,
            borderColor: EMAIL_BORDER_COLOR,
            borderRadius: 28,
            canvasColor: '#FFFFFF',
            textColor: EMAIL_TEXT_SECONDARY_COLOR,
            fontFamily: 'GEOMETRIC_SANS',
            childrenIds: ['logo', 'headline', 'content', 'imprint'],
        },
    },
    logo: {
        type: 'Image',
        data: {
            style: {
                padding: {
                    top: 16,
                    bottom: 16,
                    right: 24,
                    left: 24,
                },
                textAlign: 'center',
            },
            props: {
                height: 100,
                url: 'cid:logo',
                alt: 'Logo',
                linkHref: null,
                contentAlignment: 'middle',
            },
        },
    },
    ...generateHeadline(translations),
    ...generateImprint(translations),
});

const generateHeadline = (translations: TEmailTemplateFactory): TReaderDocument => ({
    headline: {
        type: 'Container',
        data: {
            style: {
                backgroundColor: EMAIL_ACCENT_COLOR,
                padding: {
                    top: 16,
                    bottom: 16,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                childrenIds: ['email-icon', 'email-headline'],
            },
        },
    },
    'email-icon': {
        type: 'Image',
        data: {
            style: {
                padding: {
                    top: 16,
                    bottom: 0,
                    right: 24,
                    left: 24,
                },
                textAlign: 'center',
            },
            props: {
                height: 40,
                url: translations.iconUrl,
                alt: 'Bestätigen Icon',
                linkHref: null,
                contentAlignment: 'middle',
            },
        },
    },
    'email-headline': {
        type: 'Heading',
        data: {
            props: {
                text: translations.headline,
                level: 'h1',
            },
            style: {
                color: EMAIL_TEXT_PRIMARY_COLOR,
                textAlign: 'center',
                padding: {
                    top: 0,
                    bottom: 16,
                    right: 24,
                    left: 24,
                },
            },
        },
    },
});

const generateImprint = (translations: TEmailTemplateFactory): TReaderDocument => ({
    imprint: {
        type: 'ColumnsContainer',
        data: {
            style: {
                backgroundColor: EMAIL_ACCENT_COLOR,
                padding: {
                    top: 16,
                    bottom: 16,
                    right: 24,
                    left: 24,
                },
            },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            props: {
                columnsCount: 2,
                columnsGap: 16,
                contentAlignment: 'middle',
                fixedWidths: [],
                columns: [
                    {
                        childrenIds: ['contact-headline', 'contact1', 'contact2', 'contact3', 'contact4'],
                    },
                    {
                        childrenIds: ['social-container', 'copyright'],
                    },
                ],
            } as any,
        },
    },
    'contact-headline': {
        type: 'Text',
        data: {
            style: {
                color: EMAIL_TEXT_PRIMARY_COLOR,
                fontSize: 20,
                fontWeight: 'bold',
                padding: {
                    top: 8,
                    bottom: 0,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                text: translations.contactHeadline,
            },
        },
    },
    contact1: {
        type: 'Text',
        data: {
            style: {
                color: EMAIL_TEXT_PRIMARY_COLOR,
                fontWeight: 'normal',
                padding: {
                    top: 0,
                    bottom: 0,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                text: translations.contact1,
            },
        },
    },
    contact2: {
        type: 'Text',
        data: {
            style: {
                color: EMAIL_TEXT_PRIMARY_COLOR,
                fontWeight: 'normal',
                padding: {
                    top: 0,
                    bottom: 0,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                text: translations.contact2,
            },
        },
    },
    contact3: {
        type: 'Text',
        data: {
            style: {
                color: EMAIL_TEXT_PRIMARY_COLOR,
                backgroundColor: null,
                fontWeight: 'normal',
                padding: {
                    top: 0,
                    bottom: 0,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                text: translations.contact3,
            },
        },
    },
    contact4: {
        type: 'Text',
        data: {
            style: {
                color: EMAIL_TEXT_PRIMARY_COLOR,
                fontWeight: 'normal',
                padding: {
                    top: 0,
                    bottom: 16,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                text: translations.contact4,
            },
        },
    },
    copyright: {
        type: 'Text',
        data: {
            style: {
                color: '#FAFAFA',
                fontWeight: 'normal',
                padding: {
                    top: 0,
                    bottom: 16,
                    right: 0,
                    left: 0,
                },
            },
            props: {
                text: translations.copyRight,
            },
        },
    },
    ...generateSocials(translations.socials),
});
