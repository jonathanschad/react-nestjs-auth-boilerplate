/**
 * Create Game Script
 *
 * This script creates a game with specific visit data for two players.
 *
 * How to run:
 * 1. Update PLAYER_A_UUID and PLAYER_B_UUID with real player UUIDs from your database
 * 2. Run: pnpm --filter @darts/server dev:debug create-game
 *    OR: cd apps/server && pnpm dev:debug create-game
 *
 * You can also get player UUIDs by querying the database:
 *   SELECT id, name, email FROM "User";
 */

import { randomUUID } from 'node:crypto';
import { GameVisitCreateDTO } from '@darts/types';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import type { RawServerDefault } from 'fastify';
import { GameService } from '@/dart/game/game.service';
import { DatabaseUserService } from '@/database/user/user.service';

// ⚠️ UPDATE THESE WITH ACTUAL PLAYER UUIDs FROM YOUR DATABASE ⚠️
// You can find player UUIDs by running: SELECT id, name FROM "User";
const PLAYER_A_UUID = '12424654-aa10-4e6e-bb0a-5e7b8e49e0b2'; // Spieler A
const PLAYER_B_UUID = '6943d87d-6b43-4342-82f1-51988d039f92'; // Spieler B

/**
 * Create the visits for both players based on the provided game data
 */
const createVisits = ({ playerAId, playerBId }: { playerAId: string; playerBId: string }): GameVisitCreateDTO[] => {
    const visits: GameVisitCreateDTO[] = [
        // Visit 1 - Player A: 20, 5, 20 = 45
        {
            playerId: playerAId,
            visitNumber: 0,
            throw1: 20,
            throw1Multiplier: 1,
            throw2: 5,
            throw2Multiplier: 1,
            throw3: 20,
            throw3Multiplier: 1,
        },
        // Visit 2 - Player B: 5, 20, T20 = 85
        {
            playerId: playerBId,
            visitNumber: 1,
            throw1: 5,
            throw1Multiplier: 1,
            throw2: 20,
            throw2Multiplier: 1,
            throw3: 20,
            throw3Multiplier: 3,
        },
        // Visit 3 - Player A: 1, 5, 5 = 11
        {
            playerId: playerAId,
            visitNumber: 2,
            throw1: 1,
            throw1Multiplier: 1,
            throw2: 5,
            throw2Multiplier: 1,
            throw3: 5,
            throw3Multiplier: 1,
        },
        // Visit 4 - Player B: 15, 18, Miss = 33
        {
            playerId: playerBId,
            visitNumber: 3,
            throw1: 15,
            throw1Multiplier: 1,
            throw2: 18,
            throw2Multiplier: 1,
            throw3: 0,
            throw3Multiplier: 1,
        },
        // Visit 5 - Player A: 20, 20, 12 = 52
        {
            playerId: playerAId,
            visitNumber: 4,
            throw1: 20,
            throw1Multiplier: 1,
            throw2: 20,
            throw2Multiplier: 1,
            throw3: 12,
            throw3Multiplier: 1,
        },
        // Visit 6 - Player B: D20, Miss, D20 = 80
        {
            playerId: playerBId,
            visitNumber: 5,
            throw1: 20,
            throw1Multiplier: 2,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 20,
            throw3Multiplier: 2,
        },
        // Visit 7 - Player A: 1, 1, 5 = 7
        {
            playerId: playerAId,
            visitNumber: 6,
            throw1: 1,
            throw1Multiplier: 1,
            throw2: 1,
            throw2Multiplier: 1,
            throw3: 5,
            throw3Multiplier: 1,
        },
        // Visit 8 - Player B: 20, 1, T5 = 36
        {
            playerId: playerBId,
            visitNumber: 7,
            throw1: 20,
            throw1Multiplier: 1,
            throw2: 1,
            throw2Multiplier: 1,
            throw3: 5,
            throw3Multiplier: 3,
        },
        // Visit 9 - Player A: T20, 20, T18 = 134
        {
            playerId: playerAId,
            visitNumber: 8,
            throw1: 20,
            throw1Multiplier: 3,
            throw2: 20,
            throw2Multiplier: 1,
            throw3: 18,
            throw3Multiplier: 3,
        },
        // Visit 10 - Player B: 1, T5, T20 = Bust
        {
            playerId: playerBId,
            visitNumber: 9,
            throw1: 1,
            throw1Multiplier: 1,
            throw2: 5,
            throw2Multiplier: 3,
            throw3: 20,
            throw3Multiplier: 3,
        },
        // Visit 11 - Player A: 1, 19, Miss = 20
        {
            playerId: playerAId,
            visitNumber: 10,
            throw1: 1,
            throw1Multiplier: 1,
            throw2: 19,
            throw2Multiplier: 1,
            throw3: 0,
            throw3Multiplier: 1,
        },
        // Visit 12 - Player B: 5, 20, 17 = 42
        {
            playerId: playerBId,
            visitNumber: 11,
            throw1: 5,
            throw1Multiplier: 1,
            throw2: 20,
            throw2Multiplier: 1,
            throw3: 17,
            throw3Multiplier: 1,
        },
        // Visit 13 - Player A: Miss, Miss, Miss = 0
        {
            playerId: playerAId,
            visitNumber: 12,
            throw1: 0,
            throw1Multiplier: 1,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 0,
            throw3Multiplier: 1,
        },
        // Visit 14 - Player B: 5, Miss, Miss = 5
        {
            playerId: playerBId,
            visitNumber: 13,
            throw1: 5,
            throw1Multiplier: 1,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 0,
            throw3Multiplier: 1,
        },
        // Visit 15 - Player A: 8, 12, D13 = Bust (8+12+26=46 would go from 32 to -14)
        {
            playerId: playerAId,
            visitNumber: 14,
            throw1: 8,
            throw1Multiplier: 1,
            throw2: 12,
            throw2Multiplier: 1,
            throw3: 13,
            throw3Multiplier: 2,
        },
        // Visit 16 - Player B: Miss, Miss, Miss = 0
        {
            playerId: playerBId,
            visitNumber: 15,
            throw1: 0,
            throw1Multiplier: 1,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 0,
            throw3Multiplier: 1,
        },
        // Visit 17 - Player A: Miss, Miss, Miss = 0
        {
            playerId: playerAId,
            visitNumber: 16,
            throw1: 0,
            throw1Multiplier: 1,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 0,
            throw3Multiplier: 1,
        },
        // Visit 18 - Player B: D6, Miss, Miss = 12
        {
            playerId: playerBId,
            visitNumber: 17,
            throw1: 6,
            throw1Multiplier: 2,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 0,
            throw3Multiplier: 1,
        },
        // Visit 19 - Player A: Miss, Miss, Miss = 0
        {
            playerId: playerAId,
            visitNumber: 18,
            throw1: 0,
            throw1Multiplier: 1,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 0,
            throw3Multiplier: 1,
        },
        // Visit 20 - Player B: 4, Miss, 13 = Bust (would go to -9)
        {
            playerId: playerBId,
            visitNumber: 19,
            throw1: 4,
            throw1Multiplier: 1,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 13,
            throw3Multiplier: 1,
        },
        // Visit 21 - Player A: Miss, Miss, Miss = 0
        {
            playerId: playerAId,
            visitNumber: 20,
            throw1: 0,
            throw1Multiplier: 1,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 0,
            throw3Multiplier: 1,
        },
        // Visit 22 - Player B: 13 = Bust (would go to -5)
        {
            playerId: playerBId,
            visitNumber: 21,
            throw1: 13,
            throw1Multiplier: 1,
            throw2: null,
            throw2Multiplier: null,
            throw3: null,
            throw3Multiplier: null,
        },
        // Visit 23 - Player A: Miss, Miss, Miss = 0
        {
            playerId: playerAId,
            visitNumber: 22,
            throw1: 0,
            throw1Multiplier: 1,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 0,
            throw3Multiplier: 1,
        },
        // Visit 24 - Player B: 4, 2, 18 = Bust (would go to -16)
        {
            playerId: playerBId,
            visitNumber: 23,
            throw1: 4,
            throw1Multiplier: 1,
            throw2: 2,
            throw2Multiplier: 1,
            throw3: 18,
            throw3Multiplier: 1,
        },
        // Visit 25 - Player A: Miss, Miss, Miss = 0
        {
            playerId: playerAId,
            visitNumber: 24,
            throw1: 0,
            throw1Multiplier: 1,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 0,
            throw3Multiplier: 1,
        },
        // Visit 26 - Player B: 13 = Bust
        {
            playerId: playerBId,
            visitNumber: 25,
            throw1: 13,
            throw1Multiplier: 1,
            throw2: null,
            throw2Multiplier: null,
            throw3: null,
            throw3Multiplier: null,
        },
        // Visit 27 - Player A: D16 = 32 (WIN!)
        {
            playerId: playerAId,
            visitNumber: 26,
            throw1: 16,
            throw1Multiplier: 2,
            throw2: null,
            throw2Multiplier: null,
            throw3: null,
            throw3Multiplier: null,
        },
        // Visit 28 - Player B: 4, Miss, 2 = 6
        {
            playerId: playerBId,
            visitNumber: 27,
            throw1: 4,
            throw1Multiplier: 1,
            throw2: 0,
            throw2Multiplier: 1,
            throw3: 2,
            throw3Multiplier: 1,
        },
    ];

    return visits;
};

export const main = async (app: NestFastifyApplication<RawServerDefault>) => {
    console.log('\n🎯 Creating game with specific visit data...\n');

    const gameService = app.get(GameService);
    const userService = app.get(DatabaseUserService);

    // Validate that players exist
    console.log('🔍 Validating players...');
    try {
        const playerA = await userService.findByUuid(PLAYER_A_UUID);
        const playerB = await userService.findByUuid(PLAYER_B_UUID);

        console.log(`   Player A (Spieler A): ${playerA.name || playerA.email} (${playerA.id})`);
        console.log(`   Player B (Spieler B): ${playerB.name || playerB.email} (${playerB.id})\n`);
    } catch (error) {
        console.error('\n❌ Error: One or both players not found!');
        console.error('   Please update PLAYER_A_UUID and PLAYER_B_UUID in the script');
        console.error('   with valid player UUIDs from your database.\n');
        console.error('   You can find player UUIDs by running:');
        console.error('   SELECT id, name, email FROM "User";\n');
        throw error;
    }

    const visits = createVisits({
        playerAId: PLAYER_A_UUID,
        playerBId: PLAYER_B_UUID,
    });

    const now = new Date();
    const gameStart = new Date(now.getTime() - 45 * 60 * 1000); // 45 minutes ago
    const gameEnd = now;

    const gameUuid = randomUUID();

    console.log(`📝 Creating game with UUID: ${gameUuid}`);
    console.log(`   Game Type: X301`);
    console.log(`   Checkout Mode: DOUBLE_OUT`);
    console.log(`   Total visits: ${visits.length}`);
    console.log(`   Winner: Player A (Spieler A)`);
    console.log(`   Game Start: ${gameStart.toISOString()}`);
    console.log(`   Game End: ${gameEnd.toISOString()}\n`);

    try {
        await gameService.createGame(
            gameUuid,
            {
                playerAId: PLAYER_A_UUID,
                playerBId: PLAYER_B_UUID,
                winnerId: PLAYER_A_UUID, // Player A won with D16
                gameStart: gameStart.toISOString(),
                gameEnd: gameEnd.toISOString(),
                type: 'X301',
                checkoutMode: 'DOUBLE_OUT',
                visits: visits,
            },
            true, // Send Slack notification
        );

        console.log('✅ Game created successfully!');
        console.log(`   View game at: /game/${gameUuid}\n`);
    } catch (error) {
        console.error('\n❌ Error creating game:', error);
        throw error;
    }
};
