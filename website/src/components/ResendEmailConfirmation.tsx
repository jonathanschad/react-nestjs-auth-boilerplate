import { useFormik } from 'formik';
import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    resendEmailConfirmationFormValidationSchema,
    ResendEmailConfirmationFormValues,
} from '@/forms/resend-email-confirmation';
import { Translation } from '@/i18n/Translation';
import { resendVerificationEmail } from '@/repository/login';
const SECONDS_UNTIL_EMAIL_CAN_BE_RESENT = 10 as const;

export const ResendEmailConfirmation = ({ email }: { email?: string | null }) => {
    const [lastSendEmail, setLastSendEmail] = useState<string | undefined>();
    const registeredEmail = email ?? (sessionStorage.getItem('registerEmail') as string | null);
    const [registerEmailSentAt, setRegisterEmailSentAt] = useState(
        new Date(parseInt(sessionStorage.getItem('registerEmailSentAt') ?? '0')),
    );
    const [secondsUntilEmailCanBeResent, setSecondsUntilEmailCanBeResent] = useState(0);

    const { t } = useTranslation('common');
    const resendEmailVerification = useMutation({
        mutationFn: resendVerificationEmail,
    });

    const handleResendEmail = (values: ResendEmailConfirmationFormValues) => {
        sessionStorage.setItem('registerEmailSentAt', String(new Date().getTime()));
        setRegisterEmailSentAt(new Date());
        resendEmailVerification.mutate({ email: values.email }, { onSuccess: () => setLastSendEmail(values.email) });
    };

    useEffect(() => {
        const calculateTimeUntilEmailCanBeResent = () => {
            const secondsSinceEmailWasSent = Math.floor((new Date().getTime() - registerEmailSentAt.getTime()) / 1000);
            const secondsUntil = Math.max(SECONDS_UNTIL_EMAIL_CAN_BE_RESENT - secondsSinceEmailWasSent, 0);
            setSecondsUntilEmailCanBeResent(secondsUntil);
        };
        calculateTimeUntilEmailCanBeResent();
        const intervalId = window.setInterval(calculateTimeUntilEmailCanBeResent, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [registerEmailSentAt]);

    const formik = useFormik({
        initialValues: { email: registeredEmail ?? '' },
        validationSchema: resendEmailConfirmationFormValidationSchema,
        onSubmit: handleResendEmail,
    });

    return (
        <div className="w-full">
            {lastSendEmail && (
                <Alert variant="success">
                    <Send className="h-4 w-4" />
                    <AlertDescription>
                        <Translation translationParams={{ lastSendEmail }}>
                            resendEmailConfirmation.emailResend
                        </Translation>
                    </AlertDescription>
                </Alert>
            )}
            <form onSubmit={formik.handleSubmit}>
                {!registeredEmail && (
                    <div className="mt-4">
                        <Label htmlFor="email">
                            <Translation>email</Translation>
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            autoComplete="email"
                            type="email"
                            placeholder={t('emailPlaceholder')}
                            required
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            errorMessage={formik.touched.email && formik.errors.email}
                        />
                    </div>
                )}
                <Button
                    className="mt-4 w-full"
                    type="submit"
                    disabled={!formik.isValid || secondsUntilEmailCanBeResent > 0}
                >
                    <Translation translationParams={{ secondsUntilEmailCanBeResent }}>
                        {secondsUntilEmailCanBeResent > 0
                            ? 'resendEmailConfirmation.resendButtonDisabled'
                            : 'resendEmailConfirmation.resendButton'}
                    </Translation>
                </Button>
            </form>
        </div>
    );
};
