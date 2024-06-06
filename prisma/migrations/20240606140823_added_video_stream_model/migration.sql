-- CreateTable
CREATE TABLE "VideoStream" (
    "id" TEXT NOT NULL,
    "roomid" TEXT NOT NULL,
    "lastwatched" TEXT NOT NULL,
    "lastwatchedlink" TEXT NOT NULL,
    "Chats" TEXT[],

    CONSTRAINT "VideoStream_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoStream_id_key" ON "VideoStream"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VideoStream_roomid_key" ON "VideoStream"("roomid");
