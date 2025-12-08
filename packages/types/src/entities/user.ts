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
