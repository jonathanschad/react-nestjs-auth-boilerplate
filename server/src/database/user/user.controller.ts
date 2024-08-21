import { Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { JWTService } from '@/auth/jwt.service';

@Controller('users')
export class UserController {
    constructor(
        readonly prisma: PrismaService,
        readonly jwtService: JWTService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Get()
    async getUsers() {
        return { success: true };
    }
}
