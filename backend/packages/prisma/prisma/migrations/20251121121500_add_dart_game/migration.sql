-- CreateEnum
CREATE TYPE "GamePlayer" AS ENUM ('PLAYER_A', 'PLAYER_B');

-- CreateTable
CREATE TABLE "EloHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "eloBefore" DOUBLE PRECISION NOT NULL,
    "eloAfter" DOUBLE PRECISION NOT NULL,
    "eloChange" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "EloHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerAId" TEXT NOT NULL,
    "playerBId" TEXT NOT NULL,
    "gameStart" TIMESTAMP(3) NOT NULL,
    "gameEnd" TIMESTAMP(3) NOT NULL,
    "bullOffWinner" "GamePlayer" NOT NULL,
    "winner" "GamePlayer" NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameStatisticsIndividual" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,
    "player" "GamePlayer" NOT NULL,
    "wonBullOff" BOOLEAN NOT NULL,
    "averageScore" DOUBLE PRECISION NOT NULL,
    "averageUntilFirstPossibleFinish" DOUBLE PRECISION NOT NULL,
    "throwsOnDouble" INTEGER NOT NULL,

    CONSTRAINT "GameStatisticsIndividual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameTurn" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "turnNumber" INTEGER NOT NULL,
    "throw1" INTEGER,
    "throw1Multiplier" INTEGER,
    "throw2" INTEGER,
    "throw2Multiplier" INTEGER,
    "throw3" INTEGER,
    "throw3Multiplier" INTEGER,
    "totalScore" INTEGER NOT NULL,

    CONSTRAINT "GameTurn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EloHistory_gameId_playerId_key" ON "EloHistory"("gameId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "GameStatisticsIndividual_gameId_player_key" ON "GameStatisticsIndividual"("gameId", "player");

-- CreateIndex
CREATE UNIQUE INDEX "GameTurn_gameId_turnNumber_playerId_key" ON "GameTurn"("gameId", "turnNumber", "playerId");

-- AddForeignKey
ALTER TABLE "EloHistory" ADD CONSTRAINT "EloHistory_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EloHistory" ADD CONSTRAINT "EloHistory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerAId_fkey" FOREIGN KEY ("playerAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerBId_fkey" FOREIGN KEY ("playerBId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStatisticsIndividual" ADD CONSTRAINT "GameStatisticsIndividual_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTurn" ADD CONSTRAINT "GameTurn_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTurn" ADD CONSTRAINT "GameTurn_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
