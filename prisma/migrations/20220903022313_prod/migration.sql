/*
  Warnings:

  - You are about to drop the `Defaults` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Defaults" DROP CONSTRAINT "Defaults_userId_fkey";

-- DropTable
DROP TABLE "Defaults";
