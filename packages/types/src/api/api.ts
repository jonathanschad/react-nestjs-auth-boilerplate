import { oc } from '@orpc/contract';
import { authContract, passwordContract, signupContract } from './auth/auth.api';
import { fileContract } from './file/file.api';
import { gameContract } from './game/game.api';
import { miscContract } from './misc/misc.api';
import { playerContract } from './player/player.api';
import { playerOfTheWeekContract } from './player/player-of-the-week';
import { rankingsContract } from './ranking/ranking.api';
import { userContract } from './user/user.api';

export const api = {
    auth: authContract,
    password: passwordContract,
    signup: signupContract,
    user: userContract,
    file: fileContract,
    misc: miscContract,
    dart: oc.prefix('/dart').router({
        game: gameContract,
        player: playerContract,
        rankings: rankingsContract,
        playerOfTheWeek: playerOfTheWeekContract,
    }),
};

export type AppContract = typeof api;
