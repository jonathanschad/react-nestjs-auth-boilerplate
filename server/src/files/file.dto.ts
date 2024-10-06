import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetFileDTO {
    @IsUUID()
    @IsNotEmpty()
    fileUuid!: string;
}
