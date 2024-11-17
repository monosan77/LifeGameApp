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
      // console.error('Pusherエラー:', response);
      throw new Error('pusher 同期ができませんでした。');
    }

    res.status(200).json({ message: 'ゲームが正常に開始されました。' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.error('サーバーエラー:', error);
    res.status(500).json({ error: `server error : ${error.message}` });
  }
}
