import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsTrue } from '@/util/validators/is-true';
export class SignupRequestDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsBoolean()
    @IsTrue()
    acceptAgb: boolean = false;
}

export class VerifyEmailTokenDto {
    @IsNotEmpty()
    @IsString()
    token!: string;
}

export class ResendVerificationDto {
    @IsNotEmpty()
    @IsString()
    email!: string;
}
