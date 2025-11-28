export class DatabaseHistoryInterface<DatabaseEntity, CreateInput, RatingType> {
    public getCurrentRatingByUserId(_userId: string): Promise<RatingType> {
        throw new Error('Not implemented');
    }

    public getPlayerHistory(_userId: string): Promise<DatabaseEntity[]> {
        throw new Error('Not implemented');
    }

    public createHistoryEntry(_entry: CreateInput): Promise<DatabaseEntity> {
        throw new Error('Not implemented');
    }

    public clearHistory(): Promise<void> {
        throw new Error('Not implemented');
    }

    public getRankingForUsersAtTimestamp(_timestamp: Date): Promise<{ userId: string; ranking: RatingType }[]> {
        throw new Error('Not implemented');
    }
}
