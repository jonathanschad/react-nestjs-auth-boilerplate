import { GameCheckoutMode, GameType } from '@darts/prisma';
import { AllowNull } from '@darts/utils/validators/allow-null';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsUUID, Max, Min, ValidateNested } from 'class-validator';
import { PublicUser } from '../../entities/user';
import { ApiGetEndpoint, ApiPutEndpoint } from '../api';

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

export type GameTurnEntityApiDTO = {
    id: string;
    playerId: string;
    turnNumber: number;
    throw1: number | null;
    throw1Multiplier: number | null;
    throw2: number | null;
    throw2Multiplier: number | null;
    throw3: number | null;
    throw3Multiplier: number | null;
    totalScore: number;
};

export type GameEntityApiDTO = {
    id: string;
    playerA: string;
    playerB: string;
    winner: string;
    loser: string;
    gameStart: Date;
    gameEnd: Date;
    type: GameType;
    checkoutMode: GameCheckoutMode;
    turns?: GameTurnEntityApiDTO[];
};

export type GameController = {
    createGame: ApiPutEndpoint<CreateGameDTO, void>;
    getGamePreview: ApiGetEndpoint<GetGamePreviewParamsDTO, GamePreviewResponseDTO>;
};
