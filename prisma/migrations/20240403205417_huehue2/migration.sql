-- DropIndex
DROP INDEX "Content_id_key";

-- DropIndex
DROP INDEX "Video_id_key";

-- AlterTable
CREATE SEQUENCE content_id_seq;
ALTER TABLE "Content" ALTER COLUMN "id" SET DEFAULT nextval('content_id_seq');
ALTER SEQUENCE content_id_seq OWNED BY "Content"."id";

-- AlterTable
CREATE SEQUENCE video_id_seq;
ALTER TABLE "Video" ALTER COLUMN "id" SET DEFAULT nextval('video_id_seq');
ALTER SEQUENCE video_id_seq OWNED BY "Video"."id";
