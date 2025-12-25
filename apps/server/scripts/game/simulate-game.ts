/**
 * Game Simulation Script
 *
 * This script simulates a realistic dart game between two players.
 *
 * Features:
 * - Random but realistic dart throws
 * - Smart finishing strategy when below 40 points
 * - Automatic checkout with doubles in DOUBLE_OUT mode
 * - Makes score even when needed before finishing
 * - Realistic scoring patterns (average 40-60 per visit)
 *
 * How to run:
 * 1. Update PLAYER_A_UUID and PLAYER_B_UUID with real player UUIDs from your database
 * 2. Run: pnpm --filter @boilerplate/server dev:debug simulate-game
 *    OR: cd apps/server && pnpm dev:debug simulate-game
 *
 * You can also get player UUIDs by querying the database:
 *   SELECT id, name, email FROM "User";
 */

import { randomUUID } from 'node:crypto';
import { GameCheckoutMode, GameType, GameVisitCreateDTO } from '@boilerplate/types';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import type { RawServerDefault } from 'fastify';
import { GameService } from '@/dart/game/game.service';
import { DatabaseUserService } from '@/database/user/user.service';

// ⚠️ UPDATE THESE WITH ACTUAL PLAYER UUIDs FROM YOUR DATABASE ⚠️
// You can find player UUIDs by running: SELECT id, name FROM "User";
const PLAYER_A_UUID = 'f5402eb8-e030-40e9-980a-8bf52a52fafb';
const PLAYER_B_UUID = '7054485b-cd55-4c95-b5c5-6a0c2f74725e';

interface SimulationConfig {
    gameType: GameType;
    checkoutMode: GameCheckoutMode;
    playerAId: string;
    playerBId: string;
}

interface PlayerState {
    id: string;
    score: number;
    visitCount: number;
}

/**
 * Get valid doubles for checkout (2-40 in steps of 2)
 */
const getValidDoubles = (): number[] => {
    return Array.from({ length: 20 }, (_, i) => (i + 1) * 2);
};

/**
 * Check if a score can be finished with a valid double
 */
const canCheckoutWithDouble = (score: number): boolean => {
    const validDoubles = getValidDoubles();
    return validDoubles.includes(score);
};

/**
 * Generate a random throw value (0-20 or 25 for bull)
 */
const getRandomThrowValue = (): number => {
    const rand = Math.random();
    if (rand < 0.05) return 25; // 5% chance for bull (25 or 50 with double)
    if (rand < 0.15) return 0; // 10% chance for miss
    // Weighted towards higher scores (15-20)
    if (rand < 0.6) return Math.floor(Math.random() * 6) + 15; // 15-20
    return Math.floor(Math.random() * 14) + 1; // 1-14
};

/**
 * Generate a random multiplier (1=single, 2=double, 3=triple)
 */
const getRandomMultiplier = (value: number): number => {
    if (value === 0) return 1; // Miss has no multiplier
    if (value === 25) {
        // Bull: 50% single bull (25), 50% double bull (50)
        return Math.random() < 0.5 ? 1 : 2;
    }
    const rand = Math.random();
    if (rand < 0.65) return 1; // 65% single
    if (rand < 0.85) return 3; // 20% triple
    return 2; // 15% double
};

/**
 * Generate a strategic throw for finishing when below 40 points
 *
 * DOUBLE_OUT finishing strategy:
 * 1. If score is even and ≤40: Attempt to finish with a double (70% success rate)
 * 2. If score is odd and <40: Hit single 1 to make it even
 * 3. If score is 41-60: Set up for a common double finish (D20=40, D18=36, D16=32)
 *
 * Valid doubles for checkout: D2, D4, D6, D8, D10, D12, D14, D16, D18, D20, D25(bull)
 * Most common finishes: D20 (40), D19 (38), D18 (36), D16 (32), D12 (24), D10 (20)
 */
const generateFinishingThrow = ({
    currentScore,
    isDoubleOut,
}: {
    currentScore: number;
    throwsRemaining: number;
    isDoubleOut: boolean;
}): { value: number; multiplier: number } | null => {
    if (!isDoubleOut) {
        // SINGLE_OUT or MASTER_OUT - just hit the remaining score
        if (currentScore <= 60) {
            return { value: Math.min(currentScore, 20), multiplier: currentScore > 20 ? 3 : 1 };
        }
        return null;
    }

    // DOUBLE_OUT logic
    if (canCheckoutWithDouble(currentScore)) {
        // Can finish with a double (e.g., 40 = D20, 36 = D18, 32 = D16)
        const doubleValue = currentScore / 2;
        // 70% chance to hit the double and finish (realistic success rate)
        if (Math.random() < 0.7) {
            return { value: doubleValue, multiplier: 2 };
        }
        // 30% chance to miss the double
        return { value: 0, multiplier: 1 };
    }

    // Score is odd and below 40 - need to make it even for double checkout
    // Examples: 39 → hit S1 → 38 (D19), 37 → hit S1 → 36 (D18)
    if (currentScore % 2 === 1 && currentScore < 40) {
        return { value: 1, multiplier: 1 };
    }

    // Score between 40-60: try to get to a good finish (e.g., 32, 36, 40)
    if (currentScore > 40 && currentScore <= 60) {
        const targetFinish = 40; // Target D20 (most common finish)
        const neededScore = currentScore - targetFinish;
        if (neededScore <= 20) {
            return { value: neededScore, multiplier: 1 };
        }
        return { value: 20, multiplier: 1 };
    }

    return null; // No special finish strategy needed
};

/**
 * Generate a single throw for a player
 */
const generateThrow = ({
    currentScore,
    throwsRemaining,
    isDoubleOut,
}: {
    currentScore: number;
    throwsRemaining: number;
    isDoubleOut: boolean;
}): { value: number; multiplier: number } => {
    // Check if we should use finishing strategy
    if (currentScore < 40 || (currentScore <= 60 && Math.random() < 0.6)) {
        const finishThrow = generateFinishingThrow({ currentScore, throwsRemaining, isDoubleOut });
        if (finishThrow) return finishThrow;
    }

    // Normal throw
    const value = getRandomThrowValue();
    const multiplier = getRandomMultiplier(value);

    return { value, multiplier };
};

/**
 * Generate a complete visit (3 throws) for a player
 */
const generateVisit = ({
    player,
    visitNumber,
    checkoutMode,
}: {
    player: PlayerState;
    visitNumber: number;
    checkoutMode: GameCheckoutMode;
}): GameVisitCreateDTO => {
    const visit: GameVisitCreateDTO = {
        playerId: player.id,
        visitNumber,
        throw1: null,
        throw1Multiplier: null,
        throw2: null,
        throw2Multiplier: null,
        throw3: null,
        throw3Multiplier: null,
    };

    const isDoubleOut = checkoutMode === 'DOUBLE_OUT';
    let currentScore = player.score;

    // Throw 1
    const throw1 = generateThrow({ currentScore, throwsRemaining: 3, isDoubleOut });
    visit.throw1 = throw1.value;
    visit.throw1Multiplier = throw1.multiplier;
    const score1 = throw1.value * throw1.multiplier;

    // Check if throw would bust
    if (isDoubleOut && (currentScore - score1 === 1 || currentScore - score1 < 0)) {
        // Bust - only record the busting throw
        return visit;
    }

    currentScore -= score1;
    if (currentScore === 0 && (!isDoubleOut || throw1.multiplier === 2)) {
        // Finished!
        return visit;
    }

    // Throw 2
    const throw2 = generateThrow({ currentScore, throwsRemaining: 2, isDoubleOut });
    visit.throw2 = throw2.value;
    visit.throw2Multiplier = throw2.multiplier;
    const score2 = throw2.value * throw2.multiplier;

    if (isDoubleOut && (currentScore - score2 === 1 || currentScore - score2 < 0)) {
        // Bust on second throw
        return visit;
    }

    currentScore -= score2;
    if (currentScore === 0 && (!isDoubleOut || throw2.multiplier === 2)) {
        // Finished!
        return visit;
    }

    // Throw 3
    const throw3 = generateThrow({ currentScore, throwsRemaining: 1, isDoubleOut });
    visit.throw3 = throw3.value;
    visit.throw3Multiplier = throw3.multiplier;

    return visit;
};

/**
 * Calculate if a visit results in a finish
 */
const isFinishingVisit = (visit: GameVisitCreateDTO, currentScore: number, isDoubleOut: boolean): boolean => {
    let score = currentScore;

    // Process throw 1
    if (visit.throw1 !== null && visit.throw1Multiplier !== null) {
        const points = visit.throw1 * visit.throw1Multiplier;
        score -= points;

        if (score === 0 && (!isDoubleOut || visit.throw1Multiplier === 2)) return true;
        if (score < 0 || (isDoubleOut && score === 1)) return false; // Busted
    }

    // Process throw 2
    if (visit.throw2 !== null && visit.throw2Multiplier !== null) {
        const points = visit.throw2 * visit.throw2Multiplier;
        score -= points;

        if (score === 0 && (!isDoubleOut || visit.throw2Multiplier === 2)) return true;
        if (score < 0 || (isDoubleOut && score === 1)) return false; // Busted
    }

    // Process throw 3
    if (visit.throw3 !== null && visit.throw3Multiplier !== null) {
        const points = visit.throw3 * visit.throw3Multiplier;
        score -= points;

        if (score === 0 && (!isDoubleOut || visit.throw3Multiplier === 2)) return true;
    }

    return false;
};

/**
 * Calculate score after a visit
 */
const calculateScoreAfterVisit = (visit: GameVisitCreateDTO, currentScore: number, isDoubleOut: boolean): number => {
    let score = currentScore;
    let busted = false;

    // Process throw 1
    if (visit.throw1 !== null && visit.throw1Multiplier !== null) {
        const points = visit.throw1 * visit.throw1Multiplier;
        const newScore = score - points;

        if (newScore < 0 || (isDoubleOut && newScore === 1)) {
            busted = true;
        } else {
            score = newScore;
            if (score === 0 && (!isDoubleOut || visit.throw1Multiplier === 2)) return 0;
        }
    }

    if (busted) return currentScore; // Return original score on bust

    // Process throw 2
    if (visit.throw2 !== null && visit.throw2Multiplier !== null) {
        const points = visit.throw2 * visit.throw2Multiplier;
        const newScore = score - points;

        if (newScore < 0 || (isDoubleOut && newScore === 1)) {
            return currentScore; // Busted, return score before this visit
        }
        score = newScore;
        if (score === 0 && (!isDoubleOut || visit.throw2Multiplier === 2)) return 0;
    }

    // Process throw 3
    if (visit.throw3 !== null && visit.throw3Multiplier !== null) {
        const points = visit.throw3 * visit.throw3Multiplier;
        const newScore = score - points;

        if (newScore < 0 || (isDoubleOut && newScore === 1)) {
            return currentScore; // Busted, return score before this visit
        }
        score = newScore;
    }

    return score;
};

/**
 * Simulate a complete game
 */
const simulateGame = ({ gameType, checkoutMode, playerAId, playerBId }: SimulationConfig) => {
    const startingScore = gameType === 'X501' ? 501 : 301;
    const isDoubleOut = checkoutMode === 'DOUBLE_OUT';

    const playerA: PlayerState = {
        id: playerAId,
        score: startingScore,
        visitCount: 0,
    };

    const playerB: PlayerState = {
        id: playerBId,
        score: startingScore,
        visitCount: 0,
    };

    const visits: GameVisitCreateDTO[] = [];
    let visitNumber = 0;
    let currentPlayer = Math.random() < 0.5 ? playerA : playerB; // Random starting player
    let winner: PlayerState | null = null;

    console.log(`🎯 Starting ${gameType} game with ${checkoutMode}`);
    console.log(`   Player A starts with ${startingScore} points`);
    console.log(`   Player B starts with ${startingScore} points`);
    console.log(`   ${currentPlayer.id === playerA.id ? 'Player A' : 'Player B'} starts (bull-off winner)\n`);

    // Max 100 visits per player to prevent infinite loops
    const MAX_VISITS = 100;

    while (!winner && visitNumber < MAX_VISITS * 2) {
        const visit = generateVisit({ player: currentPlayer, visitNumber, checkoutMode });
        visits.push(visit);

        const scoreBefore = currentPlayer.score;
        currentPlayer.score = calculateScoreAfterVisit(visit, currentPlayer.score, isDoubleOut);
        const scoreAfter = currentPlayer.score;
        const scored = scoreBefore - scoreAfter;

        console.log(
            `Visit ${visitNumber + 1} - ${currentPlayer.id === playerA.id ? 'Player A' : 'Player B'}: ` +
                `${scoreBefore} → ${scoreAfter} (scored: ${scored})`,
        );

        if (isFinishingVisit(visit, scoreBefore, isDoubleOut)) {
            winner = currentPlayer;
            console.log(`\n🏆 ${winner.id === playerA.id ? 'Player A' : 'Player B'} wins!`);
            break;
        }

        visitNumber++;
        currentPlayer = currentPlayer.id === playerA.id ? playerB : playerA;
    }

    if (!winner) {
        // If no winner after max visits, pick the player with the lower score
        winner = playerA.score < playerB.score ? playerA : playerB;
        console.log(
            `\n⚠️  Max visits reached. Winner: ${winner.id === playerA.id ? 'Player A' : 'Player B'} (lower score)`,
        );
    }

    return {
        visits,
        winnerId: winner.id,
        playerAId,
        playerBId,
    };
};

export const main = async (app: NestFastifyApplication<RawServerDefault>) => {
    console.log('\n🎲 Starting game simulation...\n');

    const gameService = app.get(GameService);
    const userService = app.get(DatabaseUserService);

    // Validate that players exist
    console.log('🔍 Validating players...');
    try {
        const playerA = await userService.findByUuid(PLAYER_A_UUID);
        const playerB = await userService.findByUuid(PLAYER_B_UUID);

        console.log(`   Player A: ${playerA.name || playerA.email} (${playerA.id})`);
        console.log(`   Player B: ${playerB.name || playerB.email} (${playerB.id})\n`);
    } catch (error) {
        console.error('\n❌ Error: One or both players not found!');
        console.error('   Please update PLAYER_A_UUID and PLAYER_B_UUID in the script');
        console.error('   with valid player UUIDs from your database.\n');
        console.error('   You can find player UUIDs by running:');
        console.error('   SELECT id, name, email FROM "User";\n');
        throw error;
    }

    const config: SimulationConfig = {
        gameType: 'X501',
        checkoutMode: 'DOUBLE_OUT',
        playerAId: PLAYER_A_UUID,
        playerBId: PLAYER_B_UUID,
    };

    const simulation = simulateGame(config);

    const now = new Date();
    const gameStart = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago
    const gameEnd = now;

    const gameUuid = randomUUID();

    console.log(`\n📝 Creating game with UUID: ${gameUuid}`);
    console.log(`   Total visits: ${simulation.visits.length}`);
    console.log(`   Winner: ${simulation.winnerId === config.playerAId ? 'Player A' : 'Player B'}`);

    try {
        await gameService.createGame(
            gameUuid,
            {
                playerAId: config.playerAId,
                playerBId: config.playerBId,
                winnerId: simulation.winnerId,
                gameStart: gameStart.toISOString(),
                gameEnd: gameEnd.toISOString(),
                type: config.gameType,
                checkoutMode: config.checkoutMode,
                visits: simulation.visits,
            },
            true, // Send Slack notification
        );

        console.log('\n✅ Game simulation completed successfully!');
        console.log(`   View game at: /game/${gameUuid}\n`);
    } catch (error) {
        console.error('\n❌ Error creating game:', error);
        throw error;
    }
};
