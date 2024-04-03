import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


import { prisma } from '@/prismahook/prisma';
// const prisma=new PrismaClient()
export default async function POST(req, res) {

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
          links: links,
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