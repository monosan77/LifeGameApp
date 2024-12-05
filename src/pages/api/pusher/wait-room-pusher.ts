import { RoomInfo } from '@/types/session';
import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  const uniqueId = Array.isArray(roomId) ? roomId[0] : roomId;
  if (!roomId) {
    return res.status(400).json({ message: 'roomIdが正しくありません。' });
  }

  try {
    const roomInfo: RoomInfo | null = await prisma.gameRoom.findUnique({
      where: {
        id: uniqueId,
      },
      include: {
        member: true,
      },
    });

    if (!roomInfo) {
      return res.status(404).json({ message: 'ルームが存在しません。' });
    }

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
