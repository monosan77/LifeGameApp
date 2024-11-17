import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      return await getNextPlayer(req, res);
    }
    // GETやその他のメソッドへの対応
    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('ハンドラーレベルでのエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
}

async function getNextPlayer(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { currentPlayer, newPosition } = req.body;
    const { roomId } = req.query;

    // 必須パラメータのチェック
    if (
      typeof currentPlayer !== 'number' ||
      !Array.isArray(newPosition) ||
      !roomId
    ) {
      return res
        .status(400)
        .json({ error: 'リクエストのパラメータが不正です' });
    }

    // 次のプレイヤーを決定
    const nextPlayer = moveToNextPlayer(currentPlayer, newPosition);

    // 全員が位置50以上に到達した場合のチェック
    if (nextPlayer === -1) {
      return res.status(200).json({
        message: '全てのプレイヤーが位置50以上に到達しました',
        nextPlayer: -1,
      });
    }

    // Pusher APIに次のプレイヤー情報を送信
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/taun-change-pusher?roomId=${roomId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextPlayer }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pusher APIへの送信エラー:', errorText);
      return res
        .status(502)
        .json({ error: 'Pusher APIへの送信に失敗しました' });
    }

    res.status(200).json({ nextPlayer });
  } catch (error) {
    console.error('getNextPlayer関数でのエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
}

// 次のプレイヤーを決定する関数
const moveToNextPlayer = (
  currentPlayer: number,
  newPosition: number[]
): number => {
  let nextPlayer = (currentPlayer + 1) % newPosition.length;

  // 次のプレイヤーの位置が50以上の場合スキップ
  while (newPosition[nextPlayer] > 50) {
    nextPlayer = (nextPlayer + 1) % newPosition.length;

    // 無限ループ防止チェック
    if (nextPlayer === currentPlayer) {
      console.log('全てのプレイヤーが位置50以上に到達しました');
      return -1; // 全員スキップの状態
    }
  }
  return nextPlayer;
};
