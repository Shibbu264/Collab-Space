
import { prisma } from '@/prismahook/prisma';
// const prisma=new PrismaClient()
export default async function POST(req, res) {
const postId=req.body.noteid
const content=req.body.content
const important = req.body.important
    const newContent = await prisma.content.create({
        data: {
          textContent: content,
          markedAsImportant:important,
          post: {
            connect: { id: postId } 
          }
        }
      });
console.log("Content updated !")

}