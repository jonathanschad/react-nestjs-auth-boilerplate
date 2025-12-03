import assert from 'node:assert';
import { Language, type Prisma, type Token, TokenType, type User, UserSettings, UserState } from '@darts/prisma';
import type { PublicUser, SanitizedUserWithSettings } from '@darts/types/entities/user';
import { LanguageDTOEnum, UserStateDTOEnum } from '@darts/types/entities/user';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import type { UserWithSettings } from '@/types/prisma';
@Injectable()
export class DatabaseUserService {
    constructor(private prisma: PrismaService) {}

    async find(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<UserWithSettings | null> {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput,
            include: {
                settings: true,
            },
        });
    }

    async findByEmail(email: string): Promise<UserWithSettings | null> {
        return await this.prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
            },
            include: {
                settings: true,
            },
        });
    }

    async findByUuid(uuid: string): Promise<UserWithSettings> {
        return await this.prisma.user.findFirstOrThrow({
            where: {
                id: uuid,
            },
            include: {
                settings: true,
            },
        });
    }

    async findByGoogleOAuthId(googleOAuthId: string): Promise<UserWithSettings | null> {
        return await this.prisma.user.findFirst({
            where: {
                googleOAuthId: googleOAuthId,
            },
            include: {
                settings: true,
            },
        });
    }

    async verifyUser(emailVerificationToken: Token): Promise<User> {
        assert(emailVerificationToken.type === TokenType.EMAIL_VERIFICATION);

        const user = await this.prisma.user.update({
            where: {
                id: emailVerificationToken.userId,
                state: {
                    in: [UserState.UNVERIFIED, UserState.VERIFIED],
                },
            },
            data: {
                state: UserState.VERIFIED,
            },
        });

        return user;
    }

    async update({
        userId,
        updates,
    }: {
        userId: string;
        updates: {
            name?: User['name'];
            language?: UserSettings['language'];
            notificationsEnabled?: UserSettings['notificationsEnabled'];
        };
    }): Promise<void> {
        const { name, language, notificationsEnabled } = updates;

        const userUpdates: Prisma.UserUpdateInput = {};
        if (name) {
            userUpdates.name = name.trim();
        }
        const userSettingsUpdates: Prisma.UserSettingsUpdateInput = {};
        if (language) {
            userSettingsUpdates.language = language;
        }
        if (notificationsEnabled !== undefined) {
            userSettingsUpdates.notificationsEnabled = notificationsEnabled;
        }

        if (Object.keys(userSettingsUpdates).length > 0) {
            userUpdates.settings = { update: userSettingsUpdates };
        }
        if (Object.keys(userUpdates).length > 0) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { ...userUpdates, settings: { update: userSettingsUpdates } },
            });
        }
    }

    async completeVerifiedUser({
        hashedPassword,
        salt,
        id,
        name,
    }: {
        hashedPassword: Buffer;
        salt: string;
        id: string;
        name: string;
    }): Promise<void> {
        await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                password: hashedPassword,
                salt,
                name,
                state: UserState.COMPLETE,
            },
        });
    }

    async changePassword({
        hashedPassword,
        salt,
        userId,
    }: {
        hashedPassword: Buffer;
        salt: string;
        userId: string;
    }): Promise<void> {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
                salt,
            },
        });
    }

    async updateProfilePicture({
        userId,
        profilePictureId,
    }: {
        userId: string;
        profilePictureId: string;
    }): Promise<UserWithSettings> {
        return await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                profilePictureId,
            },
            include: {
                settings: true,
            },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<UserWithSettings> {
        data.email = data.email.toLowerCase();

        if (!data.email.endsWith('@pickware.de') && !data.email.endsWith('@darts.com')) {
            throw new Error('Invalid email');
        }

        const createdUser = await this.prisma.user.create({
            data: data,
            include: {
                settings: true,
            },
        });

        return createdUser;
    }

    async connectGoogleAccount({ user, googleOAuthId }: { user: User; googleOAuthId: string }): Promise<User> {
        return await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                googleOAuthId,
            },
        });
    }

    private mapLanguageToDTOEnum(language: Language): LanguageDTOEnum {
        switch (language) {
            case Language.EN:
                return LanguageDTOEnum.EN;
            case Language.DE:
                return LanguageDTOEnum.DE;
        }
    }

    private mapUserStateToDTOEnum(state: UserState): UserStateDTOEnum {
        switch (state) {
            case UserState.UNVERIFIED:
                return UserStateDTOEnum.UNVERIFIED;
            case UserState.VERIFIED:
                return UserStateDTOEnum.VERIFIED;
            case UserState.COMPLETE:
                return UserStateDTOEnum.COMPLETE;
            case UserState.INACTIVE:
                return UserStateDTOEnum.INACTIVE;
        }
    }
    public sanitizeUserWithSettings(user: UserWithSettings): SanitizedUserWithSettings {
        return {
            name: user.name ?? '',
            id: user.id,
            email: user.email,
            state: this.mapUserStateToDTOEnum(user.state),
            profilePictureId: user.profilePictureId,
            settings: {
                language: this.mapLanguageToDTOEnum(user.settings.language),
                notificationsEnabled: user.settings.notificationsEnabled,
            },
        };
    }

    public sanitizeUser(user: User): PublicUser {
        return {
            name: user.name ?? '',
            id: user.id,
            profilePictureId: user.profilePictureId,
        };
    }

    async findAll(): Promise<Pick<User, 'id' | 'name'>[]> {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
            },
        });
    }
}
