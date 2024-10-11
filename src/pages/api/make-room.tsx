import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const roomInfo = req.body;
    const generateRandomNumber = () => {
      // 100000から999999までのランダムな6桁の数値を生成
      return Math.floor(100000 + Math.random() * 900000);
    };
    const roomId = generateRandomNumber().toString();

    try {
      const getRoomId = await fetch(
        `http://localhost:8000/room?roomId=${roomId}`
      );
      const data = await getRoomId.json();
      if (data.length > 0) {
        res.status(500).json({ message: 'ルームを作成できませんでした。' });
      }

      const postRoomId = await fetch('http://localhost:8000/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId, player: roomInfo }),
      });
      if (postRoomId.ok) {
        res.status(200).json(roomId);
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (req.method === 'GET') {
    console.log(req.method, 'uuuu');
    const { roomId } = req.query;
    if (!roomId) {
      res.status(500).json({ message: 'ルームが存在ありません' });
    }
    try {
      const response = await fetch(
        `http://localhost:8000/room?roomId=${roomId}`
      );
      if (!response) {
        res.status(500).json({ message: 'ルームが存在ありません' });
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
}
