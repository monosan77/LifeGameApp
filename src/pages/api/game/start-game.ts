import { fetchJSON } from '@/utils/fetch-functions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      return await handleStartGame(req, res);
    }
    return res.status(405).json({ error: '不正なリクエストメソッドです。' });
  } catch (error: any) {
    // console.error('ハンドラーレベルでのエラー:', error);
    res.status(500).json({ error: `server error : ${error.message}` });
  }
}

async function handleStartGame(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;

  // クエリパラメータが存在するか確認
  if (!roomId) {
    return res
      .status(400)
      .json({ error: 'リクエストエラー: roomIdが必要です。' });
  }

  // Pusher APIへのリクエスト
  await fetchJSON(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/start-game-pusher?roomId=${roomId}`
  );

  return res.status(200).json({ message: 'ゲームが正常に開始されました。' });
}
