/*
  Warnings:

  - Added the required column `path` to the `Defaults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Defaults` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Defaults" ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
