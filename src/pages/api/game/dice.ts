// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'GET') {
//     const { roomId } = req.query;
//     const diceResult = getDiceNumber();

//     await fetch(
//       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/result-dice?roomId=${roomId}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(diceResult),
//       }
//     );
//     res.status(200).json({ message: 'ok' });
//   }
// }

// function getDiceNumber() {
//   return Math.floor(Math.random() * 6) + 1;
// }

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
      const pusherResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/result-dice?roomId=${roomId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(diceResult),
        }
      );

      // 外部APIがエラーを返した場合の処理
      if (!pusherResponse.ok) {
        const errorData = await pusherResponse.json();
        console.error('Pusher APIエラー:', errorData);
        return res.status(pusherResponse.status).json({
          error: 'Pusher APIへのリクエストに失敗しました。',
          details: errorData,
        });
      }

      // 成功レスポンス
      return res.status(200).json({
        message: 'サイコロの結果が正常に送信されました。',
        diceResult,
      });
    } else {
      // GET以外のリクエストが来た場合
      return res.status(405).json({ error: '不正なリクエストメソッドです。' });
    }
  } catch (error) {
    // サーバーエラーハンドリング
    console.error('サーバーエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
}

function getDiceNumber() {
  return Math.floor(Math.random() * 6) + 1;
}
