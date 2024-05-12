-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "important" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "important" BOOLEAN NOT NULL DEFAULT false;
