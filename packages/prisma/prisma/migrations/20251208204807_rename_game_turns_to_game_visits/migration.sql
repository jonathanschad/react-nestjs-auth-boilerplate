-- Rename table
ALTER TABLE "GameTurn" RENAME TO "GameVisit";

-- Rename primary key constraint
ALTER TABLE "GameVisit" RENAME CONSTRAINT "GameTurn_pkey" TO "GameVisit_pkey";

-- Rename foreign key constraints
ALTER TABLE "GameVisit" RENAME CONSTRAINT "GameTurn_gameId_fkey" TO "GameVisit_gameId_fkey";
ALTER TABLE "GameVisit" RENAME CONSTRAINT "GameTurn_playerId_fkey" TO "GameVisit_playerId_fkey";

-- Rename unique index
ALTER INDEX "GameTurn_gameId_turnNumber_playerId_key" RENAME TO "GameVisit_gameId_turnNumber_playerId_key";
