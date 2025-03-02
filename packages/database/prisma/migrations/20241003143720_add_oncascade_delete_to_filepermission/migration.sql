-- DropForeignKey
ALTER TABLE "FilePermission" DROP CONSTRAINT "FilePermission_fileId_fkey";

-- DropForeignKey
ALTER TABLE "FilePermission" DROP CONSTRAINT "FilePermission_userId_fkey";

-- AddForeignKey
ALTER TABLE "FilePermission" ADD CONSTRAINT "FilePermission_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilePermission" ADD CONSTRAINT "FilePermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
