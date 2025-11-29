import { GameCheckoutMode, GameType, Language, User, UserState } from '@darts/prisma';
import { Injectable, Logger } from '@nestjs/common';
import assert from 'assert';
import { MongoClient } from 'mongodb';
import * as uuid from 'uuid';
import { AppConfigService } from '@/config/app-config.service';
import { GameService } from '@/dart/game/game.service';
import { nameEmailMapping } from '@/dart/import/name-email-mapping';
import { DatabaseGameService } from '@/database/game/game.service';
import { DatabaseUserService } from '@/database/user/user.service';

interface MongoGame {
    _id: string;
    winner: string;
    loser: string;
    format: {
        type: string;
        legs: number;
    };
    date: Date;
}

@Injectable()
export class ImportGamesFromOldSystemService {
    private readonly logger = new Logger(ImportGamesFromOldSystemService.name);

    private client: MongoClient;
    private users: Map<string, User> = new Map();

    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly databaseUserService: DatabaseUserService,
        private readonly gameService: GameService,
        private readonly databaseGameService: DatabaseGameService,
    ) {
        this.client = new MongoClient(this.appConfigService.oldSystemMongoDbConnection);
    }

    private async getGames() {
        const db = this.client.db();
        const gamesCollection = db.collection<MongoGame>('games');
        const games = await gamesCollection.find({}).toArray();

        games.sort((a, b) => a.date.getTime() - b.date.getTime());

        return games;
    }

    private async upsertUser(name: string) {
        const email = nameEmailMapping[name];

        if (!email) {
            throw new Error(`No email found for user: ${name}`);
        }

        const existingUser = await this.databaseUserService.find({ email });

        if (existingUser) {
            this.users.set(name, existingUser);
            return;
        }

        const user = await this.databaseUserService.create({
            email,
            settings: {
                create: {
                    notificationsEnabled: true,
                    language: Language.DE,
                },
            },
            name,
            state: UserState.COMPLETE,
            password: Buffer.from(uuid.v4()),
            salt: uuid.v4(),
        });

        this.users.set(name, user);
    }

    private async upsertGame(game: MongoGame) {
        const winner = this.users.get(game.winner);
        const loser = this.users.get(game.loser);

        assert(winner, 'Winner not found');
        assert(loser, 'Loser not found');

        let type: GameType;
        switch (game.format.type) {
            case '301':
                type = GameType.X301;
                break;
            case '501':
                type = GameType.X501;
                break;
            default:
                throw new Error(`Unknown game type: ${game.format.type}`);
        }

        const existingGame = await this.databaseGameService.find({
            gameStart: game.date,
            gameEnd: game.date,
        });

        if (existingGame) {
            return;
        }

        await this.gameService.createGame(uuid.v4(), {
            playerAId: winner.id,
            playerBId: loser.id,
            winnerId: winner.id,
            gameStart: game.date,
            gameEnd: game.date,
            type,
            checkoutMode: GameCheckoutMode.DOUBLE_OUT,
            turns: [],
        });
    }

    async importGamesFromOldSystem() {
        try {
            this.logger.log('Connecting to MongoDB...');
            await this.client.connect();
            this.logger.log('Connected successfully');

            const games = await this.getGames();

            const users = new Set<string>();

            await this.databaseGameService.clearAllGames();

            for (const game of games) {
                const winner = game.winner;
                const loser = game.loser;

                users.add(winner);
                users.add(loser);
            }

            for (const user of users) {
                await this.upsertUser(user);
            }

            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                if (i % 100 === 0) {
                    this.logger.log(`Importing game ${i} of ${games.length} (${game.date.toISOString()})`);
                }
                await this.upsertGame(game);
            }
        } finally {
            await this.client.close();
            this.logger.log('Connection closed');
        }
    }
}
