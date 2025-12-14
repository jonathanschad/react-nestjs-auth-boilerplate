import { User } from '@darts/prisma';
import { Injectable, Logger } from '@nestjs/common';
import type { MessageAttachment } from '@slack/web-api';
import { WebClient } from '@slack/web-api';
import assert from 'assert';
import { AppConfigService } from '@/config/app-config.service';
import { PlayerOfTheWeekData } from '@/dart/player/player-of-the-week.service';
import { GameResult } from '@/dart/ranking/ranking';
import { UserWithSettings } from '@/types/prisma';

export interface SlackMessageOptions {
    text: string;
    threadTs?: string;
    blocks?: unknown[];
    attachments?: MessageAttachment[];
}

@Injectable()
export class SlackService {
    private readonly logger = new Logger(SlackService.name);
    private readonly client: WebClient | null = null;
    private readonly enabled: boolean;

    constructor(private readonly appConfigService: AppConfigService) {
        const token = this.appConfigService.slackBotToken;

        if (token) {
            this.client = new WebClient(token);
            this.enabled = true;
            this.logger.log('Slack integration enabled');
        } else {
            this.enabled = false;
            this.logger.warn('Slack integration disabled - SLACK_BOT_TOKEN not configured');
        }
    }

    /**
     * Send a message to a Slack channel
     */
    private async sendMessage({ text, threadTs, blocks, attachments }: SlackMessageOptions): Promise<void> {
        if (!this.enabled || !this.client) {
            this.logger.warn('Slack is disabled, skipping message send');
            return;
        }

        const targetChannel = this.appConfigService.slackDefaultChannel;

        if (!targetChannel) {
            this.logger.error('No channel specified and no default channel configured');
            return;
        }

        try {
            const messageOptions: {
                channel: string;
                text: string;
                thread_ts?: string;
                blocks?: unknown[];
                attachments?: MessageAttachment[];
            } = {
                channel: targetChannel,
                text,
            };

            if (threadTs) {
                messageOptions.thread_ts = threadTs;
            }
            if (blocks) {
                messageOptions.blocks = blocks;
            }
            if (attachments) {
                messageOptions.attachments = attachments;
            }

            await this.client.chat.postMessage(messageOptions);

            this.logger.log(`Message sent to channel: ${targetChannel}`);
        } catch (error) {
            this.logger.error(
                `Failed to send Slack message: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
            throw error;
        }
    }

    /**
     * Send a simple text message to the default channel
     */
    private async sendSimpleMessage(text: string): Promise<void> {
        await this.sendMessage({ text });
    }

    /**
     * Send a formatted message with blocks
     */
    private async sendFormattedMessage({
        text,
        title,
        fields,
        color,
    }: {
        text: string;
        title?: string;
        fields?: { title: string; value: string; short?: boolean }[];
        color?: string;
    }): Promise<void> {
        const attachments: MessageAttachment[] = [
            {
                color: color || 'good',
                title: title || undefined,
                text,
                fields: fields || undefined,
                footer: this.appConfigService.frontendPublicUrl,
                ts: String(Math.floor(Date.now() / 1000)),
            },
        ];

        await this.sendMessage({
            text,
            attachments,
        });
    }

    async sendNewGameNotification({
        playerA,
        playerB,
        result,
    }: {
        playerA: {
            name: string;
            ratingBefore?: number | null;
            ratingAfter?: number | null;
        };
        playerB: {
            name: string;
            ratingBefore?: number | null;
            ratingAfter?: number | null;
        };
        result: GameResult;
    }): Promise<void> {
        const winner = result === GameResult.WIN_PLAYER_A ? playerA : playerB;
        const loser = result === GameResult.WIN_PLAYER_A ? playerB : playerA;

        const formatNumber = (number: number) => {
            if (number === 0) {
                return `±${number}`;
            }
            if (number > 0) {
                return `+${number}`;
            }
            return `-${Math.abs(number)}`;
        };

        const getRatingString = (rankBefore?: number | null, rankAfter?: number | null) => {
            if (rankBefore && rankAfter) {
                return `Rang: ${rankAfter} | ${formatNumber(rankBefore - rankAfter)}`;
            }
            if (rankAfter) {
                return `Neuer Rang: ${rankAfter}`;
            }
            return 'Noch kein Rang';
        };

        const winnerRankString = getRatingString(winner.ratingBefore, winner.ratingAfter);
        const loserRankString = getRatingString(loser.ratingBefore, loser.ratingAfter);

        await this.sendMessage({
            text: `${winner.name} (${winnerRankString}) hat gegen ${loser.name} (${loserRankString}) gewonnen! :dart:`,
        });
    }

    public async newPlayerSignupNotification({ player }: { player: Pick<User, 'name'> }): Promise<void> {
        await this.sendMessage({
            text: `${player.name} ist jetzt auch dabei! :blob_wave:`,
        });
    }

    public async newPlayerOfTheWeekNotification({
        players,
        playerOfTheWeekData,
    }: {
        players: UserWithSettings[];
        playerOfTheWeekData: PlayerOfTheWeekData[];
    }): Promise<void> {
        const playerOfTheWeek = playerOfTheWeekData[0];
        const playerOfTheWeekPlayer = players.find((player) => player.id === playerOfTheWeek.playerId);
        assert(playerOfTheWeekPlayer);

        const formatNumber = (number: number) => {
            if (number === 0) {
                return `±${number.toFixed(1)}`;
            }
            if (number > 0) {
                return `+${number.toFixed(1)}`;
            }
            return `${number.toFixed(1)}`;
        };

        // Build top 5 leaderboard text
        const top5 = playerOfTheWeekData.slice(0, 5);
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        const leaderboardText = top5
            .map((data, index) => {
                const player = players.find((p) => p.id === data.playerId);
                if (!player) return null;
                return `${medals[index]} *${player.name}* - Elo: ${formatNumber(data.eloDifference)} (${data.numberOfGames} Spiele)`;
            })
            .filter(Boolean)
            .join('\n');

        const blocks = [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `🏆 ${playerOfTheWeekPlayer.name} 🏆`,
                    emoji: true,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Spieler der Woche!*\n${playerOfTheWeek.numberOfGames} Spiele | Elo: ${formatNumber(playerOfTheWeek.eloDifference)} | OpenSkill: ${formatNumber(playerOfTheWeek.openSkillDifference)} | Avg: ${playerOfTheWeek.averageScore.toFixed(1)}`,
                },
            },
            {
                type: 'divider',
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Top ${top5.length} dieser Woche*\n${leaderboardText}`,
                },
            },
        ];

        await this.sendMessage({
            text: `${playerOfTheWeekPlayer.name} ist der neue Spieler der Woche!`,
            blocks,
        });
    }
}
