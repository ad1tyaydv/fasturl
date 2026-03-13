/*
  Warnings:

  - Added the required column `shorturl` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "shorturl" TEXT NOT NULL;
