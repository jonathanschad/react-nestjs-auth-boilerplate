import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SingInDTO {
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;

    @IsBoolean()
    remember: boolean = true;
}

export class GoogleOAuthDTO {
    @IsNotEmpty()
    @IsString()
    code!: string;
}

export class CompleteGoogleAccountConnectionDTO {
    @IsNotEmpty()
    @IsString()
    token!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}
