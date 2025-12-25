import assert from 'node:assert';
import { type Prisma, type Token, TokenType, type User, UserSettings, UserState } from '@boilerplate/prisma';
import type { PublicUser, SanitizedUserWithSettings } from '@boilerplate/types';
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

    async findMany(userWhereUniqueInput: Prisma.UserWhereInput): Promise<UserWithSettings[]> {
        return this.prisma.user.findMany({
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
    }): Promise<UserWithSettings> {
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
            return await this.prisma.user.update({
                where: { id: userId },
                data: { ...userUpdates, settings: { update: userSettingsUpdates } },
                include: {
                    settings: true,
                },
            });
        }

        return await this.findByUuid(userId);
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

        if (!data.email.endsWith('@pickware.de') && !data.email.endsWith('@boilerplate.com')) {
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

    public sanitizeUserWithSettings(user: UserWithSettings): SanitizedUserWithSettings {
        return {
            name: user.name ?? '',
            id: user.id,
            email: user.email,
            state: user.state,
            profilePictureId: user.profilePictureId,
            settings: {
                language: user.settings.language,
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

    async findAll(): Promise<Pick<User, 'id' | 'name' | 'profilePictureId'>[]> {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                profilePictureId: true,
            },
        });
    }
}
