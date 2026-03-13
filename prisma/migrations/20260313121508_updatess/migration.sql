-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "ipAddress" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
