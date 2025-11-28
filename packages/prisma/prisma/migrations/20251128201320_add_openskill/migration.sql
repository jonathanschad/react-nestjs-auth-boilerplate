/*
  Warnings:

  - You are about to drop the column `eloChange` on the `EloHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EloHistory" DROP COLUMN "eloChange";

-- CreateTable
CREATE TABLE "OpenSkillHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "muBefore" DOUBLE PRECISION NOT NULL,
    "muAfter" DOUBLE PRECISION NOT NULL,
    "sigmaBefore" DOUBLE PRECISION NOT NULL,
    "sigmaAfter" DOUBLE PRECISION NOT NULL,
    "ordinalBefore" DOUBLE PRECISION NOT NULL,
    "ordinalAfter" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OpenSkillHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpenSkillHistory_gameId_playerId_key" ON "OpenSkillHistory"("gameId", "playerId");

-- AddForeignKey
ALTER TABLE "OpenSkillHistory" ADD CONSTRAINT "OpenSkillHistory_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenSkillHistory" ADD CONSTRAINT "OpenSkillHistory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
