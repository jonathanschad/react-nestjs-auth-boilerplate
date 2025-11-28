-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_bullOffWinnerId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "bullOffWinnerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_bullOffWinnerId_fkey" FOREIGN KEY ("bullOffWinnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
