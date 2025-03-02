/* eslint-disable no-restricted-imports */
import './google-oauth-button.css';

import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

import { startGoogleOAuthFlow } from '@client/repository/login';

import GoogleSVG from './google.svg?react';

export const GoogleOAuthButton = () => {
    const { t } = useTranslation('common');
    const queryClient = useQueryClient();

    const googleOAuthMutation = useMutation({
        mutationFn: startGoogleOAuthFlow,
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
    });
    return (
        <button
            className="google-oauth-button inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-5"
            onClick={(e) => {
                e.preventDefault();
                googleOAuthMutation.mutate();
            }}
        >
            <div className="flex justify-center">
                <GoogleSVG className="mr-2 h-4 flex-grow-0" />
                <span className="flex-1">{t('signInWithGoogle')}</span>
            </div>
        </button>
    );
};
