import { Members } from '@/types/session';
import { fetchJSON } from '@/utils/fetch-functions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'DELETE') {
      return await handleDeleteRequest(req, res);
    }
    return res
      .status(400)
      .json({ message: 'リクエストが不正です。不正なメソッド。' });
  } catch (error: any) {
    res.status(500).json({ message: `Server Error:${error.message}` });
  }
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;
  const { playerInfo } = req.body;
  if (!roomId || !playerInfo) {
    return res
      .status(400)
      .json({ message: '不正なリクエストです。不正なbody' });
  }

  if (playerInfo.host) {
    const response = await fetch(`${process.env.API_BACK_URL}/room/${roomId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP Error! status:${response.status}`);
    }
    return res.status(200).json({ message: 'ルームを削除しました。' });
  }

  const roomInfo = await fetchJSON(
    `${process.env.API_BACK_URL}/room/${roomId}`
  );
  const newMember = roomInfo.member.filter(
    (player: Members) => player.id !== playerInfo.id
  );
  const deletMember = await fetch(
    `${process.env.API_BACK_URL}/room/${roomInfo.id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ member: newMember }), // 部分的に更新
    }
  );
  if (!deletMember.ok) {
    throw new Error(`HTTP Error! status: ${deletMember.status}`);
  }
  return res.status(200).json({ message: '退室しました' });
}
