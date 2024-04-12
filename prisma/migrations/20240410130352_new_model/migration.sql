/*
  Warnings:

  - You are about to drop the column `links` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "postId" TEXT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "links";

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
