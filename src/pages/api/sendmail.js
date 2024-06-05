
import { Resend } from "resend"
import EmailTemplate from "../../components/emailtemplate";
import { NextResponse } from 'next/server';


export default  async function POST(req,res){

    const body=req.body
 const name=body.name
 const url=body.url

    try{
        const resend = new Resend("re_6zL7w5jn_N5GYMNtsH4QFZFXRSYD3b37J")
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: name,
      subject: "Space Invitation !",
      react: EmailTemplate({ name,url })
    })
    res.json({message:"Succesfully added  as collaborator !"})
    }
    catch (e){
console.log(e)
res.json(
  {error:e}
)

    }








  }
