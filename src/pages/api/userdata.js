
import { prisma } from '@/prismahook/prisma';

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
              posts: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          });
          const collaboratedPosts = await prisma.post.findMany({
            where: {
              AND: [
                {
                  Collaborators: {
                    has: body.email
                  }
                },
                {
                  authorId: {
                    not: body.email
                  }
                }
              ]
            },
            select: {
              id: true,
              title: true,
            },
          });
         
        res.json({user,collaboratedPosts});
       
      } catch (error) {
        
      res.json(
        { message: error },
        { status: 503 },
      );
      }

    }
  
  