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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
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

  try {
    if (playerInfo.host) {
      const response = await fetch(`http://localhost:8000/room/${roomId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP Error! status:${response.status}`);
      }
      return res.status(200).json({ message: 'ルームを削除しました。' });
    }

    const roomInfo = await fetchJSON(`http://localhost:8000/room/${roomId}`);
    const newMember = roomInfo.member.filter(
      (player: Members) => player.id !== playerInfo.id
    );
    const deletMember = await fetch(
      `http://localhost:8000/room/${roomInfo.id}`,
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'server error' });
  }
}
