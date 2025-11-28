/*
  Warnings:

  - You are about to drop the column `bullOffWinner` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `Game` table. All the data in the column will be lost.
  - Added the required column `bullOffWinnerId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loserId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "bullOffWinner",
DROP COLUMN "winner",
ADD COLUMN     "bullOffWinnerId" TEXT NOT NULL,
ADD COLUMN     "loserId" TEXT NOT NULL,
ADD COLUMN     "winnerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_bullOffWinnerId_fkey" FOREIGN KEY ("bullOffWinnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
