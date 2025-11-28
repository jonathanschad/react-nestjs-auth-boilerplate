/*
  Warnings:

  - You are about to drop the column `player` on the `GameStatisticsIndividual` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId,playerId]` on the table `GameStatisticsIndividual` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playerId` to the `GameStatisticsIndividual` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GameStatisticsIndividual_gameId_player_key";

-- AlterTable
ALTER TABLE "GameStatisticsIndividual" DROP COLUMN "player",
ADD COLUMN     "playerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameStatisticsIndividual_gameId_playerId_key" ON "GameStatisticsIndividual"("gameId", "playerId");

-- AddForeignKey
ALTER TABLE "GameStatisticsIndividual" ADD CONSTRAINT "GameStatisticsIndividual_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
