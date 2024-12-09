import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'DELETE') {
      return await handleFinish(req, res);
    }
    return res.status(405).json({ error: '不正なリクエストメソッドです。' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ error: `server error : ${error.message}` });
  }
}

async function handleFinish(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ message: 'roomId が指定されていません。' });
  }

  try {
    const deleteRoom = await prisma.gameRoom.delete({
      where: { id: roomId },
    });

    return res.status(200).json({
      message: 'roomId の削除が成功しました。',
      deleteRoom,
    });
  } catch (error) {
    console.error('削除エラー:', error);
    return res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
}
