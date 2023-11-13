import PusherServer from "pusher";
import PusherClient from "pusher-js";

type pusherClientData = {
  user: string;
};

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID ?? "PUSHER_APP_ID",
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "NEXT_PUBLIC_PUSHER_APP_KEY",
  secret: process.env.PUSHER_APP_SECRET ?? "PUSHER_APP_SECRET",
  cluster: "us2",
  useTLS: true,
});

export const pusherClient = (params: pusherClientData) => {
  return new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "NEXT_PUBLIC_PUSHER_APP_KEY",
    {
      cluster: "us2",
      channelAuthorization: {
        transport: "ajax",
        params: { params },
        endpoint: "/api/pusher/auth",
      },
    }
  );
};
