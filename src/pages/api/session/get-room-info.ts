import { RoomInfo } from '@/types/session';
import { fetchJSON } from '@/utils/fetch-functions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      return await handleGetRequest(req, res);
    }
    return res.status(405).json({ message: 'リクエストが不正です。' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;
  if (!roomId) {
    return res.status(400).json({ message: '不正なリクエストです' });
  }
  try {
    const roomInfo: RoomInfo = await fetchJSON(
      `${process.env.API_BACK_URL}/room/${roomId}`

      // `http://localhost:8000/room/${roomId}`
    );
    if (!roomInfo) {
      return res.status(404).json({ message: 'ルームが存在ありません' });
    }
    res.status(200).json(roomInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'server error' });
  }
}
