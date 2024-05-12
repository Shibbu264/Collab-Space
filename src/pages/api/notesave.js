import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';



import { prisma } from '@/prismahook/prisma';
//  const prisma=new PrismaClient()
export default async function POST(req, res) {
  const body = req.body;
  const noteid = body.noteid;
  const uniqueId = uuidv4();
  try {

    const existingPost = await prisma.post.findUnique({
      where: {
        id: noteid
      },
      include: {
        links: true 
      }
    });
    console.log("qt",existingPost)

    if (existingPost) {
     console.log("inside if")
      res.json({ post: existingPost });
    } 
    else {
   console.log("Inside else")
   
      const newPost = await prisma.post.create({
        data: {
          id: noteid,
          title: "New-note",
          content: [""],
          authorId: body.userid,
          categories: "",
          Collaborators:[body.userid],
          links:{create:[{
            id:uniqueId,
            url: "",
            watchedtill:0
          },]}
        }
      });

      console.log(newPost.authorId);
      res.json({ post: newPost });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
}
