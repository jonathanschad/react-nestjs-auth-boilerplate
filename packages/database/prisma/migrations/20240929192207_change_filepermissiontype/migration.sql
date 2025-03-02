-- AlterEnum
ALTER TYPE "FilePermissionType" ADD VALUE 'DENIED';

-- AlterTable
ALTER TABLE "FilePermission" ALTER COLUMN "permission" SET NOT NULL,
ALTER COLUMN "permission" SET DATA TYPE "FilePermissionType" USING "permission"[1];
