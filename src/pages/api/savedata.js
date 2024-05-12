
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '@/prismahook/prisma';
// const prisma=new PrismaClient()
export default async function POST(req, res) {
  const uniqueId = uuidv4();
  const body = req.body
  console.log(body)
  const noteid = body.noteid ?? ""
  const title = body.title ?? ""
  const content = body.content ?? ""
  const links = body.links
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: body.userid
      }
    })

    await prisma.post.update(
      {
        where: {
          id: noteid,
        },
        data: {
          title: title,
          content: content,
          links: {
            deleteMany: {}, 
            create: links.map(link => ({
              id:uuidv4(),
              url: link.url,
              watchedtill: link.watchedtill,
              important:link.important
            })),
          },
        },
      }
    )
    const post = await prisma.post.findUnique({
      where: {
        id: noteid
      }
    })

    res.json({ post: post })

  }
  catch (e) {
    console.log(e)
    res.json(
      { error: e }
    )

  }








}