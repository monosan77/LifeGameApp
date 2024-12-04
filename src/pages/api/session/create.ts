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
    if (req.method === 'POST') {
      return await handlePostRequest(req, res);
    }
    return res
      .status(405)
      .json({ message: 'リクエストが不正です。メソッドが不正' });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: `Server Error : ${error.message}` });
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { limitPlayer, playerName } = req.body;
  if (!limitPlayer || !playerName) {
    return res
      .status(400)
      .json({ message: '不正なリクエストです。クエリが不正。' });
  }
  const generateRandomNumber = () => {
    // 100000から999999までのランダムな6桁の数値を生成
    return Math.floor(100000 + Math.random() * 900000);
  };
  const roomId = generateRandomNumber().toString();

  // const getRoomId = await fetch(
  //   `${process.env.API_BACK_URL}/room?id=${roomId}`
  // );
  const getRoomId = await prisma.gameRoom.findUnique({
    where: {
      id: roomId,
    },
  });
  if (getRoomId) {
    throw new Error(`HTTP Error! message : 作成済みのIDです。`);
  }
  // const data: RoomInfo[] = await getRoomId.json();
  // 作成したルームIDがすでに存在していた時
  // if (data.length > 0) {
  //   return res
  //     .status(404)
  //     .json({ message: 'ルーム作成に失敗しました。存在するIDです。' });
  // }
  const yourId = uuidv4();
  // ルームを作成したプレイヤーがルームホストになる
  const members = [{ id: yourId, name: playerName, host: true }];

  // const postRoomId = await fetch(`${process.env.API_BACK_URL}/room`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     id: roomId,
  //     limitPlayer: limitPlayer,
  //     member: members,
  //   }),
  // });

  const postRoomId = await prisma.gameRoom.create({
    data: {
      id: roomId,
      limitPlayer: limitPlayer,
      member: {
        create: members,
      },
    },
    include: {
      member: true,
    },
  });
  // console.log(postRoomId);
  if (!postRoomId) {
    throw new Error(`HTTP Error! ルーム作成に失敗しました。`);
  }
  // if (!postRoomId.ok) {
  //   throw new Error(`HTTP Error! status:${postRoomId.status}`);
  // }
  return res.status(200).json({ roomId, yourId, getRoomId });
}
