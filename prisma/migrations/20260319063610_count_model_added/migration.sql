-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_linkId_fkey";

-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_qrId_fkey";

-- CreateTable
CREATE TABLE "Count" (
    "countId" TEXT NOT NULL,
    "linkCount" INTEGER NOT NULL DEFAULT 0,
    "qrCount" INTEGER NOT NULL DEFAULT 0,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Count_pkey" PRIMARY KEY ("countId")
);

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_qrId_fkey" FOREIGN KEY ("qrId") REFERENCES "Qr"("id") ON DELETE SET NULL ON UPDATE CASCADE;
