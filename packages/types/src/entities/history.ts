export type EloHistoryEntityApiDTO = {
    id: string;
    gameId: string;
    playerId: string;
    eloBefore: number;
    eloAfter: number;
    gamesPlayedBefore: number;
    gamesPlayedAfter: number;
};

export type OpenSkillHistoryEntityApiDTO = {
    id: string;
    gameId: string;
    playerId: string;
    muBefore: number;
    muAfter: number;
    sigmaBefore: number;
    sigmaAfter: number;
    ordinalBefore: number;
    ordinalAfter: number;
};
