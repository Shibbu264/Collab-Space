
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


import { prisma } from '@/prismahook/prisma';
// const prisma=new PrismaClient()
export default  async function POST(req,res){

    const body=req.body
    const noteid=body.noteid??""

    try {
        // Delete associated Content records
        await prisma.content.deleteMany({
          where: {
            postId: noteid // Replace noteid with the id of the post you want to delete
          }
        });
        await prisma.video.deleteMany({
            where: {
              postId: noteid // Replace noteid with the id of the post you want to delete
            }
          });
        
      
        // Delete the Post record
        await prisma.post.delete({
          where: {
            id: noteid
          }
        });
      
        console.log("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
      





  }
