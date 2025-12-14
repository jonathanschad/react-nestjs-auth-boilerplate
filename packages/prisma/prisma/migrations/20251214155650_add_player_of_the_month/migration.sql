-- CreateTable
CREATE TABLE "PlayerOfTheWeek" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "eloDifference" DOUBLE PRECISION NOT NULL,
    "openSkillDifference" DOUBLE PRECISION NOT NULL,
    "averageScore" DOUBLE PRECISION NOT NULL,
    "scoringAverage" DOUBLE PRECISION NOT NULL,
    "numberOfGames" INTEGER NOT NULL,

    CONSTRAINT "PlayerOfTheWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerOfTheWeek_weekStart_key" ON "PlayerOfTheWeek"("weekStart");

-- AddForeignKey
ALTER TABLE "PlayerOfTheWeek" ADD CONSTRAINT "PlayerOfTheWeek_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
