/*
  Warnings:

  - The primary key for the `Link` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `linkId` on the `Link` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - The required column `id` was added to the `Link` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_userId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP CONSTRAINT "Link_pkey",
DROP COLUMN "linkId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Link_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "name",
DROP COLUMN "provider",
DROP COLUMN "userId",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
