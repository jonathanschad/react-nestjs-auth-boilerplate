/*
  Warnings:

  - Added the required column `checkoutMode` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameCheckoutMode" AS ENUM ('SINGLE_OUT', 'DOUBLE_OUT', 'MASTER_OUT');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('X301', 'X501');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "checkoutMode" "GameCheckoutMode" NOT NULL,
ADD COLUMN     "type" "GameType" NOT NULL;
