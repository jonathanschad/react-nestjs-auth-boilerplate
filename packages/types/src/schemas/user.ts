import { z } from 'zod';

// Enums
export const languageSchema = z.enum(['EN', 'DE']);
export const userStateSchema = z.enum(['UNVERIFIED', 'VERIFIED', 'COMPLETE', 'INACTIVE']);

// Public User
export const publicUserSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    profilePictureId: z.string().nullable(),
});

// User Settings
export const sanitizedUserSettingsSchema = z.object({
    notificationsEnabled: z.boolean(),
    language: languageSchema,
});

// User with Settings
export const sanitizedUserWithSettingsSchema = publicUserSchema.extend({
    email: z.string().email(),
    state: userStateSchema,
    settings: sanitizedUserSettingsSchema,
});

// DTOs
export const updateUserProfilePictureSchema = z.object({
    idempotencyKey: z.uuid(),
});

export const userUpdateablePropertiesSchema = z.object({
    name: z.string().min(1),
    language: languageSchema,
    notificationsEnabled: z.boolean(),
});

// Type exports
export type Language = z.infer<typeof languageSchema>;
export type UserState = z.infer<typeof userStateSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
export type SanitizedUserSettings = z.infer<typeof sanitizedUserSettingsSchema>;
export type SanitizedUserWithSettings = z.infer<typeof sanitizedUserWithSettingsSchema>;
export type UpdateUserProfilePictureDTO = z.infer<typeof updateUserProfilePictureSchema>;
export type UserUpdateablePropertiesDTO = z.infer<typeof userUpdateablePropertiesSchema>;
