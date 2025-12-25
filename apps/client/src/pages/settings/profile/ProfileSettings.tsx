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
import { ProfilePictureUpload } from '@/pages/settings/profile/ProfilePictureUpload';
import {
    CurrentSettingsRouteOptions,
    useSetSettingsCurrentActiveRoute,
} from '@/pages/settings/useSetSettingsCurrentActiveRoute';

const createProfileFormSchema = (t: (key: string) => string) =>
    z.object({
        name: z.string().min(1, t('formik.nameRequired')),
    });

export const ProfileSettings = () => {
    useSetSettingsCurrentActiveRoute(CurrentSettingsRouteOptions.PROFILE);
    const { t } = useTranslation('common');
    const { data: user, isLoading } = useGetUser();
    const updateUserMutation = useUpdateUser(user?.id ?? '');
    const [showSavedMessage, setShowSavedMessage] = useState(false);

    const form = useAppForm({
        ...formOptions({
            defaultValues: {
                name: user?.name ?? '',
            },
            validators: {
                onSubmit: createProfileFormSchema(t),
            },
        }),
        onSubmit: ({ value }) => {
            if (!user) return;

            updateUserMutation.mutate(
                {
                    name: value.name,
                    language: user.settings.language,
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
            form.setFieldValue('name', user.name);
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
                        settings.profile.title
                    </Translation>
                    <CardDescription>
                        <Translation>settings.profile.description</Translation>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ProfilePictureUpload userUuid={user.id} />
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
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            <Translation>email</Translation>
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
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
