import { RoomInfo } from '@/types/session';
import { fetchJSON } from '@/utils/fetch-functions';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

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

  const CheckPlayer: RoomInfo = await fetchJSON(
    `${process.env.API_BACK_URL}/room/${roomInfo.id}`
  );
  if (CheckPlayer.limitPlayer <= CheckPlayer.member.length) {
    return res.status(400).json({ message: 'すでに満室です' });
  }
  const playerId = uuidv4();
  const newMember = [
    ...CheckPlayer.member,
    { id: playerId, name: playerName, host: false },
  ];
  const response = await fetch(
    `${process.env.API_BACK_URL}/room/${roomInfo.id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ member: newMember }), // 部分的に更新
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return res.status(200).json({ playerId });
}
