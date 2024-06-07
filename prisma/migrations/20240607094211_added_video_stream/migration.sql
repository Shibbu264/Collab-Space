/*
  Warnings:

  - You are about to drop the column `lastwatched` on the `VideoStream` table. All the data in the column will be lost.
  - Added the required column `lastwatchedduration` to the `VideoStream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastwatchedspeed` to the `VideoStream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoStream" DROP COLUMN "lastwatched",
ADD COLUMN     "lastwatchedduration" TEXT NOT NULL,
ADD COLUMN     "lastwatchedspeed" TEXT NOT NULL;
