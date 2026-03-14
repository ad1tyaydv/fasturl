/*
  Warnings:

  - A unique constraint covering the columns `[shorturl]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Link_shorturl_key" ON "Link"("shorturl");
