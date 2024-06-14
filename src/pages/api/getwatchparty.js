import { prisma } from '@/prismahook/prisma'; // Assuming this import is correct

export default async function GET(req, res) {
  const roomId = req.headers.roomid;
console.log(roomId)
  if (!roomId) {
    return res.status(400).json({ error: "Room ID is missing in the header" });
  }

  try {
    const watchParty = await prisma.videostream.findUnique({
      where: {
        roomid: roomId,
      },
    });
console.log(watchParty)
    if (!watchParty) {
      return res.status(404).json({ error: "Watch Party not found" });
    }

    res.json(watchParty);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
