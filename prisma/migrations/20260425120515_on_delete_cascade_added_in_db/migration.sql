-- DropForeignKey
ALTER TABLE "ApiLog" DROP CONSTRAINT "ApiLog_apiKeyId_fkey";

-- DropForeignKey
ALTER TABLE "Api_key" DROP CONSTRAINT "Api_key_userId_fkey";

-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_linkId_fkey";

-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_qrId_fkey";

-- DropForeignKey
ALTER TABLE "CustomDomain" DROP CONSTRAINT "CustomDomain_userId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_apiLinkId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_bulkLinksId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_bulkLinksId_fkey" FOREIGN KEY ("bulkLinksId") REFERENCES "BulkLinks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_apiLinkId_fkey" FOREIGN KEY ("apiLinkId") REFERENCES "Api_key"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_qrId_fkey" FOREIGN KEY ("qrId") REFERENCES "Qr"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomDomain" ADD CONSTRAINT "CustomDomain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Api_key" ADD CONSTRAINT "Api_key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiLog" ADD CONSTRAINT "ApiLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "Api_key"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
