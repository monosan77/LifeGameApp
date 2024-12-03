import { Members } from '@/types/session';
import { fetchJSON } from '@/utils/fetch-functions';
import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';

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
  } catch (error: any) {
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;
  const { playerInfo } = req.body;

  if (!roomId || !playerInfo) {
    return res.status(400).json({ message: '不正なリクエストです。' });
  }

  if (playerInfo.host) {
    // ホストが退出した場合、ルームを削除
    await fetch(`${process.env.API_BACK_URL}/room/${roomId}`, {
      method: 'DELETE',
    });

    // Pusherで「ルーム削除」の通知
    await pusher.trigger(`${roomId}`, 'room-deleted', {
      message: 'ルームが削除されました。トップ画面に戻ります。',
    });

    return res.status(200).json({ message: 'ルームを削除しました。' });
  }

  // ゲストが退出する場合の処理
  const roomInfo = await fetchJSON(
    `${process.env.API_BACK_URL}/room/${roomId}`
  );
  const newMembers = roomInfo.member.filter(
    (player: Members) => player.id !== playerInfo.id
  );

  await fetch(`${process.env.API_BACK_URL}/room/${roomInfo.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ member: newMembers }),
  });

  return res.status(200).json({ message: '退室しました。' });
}
