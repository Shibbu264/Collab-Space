
import { prisma } from '@/prismahook/prisma';
// const prisma=new PrismaClient()
export default async function POST(req, res) {
const postId=req.body.noteid
const watched = req.body.lastwatched
const newVideo = await prisma.video.create({
    data: {
      link: "new_video_link",
      lastwatched: watched,
      post: {
        connect: { id: postId } // Replace postId with the actual ID of the post
      }
    }
  });


}