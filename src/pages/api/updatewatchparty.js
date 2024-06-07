import { prisma } from '@/prismahook/prisma'; // Assuming this import is correct

export default async function POST(req, res) {
  const body = req.body;
  console.log(body);

  const roomid = body.roomid ?? "";
  const chats = body.chats ?? [];
  const lastwatchedlink = body.lastwatchedlink;

  try {
    // Assuming you want to update or create a record based on the roomid
    await prisma.videoStream.upsert({
      where: {
        roomid: roomid,
      },
      update: {
        Chats: chats,
        lastwatchedlink: lastwatchedlink,
      },
      create: {
        lastwatchedlink: lastwatchedlink,
        lastwatchedduration:"",
        lastwatchedspeed: "",
        roomid: roomid,
        Chats:chats
      },
    });

    res.json({ message: "Watch Party updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
