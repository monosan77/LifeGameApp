// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     if (req.method === 'GET') {
//       return await handleStartGame(req, res);
//     }
//     return res.status(405).json({ message: '不正なリクエストメソッドです。' });
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function handleStartGame(req: NextApiRequest, res: NextApiResponse) {
//   const { roomId } = req.query;

//   if (!roomId) {
//     return res.status(405).json({ message: 'リクエストエラー,不正なクエリ' });
//   }

//   const res0 = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/start-game?roomId=${roomId}`
//   );
//   if (!res0.ok) {
//     const data = await res0.json();
//     console.log(data);
//   }
//   return res.status(200).json({ message: 'ok' });
// }

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
  } catch (error) {
    console.error('ハンドラーレベルでのエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
}

async function handleStartGame(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { roomId } = req.query;

    // クエリパラメータが存在するか確認
    if (!roomId) {
      return res
        .status(400)
        .json({ error: 'リクエストエラー: roomIdが必要です。' });
    }

    // Pusher APIへのリクエスト
    const pusherResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/start-game?roomId=${roomId}`
    );

    // Pusher APIがエラーを返した場合
    if (!pusherResponse.ok) {
      const errorData = await pusherResponse.json();
      console.error('Pusher APIエラー:', errorData);
      return res.status(pusherResponse.status).json({
        error: 'Pusher APIへのリクエストに失敗しました。',
        details: errorData,
      });
    }

    return res.status(200).json({ message: 'ゲームが正常に開始されました。' });
  } catch (error) {
    console.error('handleStartGameでのエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
}
