-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "provider" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
