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
  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'メソッドが許可されていません。POSTメソッドのみ許可されています。',
    });
  }

  const { roomId } = req.query;
  const { rescueEvent } = req.body;

  // roomIdとdiceResultの存在チェック
  if (!roomId || typeof rescueEvent === 'undefined' || !rescueEvent) {
    return res
      .status(400)
      .json({ error: '不正なリクエストです。roomIdとrescueEventが必要です。' });
  }

  try {
    // Pusherでイベントをトリガー
    const response = await pusher.trigger(
      `${roomId}`,
      'rescue-event',
      rescueEvent
    );

    // Pusherのレスポンスが失敗した場合のチェック
    if (response.status !== 200) {
      throw new Error('Pusher APIで同期に失敗しました。');
    }

    res.status(200).json({ message: 'rescueEventが正常に送信されました。' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.error('サーバーエラー:', error);
    res.status(500).json({ error: `server error : ${error.message}` });
  }
}
