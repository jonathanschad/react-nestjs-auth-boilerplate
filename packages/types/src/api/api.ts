import { initContract } from '@ts-rest/core';
import { authContract } from './auth/auth.api';
import { fileContract } from './file/file.api';
import { gameContract } from './game/game.api';
import { miscContract } from './misc/misc.api';
import { playerContract } from './player/player.api';
import { rankingsContract } from './ranking/ranking.api';
import { userContract } from './user/user.api';

const c = initContract();

export const api = c.router({
    auth: authContract,
    user: userContract,
    file: fileContract,
    misc: miscContract,
    dart: c.router({
        game: gameContract,
        player: playerContract,
        rankings: rankingsContract,
    }),
});

export type AppContract = typeof api;
