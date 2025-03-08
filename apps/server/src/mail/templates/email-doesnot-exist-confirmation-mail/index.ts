import * as fs from 'fs';
import * as path from 'path';

import { EmailTranslation, MailTemplate } from '@server/mail/mail.service';
import { emailDoesNotExistConfirmationFactory } from '@server/mail/templates/email-doesnot-exist-confirmation-mail/email-doesnot-exist-confirmation-mail';

export const emailDoesNotExistConformationMailTemplate: MailTemplate = {
    templateFactory: emailDoesNotExistConfirmationFactory,
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
