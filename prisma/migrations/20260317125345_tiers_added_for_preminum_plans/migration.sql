-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'ESSENTIAL', 'PRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "planExpiresAt" TIMESTAMP(3),
ADD COLUMN     "planStatedAt" TIMESTAMP(3);
