/*
  Warnings:

  - You are about to drop the column `original` on the `BulkLinks` table. All the data in the column will be lost.
  - You are about to drop the column `shortUrl` on the `BulkLinks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BulkLinks" DROP COLUMN "original",
DROP COLUMN "shortUrl",
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "bulkLinksId" TEXT;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_bulkLinksId_fkey" FOREIGN KEY ("bulkLinksId") REFERENCES "BulkLinks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
