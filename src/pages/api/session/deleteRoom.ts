import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res
      .status(405)
      .json({ message: 'リクエストエラー : メソッドが不正です' });
  }

  try {
    const { roomId } = req.query;
    const uniqueId = Array.isArray(roomId) ? roomId[0] : roomId;
    await prisma.gameRoom.delete({
      where: {
        id: uniqueId + '1',
      },
      include: {
        member: true,
      },
    });

    res.status(200).json({ message: 'ルームが削除されました。' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ error: `server error : ${error.message}` });
  }
}
