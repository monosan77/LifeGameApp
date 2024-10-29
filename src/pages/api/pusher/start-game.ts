// import { RoomInfo } from '@/types/session';
import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { roomId } = req.query;
    console.log(roomId, 'ttt');

    try {
      // const response = await fetch(
      //   `${process.env.API_BACK_URL}/room/${roomId}`
      // );
      // if (response.status === 404) {
      //   const roomInfo = null;
      //   await pusher.trigger(`${roomId}`, 'joinRoom', roomInfo);
      // }
      // const roomInfo: RoomInfo | null = await response.json();
      const isStartGame = true;

      const send = await pusher.trigger(`${roomId}`, 'start-game', isStartGame);
      if (!send.ok) {
        res.status(500).json({ message: '同期できませんでした' });
      }
      res.status(200).json({ message: 'ok' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'server error' });
    }
  }
}
