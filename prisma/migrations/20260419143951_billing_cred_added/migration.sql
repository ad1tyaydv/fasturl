-- AlterTable
ALTER TABLE "User" ADD COLUMN     "billingStatus" TEXT,
ADD COLUMN     "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "subscriptionId" TEXT;
