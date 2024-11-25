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
  // POSTリクエスト以外を拒否
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: '不正なリクエストメソッドです。POSTメソッドのみ許可されています。',
    });
  }

  const { roomId } = req.query;
  const { nextPlayer, newPosition, newMoney } = req.body;

  // roomIdとnextPlayerのバリデーション
  if (
    !roomId ||
    nextPlayer === null ||
    nextPlayer === undefined ||
    !newPosition ||
    !newMoney
  ) {
    return res
      .status(400)
      .json({ error: 'roomIdまたはnextPlayerデータがありません。' });
  }

  try {
    const response = await pusher.trigger(`${roomId}`, 'result-next-player', {
      nextPlayer,
      newPosition,
      newMoney,
    });

    // Pusherからのエラーチェック
    if (response.status !== 200) {
      console.error('Pusherエラー:', response);
      throw new Error('pusher APIで同期できませんでした。');
    }

    res.status(200).json({ message: 'プレイヤーが正常に同期されました。' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('サーバーエラー:', error);
    res.status(500).json({ error: `server error : ${error.message}` });
  }
}
