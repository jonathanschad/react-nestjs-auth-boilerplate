/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TReaderDocument } from '@usewaypoint/email-builder';

export const generateSocials = (socials: { name: string; url: string }[]): TReaderDocument => {
    // This is of type TReaderDocument but I do not want to deal with the types right now
    // biome-ignore lint/suspicious/noExplicitAny: the types of the library are not good and cause problems
    const socialDocument: any = {
        'social-container': {
            type: 'ColumnsContainer',
            data: {
                style: {
                    padding: {
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                    },
                },
                props: {
                    fixedWidths: [],
                    columnsCount: 0,
                    columnsGap: 8,
                    contentAlignment: 'middle',
                    columns: [],
                },
            },
        },
    };

    socials.forEach((social, index) => {
        const childId = `social-child-${index + 1}`;
        const socialContainer = socialDocument[`social-container`].data;
        socialContainer.props.fixedWidths.push(null);
        socialContainer.props.columnsCount++;
        socialContainer.props.columns.push({
            childrenIds: [childId],
        });
        socialDocument[`social-child-${index + 1}`] = {
            type: 'Image',
            data: {
                style: {
                    padding: {
                        top: 16,
                        bottom: 16,
                        right: 0,
                        left: 0,
                    },
                },
                props: {
                    url: `cid:${social.name}`,
                    alt: social.name,
                    linkHref: social.url,
                    contentAlignment: 'middle',
                    height: 32,
                    width: 32,
                },
            },
        };
    });

    return socialDocument;
};
