/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `JournalEntry` table. All the data in the column will be lost.
  - Added the required column `date` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentiment` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "updatedAt",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sentiment" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tags" TEXT[];
