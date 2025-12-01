import { Language } from '@darts/prisma';
import { IsBoolean, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateUserProfilePictureDTO {
    @IsUUID()
    @IsNotEmpty()
    idempotencyKey!: string;
}

export class UserUpdateablePropertiesDTO {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEnum(Language)
    @IsNotEmpty()
    language!: Language;

    @IsBoolean()
    @IsNotEmpty()
    notificationsEnabled!: boolean;
}
