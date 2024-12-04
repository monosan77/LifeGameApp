import { Members } from '@/types/session';
import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'DELETE') {
      return await handleDeleteRequest(req, res);
    }
    return res.status(405).json({ message: 'リクエストメソッドが不正です。' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: `Server Error : ${error.message}` });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;
  const { playerInfo, roomInfo } = req.body;

  const uniqueId = Array.isArray(roomId) ? roomId[0] : roomId;

  if (!roomId || !playerInfo) {
    return res.status(400).json({ message: '不正なリクエストです。' });
  }

  if (playerInfo.host) {
    // ホストが退出した場合、ルームを削除
    await prisma.gameRoom.delete({
      where: {
        id: uniqueId,
      },
      include: {
        member: true,
      },
    });
    // Pusherで「ルーム削除」の通知
    await pusher.trigger(`${roomId}`, 'room-deleted', {
      message: 'ルームが削除されました。トップ画面に戻ります。',
    });

    return res.status(200).json({ message: 'ルームを削除しました。' });
  }

  // ゲストが退出する場合の処理
  const newMembers: Members[] = roomInfo.member.filter(
    (player: Members) => player.id !== playerInfo.id
  );

  await prisma.member.deleteMany({
    where: {
      gameRoomId: uniqueId,
    },
  });

  await prisma.member.createMany({
    data: newMembers.map((member) => ({
      id: member.id,
      name: member.name,
      host: member.host,
      gameRoomId: roomInfo.id,
    })),
  });

  return res.status(200).json({ message: '退室しました。' });
}
