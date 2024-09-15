import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { EmailVerificationToken, Prisma, User, UserState } from '@prisma/client';
import { UserWithSettings } from '@/types/prisma';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async find(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<UserWithSettings | null> {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput,
            include: {
                settings: true,
            },
        });
    }

    async findByEmail(email: string): Promise<UserWithSettings> {
        return await this.prisma.user.findFirstOrThrow({
            where: {
                email: email.toLowerCase(),
            },
            include: {
                settings: true,
            },
        });
    }

    async findByGoogleOAuthId(googleOAuthId: string): Promise<UserWithSettings> {
        return await this.prisma.user.findFirstOrThrow({
            where: {
                googleOAuthId: googleOAuthId,
            },
            include: {
                settings: true,
            },
        });
    }

    async verifyUser(emailVerificationToken: EmailVerificationToken): Promise<User> {
        const user = await this.prisma.user.update({
            where: {
                id: emailVerificationToken.userId,
                state: UserState.UNVERIFIED,
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
}
