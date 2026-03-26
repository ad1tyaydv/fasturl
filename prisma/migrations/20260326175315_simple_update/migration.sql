/*
  Warnings:

  - You are about to drop the column `checkBulk` on the `BulkLinks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BulkLinks" DROP COLUMN "checkBulk";

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "checkBulk" BOOLEAN NOT NULL DEFAULT false;
