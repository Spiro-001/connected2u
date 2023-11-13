import { pusherServer } from "@/lib/pusher";
import { parsePusher } from "@/utils/parsePusher";
import { NextApiRequest, NextApiResponse } from "next";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await parsePusher(req.body);

    const socketId = data.socket_id;
    const channel = data.channel_name;

    // Pusher data
    const presenceData = {
      user_id: socketId,
      user_info: {},
    };

    // Pusher authenticate
    const authResponse = pusherServer.authorizeChannel(
      socketId,
      channel,
      presenceData
    );
    return new Response(JSON.stringify(authResponse), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify("error"), { status: 403 });
  }
};
