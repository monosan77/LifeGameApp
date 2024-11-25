/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchJSON } from '@/utils/fetch-functions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('ターンチェンジ呼ばれた');
    if (req.method === 'POST') {
      return await getNextPlayer(req, res);
    }
    // GETやその他のメソッドへの対応
    res.status(405).json({ error: 'リクエストエラー：メソッドが不正です。' });
  } catch (error: any) {
    // console.error('ハンドラーレベルでのエラー:', error);
    res.status(500).json({ error: `server error : ${error.message}` });
  }
}

async function getNextPlayer(req: NextApiRequest, res: NextApiResponse) {
  // try {
  const { currentPlayer, newPosition, newMoney } = req.body;
  const { roomId } = req.query;

  // 必須パラメータのチェック
  if (
    typeof currentPlayer !== 'number' ||
    !Array.isArray(newPosition) ||
    !roomId ||
    !newMoney
  ) {
    return res.status(400).json({ error: 'リクエストのパラメータが不正です' });
  }

  // 次のプレイヤーを決定
  const nextPlayer = moveToNextPlayer(currentPlayer, newPosition);

  // 全員が位置50以上に到達した場合のチェック
  // if (nextPlayer === -1) {
  //   return res.status(200).json({
  //     message: '全てのプレイヤーが位置50以上に到達しました',
  //     nextPlayer: -1,
  //   });
  // }

  // Pusher APIに次のプレイヤー情報を送信
  await fetchJSON(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/taun-change-pusher?roomId=${roomId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nextPlayer, newPosition, newMoney }),
    }
  );

  res.status(200).json({ message: '正常に処理が完了しました。' });
}

// 次のプレイヤーを決定する関数
export const moveToNextPlayer = (
  currentPlayer: number,
  newPosition: number[]
): number => {
  let nextPlayer = (currentPlayer + 1) % newPosition.length;

  // 次のプレイヤーの位置が50以上の場合スキップ
  while (newPosition[nextPlayer] > 50) {
    nextPlayer = (nextPlayer + 1) % newPosition.length;

    // 自分以外がゴールしているとき再度自分のターン
    if (nextPlayer === currentPlayer) {
      return nextPlayer;
    }
    // 無限ループ防止チェック
    if (newPosition.every((num) => num > 50)) {
      return -1; // 全員スキップの状態
    }
  }
  return nextPlayer;
};
