import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AppConfigService } from '@/config/app-config.service';

@Injectable()
export class EmailVerificationTokenService {
    constructor(
        private prisma: PrismaService,
        private configService: AppConfigService,
    ) {}

    public async findEmailVerificationToken(hashedSecret: string) {
        const emailVerificationToken = await this.prisma.emailVerificationToken.findFirst({
            where: {
                hashedSecret,
                expiresAt: { gte: new Date() },
                valid: true,
            },
        });
        return emailVerificationToken;
    }

    public async invalidateEmailVerificationToken(hashedSecret: string) {
        await this.prisma.emailVerificationToken.update({
            where: {
                hashedSecret,
            },
            data: {
                valid: false,
            },
        });
    }
}
