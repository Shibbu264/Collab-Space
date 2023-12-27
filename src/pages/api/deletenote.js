
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';



const prisma=new PrismaClient()
export default  async function POST(req,res){

    const body=req.body
    const noteid=body.noteid??""

    try{
      
     
await prisma.post.delete({
    where:{
        id:noteid
    }
})



res.json({message:"Succesfully Deleted!"})

    }
    catch (e){
console.log(e)
res.json(
  {error:e}
)

    }








  }
