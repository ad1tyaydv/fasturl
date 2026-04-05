-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twofactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twofactorSecret" TEXT;
