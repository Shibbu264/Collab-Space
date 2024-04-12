/*
  Warnings:

  - You are about to drop the column `postId` on the `Link` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_postId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "postId";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "links" TEXT[];
