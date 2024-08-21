import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { EmailVerificationToken, Prisma, User } from '@prisma/client';
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

    async verifyUser(emailVerificationToken: EmailVerificationToken): Promise<User> {
        const user = await this.prisma.user.update({
            where: {
                id: emailVerificationToken.userId,
                isVerified: false,
            },
            data: {
                isVerified: true,
            },
        });

        return user;
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
}
