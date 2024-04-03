/*
  Warnings:

  - The primary key for the `Content` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Content` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Content" DROP CONSTRAINT "Content_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT 0,
ADD CONSTRAINT "Content_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Video" DROP CONSTRAINT "Video_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT 0,
ADD CONSTRAINT "Video_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Content_id_key" ON "Content"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Video_id_key" ON "Video"("id");
