
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


import { prisma } from '@/prismahook/prisma';

export default  async function POST(req,res){

    const body=req.body
    const noteid=body.noteid
    const Collaborator=body.Collaborator

    try{
      console.log(body)
     
await prisma.post.update({
    where:{
        id:noteid
    },
    data:{
        Collaborators: {
            push: Collaborator
        }
    }

})



res.json({message:"Succesfully added "+ Collaborator +" as collaborator !"})

    }
    catch (e){
console.log(e)
res.json(
  {error:e}
)

    }








  }
