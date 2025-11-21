import { Alert, AlertDescription } from '@darts/ui/components/alert';
import { Button } from '@darts/ui/components/button';
import { useAppForm } from '@darts/ui/form/useAppForm';
import { Translation } from '@darts/ui/i18n/Translation';
import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import {
    type ResendEmailConfirmationFormValues,
    resendEmailConfirmationFormOptions,
} from '@/forms/resend-email-confirmation';
import { resendVerificationEmail } from '@/repository/login';

const SECONDS_UNTIL_EMAIL_CAN_BE_RESENT = 10 as const;

export const ResendEmailConfirmation = ({ email }: { email?: string | null }) => {
    const [lastSendEmail, setLastSendEmail] = useState<string | undefined>();
    const registeredEmail = email ?? sessionStorage.getItem('registerEmail');
    const [registerEmailSentAt, setRegisterEmailSentAt] = useState(
        new Date(parseInt(sessionStorage.getItem('registerEmailSentAt') ?? '0', 10)),
    );
    const [secondsUntilEmailCanBeResent, setSecondsUntilEmailCanBeResent] = useState(0);

    const { t } = useTranslation('common');
    const resendEmailVerification = useMutation({
        mutationFn: resendVerificationEmail,
    });

    const handleResendEmail = (values: ResendEmailConfirmationFormValues) => {
        sessionStorage.setItem('registerEmailSentAt', String(Date.now()));
        setRegisterEmailSentAt(new Date());
        resendEmailVerification.mutate({ email: values.email }, { onSuccess: () => setLastSendEmail(values.email) });
    };

    useEffect(() => {
        const calculateTimeUntilEmailCanBeResent = () => {
            const secondsSinceEmailWasSent = Math.floor((Date.now() - registerEmailSentAt.getTime()) / 1000);
            const secondsUntil = Math.max(SECONDS_UNTIL_EMAIL_CAN_BE_RESENT - secondsSinceEmailWasSent, 0);
            setSecondsUntilEmailCanBeResent(secondsUntil);
        };
        calculateTimeUntilEmailCanBeResent();
        const intervalId = window.setInterval(calculateTimeUntilEmailCanBeResent, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [registerEmailSentAt]);

    const form = useAppForm({
        ...resendEmailConfirmationFormOptions(t),
        defaultValues: { email: registeredEmail ?? '' },
        onSubmit: ({ value }) => {
            handleResendEmail(value);
        },
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
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
            >
                {!registeredEmail && (
                    <div className="mt-4">
                        <form.AppField
                            name="email"
                            children={(field) => (
                                <field.TextField
                                    type="email"
                                    autoComplete="email"
                                    label={t('email')}
                                    placeholder={t('emailPlaceholder')}
                                />
                            )}
                        />
                    </div>
                )}
                <Button
                    className="mt-4 w-full"
                    type="submit"
                    disabled={!form.state.isValid || secondsUntilEmailCanBeResent > 0}
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
