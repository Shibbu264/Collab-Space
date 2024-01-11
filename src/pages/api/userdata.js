import { PrismaClient } from '@prisma/client';
import { error } from 'console';
import { create } from 'domain';


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prismahook/prisma';
// const prisma = new PrismaClient();


export default  async function POST(
    req,res
    
  )  {
    const body = req.body;
     
      try {
       
        const user = await  prisma.user.findUnique({
            where: {
              id:body.email,
            },
            include: {
              posts: true,
            },
          });
         
        res.json({user});
       
      } catch (error) {
        
      res.json(
        { message: error },
        { status: 503 },
      );
      }

    }
  
  