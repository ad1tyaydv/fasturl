/*
  Warnings:

  - You are about to drop the column `planStatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "planStatedAt",
ADD COLUMN     "planStartedAt" TIMESTAMP(3);
