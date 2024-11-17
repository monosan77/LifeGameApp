import { RoomInfo } from '@/types/session';
import { fetchJSON } from '@/utils/fetch-functions';
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
  // リクエストメソッドをチェック
  if (req.method !== 'GET') {
    return res.status(405).json({
      message:
        '不正なリクエストメソッドです。GETメソッドのみ許可されています。',
    });
  }

  const { roomId } = req.query;

  if (!roomId) {
    return res.status(400).json({ message: 'roomIdが正しくありません。' });
  }

  try {
    const roomInfo: RoomInfo = await fetchJSON(
      `${process.env.API_BACK_URL}/room/${roomId}`
    );

    // Pusherでの通知
    const pusherResponse = await pusher.trigger(
      `${roomId}`,
      'joinRoom',
      roomInfo
    );
    if (!pusherResponse.ok) {
      // console.error('同期できませんでした');
      throw new Error('画面を同期できませんでした。');
    }

    return res.status(200).json({ message: '同期ができました。' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.error('An error occurred:', error);
    return res.status(500).json({ message: `server error : ${error.message}` });
  }
}
