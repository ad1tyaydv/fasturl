-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "planStartedAt" DROP NOT NULL,
ALTER COLUMN "planEndedAt" DROP NOT NULL;
