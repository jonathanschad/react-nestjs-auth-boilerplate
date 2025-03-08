import * as fs from 'fs';
import * as path from 'path';

import { EmailTranslation, MailTemplate } from '@server/mail/mail.service';
import { emailAlreadyVerifiedFactory } from '@server/mail/templates/email-already-verified/email-already-verified';

export const emailAlreadyVerifiedTemplate: MailTemplate = {
    templateFactory: emailAlreadyVerifiedFactory,
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
