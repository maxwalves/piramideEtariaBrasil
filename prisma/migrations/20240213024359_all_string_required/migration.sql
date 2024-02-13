/*
  Warnings:

  - Made the column `url` on table `Censo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Censo" ALTER COLUMN "year" SET DATA TYPE TEXT,
ALTER COLUMN "url" SET NOT NULL;
