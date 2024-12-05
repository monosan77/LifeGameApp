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
  if (req.method === 'POST') {
    const { name, message } = req.body;
    try {
      const response = await pusher.trigger('chat-channel', 'new-message', {
        name,
        message,
      });

      if (response.status !== 200) {
        throw new Error('Pusher APIで同期に失敗しました。');
      }
      res.status(200).json({ message: '正常に送信されました' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(500).json({ error: `サーバーエラー：${error.message}` });
    }
  } else {
    res.status(405).json({ error: 'メソッドが許可されていません。' }); // メソッドが許可されていない場合
  }
}
