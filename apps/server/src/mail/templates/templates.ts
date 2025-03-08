import { emailAlreadyExistsTemplate } from '@/mail/templates/email-already-exists';
import { emailAlreadyVerifiedTemplate } from '@/mail/templates/email-already-verified';
import { emailConfirmationTemplate } from '@/mail/templates/email-confirmation';
import { emailDoesNotExistConformationMailTemplate } from '@/mail/templates/email-doesnot-exist-confirmation-mail';
import { emailDoesNotExistPasswordResetTemplate } from '@/mail/templates/email-doesnot-exist-password-reset';
import { passwordChangedTemplate } from '@/mail/templates/password-changed';
import { passwordResetTemplate } from '@/mail/templates/password-reset';

export const templates = {
    passwordReset: passwordResetTemplate,
    emailConfirmation: emailConfirmationTemplate,
    accountAlreadyExists: emailAlreadyExistsTemplate,
    emailAlreadyVerified: emailAlreadyVerifiedTemplate,
    passwordChanged: passwordChangedTemplate,
    emailDoesNotExistConfirmationMail: emailDoesNotExistConformationMailTemplate,
    emailDoesNotExistPasswordReset: emailDoesNotExistPasswordResetTemplate,
};
