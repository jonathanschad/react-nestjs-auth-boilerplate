import * as fs from 'fs';
import * as path from 'path';

import type { EmailTranslation, MailTemplate } from '@/mail/mail.service';
import { emailConfirmationFactory } from '@/mail/templates/email-confirmation/email-confirmation';

export const emailConfirmationTemplate: MailTemplate = {
    templateFactory: emailConfirmationFactory,
    translations: {
        DE: JSON.parse(fs.readFileSync(path.join(__dirname, 'de.json'), 'utf8')) as EmailTranslation,
        EN: JSON.parse(fs.readFileSync(path.join(__dirname, 'en.json'), 'utf8')) as EmailTranslation,
    },
    images: [
        {
            cid: 'password-reset',
            filename: 'password-reset.png',
            path: path.join(__dirname, '../images/password-reset.png'),
        },
    ],
    headlineIconUrl: 'cid:password-reset',
};
