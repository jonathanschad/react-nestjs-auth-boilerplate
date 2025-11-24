import { GameCheckoutMode, GameType } from '@darts/prisma';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsUUID, Max, Min, ValidateNested } from 'class-validator';
import { AllowNull } from '@/util/validators/allow-null';

export class CreateGameParamsDTO {
    @IsUUID()
    uuid!: string;
}

export class GetGamePreviewParamsDTO {
    @IsUUID()
    playerAId!: string;

    @IsUUID()
    playerBId!: string;
}

export class CreateGameDTO {
    @IsUUID()
    playerAId!: string;

    @IsUUID()
    playerBId!: string;

    @IsUUID()
    winnerId!: string;

    @IsDate()
    @IsNotEmpty()
    gameStart!: Date;

    @IsDate()
    @IsNotEmpty()
    gameEnd!: Date;

    @IsEnum(GameType)
    type!: GameType;

    @IsEnum(GameCheckoutMode)
    checkoutMode!: GameCheckoutMode;

    @ValidateNested()
    @Type(() => GameTurnDTO)
    turns!: GameTurnDTO[];
}

export class GameTurnDTO {
    @IsUUID()
    playerId!: string;

    @IsInt()
    @Min(0)
    turnNumber!: number;

    @IsInt()
    @Min(0)
    throw1!: number | null;

    @IsInt()
    @Min(1)
    @Max(3)
    @AllowNull()
    throw1Multiplier!: number | null;

    @IsInt()
    @Min(0)
    @Max(25)
    @AllowNull()
    throw2!: number | null;

    @IsInt()
    @Min(0)
    @Max(25)
    @AllowNull()
    throw2Multiplier!: number | null;

    @IsInt()
    @Min(0)
    @Max(25)
    @AllowNull()
    throw3!: number | null;

    @IsInt()
    @Min(0)
    @Max(3)
    @AllowNull()
    throw3Multiplier!: number | null;
}

export type GamePreviewResponseDTO = {
    playerA: {
        id: string;
        name: string;
        elo: {
            onWin: number;
            onLoss: number;
            current: number;
        };
    };
    playerB: {
        id: string;
        name: string;
        elo: {
            onWin: number;
            onLoss: number;
            current: number;
        };
    };
};
