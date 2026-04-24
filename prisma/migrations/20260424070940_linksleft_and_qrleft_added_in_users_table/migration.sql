/*
  Warnings:

  - You are about to drop the column `linksleft` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `qrLeft` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "linksleft",
DROP COLUMN "qrLeft",
ADD COLUMN     "linksUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "qrUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalLinksCreated" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalQrCreated" INTEGER NOT NULL DEFAULT 0;
