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
//     const nextPlayer = req.body;

//     try {
//       const send = await pusher.trigger(
//         `${roomId}`,
//         'result-next-player',
//         nextPlayer
//       );

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
  // POSTリクエスト以外を拒否
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: '不正なリクエストメソッドです。POSTメソッドのみ許可されています。',
    });
  }

  const { roomId } = req.query;
  const nextPlayer = req.body;

  // roomIdとnextPlayerのバリデーション
  if (!roomId || nextPlayer === null) {
    return res
      .status(400)
      .json({ error: 'roomIdまたはnextPlayerデータがありません。' });
  }

  try {
    const response = await pusher.trigger(
      `${roomId}`,
      'result-next-player',
      nextPlayer
    );

    // Pusherからのエラーチェック
    if (response.status !== 200) {
      console.error('Pusherエラー:', response);
      return res
        .status(500)
        .json({ error: 'Pusher APIで同期できませんでした。' });
    }

    res.status(200).json({ message: 'プレイヤーが正常に同期されました。' });
  } catch (error) {
    console.error('サーバーエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
}
