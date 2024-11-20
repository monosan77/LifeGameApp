import { fetchJSON } from '@/utils/fetch-functions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const { roomId } = req.query;

      // クエリパラメータroomIdが存在するか確認
      if (!roomId) {
        return res
          .status(400)
          .json({ error: 'リクエストエラー: roomIdが必要です。' });
      }

      const diceResult = getDiceNumber();

      // 外部API（Pusher）へのリクエスト
      await fetchJSON(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/dice-pusher?roomId=${roomId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ diceResult }),
        }
      );

      // 成功レスポンス
      return res.status(200).json({
        message: 'サイコロの結果が正常に送信されました。',
      });
    } else {
      // GET以外のリクエストが来た場合
      return res.status(405).json({ error: '不正なリクエストメソッドです。' });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // サーバーエラーハンドリング
    res.status(500).json({ error: `server error : ${error.message}` });
  }
}

function getDiceNumber() {
  return Math.floor(Math.random() * 6) + 1;
}
