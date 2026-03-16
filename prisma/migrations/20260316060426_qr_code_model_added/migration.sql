-- AlterTable
ALTER TABLE "Click" ADD COLUMN     "qrId" TEXT;

-- CreateTable
CREATE TABLE "Qr" (
    "id" TEXT NOT NULL,
    "qrName" TEXT,
    "shortUrl" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "ipAddress" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Qr_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Click_qrId_idx" ON "Click"("qrId");

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_qrId_fkey" FOREIGN KEY ("qrId") REFERENCES "Qr"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qr" ADD CONSTRAINT "Qr_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
