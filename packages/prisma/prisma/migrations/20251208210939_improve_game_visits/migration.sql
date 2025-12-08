/*
  Warnings:

  - You are about to drop the column `totalScore` on the `GameVisit` table. All the data in the column will be lost.
  - You are about to drop the column `turnNumber` on the `GameVisit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId,visitNumber,playerId]` on the table `GameVisit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `outcome` to the `GameVisit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingScoreAfter` to the `GameVisit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingScoreBefore` to the `GameVisit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalScored` to the `GameVisit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitNumber` to the `GameVisit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameVisitOutcome" AS ENUM ('BUSTED', 'HIT', 'MISS');

-- DropIndex
DROP INDEX "GameVisit_gameId_turnNumber_playerId_key";

-- AlterTable
ALTER TABLE "GameVisit" DROP COLUMN "totalScore",
DROP COLUMN "turnNumber",
ADD COLUMN     "outcome" "GameVisitOutcome" NOT NULL,
ADD COLUMN     "remainingScoreAfter" INTEGER NOT NULL,
ADD COLUMN     "remainingScoreBefore" INTEGER NOT NULL,
ADD COLUMN     "totalScored" INTEGER NOT NULL,
ADD COLUMN     "visitNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameVisit_gameId_visitNumber_playerId_key" ON "GameVisit"("gameId", "visitNumber", "playerId");
