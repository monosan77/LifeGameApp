import { RoomInfo } from '@/types/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
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

  try {
    const getRoomId = await fetch(`http://localhost:8000/room?id=${roomId}`);
    const data: RoomInfo[] = await getRoomId.json();
    if (data.length > 0) {
      throw new Error(`HTTP Error! status:${getRoomId.status}`);
    }
    const yourId = uuidv4();
    // ルームを作成したプレイヤーがルームホストになる
    const members = [{ id: yourId, name: playerName, host: true }];

    const postRoomId = await fetch('http://localhost:8000/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: roomId,
        limitPlayer: limitPlayer,
        member: members,
      }),
    });
    if (!postRoomId.ok) {
      throw new Error(`HTTP Error! status:${postRoomId.status}`);
    }
    return res.status(200).json({ roomId, yourId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error' });
  }
}
