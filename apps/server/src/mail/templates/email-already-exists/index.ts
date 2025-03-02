import { MailTemplate } from '@server/mail/mail.service';
import { emailAlreadyExistsFactory } from '@server/mail/templates/email-already-exists/email-already-exists';
import * as fs from 'fs';
import * as path from 'path';

export const emailAlreadyExistsTemplate: MailTemplate = {
    templateFactory: emailAlreadyExistsFactory,
    translations: {
        DE: JSON.parse(fs.readFileSync(path.join(__dirname, 'de.json'), 'utf8')),
        EN: JSON.parse(fs.readFileSync(path.join(__dirname, 'en.json'), 'utf8')),
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
