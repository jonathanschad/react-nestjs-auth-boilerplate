import assert from 'node:assert';
import { type Prisma, type Token, TokenType, type User, UserState } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import type { UserWithSettings } from '@/types/prisma';

type SanitizedUser = Omit<
    UserWithSettings,
    'password' | 'salt' | 'createdAt' | 'updatedAt' | 'googleOAuthId' | 'settingsId'
>;

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

    public sanitizeUser(user: UserWithSettings): SanitizedUser {
        return {
            name: user.name,
            id: user.id,
            email: user.email,
            state: user.state,
            profilePictureId: user.profilePictureId,
            settings: user.settings,
        };
    }
}
