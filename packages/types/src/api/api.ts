import { initContract } from '@ts-rest/core';
import { gameContract } from './game/game.api';
import { playerContract } from './player/player.api';
import { rankingsContract } from './ranking/ranking.api';

const c = initContract();

export const api = c.router({
    dart: c.router({
        game: gameContract,
        player: playerContract,
        rankings: rankingsContract,
    }),
});

export type AppContract = typeof api;
