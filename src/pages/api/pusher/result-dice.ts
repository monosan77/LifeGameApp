// // import { RoomInfo } from '@/types/session';
// import { NextApiRequest, NextApiResponse } from 'next';
// import Pusher from 'pusher';

// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
//   secret: process.env.NEXT_PUBLIC_PUSHER_SECRET!,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
// });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'POST') {
//     const { roomId } = req.query;
//     const diceResult = req.body;

//     try {
//       const send = await pusher.trigger(`${roomId}`, 'result-dice', diceResult);
//       if (!send.ok) {
//         res.status(500).json({ message: '同期できませんでした' });
//       }
//       res.status(200).json({ message: 'ok' });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'server error' });
//     }
//   }
// }

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
    return res
      .status(405)
      .json({
        error:
          'メソッドが許可されていません。POSTメソッドのみ許可されています。',
      });
  }

  const { roomId } = req.query;
  const diceResult = req.body;

  // roomIdとdiceResultの存在チェック
  if (!roomId || typeof diceResult === 'undefined') {
    return res
      .status(400)
      .json({ error: '不正なリクエストです。roomIdとdiceResultが必要です。' });
  }

  try {
    // Pusherでイベントをトリガー
    const response = await pusher.trigger(
      `${roomId}`,
      'result-dice',
      diceResult
    );

    // Pusherのレスポンスが失敗した場合のチェック
    if (response.status !== 200) {
      console.error('Pusherエラー:', response);
      return res
        .status(500)
        .json({ error: 'Pusher APIで同期に失敗しました。' });
    }

    res.status(200).json({ message: 'サイコロの結果が正常に送信されました。' });
  } catch (error) {
    console.error('サーバーエラー:', error);
    res.status(500).json({ error: 'サーバーでエラーが発生しました。' });
  }
}
