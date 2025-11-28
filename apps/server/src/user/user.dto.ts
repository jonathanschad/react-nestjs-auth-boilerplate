import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserProfilePictureDTO {
    @IsUUID()
    @IsNotEmpty()
    idempotencyKey!: string;
}
