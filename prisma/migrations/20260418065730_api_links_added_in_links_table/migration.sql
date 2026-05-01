-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "apiLinkId" TEXT;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_apiLinkId_fkey" FOREIGN KEY ("apiLinkId") REFERENCES "Api_key"("id") ON DELETE SET NULL ON UPDATE CASCADE;
