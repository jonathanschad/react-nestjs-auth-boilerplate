-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('UNVERIFIED', 'VERIFIED', 'COMPLETE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'DE');

-- CreateEnum
CREATE TYPE "FileAccess" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "FilePermissionType" AS ENUM ('DENIED', 'READ', 'WRITE', 'DELETE', 'CREATOR');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'CONNECT_GOOGLE_ACCOUNT');

-- CreateEnum
CREATE TYPE "GamePlayer" AS ENUM ('PLAYER_A', 'PLAYER_B');

-- CreateEnum
CREATE TYPE "GameCheckoutMode" AS ENUM ('SINGLE_OUT', 'DOUBLE_OUT', 'MASTER_OUT');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('X301', 'X501');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "state" "UserState" NOT NULL DEFAULT 'UNVERIFIED',
    "googleOAuthId" TEXT,
    "password" BYTEA,
    "salt" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "settingsId" TEXT NOT NULL,
    "profilePictureId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "access" "FileAccess" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilePermission" (
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "FilePermissionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilePermission_pkey" PRIMARY KEY ("fileId","userId")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "refreshTokenId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "rememberUser" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("refreshTokenId")
);

-- CreateTable
CREATE TABLE "AccessToken" (
    "accessTokenId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "refreshTokenId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("accessTokenId")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "userId" TEXT NOT NULL,
    "hashedSecret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EloHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "eloBefore" DOUBLE PRECISION NOT NULL,
    "eloAfter" DOUBLE PRECISION NOT NULL,
    "gamesPlayedBefore" INTEGER NOT NULL DEFAULT 0,
    "gamesPlayedAfter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EloHistory_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerAId" TEXT NOT NULL,
    "playerBId" TEXT NOT NULL,
    "gameStart" TIMESTAMP(3) NOT NULL,
    "gameEnd" TIMESTAMP(3) NOT NULL,
    "bullOffWinnerId" TEXT,
    "winnerId" TEXT NOT NULL,
    "loserId" TEXT NOT NULL,
    "type" "GameType" NOT NULL,
    "checkoutMode" "GameCheckoutMode" NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameStatisticsIndividual" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "wonBullOff" BOOLEAN NOT NULL,
    "averageScore" DOUBLE PRECISION NOT NULL,
    "averageUntilFirstPossibleFinish" DOUBLE PRECISION NOT NULL,
    "throwsOnDouble" INTEGER NOT NULL,

    CONSTRAINT "GameStatisticsIndividual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameTurn" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "turnNumber" INTEGER NOT NULL,
    "throw1" INTEGER,
    "throw1Multiplier" INTEGER,
    "throw2" INTEGER,
    "throw2Multiplier" INTEGER,
    "throw3" INTEGER,
    "throw3Multiplier" INTEGER,
    "totalScore" INTEGER NOT NULL,

    CONSTRAINT "GameTurn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_settingsId_key" ON "User"("settingsId");

-- CreateIndex
CREATE UNIQUE INDEX "User_profilePictureId_key" ON "User"("profilePictureId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AccessToken_token_key" ON "AccessToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Token_hashedSecret_key" ON "Token"("hashedSecret");

-- CreateIndex
CREATE UNIQUE INDEX "EloHistory_gameId_playerId_key" ON "EloHistory"("gameId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "OpenSkillHistory_gameId_playerId_key" ON "OpenSkillHistory"("gameId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "GameStatisticsIndividual_gameId_playerId_key" ON "GameStatisticsIndividual"("gameId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "GameTurn_gameId_turnNumber_playerId_key" ON "GameTurn"("gameId", "turnNumber", "playerId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "UserSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilePermission" ADD CONSTRAINT "FilePermission_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilePermission" ADD CONSTRAINT "FilePermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_refreshTokenId_fkey" FOREIGN KEY ("refreshTokenId") REFERENCES "RefreshToken"("refreshTokenId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EloHistory" ADD CONSTRAINT "EloHistory_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EloHistory" ADD CONSTRAINT "EloHistory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenSkillHistory" ADD CONSTRAINT "OpenSkillHistory_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenSkillHistory" ADD CONSTRAINT "OpenSkillHistory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerAId_fkey" FOREIGN KEY ("playerAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerBId_fkey" FOREIGN KEY ("playerBId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_bullOffWinnerId_fkey" FOREIGN KEY ("bullOffWinnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStatisticsIndividual" ADD CONSTRAINT "GameStatisticsIndividual_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStatisticsIndividual" ADD CONSTRAINT "GameStatisticsIndividual_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTurn" ADD CONSTRAINT "GameTurn_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTurn" ADD CONSTRAINT "GameTurn_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
