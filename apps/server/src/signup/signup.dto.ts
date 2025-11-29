import { IsTrue } from '@darts/utils/validators/is-true';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class SignupRequestDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email!: string;

    @IsBoolean()
    @IsTrue()
    acceptPrivacyPolicy: boolean = false;
}

export class CompleteSignupRequestDto {
    @IsNotEmpty()
    @IsString()
    password!: string;

    @IsNotEmpty()
    @IsString()
    name!: string;
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
