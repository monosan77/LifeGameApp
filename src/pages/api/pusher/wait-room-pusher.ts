// import { RoomInfo } from '@/types/session';
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
//   if (req.method === 'GET') {
//     const { roomId } = req.query;

//     try {
//       const response = await fetch(
//         `${process.env.API_BACK_URL}/room/${roomId}`
//       );
//       if (response.status === 404) {
//         const roomInfo = null;
//         await pusher.trigger(`${roomId}`, 'joinRoom', roomInfo);
//       }
//       const roomInfo: RoomInfo | null = await response.json();

//       const send = await pusher.trigger(`${roomId}`, 'joinRoom', roomInfo);
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

import { RoomInfo } from '@/types/session';
import { fetchJSON } from '@/utils/fetch-functions';
import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';

// 環境変数が適切に設定されているか確認
if (
  !process.env.NEXT_PUBLIC_PUSHER_APP_ID ||
  !process.env.NEXT_PUBLIC_PUSHER_KEY ||
  !process.env.NEXT_PUBLIC_PUSHER_SECRET ||
  !process.env.NEXT_PUBLIC_PUSHER_CLUSTER ||
  !process.env.API_BACK_URL
) {
  throw new Error('環境変数が正しく設定されていません。');
}

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
  // リクエストメソッドをチェック
  if (req.method !== 'GET') {
    return res.status(405).json({
      message:
        '不正なリクエストメソッドです。GETメソッドのみ許可されています。',
    });
  }

  const { roomId } = req.query;

  if (!roomId || typeof roomId !== 'string') {
    return res.status(400).json({ message: 'roomIdが正しくありません。' });
  }

  try {
    const roomInfo: RoomInfo = await fetchJSON(
      `${process.env.API_BACK_URL}/room/${roomId}`
    );

    if (!roomInfo) {
      console.error('ルーム情報が取得できません。');
      return res
        .status(500)
        .json({ message: 'ルーム情報を習得できませんでした。' });
    }

    // Pusherでの通知
    const pusherResponse = await pusher.trigger(
      `${roomId}`,
      'joinRoom',
      roomInfo
    );
    if (!pusherResponse.ok) {
      console.error('同期できませんでした');
      return res.status(500).json({ message: '画面を同期できませんでした。' });
    }

    return res.status(200).json({ message: '同期ができました。' });
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
}
