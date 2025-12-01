import { LanguageDTOEnum } from '@darts/types/entities/user';
import { Button } from '@darts/ui/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@darts/ui/components/card';
import { useAppForm } from '@darts/ui/form/useAppForm';
import { Translation } from '@darts/ui/i18n/Translation';
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

const createSettingsFormSchema = (t: (key: string) => string) =>
    z.object({
        name: z.string().min(1, t('formik.nameRequired')),
        language: z.nativeEnum(LanguageDTOEnum),
        notificationsEnabled: z.boolean(),
    });

export const GeneralSettings = () => {
    useSetSettingsCurrentActiveRoute(CurrentSettingsRouteOptions.GENERAL);
    const { t } = useTranslation('common');
    const { data: user, isLoading } = useGetUser();
    const updateUserMutation = useUpdateUser(user?.id ?? '');
    const [showSavedMessage, setShowSavedMessage] = useState(false);

    const languageOptions = [
        { value: LanguageDTOEnum.EN, label: t('language.en') },
        { value: LanguageDTOEnum.DE, label: t('language.de') },
    ];

    const form = useAppForm({
        ...formOptions({
            defaultValues: {
                name: user?.name ?? '',
                language: user?.settings.language ?? LanguageDTOEnum.EN,
                notificationsEnabled: user?.settings.notificationsEnabled ?? false,
            },
            validators: {
                onSubmit: createSettingsFormSchema(t),
            },
        }),
        onSubmit: ({ value }) => {
            if (!user) return;

            updateUserMutation.mutate(
                {
                    name: value.name,
                    language: value.language,
                    notificationsEnabled: value.notificationsEnabled,
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
            form.setFieldValue('name', user.name);
            form.setFieldValue('language', user.settings.language);
            form.setFieldValue('notificationsEnabled', user.settings.notificationsEnabled);
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
            className="grid gap-6"
        >
            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <Translation as="h4" element="div">
                        settings.profile.title
                    </Translation>
                    <CardDescription>
                        <Translation>settings.profile.description</Translation>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form.AppField
                        name="name"
                        children={(field) => (
                            <field.TextField
                                type="text"
                                autoComplete="name"
                                label={t('name')}
                                placeholder={t('namePlaceholder')}
                            />
                        )}
                    />
                </CardContent>
            </Card>

            {/* Language Settings */}
            <Card>
                <CardHeader>
                    <Translation as="h4" element="div">
                        settings.general.title
                    </Translation>
                    <CardDescription>
                        <Translation>settings.general.description</Translation>
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <Translation as="h4" element="div">
                        settings.notification.title
                    </Translation>
                    <CardDescription>
                        <Translation>settings.notification.description</Translation>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form.AppField
                        name="notificationsEnabled"
                        children={(field) => <field.Checkbox label={t('settings.notification.enabled')} />}
                    />
                </CardContent>
            </Card>

            {/* Save Button */}
            <Card>
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
