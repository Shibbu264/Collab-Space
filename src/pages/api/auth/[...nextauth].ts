import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client'

const prisma =new PrismaClient()
const authOptions: NextAuthOptions = {
  
  providers: [
    GithubProvider({
      clientId: '7b28b61e01d2de291f92' as string,
      clientSecret: 'ac819cd758b53c51331190af46660fcf0b5a2f6d' as string,
    }),
    GoogleProvider({
      clientId: '809328833359-t6inuf1bllcbrhvnro3a03f0pd0kovqu.apps.googleusercontent.com' as string,
      clientSecret: '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' as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      
try{
  const email = user.email ?? "";
  const name = user.name ?? ""; 
  const image = user.image ?? ""; 
  await prisma.user.upsert({
    where: { id:email  },
    create: {
      id: email ,
      name: name ,
      profilepic: image,
      Phonenumber:+91,
     
    },
    update: {
      name:name,
      profilepic:image,
     
    },


  })

  return true
}
catch (error){
  console.log(error)
  return false
}
      
    },
    async redirect({ url, baseUrl }) {
      return url
    },
    async session({ session, user, token }) {
      return session
    },
    async jwt({ token, user, account, profile }) {
      return token
    }
},
pages: {
  signIn: '/signin',
  newUser: '/home'
}
}
const handler = NextAuth(authOptions);
export default handler
