/*
  Warnings:

  - You are about to drop the column `postId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_postId_fkey";

-- DropIndex
DROP INDEX "Vote_userId_postId_key";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "postId";

-- DropTable
DROP TABLE "Post";
