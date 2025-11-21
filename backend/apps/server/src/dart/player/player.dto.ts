export type PlayerResponseDTO = {
    id: string;
    name: string;
    currentElo: number | null;
    lastGamePlayedAt: string | null;
};
