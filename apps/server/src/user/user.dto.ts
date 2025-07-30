import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateUserProfilePictureDTO {
    @IsUUID()
    @IsNotEmpty()
    idempotencyKey!: string;
}

export class UpdateUserNameDTO {
    @IsString()
    @IsNotEmpty()
    name!: string;
}

export class ChangePasswordDTO {
    @IsString()
    @IsNotEmpty()
    currentPassword!: string;

    @IsString()
    @IsNotEmpty()
    newPassword!: string;
}
