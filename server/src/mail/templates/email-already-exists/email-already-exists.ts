import { EMAIL_ACCENT_COLOR, EMAIL_TEXT_DISABLED_COLOR } from '@/mail/templates/default-template';
import { TReaderDocument } from '@usewaypoint/email-builder';

export const emailAlreadyExistsFactory = (translations: {
    body1: string;
    body2: string;
    body3: string;
    login: string;
    body4: string;
    loginLink: string;
}): TReaderDocument => ({
    content: {
        type: 'Container',
        data: {
            style: {
                padding: {
                    top: 16,
                    bottom: 16,
                    left: 24,
                    right: 24,
                },
            },
            props: {
                childrenIds: [
                    'content-text-1',
                    'content-text-2',
                    'content-text-3',
                    'content-action-button',
                    'content-text-4',
                ],
            },
        },
    },
    'content-text-1': {
        type: 'Text',
        data: {
            style: {
                fontWeight: 'normal',
                padding: {
                    top: 16,
                    bottom: 8,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                markdown: false,
                text: translations.body1,
            },
        },
    },
    'content-text-2': {
        type: 'Text',
        data: {
            style: {
                fontWeight: 'normal',
                padding: {
                    top: 8,
                    bottom: 8,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                text: translations.body2,
            },
        },
    },
    'content-text-3': {
        type: 'Text',
        data: {
            style: {
                fontSize: 16,
                fontWeight: 'normal',
                padding: {
                    top: 8,
                    bottom: 16,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                text: translations.body3,
            },
        },
    },
    'content-text-4': {
        type: 'Text',
        data: {
            style: {
                color: EMAIL_TEXT_DISABLED_COLOR,
                fontWeight: 'normal',
                padding: {
                    top: 32,
                    bottom: 32,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                text: translations.body4,
            },
        },
    },
    'content-action-button': {
        type: 'Button',
        data: {
            style: {
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                padding: {
                    top: 16,
                    bottom: 16,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                buttonBackgroundColor: EMAIL_ACCENT_COLOR,
                buttonStyle: 'rounded',
                fullWidth: true,
                size: 'medium',
                text: translations.login,
                url: translations.loginLink,
            },
        },
    },
});
