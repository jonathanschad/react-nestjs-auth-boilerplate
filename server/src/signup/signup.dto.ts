import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsTrue } from '@/util/validators/is-true';
export class SignupRequestDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email!: string;

    @IsBoolean()
    @IsTrue()
    acceptAgb: boolean = false;
}

export class CompleteSignupRequestDto extends SignupRequestDto {
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
