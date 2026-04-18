/*
  Warnings:

  - You are about to drop the column `success` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "success";

-- CreateTable
CREATE TABLE "ApiLog" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,
    "ipAddress" TEXT,
    "device" TEXT,
    "apiKeyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApiLog_apiKeyId_idx" ON "ApiLog"("apiKeyId");

-- CreateIndex
CREATE INDEX "ApiLog_createdAt_idx" ON "ApiLog"("createdAt");

-- CreateIndex
CREATE INDEX "Api_key_userId_idx" ON "Api_key"("userId");

-- AddForeignKey
ALTER TABLE "ApiLog" ADD CONSTRAINT "ApiLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "Api_key"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
