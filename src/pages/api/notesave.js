import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';



const prisma=new PrismaClient()
export default async function POST(req, res) {
  const body = req.body;
  const noteid = body.noteid;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: body.userid ?? ""
      }
    });

    // Check if post with the given ID already exists
    const existingPost = await prisma.post.findUnique({
      where: {
        id: noteid
      }
    });

    if (existingPost) {
    
     console.log("inside if")
      res.json({ post: existingPost });
    } else {
   console.log("Inside else")
      const newPost = await prisma.post.create({
        data: {
          id: noteid,
          title: "New-note",
          content: "",
          authorId: user?.id ?? "",
          categories: ""
        }
      });

      console.log(newPost+"BC");
      res.json({ post: newPost });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
}
