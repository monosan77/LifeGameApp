import { RoomInfo } from '@/types/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'PATCH') {
      return await handlePatchRequest(req, res);
    }
    return res
      .status(400)
      .json({ message: 'リクエストが不正です。不正なメソッド' });
  } catch (error: any) {
    // console.log(error);
    res.status(500).json({ message: `Server Error : ${error.message}` });
  }
}

async function handlePatchRequest(req: NextApiRequest, res: NextApiResponse) {
  const { playerName, roomInfo } = req.body;
  if (!playerName || !roomInfo) {
    return res
      .status(400)
      .json({ message: '不正なリクエストです。不正なbody' });
  }

  const CheckPlayer: RoomInfo | null = await prisma.gameRoom.findUnique({
    where: {
      id: roomInfo.id,
    },
    include: {
      member: true,
    },
  });
  if (!CheckPlayer) {
    throw new Error('ルーム情報が存在しませんでした。');
  }
  if (CheckPlayer.limitPlayer <= CheckPlayer.member.length) {
    return res.status(400).json({ message: 'すでに満室です' });
  }
  const playerId = uuidv4();
  const newMember = [
    ...CheckPlayer.member,
    { id: playerId, name: playerName, host: false, gameRoomId: roomInfo.id },
  ];

  await prisma.member.deleteMany({
    where: {
      gameRoomId: roomInfo.id,
    },
  });

  await prisma.member.createMany({
    data: newMember.map((member) => ({
      id: member.id,
      name: member.name,
      host: member.host,
      gameRoomId: roomInfo.id,
    })),
  });

  // const response = await prisma.gameRoom.findUnique({
  //   where: {
  //     id: roomInfo.id,
  //   },
  //   include: {
  //     member: true,
  //   },
  // });
  return res.status(200).json({ playerId });
}
