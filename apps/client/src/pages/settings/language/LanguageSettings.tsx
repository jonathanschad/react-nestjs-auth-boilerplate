import type { Language } from '@boilerplate/types';
import { Button } from '@boilerplate/ui/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@boilerplate/ui/components/card';
import { useAppForm } from '@boilerplate/ui/form/useAppForm';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { formOptions } from '@tanstack/react-form/nextjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useGetUser } from '@/api/auth/useGetUser';
import { useUpdateUser } from '@/api/user/useUpdateUser';
import {
    CurrentSettingsRouteOptions,
    useSetSettingsCurrentActiveRoute,
} from '@/pages/settings/useSetSettingsCurrentActiveRoute';

export const LanguageSettings = () => {
    useSetSettingsCurrentActiveRoute(CurrentSettingsRouteOptions.LANGUAGE);
    const { t } = useTranslation('common');
    const { data: user, isLoading } = useGetUser();
    const updateUserMutation = useUpdateUser(user?.id ?? '');
    const [showSavedMessage, setShowSavedMessage] = useState(false);

    const languageOptions: { value: Language; label: string }[] = [
        { value: 'EN', label: t('language.en') },
        { value: 'DE', label: t('language.de') },
    ];

    const form = useAppForm({
        ...formOptions({
            defaultValues: {
                language: user?.settings.language ?? 'EN',
            },
            validators: {
                onSubmit: z.object({
                    language: z.enum(['EN', 'DE']),
                }),
            },
        }),
        onSubmit: ({ value }) => {
            if (!user) return;

            updateUserMutation.mutate(
                {
                    name: user.name,
                    language: value.language,
                    notificationsEnabled: user.settings.notificationsEnabled,
                },
                {
                    onSuccess: () => {
                        setShowSavedMessage(true);
                        setTimeout(() => setShowSavedMessage(false), 3000);
                    },
                },
            );
        },
    });

    useEffect(() => {
        if (user) {
            form.setFieldValue('language', user.settings.language);
        }
    }, [user, form]);

    if (isLoading || !user) {
        return <Translation as="p">loading</Translation>;
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
            }}
        >
            <Card>
                <CardHeader>
                    <Translation as="h4" element="div">
                        settings.language.title
                    </Translation>
                    <CardDescription>
                        <Translation>settings.language.description</Translation>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form.AppField
                        name="language"
                        children={(field) => (
                            <field.SelectField
                                label={t('language')}
                                options={languageOptions}
                                placeholder={t('language')}
                            />
                        )}
                    />
                </CardContent>

                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={updateUserMutation.isLoading}>
                        {showSavedMessage ? <Translation>saved</Translation> : <Translation>save</Translation>}
                    </Button>
                    {updateUserMutation.isError && (
                        <p className="ml-4 text-sm text-red-500">
                            <Translation>saveError</Translation>
                        </p>
                    )}
                </CardFooter>
            </Card>
        </form>
    );
};
