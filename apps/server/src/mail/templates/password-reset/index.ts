import * as fs from 'node:fs';
import * as path from 'node:path';

import type { EmailTranslation, MailTemplate } from '@/mail/mail.service';
import { passwordResetFactory } from '@/mail/templates/password-reset/password-reset';

export const passwordResetTemplate: MailTemplate = {
    templateFactory: passwordResetFactory,
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
