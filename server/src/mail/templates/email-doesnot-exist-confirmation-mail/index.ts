import * as fs from 'fs';
import * as path from 'path';

import { MailTemplate } from '@/mail/mail.service';

export const emailDoesNotExistConformationMailTemplate: MailTemplate = {
    template: fs.readFileSync(path.join(__dirname, 'email-doesnot-exist-confirmation-mail.html'), 'utf8'),
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
};
