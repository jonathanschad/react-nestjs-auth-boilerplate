export type SanitizedUser = {
    name: string | null;
    id: string;
    email: string;
    state: UserState;
    profilePictureId: string | null;
    settings: UserSettings;
};

export enum UserState {
    UNVERIFIED = 'UNVERIFIED',
    VERIFIED = 'VERIFIED',
    COMPLETE = 'COMPLETE',
    INACTIVE = 'INACTIVE',
}

export type UserSettings = {
    id: string;
    notificationsEnabled: boolean;
    language: Language;
    createdAt: Date;
    updatedAt: Date;
};

enum Language {
    EN = 'EN',
    DE = 'DE',
}
