/*
  Warnings:

  - Added the required column `txtName` to the `CustomDomain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomDomain" ADD COLUMN     "txtName" TEXT NOT NULL;
