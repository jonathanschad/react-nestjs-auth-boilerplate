import { Language, UserState } from '@darts/prisma';

export type PublicUser = {
    name: string;
    id: string;
    profilePictureId: string | null;
};

export type SanitizedUserSettings = {
    notificationsEnabled: boolean;
    language: Language;
};

export type SanitizedUserWithSettings = PublicUser & {
    email: string;
    state: UserState;
    settings: SanitizedUserSettings;
};
