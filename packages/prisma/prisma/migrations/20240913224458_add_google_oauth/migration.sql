/*
  Warnings:

  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('UNVERIFIED', 'VERIFIED', 'COMPLETE', 'INACTIVE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isVerified",
ADD COLUMN     "googleOAuthId" TEXT,
ADD COLUMN     "state" "UserState" NOT NULL DEFAULT 'UNVERIFIED',
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "salt" DROP NOT NULL;
