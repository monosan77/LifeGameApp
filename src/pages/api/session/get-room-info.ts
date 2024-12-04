import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      return await handleGetRequest(req, res);
    }
    return res.status(405).json({ message: 'リクエストが不正です。' });
  } catch (error: any) {
    res.status(500).json({ message: `Server Error : ${error.message}` });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;
  const uniqueId = Array.isArray(roomId) ? roomId[0] : roomId;

  if (!roomId) {
    return res.status(400).json({ message: '不正なリクエストです' });
  }
  const roomInfo = await prisma.gameRoom.findUnique({
    where: {
      id: uniqueId,
    },
    include: {
      member: true,
    },
  });
  if (!roomInfo) {
    throw new Error('ルーム情報を取得できませんでした。');
  }

  res.status(200).json(roomInfo);
}
