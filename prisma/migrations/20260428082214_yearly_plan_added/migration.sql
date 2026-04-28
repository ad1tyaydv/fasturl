-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "planType" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "planType" TEXT DEFAULT '';
