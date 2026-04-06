/*
  Warnings:

  - A unique constraint covering the columns `[domain,subDomain]` on the table `CustomDomain` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CustomDomain_domain_key";

-- CreateIndex
CREATE UNIQUE INDEX "CustomDomain_domain_subDomain_key" ON "CustomDomain"("domain", "subDomain");
