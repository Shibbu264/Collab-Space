/*
  Warnings:

  - The primary key for the `VideoStream` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VideoStream` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "VideoStream_id_key";

-- AlterTable
ALTER TABLE "VideoStream" DROP CONSTRAINT "VideoStream_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "VideoStream_pkey" PRIMARY KEY ("id");
