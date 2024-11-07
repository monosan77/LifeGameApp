import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GETメソッド以外のリクエストを拒否
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: '不正なリクエストメソッドです。GETメソッドのみ許可されています。',
    });
  }

  const { roomId } = req.query;

  // roomIdの存在チェック
  if (!roomId) {
    return res.status(400).json({ error: 'roomIdが指定されていません。' });
  }

  try {
    const isStartGame = true;

    const response = await pusher.trigger(
      `${roomId}`,
      'start-game',
      isStartGame
    );

    // Pusherからのレスポンスチェック
    if (response.status !== 200) {
      console.error('Pusherエラー:', response);
      return res.status(500).json({ error: '同期できませんでした。' });
    }

    res.status(200).json({ message: 'ゲームが正常に開始されました。' });
  } catch (error) {
    console.error('サーバーエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
}
