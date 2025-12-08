import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PasswordForgotDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email!: string;
}

export class PasswordForgotValidateDto {
    @IsNotEmpty()
    @IsString()
    token!: string;
}

export class PasswordChangeTokenDto {
    @IsNotEmpty()
    @IsString()
    token!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}

export class PasswordChangePasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email!: string;

    @IsNotEmpty()
    @IsString()
    newPassword!: string;

    @IsNotEmpty()
    @IsString()
    oldPassword!: string;
}
