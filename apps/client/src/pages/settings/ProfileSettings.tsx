import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

import { Button } from '@boilerplate/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@boilerplate/ui/components/card';
import { Input } from '@boilerplate/ui/components/input';
import { Label } from '@boilerplate/ui/components/label';
import { useAppForm } from '@boilerplate/ui/form/useAppForm';
import { Translation } from '@boilerplate/ui/i18n/Translation';

import { ProfilePictureUpload } from '@/components/ProfilePictureUpload';
import { createInitialProfileEditFormValues, profileEditFormOptions, ProfileEditFormValues } from '@/forms/profile-edit-form';
import {
    CurrentSettingsRouteOptions,
    useSetSettingsCurrentActiveRoute,
} from '@/pages/settings/useSetSettingsCurrentActiveRoute';
import { changePassword, updateUserName } from '@/repository/user';
import { useUser } from '@/store/async-store';

export const ProfileSettings = () => {
    useSetSettingsCurrentActiveRoute(CurrentSettingsRouteOptions.PROFILE);
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    const { data: user } = useUser();

    const updateNameMutation = useMutation({
        mutationFn: updateUserName,
        onSuccess: () => {
            queryClient.invalidateQueries(['user']);
            toast.success(t('profile.nameUpdated'));
        },
        onError: () => {
            toast.error(t('profile.nameUpdateError'));
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
            changePassword(currentPassword, newPassword),
        onSuccess: () => {
            toast.success(t('profile.passwordChanged'));
            form.reset();
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || t('profile.passwordChangeError');
            toast.error(message);
        },
    });

    const form = useAppForm({
        ...profileEditFormOptions(t, createInitialProfileEditFormValues(user?.name || '')),
        onSubmit: async ({ value }) => {
            const { name, currentPassword, newPassword } = value;

            try {
                // Update name if it changed
                if (name !== user?.name) {
                    await updateNameMutation.mutateAsync(name);
                }

                // Change password if password fields are filled
                if (currentPassword && newPassword) {
                    await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
                }

                // If only name was updated and no password change, show success
                if (name !== user?.name && !currentPassword && !newPassword) {
                    // Success already shown by updateNameMutation
                }

                // If no changes were made
                if (name === user?.name && !currentPassword && !newPassword) {
                    toast.info(t('profile.noChanges'));
                }
            } catch (error) {
                // Errors are handled by individual mutations
            }
        },
    });

    const isLoading = updateNameMutation.isLoading || changePasswordMutation.isLoading;

    return (
        <>
            <Translation as={'h3'}>profile</Translation>

            {/* Profile Picture Section */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Translation>profile.picture</Translation>
                    </CardTitle>
                    <CardDescription>
                        <Translation>profile.pictureDescription</Translation>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfilePictureUpload />
                </CardContent>
            </Card>

            {/* Profile Information Section */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Translation>profile.information</Translation>
                    </CardTitle>
                    <CardDescription>
                        <Translation>profile.informationDescription</Translation>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        {/* Name Field */}
                        <form.Field name="name">
                            {(field) => (
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('profile.name')}</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder={t('profile.namePlaceholder')}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        disabled={isLoading}
                                        error={field.state.meta.isTouched && Boolean(field.state.meta.errors.length)}
                                        errorMessage={
                                            field.state.meta.isTouched && field.state.meta.errors.length > 0
                                                ? String(field.state.meta.errors[0])
                                                : undefined
                                        }
                                    />
                                </div>
                            )}
                        </form.Field>

                        {/* Email Field (Read-only) */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t('profile.email')}</Label>
                            <Input
                                id="email"
                                value={user?.email || ''}
                                disabled
                                readOnly
                            />
                        </div>

                        {/* Password Change Section */}
                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-4">
                                <Translation>profile.changePassword</Translation>
                            </h4>
                            
                            <div className="space-y-4">
                                <form.Field name="currentPassword">
                                    {(field) => (
                                        <div className="grid gap-2">
                                            <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                                            <Input
                                                id="currentPassword"
                                                name="currentPassword"
                                                type="password"
                                                placeholder={t('profile.currentPasswordPlaceholder')}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                disabled={isLoading}
                                                error={field.state.meta.isTouched && Boolean(field.state.meta.errors.length)}
                                                errorMessage={
                                                    field.state.meta.isTouched && field.state.meta.errors.length > 0
                                                        ? String(field.state.meta.errors[0])
                                                        : undefined
                                                }
                                            />
                                        </div>
                                    )}
                                </form.Field>

                                <form.Field name="newPassword">
                                    {(field) => (
                                        <div className="grid gap-2">
                                            <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                                            <Input
                                                id="newPassword"
                                                name="newPassword"
                                                type="password"
                                                placeholder={t('profile.newPasswordPlaceholder')}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                disabled={isLoading}
                                                error={field.state.meta.isTouched && Boolean(field.state.meta.errors.length)}
                                                errorMessage={
                                                    field.state.meta.isTouched && field.state.meta.errors.length > 0
                                                        ? String(field.state.meta.errors[0])
                                                        : undefined
                                                }
                                            />
                                        </div>
                                    )}
                                </form.Field>

                                <form.Field name="confirmPassword">
                                    {(field) => (
                                        <div className="grid gap-2">
                                            <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                placeholder={t('profile.confirmPasswordPlaceholder')}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                disabled={isLoading}
                                                error={field.state.meta.isTouched && Boolean(field.state.meta.errors.length)}
                                                errorMessage={
                                                    field.state.meta.isTouched && field.state.meta.errors.length > 0
                                                        ? String(field.state.meta.errors[0])
                                                        : undefined
                                                }
                                            />
                                        </div>
                                    )}
                                </form.Field>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Translation>profile.saving</Translation>
                                ) : (
                                    <Translation>profile.saveChanges</Translation>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
};
