import { emailAlreadyExistsTemplate } from '@server/mail/templates/email-already-exists';
import { emailAlreadyVerifiedTemplate } from '@server/mail/templates/email-already-verified';
import { emailConfirmationTemplate } from '@server/mail/templates/email-confirmation';
import { emailDoesNotExistConformationMailTemplate } from '@server/mail/templates/email-doesnot-exist-confirmation-mail';
import { emailDoesNotExistPasswordResetTemplate } from '@server/mail/templates/email-doesnot-exist-password-reset';
import { passwordChangedTemplate } from '@server/mail/templates/password-changed';
import { passwordResetTemplate } from '@server/mail/templates/password-reset';

export const templates = {
    passwordReset: passwordResetTemplate,
    emailConfirmation: emailConfirmationTemplate,
    accountAlreadyExists: emailAlreadyExistsTemplate,
    emailAlreadyVerified: emailAlreadyVerifiedTemplate,
    passwordChanged: passwordChangedTemplate,
    emailDoesNotExistConfirmationMail: emailDoesNotExistConformationMailTemplate,
    emailDoesNotExistPasswordReset: emailDoesNotExistPasswordResetTemplate,
};
