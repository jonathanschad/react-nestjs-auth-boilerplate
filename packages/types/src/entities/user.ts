import type { Language, UserState } from '@darts/prisma';
import { ValidateEnum } from '../util/validate-enum';

export enum LanguageDTOEnum {
    EN = 'EN',
    DE = 'DE',
}

export enum UserStateDTOEnum {
    UNVERIFIED = 'UNVERIFIED',
    VERIFIED = 'VERIFIED',
    COMPLETE = 'COMPLETE',
    INACTIVE = 'INACTIVE',
}

// TypeScript validation: These will cause compile errors if enums don't match Prisma types
const _validateLanguageEnum: ValidateEnum<Language> = LanguageDTOEnum;
const _validateUserStateEnum: ValidateEnum<UserState> = UserStateDTOEnum;

export type PublicUser = {
    name: string;
    id: string;
    profilePictureId: string | null;
};

export type SanitizedUserSettings = {
    notificationsEnabled: boolean;
    language: LanguageDTOEnum;
};

export type SanitizedUserWithSettings = PublicUser & {
    email: string;
    state: UserStateDTOEnum;
    settings: SanitizedUserSettings;
};
