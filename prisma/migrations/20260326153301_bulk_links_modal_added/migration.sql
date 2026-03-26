-- CreateTable
CREATE TABLE "BulkLinks" (
    "id" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "password" TEXT,
    "expiresAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BulkLinks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BulkLinks" ADD CONSTRAINT "BulkLinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
