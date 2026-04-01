/*
  Warnings:

  - You are about to drop the column `verified` on the `CustomDomain` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomDomain" DROP COLUMN "verified",
ADD COLUMN     "cnameTarget" TEXT,
ADD COLUMN     "cnameVerfied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subDomain" TEXT,
ADD COLUMN     "txtValue" TEXT,
ADD COLUMN     "txtVerified" BOOLEAN NOT NULL DEFAULT false;
